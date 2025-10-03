import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentMetadata } from '@/lib/content.schema';

interface ArticleNavigationProps {
  prev: ContentMetadata | null;
  next: ContentMetadata | null;
}

export function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      className="mt-12 pt-8 border-t border-[var(--border)]"
      aria-label="Article navigation"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Article */}
        {prev ? (
          <Link
            href={`/${prev.category}/${prev.slug}`}
            className="flex items-start gap-3 p-4 rounded border border-[var(--border)] hover:bg-[var(--surface)] transition-colors group"
          >
            <ChevronLeft
              className="w-5 h-5 mt-1 text-[var(--text-secondary)] group-hover:text-[var(--link)] transition-colors flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Previous
              </div>
              <div className="font-medium text-[var(--text)] group-hover:text-[var(--link)] transition-colors line-clamp-2">
                {prev.frontmatter.title}
              </div>
            </div>
          </Link>
        ) : (
          <div /> // Empty div to maintain grid layout
        )}

        {/* Next Article */}
        {next && (
          <Link
            href={`/${next.category}/${next.slug}`}
            className="flex items-start gap-3 p-4 rounded border border-[var(--border)] hover:bg-[var(--surface)] transition-colors group md:text-right"
          >
            <div className="flex-1 min-w-0 md:order-1">
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                Next
              </div>
              <div className="font-medium text-[var(--text)] group-hover:text-[var(--link)] transition-colors line-clamp-2">
                {next.frontmatter.title}
              </div>
            </div>
            <ChevronRight
              className="w-5 h-5 mt-1 text-[var(--text-secondary)] group-hover:text-[var(--link)] transition-colors flex-shrink-0 md:order-2"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
