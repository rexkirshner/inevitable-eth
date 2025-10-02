'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-serif font-normal text-[var(--text)] mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl font-normal text-[var(--text)] mb-4">
          Something went wrong
        </h2>
        <p className="text-[var(--text-secondary)] mb-2">
          We encountered an unexpected error while loading this page.
        </p>
        {error.message && (
          <p className="text-sm text-[var(--text-secondary)] font-mono bg-[var(--surface)] border border-[var(--border)] p-3 rounded mt-4">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--link)] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--link)] transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-8 text-left">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">
          What can I do?
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)]">
          <li>• Try refreshing the page</li>
          <li>• Check your internet connection</li>
          <li>• Clear your browser cache</li>
          <li>• Return to the homepage and try again</li>
        </ul>
      </div>
    </div>
  );
}
