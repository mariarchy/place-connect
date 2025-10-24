# Use Node.js LTS version
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN npm run build

# Verify public folder exists after build
RUN ls -la /app/public/communities/ || echo "WARNING: public/communities not found!"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone server files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets (built CSS/JS)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder to both root and standalone expected location
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Verify public folder in final image
RUN ls -la /app/public/communities/ && echo "✓ Public images copied successfully" || echo "✗ Public images NOT found"

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

