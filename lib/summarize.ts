/**
 * Client-side brand summarization logic
 * Creates a poetic brand essence and extracts keywords from user inputs
 */

interface BrandAnswers {
  mission: string;
  tone: string;
  communities: string;
  inspiration: string;
  budget: string;
  fileNames: string[];
}

interface BrandSummary {
  brandName: string | null;
  brandEssence: string;
  keywords: string[];
  audience: string;
  tone: string[];
  communities: string[];
  fileKeywords: string[];
}

/**
 * Extract adjectives from tone input
 */
function extractAdjectives(tone: string): string[] {
  if (!tone) return ['authentic', 'bold'];
  
  const words = tone
    .toLowerCase()
    .split(/[,;]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
  
  return words.slice(0, 3);
}

/**
 * Extract a verb from mission statement
 */
function extractVerb(mission: string): string {
  const lowerMission = mission.toLowerCase();
  
  // Common action verbs in mission statements
  const verbs = [
    'connect', 'create', 'inspire', 'empower', 'build', 
    'transform', 'celebrate', 'unite', 'elevate', 'champion'
  ];
  
  for (const verb of verbs) {
    if (lowerMission.includes(verb)) {
      return verb;
    }
  }
  
  return 'connect'; // default
}

/**
 * Synthesize a poetic brand essence from mission and tone
 * TODO: Eventually use a more sophisticated model to synthesize the brand essence, e.g. use 
 * a model like OpenAI's GPT-4o to synthesize the brand essence.
 */
export function synthesizeBrandSummary(
  answers: BrandAnswers,
  fileKeywords: string[]
): BrandSummary {
  const { mission, tone, communities, inspiration, budget } = answers;
  
  // Extract components
  const adjectives = extractAdjectives(tone);
  const verb = extractVerb(mission);
  
  // Determine if outdoor/sport brand
  const isOutdoor = 
    mission.toLowerCase().includes('sport') ||
    mission.toLowerCase().includes('outdoor') ||
    mission.toLowerCase().includes('active') ||
    fileKeywords.some(k => k.toLowerCase().includes('outdoor') || k.toLowerCase().includes('sport'));
  
  // Create brand essence
  let brandEssence = '';
  
  if (isOutdoor && adjectives.length >= 2) {
    brandEssence = `You are an ${adjectives[0]}, ${adjectives[1]} brand that aims to ${verb} communities through outdoor experiences and active culture.`;
  } else if (mission && adjectives.length >= 2) {
    brandEssence = `You are a ${adjectives[0]}, ${adjectives[1]} brand that seeks to ${verb} with your audience. ${mission.split('.')[0]}.`;
  } else if (mission) {
    brandEssence = `${mission.split('.')[0]}. You ${verb} through ${adjectives[0] || 'authentic'} storytelling and cultural resonance.`;
  } else {
    brandEssence = `You are a brand that values ${adjectives[0] || 'authenticity'} and speaks with ${adjectives[1] || 'boldness'}.`;
  }
  
  // Extract keywords for image queries (3-5 keywords)
  const keywordSet = new Set<string>();
  
  // Add tone keywords
  adjectives.forEach(adj => keywordSet.add(adj));
  
  // Add community keywords
  if (communities) {
    communities
      .split(/[,;]+/)
      .map(c => c.trim().toLowerCase())
      .filter(c => c.length > 0)
      .slice(0, 2)
      .forEach(c => keywordSet.add(c));
  }
  
  // Add file keywords
  fileKeywords.slice(0, 2).forEach(k => keywordSet.add(k));
  
  // Add inspiration keywords
  if (inspiration) {
    const inspirationWords = inspiration
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4 && !['event', 'campaign'].includes(w))
      .slice(0, 1);
    inspirationWords.forEach(w => keywordSet.add(w));
  }
  
  const keywords = Array.from(keywordSet).slice(0, 5);
  
  // Split communities into array
  const communitiesList = communities
    ? communities.split(/[,;]+/).map(c => c.trim()).filter(c => c.length > 0)
    : [];
  
  // Split tone into array
  const toneList = adjectives;
  
  return {
    brandName: null, // Could be extracted from mission in future
    brandEssence,
    keywords,
    audience: communities || 'Culturally engaged communities',
    tone: toneList,
    communities: communitiesList,
    fileKeywords,
  };
}

