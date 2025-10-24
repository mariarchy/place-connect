import { NextRequest, NextResponse } from 'next/server';

export interface MoodboardImage {
  id: string;
  url: string;
  alt: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords') || 'creative,culture';
  const seed = searchParams.get('seed') || '0';

  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  // If no Unsplash key, return placeholder images
  if (!UNSPLASH_ACCESS_KEY) {
    const placeholderImages: MoodboardImage[] = Array.from({ length: 8 }, (_, i) => ({
      id: `placeholder-${i}`,
      url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=600&h=800&fit=crop`,
      alt: `Placeholder ${i + 1}`,
    }));
    return NextResponse.json(placeholderImages);
  }

  try {
    const keywordsArray = keywords.split(',').map((k) => k.trim());
    const query = keywordsArray.join(' ');

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Unsplash API request failed');
    }

    const data = await response.json();
    const images: MoodboardImage[] = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      alt: photo.alt_description || photo.description || 'Campaign visual',
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching moodboard:', error);
    
    // Fallback to placeholder images
    const placeholderImages: MoodboardImage[] = Array.from({ length: 8 }, (_, i) => ({
      id: `fallback-${i}`,
      url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=600&h=800&fit=crop`,
      alt: `Fallback ${i + 1}`,
    }));
    
    return NextResponse.json(placeholderImages);
  }
}
