import { NextRequest, NextResponse } from 'next/server';

// In-memory cache to reduce API calls during demo
const cache = new Map<string, { data: MoodboardImage[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface MoodboardImage {
  id: string;
  url: string;
  urlLarge: string;
  alt: string;
  tags: string[];
  photographer: string;
  photographerUrl?: string;
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

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

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keywordsParam = searchParams.get('keywords');
    const seed = searchParams.get('seed') || '0';

    if (!keywordsParam) {
      return NextResponse.json(
        { error: 'Missing keywords parameter' },
        { status: 400 }
      );
    }

    const keywords = keywordsParam.split(',').map((k) => k.trim());

    // Check cache
    const cacheKey = `${keywordsParam}-${seed}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Check for API key
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) {
      console.warn('No UNSPLASH_ACCESS_KEY found, returning mock data');
      const mockImages = getMockImages(keywords);
      cache.set(cacheKey, { data: mockImages, timestamp: Date.now() });
      return NextResponse.json(mockImages);
    }

    // Fetch from Unsplash
    const images = await fetchUnsplashImages(keywords, apiKey, seed);
    cache.set(cacheKey, { data: images, timestamp: Date.now() });

    return NextResponse.json(images);
  } catch (error: unknown) {
    console.error('Error fetching moodboard:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch moodboard', details: errorMessage },
      { status: 500 }
    );
  }
}

async function fetchUnsplashImages(
  keywords: string[],
  apiKey: string,
  seed: string
): Promise<MoodboardImage[]> {
  const images: MoodboardImage[] = [];
  const seenIds = new Set<string>();

  // Search for each keyword and collect diverse results
  for (const keyword of keywords.slice(0, 3)) {
    try {
      const page = parseInt(seed) % 3 + 1; // Use seed to vary pages
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          keyword
        )}&per_page=3&page=${page}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Unsplash API error for keyword "${keyword}":`, response.statusText);
        continue;
      }

      const data = await response.json();

      for (const photo of data.results) {
        if (seenIds.has(photo.id)) continue;
        seenIds.add(photo.id);

        images.push({
          id: photo.id,
          url: photo.urls.regular,
          urlLarge: photo.urls.full,
          alt: photo.alt_description || photo.description || keyword,
          tags: photo.tags?.map((t: { title: string }) => t.title).slice(0, 3) || [keyword],
          photographer: photo.user.name,
          photographerUrl: photo.user.links?.html,
        });

        if (images.length >= 8) break;
      }

      if (images.length >= 8) break;
    } catch (error) {
      console.error(`Error fetching images for keyword "${keyword}":`, error);
    }
  }

  // If we didn't get enough images, pad with a general "creative" search
  if (images.length < 6) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=creative+abstract&per_page=${
          8 - images.length
        }&page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        for (const photo of data.results) {
          if (seenIds.has(photo.id)) continue;
          seenIds.add(photo.id);

          images.push({
            id: photo.id,
            url: photo.urls.regular,
            urlLarge: photo.urls.full,
            alt: photo.alt_description || photo.description || 'creative imagery',
            tags: photo.tags?.map((t: { title: string }) => t.title).slice(0, 3) || ['creative'],
            photographer: photo.user.name,
            photographerUrl: photo.user.links?.html,
          });

          if (images.length >= 8) break;
        }
      }
    } catch (error) {
      console.error('Error fetching fallback images:', error);
    }
  }

  return images;
}

function getMockImages(keywords: string[]): MoodboardImage[] {
  // High-quality mock images from Unsplash (no API key required)
  const mockPool = [
    {
      id: 'mock-1',
      url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
      urlLarge: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
      alt: 'Urban street culture',
      tags: ['urban', 'street', 'culture'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-2',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      urlLarge: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920',
      alt: 'Music and audio equipment',
      tags: ['music', 'audio', 'creative'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-3',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      urlLarge: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
      alt: 'Mountain landscape adventure',
      tags: ['nature', 'outdoor', 'adventure'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-4',
      url: 'https://images.unsplash.com/photo-1551410224-699683e15636',
      urlLarge: 'https://images.unsplash.com/photo-1551410224-699683e15636?w=1920',
      alt: 'Chess strategy game',
      tags: ['chess', 'strategy', 'intellectual'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-5',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      urlLarge: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
      alt: 'Skateboarding urban sport',
      tags: ['skateboard', 'sport', 'urban'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-6',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      urlLarge: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920',
      alt: 'Creative portrait',
      tags: ['portrait', 'creative', 'people'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-7',
      url: 'https://images.unsplash.com/photo-1501696461415-6bd6660c6742',
      urlLarge: 'https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=1920',
      alt: 'Hiking and outdoor activity',
      tags: ['hiking', 'outdoor', 'nature'],
      photographer: 'Unsplash',
    },
    {
      id: 'mock-8',
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      urlLarge: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920',
      alt: 'Live music performance',
      tags: ['music', 'live', 'performance'],
      photographer: 'Unsplash',
    },
  ];

  // Return a shuffled subset based on seed
  const seed = keywords.join('').length;
  const shuffled = [...mockPool].sort(() => 0.5 - ((seed * 9301 + 49297) % 233280) / 233280);
  
  return shuffled.slice(0, 8);
}

