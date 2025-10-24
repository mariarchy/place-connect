#!/bin/bash
# Convert the large GIF to an optimized MP4 video
# This will reduce file size from 43MB to ~3-5MB

echo "Converting landing-page.gif to MP4..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed"
    echo "Install it with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    exit 1
fi

# Convert GIF to MP4 with optimization
ffmpeg -i public/landing-page.gif \
    -vf "scale=1920:-1:flags=lanczos,fps=15" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -movflags +faststart \
    -pix_fmt yuv420p \
    -y \
    public/landing-page.mp4

# Also create WebM for better browser support
ffmpeg -i public/landing-page.gif \
    -vf "scale=1920:-1:flags=lanczos,fps=15" \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -y \
    public/landing-page.webm

# Show file sizes
echo ""
echo "✅ Conversion complete!"
echo ""
echo "File sizes:"
ls -lh public/landing-page.* | awk '{print $9, $5}'
echo ""
echo "You can now delete the GIF file and update your code to use video instead."

