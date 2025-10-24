import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

interface EmailRequestBody {
  brandName: string;
  brandTone: string;
  campaignTitle: string;
  campaignDescription: string;
  communityName: string;
  communityDescription: string;
  engagementType: string;
  budget: number;
  nonMonetaryOfferings: string[];
  collaborationDescription: string;
}

const SYSTEM_PROMPT = `You are a professional brand partnership manager writing personalized outreach emails to community organizers. 

Write a warm, authentic email that:
1. Introduces the brand and their values
2. Expresses genuine interest in the community and their work
3. Proposes the collaboration in an exciting but respectful way
4. Clearly outlines what the brand is offering (budget + non-monetary offerings)
5. Invites a conversation to explore the partnership

Tone guidelines:
- Match the brand's tone (provided in the request)
- Be genuine and human, not corporate or salesy
- Show you've done your research on the community
- Express excitement without being pushy
- Keep it concise (300-400 words max)

Return ONLY the email body text (no subject line, no JSON wrapper).`;

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

    const body: EmailRequestBody = await request.json();
    const {
      brandName,
      brandTone,
      campaignTitle,
      campaignDescription,
      communityName,
      communityDescription,
      engagementType,
      budget,
      nonMonetaryOfferings,
      collaborationDescription,
    } = body;

    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    // If no API key, return mock email
    if (!GEMINI_API_KEY) {
      const mockEmail = generateMockEmail(body);
      return NextResponse.json({ email: mockEmail });
    }

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const userPrompt = `Write an outreach email for the following partnership:

BRAND:
Name: ${brandName || 'Our brand'}
Tone: ${brandTone}

CAMPAIGN:
Title: ${campaignTitle}
Description: ${campaignDescription}

COMMUNITY:
Name: ${communityName}
Description: ${communityDescription}

COLLABORATION:
Type: ${engagementType}
Budget: £${budget.toLocaleString()}
Additional Offerings: ${nonMonetaryOfferings.join(', ')}
Details: ${collaborationDescription}

Write the email body (no subject line).`;

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I will write personalized outreach emails matching the brand tone and collaboration details.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
    });

    const emailText = result.response.text();

    return NextResponse.json({ email: emailText });
  } catch (error) {
    console.error('Error generating email:', error);
    
    // Fallback to mock email on error
    const body: EmailRequestBody = await request.json();
    const mockEmail = generateMockEmail(body);
    
    return NextResponse.json({ email: mockEmail });
  }
}

function generateMockEmail(body: EmailRequestBody): string {
  const {
    brandName,
    brandTone,
    campaignTitle,
    communityName,
    communityDescription,
    engagementType,
    budget,
    nonMonetaryOfferings,
    collaborationDescription,
  } = body;

  return `Hi there,

I hope this message finds you well! I'm reaching out from ${brandName || 'our brand'} because we've been following ${communityName}'s incredible work in building authentic community connections.

We're currently developing "${campaignTitle}" — a campaign that aligns beautifully with ${communityName}'s mission. ${communityDescription.split('.')[0]}, and we believe there's a natural synergy between what you're building and what we stand for.

We'd love to explore a partnership around ${engagementType.toLowerCase()} that would bring real value to your community. Here's what we're thinking:

💰 Budget: £${budget.toLocaleString()}
🎁 Additional offerings: ${nonMonetaryOfferings.join(', ')}

${collaborationDescription}

We're genuinely excited about the possibility of working together and would love to set up a call to discuss how we can make this collaboration meaningful for ${communityName} and your community members.

Would you be open to a quick chat next week?

Looking forward to hearing from you!

Best,
${brandName || 'The Brand Team'}`;
}

