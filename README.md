# CultureMesh

AI-powered culture campaign builder that connects brands with grassroots communities.

## 🎯 Overview

CultureMesh is a flashy, AI-powered web prototype that lets marketing users (e.g., e-tail marketing leads at Salomon) create moodboard-style campaigns and instantly get:

- An AI-generated PR campaign brief
- A list of matching grassroots communities
- A visual "connection animation" between the brand and community

**Visual Style**: Cross between Figma, DICE, and Notion AI — sleek, motion-rich, and conceptually magical.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: TailwindCSS + Framer Motion
- **AI**: OpenAI GPT-4o API (coming in Phase 3)
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Later) OpenAI API key for AI brief generation

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Deployment to Netlify

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Click "Deploy site"

### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub
2. Netlify will auto-detect the Next.js framework
3. Automatic deployments on every push to main

### Environment Variables (for Phase 3+)

Add these to your Netlify site settings under "Environment variables":

```
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎬 User Flow

### Phase 1 (Current): Frame + Scaffolding ✅

- Landing page with DICE-inspired aesthetic
- Moodboard page with drag-and-drop image upload
- Basic routing and navigation
- Ready for Netlify deployment

### Phase 2 (Next): AI Integration

- OpenAI GPT-4o integration for brief generation
- Loading animations and shimmer effects
- Rich, scrollable brief display

### Phase 3: Community Matching

- Hardcoded community data
- Smart matching algorithm
- Community cards with collaboration CTAs

### Phase 4: Connection Animation

- Framer Motion partnership animation
- Sparkle/glow effects
- Success modal

## 📁 Project Structure

```
culturemesh/
├── app/
│   ├── page.tsx              # Landing page
│   ├── moodboard/
│   │   └── page.tsx          # Moodboard builder
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── package.json
└── README.md
```

## 🎨 Design Philosophy

- **Black & White Aesthetic**: Minimal DICE-inspired design
- **Motion-Rich**: Smooth Framer Motion animations
- **Breathing Room**: Clean typography with lots of space
- **Conceptually Magical**: AI-powered features feel futuristic yet accessible

## 📝 License

This is a prototype project for demonstration purposes.
