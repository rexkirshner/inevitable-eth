import { getAllTags } from '@/lib/content';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse by Topic | Inevitable Ethereum',
  description: 'Explore all topics covered in Inevitable Ethereum. Browse articles by tag to discover content about Ethereum, cryptography, finance, and more.',
};

export default function TagsPage() {
  const tags = getAllTags();

  // Calculate tag cloud sizes (based on count)
  const maxCount = Math.max(...tags.map(t => t.count));
  const minCount = Math.min(...tags.map(t => t.count));
  const range = maxCount - minCount || 1;

  const getTagSize = (count: number) => {
    const normalized = (count - minCount) / range;
    const minSize = 0.875; // text-sm
    const maxSize = 1.5; // text-2xl
    return minSize + (normalized * (maxSize - minSize));
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="h-8 w-8 text-[var(--text-secondary)]" />
          <h1 className="text-4xl font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
            Browse by Topic
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] text-lg">
          Explore {tags.length} topics across {tags.reduce((sum, t) => sum + t.count, 0)} articles.
          Click any tag to see related content.
        </p>
      </div>

      {/* Tag Cloud */}
      <div className="mb-16 p-8 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
          Tag Cloud
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {tags.map((tagInfo) => {
            const size = getTagSize(tagInfo.count);
            return (
              <Link
                key={tagInfo.tag}
                href={`/tags/${encodeURIComponent(tagInfo.tag)}`}
                className="text-[var(--link)] hover:text-[var(--link)] hover:underline transition-colors"
                style={{ fontSize: `${size}rem` }}
                title={`${tagInfo.count} article${tagInfo.count !== 1 ? 's' : ''}`}
              >
                {tagInfo.tag}
              </Link>
            );
          })}
        </div>
      </div>

      {/* All Tags (List View) */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
          All Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tagInfo) => (
            <Link
              key={tagInfo.tag}
              href={`/tags/${encodeURIComponent(tagInfo.tag)}`}
              className="group p-4 bg-[var(--surface)] border border-[var(--border)] rounded hover:border-[var(--link)] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-[var(--text)] group-hover:text-[var(--link)] transition-colors">
                  {tagInfo.tag}
                </h3>
                <span className="text-sm text-[var(--text-secondary)] bg-[var(--background)] px-2 py-1 rounded">
                  {tagInfo.count}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {tagInfo.articles.slice(0, 3).map(a => a.frontmatter.title).join(', ')}
                {tagInfo.articles.length > 3 && '...'}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="mt-16 p-6 border-t border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-4">Most Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 10).map((tagInfo) => (
            <Link
              key={tagInfo.tag}
              href={`/tags/${encodeURIComponent(tagInfo.tag)}`}
              className="px-3 py-1.5 bg-[var(--link)] text-[var(--background)] rounded hover:brightness-110 transition-all text-sm"
            >
              {tagInfo.tag} ({tagInfo.count})
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
