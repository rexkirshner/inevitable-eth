'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--background)] z-50 shadow-xl md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-lg font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text)] hover:text-[var(--link)] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/background"
                className="block px-4 py-3 text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--link)] rounded transition-colors"
              >
                Background
              </Link>
            </li>
            <li>
              <Link
                href="/concepts"
                className="block px-4 py-3 text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--link)] rounded transition-colors"
              >
                Concepts
              </Link>
            </li>
            <li>
              <Link
                href="/ethereum"
                className="block px-4 py-3 text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--link)] rounded transition-colors"
              >
                Ethereum
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--link)] rounded transition-colors"
              >
                About
              </Link>
            </li>
            <li className="pt-4 border-t border-[var(--border)]">
              <Link
                href="/random"
                className="block px-4 py-3 text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--link)] rounded transition-colors"
              >
                Random Article
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
