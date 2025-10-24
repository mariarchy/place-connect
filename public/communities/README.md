# Community Images Directory

This directory contains images for each community featured in the PLACE Connect platform.

## How to Add Community Images

1. **Prepare your images** with these specs:
   - **Format**: JPG or PNG
   - **Dimensions**: 800x600px (4:3 aspect ratio) recommended
   - **File size**: < 500KB for optimal loading
   - **Content**: High-quality photos that represent the community's vibe and activities

2. **Name your files** exactly as follows (matching the community ID in `lib/communities.json`):
   - `five-points-project.jpg`
   - `walk-this-way.jpg`
   - `knight-chess-club.jpg`

3. **Upload the files** to this directory (`/public/communities/`)

4. The images will automatically appear in:
   - **Carousel cards**: Hero image at the top of each community card (192px height)
   - **Modal overlay**: Large hero image when card is clicked (256px height)

## Current Communities

- **Five Points Project** (`five-points-project.jpg`) - Live music events and community gatherings
- **Walk This Way** (`walk-this-way.jpg`) - Hiking and outdoor adventure community
- **Knight Chess Club** (`knight-chess-club.jpg`) - Chess events in unique venues across London

## Image Examples

Good images should capture:
- ✅ People engaging with the community
- ✅ The energy and vibe of events
- ✅ Authentic moments that represent the community's culture
- ✅ Good lighting and composition

Avoid:
- ❌ Low resolution or blurry images
- ❌ Images with too much text overlay
- ❌ Stock photos that don't represent the actual community
- ❌ Images larger than 1MB (they will slow down page load)

## Technical Details

Images are referenced in `/lib/communities.json` with the `image` field pointing to `/communities/[filename].jpg`.

If an image is not found, the card will gracefully display without an image (no broken image placeholders).

