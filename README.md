# CultureMesh v0 Prototype

An AI-powered web prototype that lets marketing users create moodboard-style campaigns and instantly get AI-generated PR campaign briefs with matching grassroots communities.

## Features

- 🎨 **Moodboard Creation**: Drag-and-drop image upload with brand vibe input
- 🤖 **AI Brief Generation**: GPT-4o powered campaign brief generation
- 🏘️ **Community Matching**: Smart matching with authentic grassroots communities
- ✨ **Connection Animation**: Framer Motion powered collaboration animations
- 🎯 **Modern UI**: DICE-inspired minimal black-and-white aesthetic

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Animations**: Framer Motion
- **File Upload**: React Dropzone
- **AI**: OpenAI GPT-4o API
- **Deployment**: Vercel

## Setup

1. **Clone and install dependencies**:
   ```bash
   cd culturemesh
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your API key from: https://platform.openai.com/api-keys

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Landing Page**: Click "Create Campaign Moodboard" to start
2. **Moodboard**: Upload images and describe your brand's vibe
3. **Results**: View AI-generated campaign brief and matching communities
4. **Collaboration**: Click "Propose Collaboration" to see the connection animation

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── moodboard/
│   │   └── page.tsx          # Moodboard creation
│   ├── results/
│   │   └── page.tsx          # AI brief and community matches
│   └── api/
│       └── brief/
│           └── route.ts      # OpenAI API endpoint
├── data/
│   └── communities.ts        # Hardcoded community data
└── components/               # Reusable components (future)
```

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

## Mock Data

The app uses hardcoded community data for demonstration purposes. In a production version, this would connect to a real database with actual community information.

## License

MIT License - feel free to use this prototype for inspiration and learning!