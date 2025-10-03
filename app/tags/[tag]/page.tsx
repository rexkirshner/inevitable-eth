import { notFound } from 'next/navigation';
import { getAllTags, getArticlesByTag, getRelatedTags } from '@/lib/content';
import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tagInfo) => ({
    tag: encodeURIComponent(tagInfo.tag),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = getArticlesByTag(decodedTag);

  if (articles.length === 0) {
    return {
      title: 'Tag Not Found | Inevitable Ethereum',
    };
  }

  return {
    title: `${decodedTag} Articles | Inevitable Ethereum`,
    description: `Explore ${articles.length} article${articles.length !== 1 ? 's' : ''} about ${decodedTag}. Learn about Ethereum, cryptography, finance, and more.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = getArticlesByTag(decodedTag);

  if (articles.length === 0) {
    notFound();
  }

  const relatedTags = getRelatedTags(decodedTag, 8);

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return {};
  }, {} as Record<string, typeof articles>);

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
          <Link href="/tags" className="hover:text-[var(--link)] hover:underline">
            All Topics
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span>{decodedTag}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Tag className="h-8 w-8 text-[var(--text-secondary)]" />
          <h1 className="text-4xl font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
            {decodedTag}
          </h1>
        </div>

        <p className="text-[var(--text-secondary)] text-lg">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with "{decodedTag}"
        </p>
      </div>

      {/* Articles List */}
      <div className="space-y-6 mb-12">
        {articles.map((article) => (
          <article key={`${article.category}-${article.slug}`} className="border-b border-[var(--border)] pb-6">
            <Link href={`/${article.category}/${article.slug}`}>
              <h2 className="text-2xl font-normal text-[var(--text)] hover:text-[var(--link)] transition-colors mb-2" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
                {article.frontmatter.title}
              </h2>
            </Link>

            <p className="text-[var(--text-secondary)] mb-3">
              {article.frontmatter.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="capitalize">{article.category}</span>
              {article.frontmatter.difficulty && (
                <>
                  <span>•</span>
                  <span className="capitalize">{article.frontmatter.difficulty}</span>
                </>
              )}
              {article.frontmatter.readingTime && (
                <>
                  <span>•</span>
                  <span>{article.frontmatter.readingTime} min read</span>
                </>
              )}
              <span>•</span>
              <span>Updated {article.frontmatter.updated}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <div className="mt-12 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((tagInfo) => (
              <Link
                key={tagInfo.tag}
                href={`/tags/${encodeURIComponent(tagInfo.tag)}`}
                className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded hover:border-[var(--link)] hover:text-[var(--link)] transition-colors text-sm"
              >
                {tagInfo.tag} ({tagInfo.count})
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
