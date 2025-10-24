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

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

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
  BrandSummaryCard.tsx # Final brand summary with JSON preview

/lib
  fileMapping.ts      # Mock file-to-keyword mapping logic
  summarize.ts        # Client-side brand essence synthesis
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
5. **Edit Capability** → Click "Edit" to return to questions with data intact
6. **JSON Preview** → Expand to see canonical data structure for Step 3

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

## Testing Step 2

To test the Review & Summarize functionality:

1. Start at `/moodboard`
2. Fill in at least the first 3 questions (mission, tone, communities)
3. Click "Next" through all 6 questions
4. You'll see the "You're all set" review screen
5. Click "Summarize Brand" to see the synthesized summary
6. Verify the Brand Essence uses words from your tone and mission
7. Check that Image Keywords contains 3-5 relevant terms
8. Click "Edit" to return to questions (data should persist)
9. Expand "JSON Preview" to see the data structure

**Example Test Data:**
- Mission: "We connect urban creators with sustainable outdoor experiences"
- Tone: "playful, authentic, bold"
- Communities: "skaters, climbers, photographers"
- Try uploading a file with "salomon" in the name to trigger keywords

## Notes

- No authentication or database
- All data stored in local component state
- File parsing is mock/demo only (no actual PDF/PPT extraction)
- Brand summarization is deterministic client-side logic (no AI yet)
- Designed for demo purposes with easily tweakable templates

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion 12
- **Language**: TypeScript 5

## License

Private - PLACE Connect Hack Demo
