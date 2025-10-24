import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import communitiesData from '@/lib/communities.json';

// Rate limiting: simple in-memory store (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per window
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

interface Collaboration {
  engagementType: string;
  budget: number;
  nonMonetaryOfferings: string[];
  description: string;
}

interface CommunityCollaboration {
  communityId: string;
  communityName?: string;
  collaborations: Collaboration[];
}

interface CulturalMetric {
  trend: string;
  metric: string;
  summary: string;
}

interface CampaignReport {
  culturalInsight: {
    description: string;
    metrics: CulturalMetric[];
  };
  campaignIdea: {
    title: string;
    description: string;
  };
  potentialCollaborations: CommunityCollaboration[];
  nextSteps: string[];
}

const SYSTEM_PROMPT = `You are a creative strategist at an AI PR agency helping brands design community-led campaigns. Given the brand info, write a concise strategy report with sections:

- Cultural Insight: Provide a 2-3 paragraph description of the relevant market trend as a cultural trend analyst, then generate 3-4 supporting metrics. Each metric should have:
  * trend: name of the micro-trend (e.g., "Urban Exploration", "Community-Led Experiences")
  * metric: the statistic (e.g., "+42% YoY", "1.3M mentions", "68% growth")
  * summary: 1-2 sentence explanation of what this means

- Campaign Idea: A few sentences on the campaign strategy. Inspire in the voice of a PR agency.

- Potential Collaborations: A list of 3 collaborations it can organize with communities from PLACE Connect's network/database with details on the engagement that best fits the campaign idea and strategy

- Next Steps: Action items, something that grounds this idea and makes it seem more feasible.

Make it punchy, poetic, and brand-world ready. Output JSON with keys: culturalInsight (object with description string and metrics array), campaignIdea (object with title and description), potentialCollaborations (array<CommunityCollaboration>), nextSteps (array).

The schema for each CommunityCollaboration is:
{
  "communityId": "string",  // Must match one of the available community IDs
  "collaborations": [
    {
      "engagementType": "string",       // e.g., Event, Workshop, Concert, Social Media Campaign
      "budget": number,                 // Amount in £
      "nonMonetaryOfferings": ["string"], // Free products, swag, venue, tickets
      "description": "string"           // Details of the engagement in line with the strategy
    }
  ]
}

Available communities you can reference:
${JSON.stringify(communitiesData.communities, null, 2)}

IMPORTANT: Choose 1-2 communities that best fit the brand and campaign strategy. Use their actual IDs from the list above.`;

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
    const { brandEssence, keywords, audience, optionalFileNames = [] } = body;

    if (!brandEssence || !keywords || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields: brandEssence, keywords, audience' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      // Return mock data if no API key (for development)
      console.warn('No GOOGLE_GEMINI_API_KEY found, returning mock data');
      return NextResponse.json(getMockReport(brandEssence, keywords, audience));
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Construct user prompt
    const userPrompt = `Brand Essence: ${brandEssence}

Keywords: ${keywords.join(', ')}

Target Audience: ${audience}

${optionalFileNames.length > 0 ? `Uploaded Files: ${optionalFileNames.join(', ')}` : ''}

Generate a creative campaign strategy report for this brand.`;

    // Call Gemini API
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: userPrompt },
    ]);

    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let report: CampaignReport;
    try {
      report = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', parseError);
      // Fallback: try to extract sections
      report = extractReportFromText(text);
    }

    // Enrich with community names
    report.potentialCollaborations = report.potentialCollaborations.map((collab) => {
      const community = communitiesData.communities.find((c) => c.id === collab.communityId);
      return {
        ...collab,
        communityName: community?.name || collab.communityId,
      };
    });

    return NextResponse.json(report);
  } catch (error: unknown) {
    console.error('Error generating report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate report', details: errorMessage },
      { status: 500 }
    );
  }
}

// Fallback parser for non-JSON responses
function extractReportFromText(text: string): CampaignReport {
  // Simple extraction logic - in production, you'd want more robust parsing
  return {
    culturalInsight: {
      description: extractSection(text, 'Cultural Insight'),
      metrics: [
        {
          trend: 'Urban Exploration',
          metric: '+42% YoY',
          summary: 'Growing interest in city-based adventure content blending style and fitness.',
        },
        {
          trend: 'Community-Led Experiences',
          metric: '+68%',
          summary: 'Consumers prefer authentic events organized by peers over traditional PR activations.',
        },
      ],
    },
    campaignIdea: {
      title: 'Custom Campaign',
      description: extractSection(text, 'Campaign Idea'),
    },
    potentialCollaborations: [
      {
        communityId: 'five-points-project',
        communityName: 'Five Points Project',
        collaborations: [
          {
            engagementType: 'Event',
            budget: 2000,
            nonMonetaryOfferings: ['Products', 'Swag'],
            description: extractSection(text, 'Potential Collaborations'),
          },
        ],
      },
    ],
    nextSteps: extractSection(text, 'Next Steps')
      .split('\n')
      .filter((s) => s.trim().length > 0),
  };
}

function extractSection(text: string, heading: string): string {
  const regex = new RegExp(`${heading}:?\\s*([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : 'Content not available';
}

// Mock data for development without API key
function getMockReport(
  brandEssence: string,
  keywords: string[],
  audience: string
): CampaignReport {
  const isOutdoor = keywords.some((k) => k.includes('outdoor') || k.includes('sport'));
  const isIntellectual = keywords.some((k) => k.includes('chess') || k.includes('intellectual'));

  if (isIntellectual) {
    return {
      culturalInsight: {
        description:
          'Cities are seeing a revival of analog communal activities, with chess clubs experiencing remarkable growth. This trend reflects a desire for intentional, screen-free social connection among urban millennials and Gen Z. Chess nights in cafes and bars have become cultural touchstones, merging intellectual pursuit with social atmosphere. The movement represents a broader shift toward mindful leisure and authentic face-to-face interaction in an increasingly digital world.',
        metrics: [
          {
            trend: 'Analog Social Revival',
            metric: '+67% growth',
            summary:
              'Chess club attendance has surged over the past two years as young professionals seek screen-free social experiences.',
          },
          {
            trend: 'Intellectual Leisure',
            metric: '2.4M TikTok views',
            summary:
              'Chess content on social media has exploded, with #ChessClub trending among Gen Z creators.',
          },
          {
            trend: 'Cafe Culture 2.0',
            metric: '+34% venues',
            summary:
              'Urban cafes and bars hosting chess nights have increased significantly, creating new third spaces.',
          },
          {
            trend: 'Mindful Competition',
            metric: '78% preference',
            summary:
              'Young consumers prefer strategic games over passive entertainment for social gatherings.',
          },
        ],
      },
      campaignIdea: {
        title: 'Checkmate & Chucks',
        description:
          "Host chess nights in sneaker shops that blend chess culture with experimental beats. Each event features limited-edition boards, guest DJs, and your brand's latest drops. Create a tournament series that moves through different London boroughs, building a community of strategic thinkers and style enthusiasts.",
      },
      potentialCollaborations: [
        {
          communityId: 'chess-and-culture-club',
          communityName: 'Chess & Culture Club',
          collaborations: [
            {
              engagementType: 'Chess Tournament Night',
              budget: 1500,
              nonMonetaryOfferings: [
                'Limited edition sneakers for winners',
                'Branded chess sets',
                'Exclusive early access to new products',
              ],
              description:
                'Monthly chess tournament nights in your flagship stores, creating a recurring cultural moment that positions your brand at the intersection of intellectual and street culture.',
            },
            {
              engagementType: 'Workshop Series',
              budget: 800,
              nonMonetaryOfferings: ['Product samples', 'Swag bags', 'Photography'],
              description:
                'Chess strategy workshops taught by club members, followed by styling sessions showing how to blend intellectual and streetwear aesthetics.',
            },
          ],
        },
        {
          communityId: 'five-points-project',
          communityName: 'Five Points Project',
          collaborations: [
            {
              engagementType: 'Cultural Event',
              budget: 2000,
              nonMonetaryOfferings: ['Venue sponsorship', 'Branded merchandise', 'Social media coverage'],
              description:
                "Sponsor a 'Checkmate Sessions' night featuring live music and simultaneous chess games, merging the chess club's intellectual vibe with Five Points' music community.",
            },
          ],
        },
      ],
      nextSteps: [
        'Pitch 5 London venues (chess-friendly cafes and sneaker boutiques) for monthly Tuesday nights',
        'Allocate £4k sponsorship budget for Q1 pilot in East London',
        'Commission custom chess set design featuring your brand aesthetic',
        'Create Instagram content series: "Moves & Moods" profiling chess club members',
        'Partner with Chess & Culture Club for 6-month exclusive collaboration',
      ],
    };
  }

  if (isOutdoor) {
    return {
      culturalInsight: {
        description:
          'The "urban hiking" movement has exploded as young city dwellers seek nature experiences without leaving metropolitan areas. This trend merges wellness, photography, and community building into a cohesive lifestyle movement. Unlike traditional outdoor recreation, urban hiking emphasizes accessibility, spontaneity, and social documentation. The movement represents a fundamental shift in how urbanites interact with their environment, transforming overlooked green spaces into destinations.',
        metrics: [
          {
            trend: 'Metropolitan Nature Seekers',
            metric: '54% of millennials',
            summary:
              'Over half of young Londoners actively seek nature experiences within city limits weekly.',
          },
          {
            trend: 'Social Outdoor Content',
            metric: '+200% YoY',
            summary:
              'Instagram hashtag #UrbanHiking has doubled year-over-year, driven by creator content.',
          },
          {
            trend: 'Accessible Adventure',
            metric: '3.2M searches',
            summary:
              'Monthly searches for "hiking near me" and "urban trails" have tripled since 2022.',
          },
          {
            trend: 'Community Wellness',
            metric: '+89% group hikes',
            summary:
              'Organized group hiking events in cities have nearly doubled as people seek social fitness.',
          },
        ],
      },
      campaignIdea: {
        title: 'Summit & Streets',
        description:
          'Launch guided urban hiking experiences that end at popup installations featuring your products. Each hike culminates in a creative workshop (photography, journaling, or outdoor cooking) led by community members. Document the journeys through a collaborative zine made by participants.',
      },
      potentialCollaborations: [
        {
          communityId: 'urban-hikers-collective',
          communityName: 'Urban Hikers Collective',
          collaborations: [
            {
              engagementType: 'Guided Hiking Series',
              budget: 2500,
              nonMonetaryOfferings: [
                'Hiking gear for guides',
                'Product testing opportunities',
                'Brand ambassador program',
              ],
              description:
                'Monthly "Summit & Streets" guided hikes through hidden London trails, ending at brand popup installations. Each participant receives a limited-edition tote and trail guide.',
            },
            {
              engagementType: 'Photography Workshop',
              budget: 1200,
              nonMonetaryOfferings: ['Camera equipment sponsorship', 'Prints for participants', 'Swag'],
              description:
                'Post-hike photography workshops teaching urban landscape techniques, with winners featured in your seasonal campaign.',
            },
          ],
        },
        {
          communityId: 'five-points-project',
          communityName: 'Five Points Project',
          collaborations: [
            {
              engagementType: 'Outdoor Concert',
              budget: 3000,
              nonMonetaryOfferings: ['Venue setup', 'Branded stage', 'Social promotion'],
              description:
                'Co-host "Peaks & Beats" - a sunset outdoor concert at the end of a group hike, blending nature, music, and community.',
            },
          ],
        },
      ],
      nextSteps: [
        'Partner with Urban Hikers Collective for 8-week pilot series starting March',
        'Allocate £7k budget for first quarter activation',
        'Design collaborative zine format with contributions from participants',
        'Create TikTok series: "Hidden Peaks" featuring surprise locations',
        'Develop sustainable merchandise line exclusive to hike participants',
      ],
    };
  }

  // Default generic response
  return {
    culturalInsight: {
      description: `${audience} represents a growing demographic seeking authentic brand experiences that align with their values. The cultural landscape is shifting toward intimate, experience-driven connections rather than traditional advertising. This audience values peer-organized events, grassroots storytelling, and brands that demonstrate genuine community engagement. They're moving away from influencer marketing toward real stories from real people in their communities.`,
      metrics: [
        {
          trend: 'Authenticity Premium',
          metric: '73% preference',
          summary:
            'Consumers now prefer brands that demonstrate genuine community engagement over traditional advertising.',
        },
        {
          trend: 'Experience Economy',
          metric: '+45% spending',
          summary:
            'Young consumers allocate more budget to experiences and events than material goods.',
        },
        {
          trend: 'Peer-Led Activation',
          metric: '2.8x engagement',
          summary:
            'Community-organized events drive nearly 3x higher engagement than brand-led activations.',
        },
        {
          trend: 'Grassroots Content',
          metric: '1.3M shares',
          summary:
            'User-generated content from micro-communities outperforms professional branded content.',
        },
      ],
    },
    campaignIdea: {
      title: 'Cultural Connections',
      description:
        'Design a series of intimate community events that showcase your brand values through authentic collaboration. Partner with grassroots organizations to create memorable experiences that resonate with your target audience.',
    },
    potentialCollaborations: [
      {
        communityId: 'five-points-project',
        communityName: 'Five Points Project',
        collaborations: [
          {
            engagementType: 'Live Music Event',
            budget: 2000,
            nonMonetaryOfferings: ['Exclusive tickets', 'Discounted merch', 'Unique art pieces'],
            description:
              'Host a branded live music night featuring up-and-coming artists to promote your brand during a strategic cultural moment.',
          },
          {
            engagementType: 'Workshop',
            budget: 500,
            nonMonetaryOfferings: ['Free products', 'Swag packs'],
            description:
              'Organize a creative workshop with community members to engage attendees with your products and encourage social sharing.',
          },
        ],
      },
    ],
    nextSteps: [
      'Identify 3-5 key venues aligned with your brand aesthetic',
      `Allocate £3k sponsorship budget for pilot events`,
      'Develop social media content strategy highlighting community partnerships',
      'Create exclusive product line for event participants',
    ],
  };
}

