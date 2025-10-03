/**
 * Utility to extract OG images from content
 */

const DEFAULT_OG_IMAGE = '/images/inevitable-eth-banner.png';

/**
 * Extract the first image from markdown content
 */
export function extractFirstImage(content: string): string | null {
  // Match markdown image syntax: ![alt](image-path)
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Get OG image for article page
 * Priority: hero frontmatter > first image in content > default banner
 */
export function getArticleOgImage(heroImage: string | undefined, content: string): string {
  // Use hero image if specified in frontmatter
  if (heroImage) {
    return heroImage;
  }

  // Extract first image from content
  const firstImage = extractFirstImage(content);
  if (firstImage) {
    return firstImage;
  }

  // Fallback to default
  return DEFAULT_OG_IMAGE;
}

/**
 * Get default OG image for non-article pages
 */
export function getDefaultOgImage(): string {
  return DEFAULT_OG_IMAGE;
}
