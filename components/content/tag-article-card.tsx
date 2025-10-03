'use client';

import Link from 'next/link';
import { ArticleReadIndicator } from './article-read-indicator';

interface TagArticleCardProps {
  category: string;
  slug: string;
  title: string;
  description: string;
  difficulty?: string;
  readingTime?: number;
  updated: string;
}

export function TagArticleCard({
  category,
  slug,
  title,
  description,
  difficulty,
  readingTime,
  updated,
}: TagArticleCardProps) {
  return (
    <article className="border-b border-[var(--border)] pb-6">
      <Link href={`/${category}/${slug}`}>
        <h2
          className="text-2xl font-normal text-[var(--text)] hover:text-[var(--link)] transition-colors mb-2"
          style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}
        >
          {title}
        </h2>
      </Link>

      <p className="text-[var(--text-secondary)] mb-3">{description}</p>

      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
        <ArticleReadIndicator category={category} slug={slug} />
        <span className="capitalize">{category}</span>
        {difficulty && (
          <>
            <span>•</span>
            <span className="capitalize">{difficulty}</span>
          </>
        )}
        {readingTime && (
          <>
            <span>•</span>
            <span>{readingTime} min read</span>
          </>
        )}
        <span>•</span>
        <span>Updated {updated}</span>
      </div>
    </article>
  );
}
