'use client';

import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from './error-boundary';
import { env } from '@/lib/env';

// Trigger rebuild with Giscus environment variables

interface ArticleCommentsProps {
  /** Article title - available for future mapping strategies */
  articleTitle: string;
  /** Article slug - available for future mapping strategies */
  articleSlug: string;
  /** Content category - available for future mapping strategies */
  category: string;
}

/**
 * Giscus-powered comments component.
 * Props are passed for potential future mapping strategies (currently uses pathname).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Props reserved for future Giscus mapping strategies
export function ArticleComments({ articleTitle: _articleTitle, articleSlug: _articleSlug, category: _category }: ArticleCommentsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect theme from document
  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      setTheme(isDark ? 'dark' : 'light');
    };

    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => detectTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Check if Giscus is configured (using validated environment variables)
  const repo = env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const giscusCategory = env.NEXT_PUBLIC_GISCUS_CATEGORY || 'General';
  const categoryId = env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !categoryId) {
    return (
      <div className="my-8 p-6 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          Comments
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Comments are not yet configured for this site.
        </p>
        <details className="text-xs text-[var(--text-secondary)]">
          <summary className="cursor-pointer hover:text-[var(--link)]">
            Setup instructions
          </summary>
          <div className="mt-2 space-y-2">
            <p>To enable comments with Giscus:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Enable GitHub Discussions on your repository</li>
              <li>
                Install the Giscus app:{' '}
                <a
                  href="https://github.com/apps/giscus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--link)] hover:underline"
                >
                  github.com/apps/giscus
                </a>
              </li>
              <li>
                Visit{' '}
                <a
                  href="https://giscus.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--link)] hover:underline"
                >
                  giscus.app
                </a>
                {' '}to get your configuration
              </li>
              <li>Add these environment variables to .env.local:</li>
            </ol>
            <pre className="mt-2 p-2 bg-[var(--background)] rounded text-xs">
              {`NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxx
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx`}
            </pre>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h3
        className="text-2xl font-normal mb-4 pb-2 border-b border-[var(--border)]"
        style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}
      >
        Discussion
      </h3>
      <ErrorBoundary
        fallback={
          <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Comments are temporarily unavailable. Please try refreshing the page.
            </p>
          </div>
        }
      >
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={giscusCategory}
          categoryId={categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme === 'dark' ? 'dark' : 'light'}
          lang="en"
          loading="lazy"
        />
      </ErrorBoundary>
    </div>
  );
}
