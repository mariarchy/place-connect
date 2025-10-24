export interface Community {
  id: string;
  name: string;
  vibe: string;
  location: string;
  description: string;
  memberCount: number;
  logo: string;
  tags: string[];
}

export const communities: Community[] = [
  {
    id: '1',
    name: 'Brick Lane Chess Club',
    vibe: 'intellectual, cozy',
    location: 'East London',
    description: 'A community of chess enthusiasts who gather in intimate cafes to play, learn, and discuss strategy over coffee.',
    memberCount: 234,
    logo: '♟️',
    tags: ['intellectual', 'cozy', 'strategy', 'community', 'cafe']
  },
  {
    id: '2',
    name: 'Tempo Run Club',
    vibe: 'urban, fitness',
    location: 'Shoreditch',
    description: 'Urban runners who explore the city through music-synchronized group runs, combining fitness with cultural discovery.',
    memberCount: 456,
    logo: '🏃',
    tags: ['urban', 'fitness', 'music', 'running', 'city']
  },
  {
    id: '3',
    name: 'Late Checkout DJs',
    vibe: 'nightlife, art-forward',
    location: 'Dalston',
    description: 'Underground DJ collective focused on experimental electronic music and immersive audio-visual experiences.',
    memberCount: 189,
    logo: '🎧',
    tags: ['nightlife', 'art', 'electronic', 'experimental', 'music']
  },
  {
    id: '4',
    name: 'Green Thumb Collective',
    vibe: 'sustainable, mindful',
    location: 'Hackney',
    description: 'Urban gardeners and sustainability advocates who transform unused spaces into thriving community gardens.',
    memberCount: 312,
    logo: '🌱',
    tags: ['sustainable', 'mindful', 'gardening', 'community', 'environment']
  },
  {
    id: '5',
    name: 'Analog Photography Society',
    vibe: 'artistic, nostalgic',
    location: 'Camden',
    description: 'Film photography enthusiasts who organize photo walks, darkroom sessions, and gallery exhibitions.',
    memberCount: 167,
    logo: '📷',
    tags: ['artistic', 'nostalgic', 'photography', 'film', 'creative']
  },
  {
    id: '6',
    name: 'Midnight Book Club',
    vibe: 'intellectual, mysterious',
    location: 'Soho',
    description: 'Late-night literary discussions in hidden bars, focusing on contemporary fiction and philosophical texts.',
    memberCount: 98,
    logo: '📚',
    tags: ['intellectual', 'mysterious', 'books', 'literature', 'night']
  },
  {
    id: '7',
    name: 'Street Art Mappers',
    vibe: 'rebellious, creative',
    location: 'Brixton',
    description: 'Urban explorers who document and create street art, organizing walking tours and collaborative murals.',
    memberCount: 278,
    logo: '🎨',
    tags: ['rebellious', 'creative', 'street art', 'urban', 'community']
  },
  {
    id: '8',
    name: 'Silent Disco Yoga',
    vibe: 'mindful, experimental',
    location: 'King\'s Cross',
    description: 'Unique yoga sessions with wireless headphones, combining mindfulness with electronic beats in unusual venues.',
    memberCount: 145,
    logo: '🧘',
    tags: ['mindful', 'experimental', 'yoga', 'music', 'wellness']
  }
];

export function findMatchingCommunities(vibes: string, brandName: string): Community[] {
  const vibeKeywords = vibes.toLowerCase().split(/[,\s]+/).filter(word => word.length > 2);
  
  // Score communities based on vibe matching
  const scoredCommunities = communities.map(community => {
    let score = 0;
    
    // Check for direct vibe matches
    community.tags.forEach(tag => {
      if (vibeKeywords.some(keyword => tag.includes(keyword) || keyword.includes(tag))) {
        score += 2;
      }
    });
    
    // Check for vibe string matches
    if (vibeKeywords.some(keyword => community.vibe.includes(keyword))) {
      score += 1;
    }
    
    // Add some randomness for variety
    score += Math.random() * 0.5;
    
    return { community, score };
  });
  
  // Sort by score and return top 5
  return scoredCommunities
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.community);
}
