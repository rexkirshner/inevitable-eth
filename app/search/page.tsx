import { getAllContent } from '@/lib/content';
import SearchClient from './search-client';

export default function SearchPage() {
  // Get all articles server-side (without content for smaller payload)
  const allArticles = getAllContent().map(article => ({
    category: article.category,
    slug: article.slug,
    frontmatter: article.frontmatter,
  }));

  return <SearchClient articles={allArticles} />;
}
