import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an expert cultural strategist and creative technologist.
Given a brand moodboard and short description, generate a PR campaign brief that connects the brand with authentic grassroots communities.
Your tone should sound like a senior strategist at an agency like Mother London or Wieden+Kennedy.
Output 3 sections:
1. Campaign Idea — the creative concept and cultural insight
2. Activation Example — a real-world event idea
3. Tone & Aesthetic — mood and creative direction

Keep each section concise but impactful. Use specific, actionable language that feels both strategic and culturally aware.
`;

export async function POST(request: NextRequest) {
  try {
    const { brandName, vibes } = await request.json();

    if (!brandName) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const userPrompt = `
Brand: ${brandName}
Moodboard Vibes: ${vibes || 'Not specified'}

Generate a compelling PR campaign brief that connects this brand with authentic grassroots communities.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const brief = response.choices[0]?.message?.content || 'Unable to generate brief';

    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate campaign brief' },
      { status: 500 }
    );
  }
}
