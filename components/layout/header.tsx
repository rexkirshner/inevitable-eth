'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { MobileMenu } from './mobile-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] shadow-sm">
      {/* Top bar - Wikipedia style */}
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text)] hover:no-underline"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <polygon points="16.01,1.5 7.62,16.23 16.01,21.5 24.38,16.18" />
              <line x1="16.01" x2="16.01" y1="30.5" y2="24.1" />
              <polygon points="16.01,30.5 7.62,18.83 16.01,24.1 24.38,18.78" />
              <polygon points="16.01,12.3 7.62,16.23 16.01,21.5 24.38,16.18" />
              <line x1="16.01" x2="16.01" y1="1.5" y2="21.5" />
            </svg>
            <span className="text-xl font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
              Inevitable Ethereum
            </span>
          </Link>

          {/* Search and utilities */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm text-[var(--text)] hover:text-[var(--link)] transition-colors p-2"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[var(--text)] p-2 hover:text-[var(--link)] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar - full width background */}
      <nav className="hidden md:block w-full border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1440px] px-4">
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
                href="/tags"
                className="text-[var(--text)] hover:text-[var(--link)] transition-colors"
              >
                Topics
              </Link>
            </li>
            <li>
              <Link
                href="/random"
                className="text-[var(--text)] hover:text-[var(--link)] transition-colors"
              >
                Random Article
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
    </>
  );
}
