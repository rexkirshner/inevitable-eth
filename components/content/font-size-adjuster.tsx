'use client';

import { useEffect, useState } from 'react';
import { Type } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '0.9rem',
  medium: '1rem',
  large: '1.1rem',
};

const LOCAL_STORAGE_KEY = 'article-font-size';

export function FontSizeAdjuster() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as FontSize | null;
    if (saved && saved in FONT_SIZE_MAP) {
      setFontSize(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply font size to article content
    const articleElement = document.querySelector('article.prose');
    if (articleElement) {
      (articleElement as HTMLElement).style.fontSize = FONT_SIZE_MAP[fontSize];
    }

    // Save preference
    localStorage.setItem(LOCAL_STORAGE_KEY, fontSize);
  }, [fontSize, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Type className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden="true" />
      <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden">
        <button
          onClick={() => setFontSize('small')}
          className={`px-2 py-1 text-xs transition-colors ${
            fontSize === 'small'
              ? 'bg-[var(--link)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--background)]'
          }`}
          aria-label="Small font size"
          aria-pressed={fontSize === 'small'}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('medium')}
          className={`px-2 py-1 text-sm transition-colors ${
            fontSize === 'medium'
              ? 'bg-[var(--link)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--background)]'
          }`}
          aria-label="Medium font size"
          aria-pressed={fontSize === 'medium'}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('large')}
          className={`px-2 py-1 text-base transition-colors ${
            fontSize === 'large'
              ? 'bg-[var(--link)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--background)]'
          }`}
          aria-label="Large font size"
          aria-pressed={fontSize === 'large'}
        >
          A
        </button>
      </div>
    </div>
  );
}
