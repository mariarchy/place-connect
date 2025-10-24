/**
 * Mock file parsing behavior
 * Maps filenames to brand keywords based on simple pattern matching
 */

export function mapFilenamesToKeywords(fileNames: string[]): string[] {
  const keywords: string[] = [];

  fileNames.forEach((fileName) => {
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes('salomon') || lowerName.includes('sneaker')) {
      keywords.push('outdoor / sport');
    } else if (lowerName.includes('chess')) {
      keywords.push('intellectual / quiet-night');
    }
  });

  return keywords;
}

