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

### Step 3b: Community Collaborations Page
- **Vetted Communities**: Showcases AI-recommended communities from PLACE Connect network
- **Horizontal Carousel**: Manual scroll/drag carousel with community cards
- **Community Cards**: Display hero image, name, engagement type pills, description, and reach stats
- **Interactive Modal**: Click cards to view detailed collaboration info with full-size image
- **Community Images**: Each community has a featured image stored in `/public/communities/`
- **Image Optimization**: Images with hover zoom effects and gradient overlays
- **Selection Flow**: Select a community and proceed to contact page
- **Data Enrichment**: Stitches Gemini collaboration data with community details from database
- **Smooth Animations**: Framer Motion card hover effects and modal transitions
- **Responsive Design**: Mobile-optimized carousel with touch scroll
- **Scrollable Modal**: Modal supports scrolling for longer content

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
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

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
  /communities
    page.tsx          # Community collaborations carousel and selection
  /contact
    page.tsx          # Contact page (placeholder for AI email generation)
  layout.tsx          # Root layout with fonts
  page.tsx            # Landing page
  globals.css         # Global styles and theme

/components
  QuestionCard.tsx    # Animated question card component
  ProtoBrief.tsx      # Live-updating summary panel
  BrandSummaryCard.tsx # Final brand summary with report generation
  CampaignReport.tsx  # AI-generated campaign strategy with hero moodboard

/lib
  fileMapping.ts      # Mock file-to-keyword mapping logic
  summarize.ts        # Client-side brand essence synthesis
  communities.json    # Database of available communities with images

/public
  /communities        # Community images directory (upload JPGs here)

/app/api
  /generate-report
    route.ts          # Serverless API endpoint for Gemini integration
  /moodboard
    route.ts          # Serverless API endpoint for Unsplash integration
```

## Community Images

### Adding Community Images

Place community images in the `/public/communities/` directory with the following naming convention:

- `five-points-project.jpg`
- `walk-this-way.jpg`
- `knight-chess-club.jpg`

**Recommended Image Specs:**
- **Format**: JPG or PNG
- **Dimensions**: 800x600px (4:3 aspect ratio) or similar
- **File size**: < 500KB for optimal loading
- **Content**: High-quality photos that represent the community's vibe and activities

Images will automatically appear in:
1. **Carousel cards**: 192px height with gradient overlay and hover zoom
2. **Modal overlay**: 256px height hero image with dark gradient

If no image is provided, the card will display without an image (graceful fallback).

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
7. **Campaign Report Page** → Full-page experience with:
   - Hero: Diagonal overlapping Unsplash images with campaign title overlay
   - Campaign description and cultural insights
   - Market trends metrics (AI-generated)
   - Potential collaborations with budgets and offerings
8. **Community Collaborations** (`/communities`) → Click "Explore Communities →"
   - Horizontal carousel of vetted community cards
   - Click card to view modal with detailed collaboration info
   - Select a community to proceed
9. **Contact Page** (`/contact`) → Placeholder for AI-generated outreach
10. **Regenerate & Export** → Regenerate report or export as PDF anytime
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

### Step 3b: Community Collaborations
✅ Communities page loads with carousel of AI-recommended communities  
✅ Cards display community name, engagement types, description, and stats  
✅ Manual horizontal scroll with CSS snap points  
✅ Click card opens modal with full collaboration details  
✅ Modal shows budget, non-monetary offerings, and community reach metrics  
✅ "Select this community" button highlights card and reveals "Next" CTA  
✅ Selected community data persists to contact page  
✅ Smooth Framer Motion animations on hover and modal open/close  
✅ Hero section with diagonal overlapping Unsplash images  
✅ "Export Deck (PDF)" compiles full campaign report with images  
✅ Data enrichment: Gemini collaborations + communities.json details  
✅ Mobile responsive: carousel works with touch scroll

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

### Testing Step 3b: Community Collaborations

1. After viewing campaign report, click "Explore Communities →" at bottom
2. Verify navigation to `/communities` page
3. **Community Cards**: 
   - Verify cards display in horizontal carousel
   - Check community name, engagement type pills, description
   - Verify Instagram followers and avg. attendance stats
4. **Card Interaction**:
   - Hover over card to see scale/elevation animation
   - Click card to open modal overlay
5. **Modal Details**:
   - Verify modal shows full community description
   - Check collaboration details (engagement type, budget, description)
   - Verify non-monetary offerings displayed as pills
   - Check community stats grid (Instagram, attendance, WhatsApp, event types)
   - Verify Instagram link is clickable
6. **Selection Flow**:
   - Click "Select this community" button
   - Modal should close
   - Card should highlight with white border and checkmark
   - "Next →" button should appear at bottom-right
7. **Navigation**:
   - Click "Next →" to navigate to `/contact`
   - Verify selected community data appears on contact page
8. **Mobile Responsive**: 
   - Resize to mobile width
   - Verify carousel scrolls horizontally with touch
   - Check modal is properly sized and scrollable

**Example Test Data:**
- Use the chess keywords to trigger "Knight Chess Club" recommendation
- Use outdoor/sport keywords to trigger "Walk This Way" recommendation
- Use music/creative keywords to trigger "Five Points Project" recommendation

**Expected Behavior:**

**Communities Page:**
- Without campaign report: Shows "No collaborations found" with link back to brand discovery
- With campaign report: Displays AI-recommended communities enriched with data from `communities.json`
- Data persistence: Selected community saved to sessionStorage for contact page

**Hero Moodboard:**
- Without Unsplash API key: Returns placeholder images in diagonal layout
- With Unsplash API key: Fetches keyword-relevant images with creative overlapping arrangement
- Images have reduced shadow overlay for better title visibility

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
