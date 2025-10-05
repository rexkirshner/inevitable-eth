/**
 * Utility to extract OG images from content
 */

const DEFAULT_OG_IMAGE = '/images/inevitable-eth-banner.png';
const DEFAULT_OG_IMAGE_WIDTH = 1259;
const DEFAULT_OG_IMAGE_HEIGHT = 512;

export interface OgImageInfo {
  url: string;
  width: number;
  height: number;
}

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
 * Get OG image for article page with dimensions
 * Priority: hero frontmatter > first image in content > default banner
 *
 * For article images, we use desktop size (1200px wide) for OG images
 * For default banner, we use actual dimensions (1259x512)
 */
export function getArticleOgImage(heroImage: string | undefined, content: string): OgImageInfo {
  // Use hero image if specified in frontmatter
  if (heroImage) {
    // For article images, assume desktop size (1200px wide, 16:9 aspect ratio)
    return {
      url: heroImage,
      width: 1200,
      height: 675,
    };
  }

  // Extract first image from content
  const firstImage = extractFirstImage(content);
  if (firstImage) {
    return {
      url: firstImage,
      width: 1200,
      height: 675,
    };
  }

  // Fallback to default
  return {
    url: DEFAULT_OG_IMAGE,
    width: DEFAULT_OG_IMAGE_WIDTH,
    height: DEFAULT_OG_IMAGE_HEIGHT,
  };
}

/**
 * Get default OG image for non-article pages with dimensions
 */
export function getDefaultOgImage(): OgImageInfo {
  return {
    url: DEFAULT_OG_IMAGE,
    width: DEFAULT_OG_IMAGE_WIDTH,
    height: DEFAULT_OG_IMAGE_HEIGHT,
  };
}
