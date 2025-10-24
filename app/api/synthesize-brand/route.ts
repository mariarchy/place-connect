import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface BrandAnswers {
  brandName: string;
  brandWebsite: string;
  mission: string;
  tone: string;
  communities: string;
  inspiration: string;
  budget: string;
  fileKeywords: string[];
}

interface BrandSummary {
  brandName: string | null;
  brandWebsite: string | null;
  brandEssence: string;
  keywords: string[];
  audience: string;
  tone: string[];
  communities: string[];
  fileKeywords: string[];
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { answers, fileKeywords } = body as { answers: BrandAnswers; fileKeywords: string[] };

    if (!answers) {
      return NextResponse.json(
        { error: 'Missing brand answers in request body' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No GOOGLE_GEMINI_API_KEY found, returning fallback synthesis');
      // Fall back to the original client-side logic
      const fallbackSummary = generateFallbackSummary(answers, fileKeywords || []);
      return NextResponse.json(fallbackSummary);
    }

    // Initialize Google Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build the prompt in the voice of a sophisticated PR agency
    const prompt = buildPRAgencyPrompt(answers, fileKeywords || []);

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let brandSummary: BrandSummary;
    try {
      // Extract JSON from response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      brandSummary = JSON.parse(jsonText);
      
      // Ensure brandName and brandWebsite are included
      brandSummary.brandName = answers.brandName || null;
      brandSummary.brandWebsite = answers.brandWebsite || null;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Response text:', text);
      // Fall back to default logic
      brandSummary = generateFallbackSummary(answers, fileKeywords || []);
    }

    return NextResponse.json(brandSummary);
  } catch (error: unknown) {
    console.error('Error synthesizing brand summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to synthesize brand summary', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Build a sophisticated PR agency-style prompt for Gemini
 */
function buildPRAgencyPrompt(answers: BrandAnswers, fileKeywords: string[]): string {
  const { brandName, brandWebsite, mission, tone, communities, inspiration, budget } = answers;

  return `You are a senior brand strategist at a world-class PR and creative agency. Your expertise lies in synthesizing complex brand narratives into compelling, strategic brand essences that resonate with cultural movements and diverse audiences.

You have been provided with the following brand discovery inputs from a client:

**Brand Name:** ${brandName || 'Not provided'}
**Website:** ${brandWebsite || 'Not provided'}
**Mission Statement:** ${mission || 'Not provided'}
**Tone & Voice Descriptors:** ${tone || 'Not provided'}
**Target Communities/Subcultures:** ${communities || 'Not provided'}
**Inspirational Reference (Event/Campaign):** ${inspiration || 'Not provided'}
**Budget Range:** ${budget || 'Not provided'}
**Visual/Cultural Themes from Brand Materials:** ${fileKeywords.length > 0 ? fileKeywords.join(', ') : 'Not provided'}

---

**Your Task:**

Synthesize this information into a strategic brand summary. Your output must be sophisticated, culturally astute, and demonstrate deep understanding of contemporary brand positioning. Think like you're preparing materials for a C-suite presentation or a high-stakes pitch.

Generate a JSON object with the following structure:

{
  "brandEssence": "A 1-2 sentence poetic yet strategic statement that captures the soul of the brand. This should feel like it could open a keynote or brand manifesto. Be bold, aspirational, and culturally resonant. Avoid clichés. Reference the mission and tone naturally.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "audience": "A concise, insightful description of the target audience that goes beyond demographics to capture psychographics and cultural identity.",
  "tone": ["adjective1", "adjective2", "adjective3"],
  "communities": ["community1", "community2", "community3"],
  "fileKeywords": ${JSON.stringify(fileKeywords)}
}

**Guidelines for brandEssence:**
- Write as if you're crafting the opening line of a TED talk or brand film
- Be concrete yet evocative
- Reference the mission statement naturally, but elevate it
- Infuse the tone descriptors seamlessly
- Make it memorable and quotable
- 2-3 sentences maximum
- Avoid "You are" or "We are" openings—be more creative

**Guidelines for keywords:**
- Extract 5 highly visual, culturally relevant keywords for image curation
- These will be used to search for brand imagery (moodboard)
- Blend tone words, community references, and visual themes
- Think like a creative director curating a moodboard

**Guidelines for audience:**
- Go beyond listing communities—describe their mindset, values, and cultural position
- Be specific yet inclusive
- Capture the "why" they would connect with this brand

**Guidelines for tone:**
- Extract 3 core adjectives from the provided tone
- If tone is vague, infer from mission and communities

**Guidelines for communities:**
- Parse the communities field into 2-4 distinct community names
- Be specific (e.g., "skaters", "indie music lovers", "chess enthusiasts")

Return ONLY the JSON object, no additional commentary.`;
}

/**
 * Fallback function when API key is not available (uses original client logic)
 */
function generateFallbackSummary(answers: BrandAnswers, fileKeywords: string[]): BrandSummary {
  const { brandName, brandWebsite, mission, tone, communities, inspiration } = answers;

  // Extract components
  const adjectives = tone
    ? tone.toLowerCase().split(/[,;]+/).map(w => w.trim()).filter(w => w.length > 0).slice(0, 3)
    : ['authentic', 'bold'];

  // Extract verb
  const verbs = ['connect', 'create', 'inspire', 'empower', 'build', 'transform', 'celebrate', 'unite', 'elevate', 'champion'];
  const verb = verbs.find(v => mission.toLowerCase().includes(v)) || 'connect';

  // Create brand essence
  let brandEssence = '';
  const isOutdoor = 
    mission.toLowerCase().includes('sport') ||
    mission.toLowerCase().includes('outdoor') ||
    mission.toLowerCase().includes('active') ||
    fileKeywords.some(k => k.toLowerCase().includes('outdoor') || k.toLowerCase().includes('sport'));

  if (isOutdoor && adjectives.length >= 2) {
    brandEssence = `An ${adjectives[0]}, ${adjectives[1]} brand that aims to ${verb} communities through outdoor experiences and active culture.`;
  } else if (mission && adjectives.length >= 2) {
    brandEssence = `A ${adjectives[0]}, ${adjectives[1]} brand that seeks to ${verb} with audiences. ${mission.split('.')[0]}.`;
  } else if (mission) {
    brandEssence = `${mission.split('.')[0]}. ${verb.charAt(0).toUpperCase() + verb.slice(1)}ing through ${adjectives[0] || 'authentic'} storytelling and cultural resonance.`;
  } else {
    brandEssence = `A brand that values ${adjectives[0] || 'authenticity'} and speaks with ${adjectives[1] || 'boldness'}.`;
  }

  // Extract keywords
  const keywordSet = new Set<string>();
  adjectives.forEach(adj => keywordSet.add(adj));
  
  if (communities) {
    communities
      .split(/[,;]+/)
      .map(c => c.trim().toLowerCase())
      .filter(c => c.length > 0)
      .slice(0, 2)
      .forEach(c => keywordSet.add(c));
  }

  fileKeywords.slice(0, 2).forEach(k => keywordSet.add(k));

  if (inspiration) {
    const inspirationWords = inspiration
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4 && !['event', 'campaign'].includes(w))
      .slice(0, 1);
    inspirationWords.forEach(w => keywordSet.add(w));
  }

  const keywords = Array.from(keywordSet).slice(0, 5);

  // Split communities
  const communitiesList = communities
    ? communities.split(/[,;]+/).map(c => c.trim()).filter(c => c.length > 0)
    : [];

  return {
    brandName: brandName || null,
    brandWebsite: brandWebsite || null,
    brandEssence,
    keywords,
    audience: communities || 'Culturally engaged communities',
    tone: adjectives,
    communities: communitiesList,
    fileKeywords,
  };
}

