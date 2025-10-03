import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FrontmatterSchema, type Frontmatter, type ContentMetadata } from './content.schema';

const contentDirectory = path.join(process.cwd(), 'content');

export function getContentDirectory(category?: string): string {
  if (category) {
    return path.join(contentDirectory, category);
  }
  return contentDirectory;
}

export function getAllCategories(): string[] {
  const categories = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return categories;
}

export function getAllSlugsInCategory(category: string): string[] {
  const categoryPath = getContentDirectory(category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath)
    .filter(file => file.endsWith('.mdx'));

  return files.map(file => file.replace(/\.mdx$/, ''));
}

export function getContentBySlug(category: string, slug: string): {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
} {
  const fullPath = path.join(getContentDirectory(category), `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Validate frontmatter with Zod
  const frontmatter = FrontmatterSchema.parse(data);

  return {
    frontmatter,
    content,
    slug,
  };
}

const contentCache = new Map<string, ContentMetadata[]>();

export function getAllContent(category?: string): ContentMetadata[] {
  const cacheKey = category || 'all';

  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  const categories = category ? [category] : getAllCategories();
  const allContent: ContentMetadata[] = [];

  for (const cat of categories) {
    const slugs = getAllSlugsInCategory(cat);

    for (const slug of slugs) {
      try {
        const { frontmatter } = getContentBySlug(cat, slug);
        allContent.push({
          slug,
          category: cat,
          frontmatter,
        });
      } catch (error) {
        console.error(`Error loading ${cat}/${slug}:`, error);
      }
    }
  }

  contentCache.set(cacheKey, allContent);
  return allContent;
}

export function getRelatedContent(category: string, slug: string, limit: number = 3): ContentMetadata[] {
  const { frontmatter } = getContentBySlug(category, slug);
  const relatedSlugs = frontmatter.related || [];
  const relatedContent: ContentMetadata[] = [];

  // First, try to get explicitly related content
  for (const relatedSlug of relatedSlugs) {
    if (relatedContent.length >= limit) break;

    try {
      const parts = relatedSlug.split('/');
      const relatedCategory = parts.length > 1 ? parts[0] : category;
      const relatedSlugName = parts.length > 1 ? parts[1] : parts[0];

      const content = getContentBySlug(relatedCategory, relatedSlugName);
      relatedContent.push({
        slug: relatedSlugName,
        category: relatedCategory,
        frontmatter: content.frontmatter,
      });
    } catch (error) {
      console.error(`Error loading related content ${relatedSlug}:`, error);
    }
  }

  // If we need more, find by matching tags
  if (relatedContent.length < limit && frontmatter.tags.length > 0) {
    const allContent = getAllContent(category);
    const currentTags = new Set(frontmatter.tags);

    const tagMatches = allContent
      .filter(content => content.slug !== slug)
      .map(content => ({
        content,
        matchCount: content.frontmatter.tags.filter(tag => currentTags.has(tag)).length,
      }))
      .filter(match => match.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(match => match.content);

    for (const match of tagMatches) {
      if (relatedContent.length >= limit) break;
      if (!relatedContent.find(c => c.slug === match.slug)) {
        relatedContent.push(match);
      }
    }
  }

  return relatedContent.slice(0, limit);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get article by slug (alias for getContentBySlug for clarity)
 */
export function getArticleBySlug(category: string, slug: string) {
  return getContentBySlug(category, slug);
}

/**
 * Get all articles across all categories or filtered by category
 */
export function getAllArticles(category?: string): ContentMetadata[] {
  return getAllContent(category);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): ContentMetadata[] {
  return getAllContent(category);
}

/**
 * Get related articles (alias for getRelatedContent)
 */
export function getRelatedArticles(category: string, slug: string, limit: number = 3): ContentMetadata[] {
  return getRelatedContent(category, slug, limit);
}

/**
 * Build a hierarchical content tree for navigation
 */
export interface CategoryTree {
  name: string;
  slug: string;
  count: number;
  articles: Array<{
    title: string;
    slug: string;
    difficulty: string;
  }>;
}

let contentTreeCache: CategoryTree[] | null = null;

export function buildContentTree(): CategoryTree[] {
  if (contentTreeCache) {
    return contentTreeCache;
  }

  const categories = getAllCategories();

  contentTreeCache = categories.map(category => {
    const articles = getAllContent(category);

    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      slug: category,
      count: articles.length,
      articles: articles
        .map(article => ({
          title: article.frontmatter.title,
          slug: article.slug,
          difficulty: article.frontmatter.difficulty,
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    };
  });

  return contentTreeCache;
}

/**
 * Generate breadcrumbs for an article
 */
export interface Breadcrumb {
  label: string;
  href: string;
}

export function generateBreadcrumbs(category: string, slug?: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      href: `/${category}`
    },
  ];

  if (slug) {
    try {
      const { frontmatter } = getContentBySlug(category, slug);
      breadcrumbs.push({
        label: frontmatter.title,
        href: `/${category}/${slug}`,
      });
    } catch {
      // If article doesn't exist, just use the slug
      breadcrumbs.push({
        label: slug,
        href: `/${category}/${slug}`,
      });
    }
  }

  return breadcrumbs;
}

/**
 * Get previous and next articles in a category
 */
export function getPrevNextArticles(category: string, currentSlug: string): {
  prev: ContentMetadata | null;
  next: ContentMetadata | null;
} {
  const articles = getAllContent(category);
  const currentIndex = articles.findIndex(a => a.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
  };
}

/**
 * Search articles by query string
 */
export function searchArticles(query: string, filters?: {
  category?: string;
  difficulty?: string;
  tags?: string[];
}): ContentMetadata[] {
  let articles = getAllContent(filters?.category);

  // Filter by difficulty
  if (filters?.difficulty) {
    articles = articles.filter(a => a.frontmatter.difficulty === filters.difficulty);
  }

  // Filter by tags
  if (filters?.tags && filters.tags.length > 0) {
    articles = articles.filter(a =>
      filters.tags!.some(tag => a.frontmatter.tags.includes(tag))
    );
  }

  // Simple text search (basic implementation, Fuse.js will provide better results)
  if (query) {
    const lowerQuery = query.toLowerCase();
    articles = articles.filter(a =>
      a.frontmatter.title.toLowerCase().includes(lowerQuery) ||
      a.frontmatter.description.toLowerCase().includes(lowerQuery) ||
      a.frontmatter.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  return articles;
}
