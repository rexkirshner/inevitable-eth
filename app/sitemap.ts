import { MetadataRoute } from 'next';
import { getAllContent, getAllCategories, getAllTags } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://inevitableeth.com';

  // Dynamic pages - content changes when articles are added/updated
  // lastModified = build time, which reflects when content was last generated
  const dynamicPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Static utility pages - rarely change, omit lastModified
  const staticPages = [
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/visualize`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/request`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Category pages
  const categories = getAllCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Article pages
  const allArticles = getAllContent();
  const articlePages = allArticles.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.slug}`,
    lastModified: article.frontmatter.updated
      ? new Date(article.frontmatter.updated)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Tag pages
  const allTags = getAllTags();
  const tagPages = allTags.map((tagInfo) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tagInfo.tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...dynamicPages, ...staticPages, ...categoryPages, ...articlePages, ...tagPages];
}
