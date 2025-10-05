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

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return defaultOpen;
    if (!storageKey) return defaultOpen;

    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === 'true' : defaultOpen;
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(isOpen));
    }
  }, [isOpen, storageKey]);

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
        ref={contentRef}
        id={id ? `collapsible-content-${id}` : undefined}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className="px-4 py-3 border-t border-[var(--border)] prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
