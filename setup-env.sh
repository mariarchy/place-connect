#!/bin/bash

# CultureMesh Environment Setup Script

echo "🎨 Setting up CultureMesh environment..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Add your OpenAI API key to this file
# Get your API key from: https://platform.openai.com/api-keys
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please add your OpenAI API key to .env.local"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For deployment to Vercel:"
echo "1. Push your code to GitHub"
echo "2. Connect to Vercel"
echo "3. Add OPENAI_API_KEY environment variable in Vercel dashboard"
