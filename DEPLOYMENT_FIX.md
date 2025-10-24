# Image Loading Fix for Production

## Problem
Images in the `/public/communities/` folder were not loading in production (Cloud Run) even though they work locally.

## Root Cause
Next.js standalone output mode requires specific Docker configuration to ensure the `public` folder is properly copied and served in production.

## Changes Made

### 1. **Dockerfile** - Enhanced for standalone mode
- ✅ Added proper ownership (`--chown`) when copying files
- ✅ Added verification steps to confirm images are present during build
- ✅ Ensured correct copy order (standalone → static → public)
- ✅ Removed redundant RUN command for permissions

### 2. **next.config.ts** - Added image optimization flag
- ✅ Added `images.unoptimized: true` to handle regular `<img>` tags

### 3. **Diagnostic Endpoint** - `/api/test-image`
- ✅ Created test endpoint to verify file system state in production
- ✅ Returns JSON with directory existence checks and file listings

## Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add Dockerfile next.config.ts app/api/test-image/route.ts
git commit -m "Fix: Properly serve public images in standalone Docker build"
git push origin main
```

### Step 2: Monitor Cloud Build
1. Go to Google Cloud Console → Cloud Build → History
2. Watch the build logs for these messages:
   - `WARNING: public/communities not found!` (should NOT appear)
   - `✓ Public images copied successfully` (should appear)

### Step 3: Test the Deployment
Once deployed, test these URLs:

**Diagnostic endpoint:**
```
https://your-app-url.run.app/api/test-image
```

Expected response:
```json
{
  "cwd": "/app",
  "publicDirExists": true,
  "communitiesDirExists": true,
  "testImageExists": true,
  "nodeEnv": "production",
  "files": ["five-points-project-1.png", "walk-this-way-1.png", "knight-chess-club-1.png", ...]
}
```

**Direct image access:**
```
https://your-app-url.run.app/communities/five-points-project-1.png
```

**Communities page:**
```
https://your-app-url.run.app/communities
```

## Troubleshooting

### If images still don't load:

1. **Check build logs** - Look for the verification messages
   ```bash
   gcloud builds list --limit=1
   gcloud builds log [BUILD_ID]
   ```

2. **Check diagnostic endpoint** - Visit `/api/test-image` to see if files exist

3. **Check Cloud Run logs** - Look for 404 errors
   ```bash
   gcloud run logs read place-connect --limit=50
   ```

4. **Force rebuild without cache**
   ```bash
   gcloud builds submit --config cloudbuild.yaml --no-cache
   ```

5. **Verify git tracking** - Ensure images are committed
   ```bash
   git ls-files public/communities/
   ```

### Common Issues

| Issue | Solution |
|-------|----------|
| `publicDirExists: false` | Public folder not being copied - check .dockerignore |
| `testImageExists: false` | Images not in git - run `git add public/communities/*.png` |
| 404 on `/communities/*.png` | Next.js not serving public folder - check server.js startup |
| Images work locally but not in prod | Cache issue - force rebuild without cache |

## Files Modified
- `Dockerfile` - Docker build configuration
- `next.config.ts` - Next.js configuration
- `app/api/test-image/route.ts` - Diagnostic endpoint (NEW)

## Verification Checklist
- [ ] Changes committed and pushed
- [ ] Cloud Build completed successfully  
- [ ] Build logs show "✓ Public images copied successfully"
- [ ] `/api/test-image` returns all `true` values
- [ ] Direct image URLs load (e.g., `/communities/five-points-project-1.png`)
- [ ] Communities page displays images
- [ ] Modal overlays show images

