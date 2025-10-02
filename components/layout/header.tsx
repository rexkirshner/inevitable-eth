import Link from 'next/link';
import { Search, Menu, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4">
        {/* Top bar - Wikipedia style */}
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text)] hover:no-underline"
          >
            <BookOpen className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
              Inevitable Ethereum
            </span>
          </Link>

          {/* Search and utilities */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm text-[var(--text)] hover:text-[var(--link)] transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            <button
              className="md:hidden text-[var(--text)]"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="hidden md:flex border-t border-[var(--border)] bg-[var(--surface)] -mx-4 px-4">
          <ul className="flex items-center gap-6 h-10 text-sm">
            <li>
              <Link
                href="/background"
                className="text-[var(--text)] hover:text-[var(--link)] transition-colors"
              >
                Background
              </Link>
            </li>
            <li>
              <Link
                href="/concepts"
                className="text-[var(--text)] hover:text-[var(--link)] transition-colors"
              >
                Concepts
              </Link>
            </li>
            <li>
              <Link
                href="/ethereum"
                className="text-[var(--text)] hover:text-[var(--link)] transition-colors"
              >
                Ethereum
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
