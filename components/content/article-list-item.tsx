'use client';

import Link from 'next/link';
import { ArticleReadIndicator } from './article-read-indicator';

interface ArticleListItemProps {
  category: string;
  slug: string;
  title: string;
  description?: string;
  readingTime?: number;
  updated?: string;
}

export function ArticleListItem({
  category,
  slug,
  title,
  description,
  readingTime,
  updated,
}: ArticleListItemProps) {
  return (
    <li className="border-b border-[var(--border)] pb-3">
      <Link
        href={`/${category}/${slug}`}
        className="text-lg text-[var(--link)] hover:underline font-semibold"
      >
        {title}
      </Link>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {description}
        </p>
      )}
      <div className="flex gap-4 text-xs text-[var(--text-secondary)] mt-2 items-center">
        <ArticleReadIndicator category={category} slug={slug} />
        {readingTime && <span>{readingTime} min read</span>}
        {updated && <span>Updated {updated}</span>}
      </div>
    </li>
  );
}
