'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ArrowLeft, Info } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  const oldSiteUrl = `https://old.inevitableeth.com${pathname}`;

  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-serif font-normal text-[var(--text)] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-normal text-[var(--text)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      {/* Callout box for site rewrite */}
      <div className="mb-8 mx-auto max-w-[600px] p-4 border-2 border-[var(--link)] bg-[var(--surface)] rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[var(--link)] flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <h3 className="font-semibold text-[var(--text)] mb-2">Site Recently Rebuilt</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              This website has been completely rewritten. If you followed a link from the old version,
              the URL structure may have changed.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try checking the same link at{' '}
              <a
                href={oldSiteUrl}
                className="text-[var(--link)] hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                old.inevitableeth.com{pathname}
              </a>
              {' '}or use the search below to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--link)] transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>

        <Link
          href="/search"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--link)] transition-colors"
        >
          <Search className="h-4 w-4" />
          Search Articles
        </Link>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded hover:border-[var(--link)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-8">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">
          Popular Articles
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 text-left">
          <Link
            href="/ethereum/world-computer"
            className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
          >
            <h4 className="font-semibold text-[var(--link)] hover:underline mb-1">
              The World Computer
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Introduction to Ethereum
            </p>
          </Link>

          <Link
            href="/ethereum/pos"
            className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
          >
            <h4 className="font-semibold text-[var(--link)] hover:underline mb-1">
              Proof of Stake
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Ethereum&apos;s consensus mechanism
            </p>
          </Link>

          <Link
            href="/concepts/hash"
            className="p-4 border border-[var(--border)] bg-[var(--surface)] rounded hover:border-[var(--link)] transition-colors"
          >
            <h4 className="font-semibold text-[var(--link)] hover:underline mb-1">
              Hash Functions
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Cryptographic fundamentals
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
