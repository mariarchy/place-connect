# PLACE Connect - Brand Discovery Platform

A cinematic conversational upload UI for marketing leads to describe their brand, built with Next.js, React, TailwindCSS, and Framer Motion.

## Features

### Step 1: Conversational Brand Input
- **Sequential Q&A Interface**: 6 guided prompts presented as animated cards
- **Live Proto Brief**: Real-time summary panel that updates as users type
- **File Upload**: Support for PDF, PPT, and images with mock keyword extraction
- **Dark DICE-like Aesthetic**: Black background (#0b0b0b), white text, subtle gray accents
- **Smooth Animations**: Framer Motion transitions between questions
- **Responsive Layout**: 60/40 split (chat/brief) on desktop, stacked on mobile

### Step 2: Review & Summarize
- **Brand Essence Synthesis**: Client-side logic creates poetic 1-2 sentence brand essence
- **Keyword Extraction**: Generates 3-5 keywords for image curation
- **Interactive Summary**: Large elegant card with hero serif heading
- **Edit Flow**: Return to questions with all previous inputs intact
- **JSON Preview**: Collapsed panel showing canonical data structure for Step 3

### Step 3a: AI Campaign Report Generation
- **Gemini Integration**: Uses Google's Gemini 2.0 Flash (optimized for JSON and creative writing)
- **Strategic Report**: AI generates PR agency-grade campaign strategy with cultural insights
- **Community Matching**: Automatically suggests relevant communities from PLACE Connect network
- **Collaboration Details**: Budget, engagement types, and non-monetary offerings for each partnership
- **Loading UX**: Shimmer animation with "Imagining the campaign..." message
- **Regeneration**: One-click regenerate with fresh AI insights
- **Error Handling**: Graceful degradation with mock data if API key unavailable
- **Rate Limiting**: Built-in protection (5 requests/minute per IP)

### Step 3b: Dynamic Visual Moodboard
- **Unsplash Integration**: Server-side API calls for copyright-free imagery
- **Keyword-Based Search**: Uses Step 2 keywords to curate relevant visuals
- **Interactive Grid**: 3x3 responsive grid with hover effects and image enlargement
- **Lightbox Modal**: Click images for full-size view with photographer credits
- **Image Selection**: "Use in Deck" toggle to mark images for export
- **Regeneration**: Fetch different images with same keywords (uses pagination seed)
- **Two-Column Layout**: Strategy report (60%) + Moodboard (40%), responsive stacking
- **PDF Export**: html2canvas + jsPDF to generate downloadable campaign deck
- **Server Caching**: 5-minute in-memory cache to reduce API quota usage
- **Mock Fallback**: High-quality Unsplash demo images when no API key

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required for AI Campaign Report Generation (Step 3a)
GEMINI_API_KEY=your_gemini_api_key_here

# Required for Visual Moodboard (Step 3b)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

**Getting API Keys:**

**Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into `.env.local`

**Unsplash API Key:**
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Sign up / log in to your Unsplash account
3. Create a new application (choose "Demo" for testing)
4. Copy the "Access Key" and paste it into `.env.local`

**Note:** The app works without API keys (uses mock data), but you need them for real AI reports and diverse imagery.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.  
Navigate to [http://localhost:3000/brand](http://localhost:3000/brand) for the brand discovery interface.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /brand
    page.tsx          # Main brand discovery Q&A page with multi-view flow
  layout.tsx          # Root layout with fonts
  page.tsx            # Landing page
  globals.css         # Global styles and theme

/components
  QuestionCard.tsx    # Animated question card component
  ProtoBrief.tsx      # Live-updating summary panel
  BrandSummaryCard.tsx # Final brand summary with report generation
  CampaignReport.tsx  # AI-generated campaign strategy with moodboard
  MoodboardGrid.tsx   # Interactive image grid with lightbox

/lib
  fileMapping.ts      # Mock file-to-keyword mapping logic
  summarize.ts        # Client-side brand essence synthesis
  communities.json    # Database of available communities

/app/api
  /generate-report
    route.ts          # Serverless API endpoint for Gemini integration
  /moodboard
    route.ts          # Serverless API endpoint for Unsplash integration
```

## Mock File Parsing

The demo includes simple keyword extraction based on filenames:

- Files containing "salomon" or "sneaker" → tagged as "outdoor / sport"
- Files containing "chess" → tagged as "intellectual / quiet-night"
- Other files → no automatic keywords

### Editing the Mapping

To customize the filename-to-keyword logic, edit `/lib/fileMapping.ts`:

```typescript
export function mapFilenamesToKeywords(fileNames: string[]): string[] {
  const keywords: string[] = [];

  fileNames.forEach((fileName) => {
    const lowerName = fileName.toLowerCase();

    // Add your custom mappings here
    if (lowerName.includes('your-keyword')) {
      keywords.push('your-tag');
    }
  });

  return keywords;
}
```

## Brand Summarization Logic

The client-side summarization creates a poetic brand essence by:

1. **Extracting Adjectives**: Parses tone input for descriptive words
2. **Finding Action Verbs**: Identifies verbs like "connect", "inspire", "empower" from mission
3. **Template Selection**: Uses different templates based on content (e.g., outdoor/sport brands)
4. **Keyword Curation**: Combines tone, communities, file keywords into 3-5 image search terms

### Customizing Summarization

Edit `/lib/summarize.ts` to adjust the synthesis logic:

```typescript
// Add new brand archetypes
const isOutdoor = 
  mission.toLowerCase().includes('sport') ||
  mission.toLowerCase().includes('outdoor');

// Customize brand essence templates
if (isOutdoor && adjectives.length >= 2) {
  brandEssence = `You are an ${adjectives[0]}, ${adjectives[1]} brand...`;
}
```

## User Flow

1. **Landing Page** (`/`) → Click "Start Brand Discovery"
2. **Questions Flow** (`/brand`) → Answer 6 sequential questions with Back/Next navigation
3. **Review Screen** → After final question, shown "You're all set" with CTA
4. **Brand Summary** → Click "Summarize Brand" to see synthesized brand essence
5. **Campaign Generation** → Click "✨ Generate Campaign Report" to trigger AI
6. **Loading State** → Shimmer animation while Gemini generates strategy
7. **Campaign Report + Moodboard** → Two-column layout:
   - Left: AI strategy report with title, insights, collaborations, next steps
   - Right: Visual moodboard with 8 curated images based on keywords
8. **Image Interaction** → Hover to see tags, click for lightbox, toggle "Use in Deck"
9. **Regenerate Options** → Regenerate report (AI) or moodboard (new images)
10. **Export PDF** → Click "Export Deck (PDF)" to download complete campaign deck
11. **Edit Capability** → Navigate back to edit brand inputs anytime

## Design System

### Colors
- Background: `#0b0b0b`
- Primary Text: `#ffffff`
- Secondary Text: `#BDBDBD`
- Borders: `#374151` (gray-700)

### Typography
- Body: Inter (variable font)
- Proto Brief Heading: Playfair Display (serif)

### Spacing
- Large spacing throughout for breathing room
- Pill-shaped buttons with transparent fills

## State Management

Uses simple React `useState` with the following shape:

```typescript
{
  mission: string,
  tone: string,
  communities: string,
  inspiration: string,
  budget: string,
  fileNames: string[]
}
```

No external state library required for this demo.

## Acceptance Criteria

### Step 1: Conversational Input
✅ /brand page loads and is responsive  
✅ Sequential Q&A works with Back/Next navigation  
✅ Smooth Framer Motion transitions between questions  
✅ Proto Brief updates in real-time as user types  
✅ File upload accepts multiple files and displays filenames  
✅ Mock keyword mapping runs on file upload  
✅ Dark DICE-like aesthetic implemented  
✅ Accessible components with proper labels and keyboard navigation

### Step 2: Review & Summarize
✅ After final question, "Review" screen appears with CTA  
✅ "Summarize Brand" button generates brand essence  
✅ Brand essence uses poetic language with adjectives and verbs  
✅ Summary shows tone, communities, and file keywords  
✅ 3-5 image keywords extracted for visual curation  
✅ "Edit" button returns to questions with inputs preserved  
✅ JSON preview panel displays canonical data structure  
✅ Micro-animations on summary card reveal (scale/fade)

### Step 3a: AI Campaign Report
✅ "Generate Campaign Report" button triggers Gemini API call  
✅ Loading state displays shimmer animation + "Imagining the campaign..."  
✅ API route calls Gemini 2.0 Flash with structured JSON response  
✅ Report displays campaign title, brand essence, cultural insights  
✅ Potential collaborations listed with budget and engagement details  
✅ Next steps provided as actionable bullet points  
✅ "Regenerate" button creates fresh campaign idea  
✅ Rate limiting prevents spam (5 requests/minute)  
✅ Errors displayed gracefully with dismissible messages  
✅ Mock data fallback when no API key configured

### Step 3b: Visual Moodboard
✅ Moodboard fetches 8 images from Unsplash based on keywords  
✅ Responsive 2x4 grid (desktop) with hover effects  
✅ Hover shows image tags and selection heart icon  
✅ Click opens lightbox modal with large image view  
✅ Lightbox displays photographer credits and "Use in Deck" toggle  
✅ "Regenerate Moodboard" fetches different images (pagination seed)  
✅ Staggered Framer Motion animations on grid load/update  
✅ Two-column layout: Report (60%) + Moodboard (40%)  
✅ Mobile responsive: stacks moodboard below report  
✅ "Export Deck (PDF)" compiles report + selected images  
✅ Server-side caching reduces API quota usage (5min cache)  
✅ Mock images fallback when no Unsplash API key

## Testing

### Testing Step 2: Brand Summarization

1. Start at `/brand`
2. Fill in at least the first 3 questions (mission, tone, communities)
3. Click "Next" through all 6 questions
4. You'll see the "You're all set" review screen
5. Click "Summarize Brand" to see the synthesized summary
6. Verify the Brand Essence uses words from your tone and mission
7. Check that Image Keywords contains 3-5 relevant terms
8. Click "Edit" to return to questions (data should persist)
9. Expand "JSON Preview" to see the data structure

### Testing Step 3a: AI Campaign Report

1. Complete Step 2 to reach the Brand Summary screen
2. Click "✨ Generate Campaign Report"
3. Observe shimmer loading animation with "Imagining the campaign..." text
4. Review generated report sections:
   - Campaign title (large serif heading)
   - Brand essence summary
   - Cultural insights (1-2 paragraphs with metrics)
   - Potential collaborations (community name, engagement type, budget, offerings)
   - Next steps (actionable bullets)
5. Click "Regenerate" to get a fresh perspective

### Testing Step 3b: Visual Moodboard

1. After generating campaign report, observe automatic moodboard load (right column)
2. Verify 8 images displayed in responsive grid
3. **Hover Effects**: Hover over images to see tags and heart icon
4. **Lightbox**: Click an image to open full-size view
   - Verify photographer attribution
   - Toggle "Use in Deck" button
   - Close with × button or background click
5. **Regenerate**: Click "Regenerate" on moodboard to fetch new images
6. **Export PDF**: 
   - Select 2-3 images with "Use in Deck"
   - Click "Export Deck (PDF)" button
   - Verify PDF downloads with report content
   - Check image quality and layout
7. **Mobile Responsive**: Resize browser to mobile width
   - Verify moodboard stacks below report
   - Check grid becomes 2 columns

**Example Test Data:**
- Mission: "We connect urban creators with sustainable outdoor experiences"
- Tone: "playful, authentic, bold"
- Communities: "skaters, climbers, photographers"
- Try uploading a file with "salomon" in the name to trigger "outdoor / sport" keywords

**Expected Behavior:**

**Campaign Report:**
- Without Gemini API key: Returns rich mock data (chess, outdoor, or generic campaign based on keywords)
- With Gemini API key: Calls real API and returns AI-generated campaign strategy
- Rate limit: After 5 requests in 1 minute, shows "Rate limit exceeded" error

**Moodboard:**
- Without Unsplash API key: Returns 8 high-quality mock images from Unsplash demo pool
- With Unsplash API key: Searches Unsplash for keyword-relevant images
- Caching: Same keywords return cached results for 5 minutes
- Regenerate: Changes pagination seed to fetch different images

## Technical Details

### Why Gemini 2.0 Flash Exp?

We chose **Gemini 2.0 Flash (Experimental)** for campaign report generation because:

1. **Native JSON Mode**: Built-in `responseMimeType: 'application/json'` ensures structured output
2. **Creative Writing**: Optimized for marketing copy and strategic narrative
3. **Speed**: Fast inference (~2-3 seconds) for great UX
4. **Cost-Effective**: Lower cost than GPT-4 for similar creative tasks
5. **Multimodal Ready**: Future-proof for image analysis

### Why Unsplash?

We chose **Unsplash API** for moodboard imagery because:

1. **Free & Copyright-Free**: All images free to use, no attribution required
2. **High Quality**: Professional photography, editorial-grade
3. **Extensive Library**: 3M+ curated images covering diverse keywords
4. **Search API**: Robust keyword search with relevance scoring
5. **Metadata**: Rich tags and photographer info for attribution
6. **Demo-Friendly**: Works well with mock data fallback for testing

### Rate Limiting

Simple in-memory rate limiting:
- **Limit**: 5 requests per minute per IP
- **Storage**: Map in memory (resets on server restart)
- **Production**: Should use Redis or similar distributed cache

### API Security

- API keys stored in environment variables (never logged or exposed)
- Rate limiting prevents abuse (5-10 requests/minute)
- Server-side API calls avoid exposing keys to frontend
- Graceful error handling with user-friendly messages
- No API keys? Falls back to high-quality mock data

### PDF Export

Uses **html2canvas** + **jsPDF** for client-side PDF generation:

1. Captures entire campaign report container as canvas image
2. Converts to high-resolution PNG (scale: 2)
3. Generates A4 PDF with automatic page breaks
4. Includes both strategy report and moodboard
5. Downloads with campaign title as filename

**Limitations:**
- Client-side rendering may have font/style inconsistencies
- Large images increase file size
- Alternative: Use browser print (Cmd+P) for better control

## Notes

- No authentication or database
- Brand data stored in sessionStorage (persists across browser refresh)
- File parsing is mock/demo only (no actual PDF/PPT extraction)
- Brand summarization uses deterministic client-side logic
- Campaign generation uses AI (Gemini) or mock data fallback
- Designed for demo purposes with easily tweakable templates

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion 12
- **Language**: TypeScript 5
- **AI**: Google Gemini 2.0 Flash (via `@google/generative-ai`)
- **Images**: Unsplash API for moodboard curation
- **PDF Export**: html2canvas + jsPDF for deck generation
- **API**: Next.js serverless functions (API routes)

## License

Private - PLACE Connect Hack Demo
