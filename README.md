# PLACE Connect - Step 1: Brand Discovery UI

A cinematic conversational upload UI for marketing leads to describe their brand, built with Next.js, React, TailwindCSS, and Framer Motion.

## Features

- **Sequential Q&A Interface**: 6 guided prompts presented as animated cards
- **Live Proto Brief**: Real-time summary panel that updates as users type
- **File Upload**: Support for PDF, PPT, and images with mock keyword extraction
- **Dark DICE-like Aesthetic**: Black background (#0b0b0b), white text, subtle gray accents
- **Smooth Animations**: Framer Motion transitions between questions
- **Responsive Layout**: 60/40 split (chat/brief) on desktop, stacked on mobile

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
Navigate to [http://localhost:3000/moodboard](http://localhost:3000/moodboard) for the brand discovery interface.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /moodboard
    page.tsx          # Main moodboard Q&A page
  layout.tsx          # Root layout with fonts
  page.tsx            # Landing page
  globals.css         # Global styles and theme

/components
  QuestionCard.tsx    # Animated question card component
  ProtoBrief.tsx      # Live-updating summary panel

/lib
  fileMapping.ts      # Mock file-to-keyword mapping logic
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

✅ /moodboard page loads and is responsive  
✅ Sequential Q&A works with Back/Next navigation  
✅ Smooth Framer Motion transitions between questions  
✅ Proto Brief updates in real-time as user types  
✅ File upload accepts multiple files and displays filenames  
✅ Mock keyword mapping runs on file upload  
✅ Dark DICE-like aesthetic implemented  
✅ Accessible components with proper labels and keyboard navigation

## Notes

- No authentication or database
- All data stored in local component state
- File parsing is mock/demo only (no actual PDF/PPT extraction)
- Designed for demo purposes with placeholder content

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion 12
- **Language**: TypeScript 5

## License

Private - PLACE Connect Hack Demo
