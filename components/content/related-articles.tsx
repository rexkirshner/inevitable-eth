'use client';

import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import type { ContentMetadata } from '@/lib/content.schema';
import { ArticleReadIndicator } from './article-read-indicator';

interface RelatedArticlesProps {
  articles: ContentMetadata[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 pt-8 border-t border-[var(--border)]">
      <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={`${article.category}/${article.slug}`}
            href={`/${article.category}/${article.slug}`}
            className="group block p-4 rounded border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
          >
            <div className="flex items-start gap-2 mb-2">
              <BookOpen
                className="w-4 h-4 mt-1 text-[var(--text-secondary)] flex-shrink-0"
                aria-hidden="true"
              />
              <h3 className="font-medium text-[var(--text)] group-hover:text-[var(--link)] transition-colors line-clamp-2">
                {article.frontmatter.title}
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
              {article.frontmatter.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <ArticleReadIndicator category={article.category} slug={article.slug} />
              {article.frontmatter.difficulty && (
                <span className="px-2 py-1 bg-[var(--surface)] rounded">
                  {article.frontmatter.difficulty}
                </span>
              )}
              {article.frontmatter.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {article.frontmatter.readingTime} min
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
