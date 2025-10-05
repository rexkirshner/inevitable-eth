'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
  rememberState?: boolean;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  id,
  rememberState = true,
}: CollapsibleProps) {
  const storageKey = id && rememberState ? `collapsible-${id}` : null;

  // SSR-safe: Check typeof window to prevent hydration issues
  // This ensures localStorage is only accessed on the client
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return defaultOpen;
    if (!storageKey) return defaultOpen;

    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === 'true' : defaultOpen;
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  // Calculate dynamic height when content changes or opens
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

  // Save state to localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(isOpen));
    }
  }, [isOpen, storageKey]);

  // Focus management: move focus to first interactive element when opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const firstFocusable = contentRef.current.querySelector<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="my-6 border border-[var(--border)] rounded-md overflow-hidden bg-[var(--surface)]">
      <button
        onClick={toggle}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between gap-3",
          "text-left font-semibold text-[var(--text)]",
          "hover:bg-[var(--background)] transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus:ring-inset"
        )}
        aria-expanded={isOpen}
        aria-controls={id ? `collapsible-content-${id}` : undefined}
      >
        <span className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          )}
          {title}
        </span>
        <span className="text-xs text-[var(--text-secondary)] font-normal">
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </button>

      <div
        id={id ? `collapsible-content-${id}` : undefined}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out"
        )}
        style={{
          maxHeight: isOpen ? `${height}px` : '0',
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="px-4 py-3 border-t border-[var(--border)] prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
