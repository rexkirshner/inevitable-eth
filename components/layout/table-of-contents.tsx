'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the article
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3, h4');
    const items: TocItem[] = Array.from(headings).map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));

    setToc(items);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1,
      }
    );

    headings.forEach(heading => observer.observe(heading));

    return () => {
      headings.forEach(heading => observer.unobserve(heading));
    };
  }, []);

  if (toc.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <aside className={cn('w-64 overflow-y-auto', className)}>
      <nav className="sticky top-20 p-4" aria-label="Table of contents">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-3 pb-2 border-b border-[var(--border)]">
          Contents
        </h2>
        <ul className="space-y-1 text-sm">
          {toc.map(item => {
            const isActive = activeId === item.id;
            const indent = (item.level - 2) * 12; // 12px per level

            return (
              <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
                <a
                  href={`#${item.id}`}
                  onClick={e => handleClick(e, item.id)}
                  className={cn(
                    'block py-1 transition-colors leading-snug',
                    isActive
                      ? 'text-[var(--link)] font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--link)]'
                  )}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Wikipedia-style back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-6 text-sm text-[var(--text-secondary)] hover:text-[var(--link)] transition-colors"
        >
          ↑ Back to top
        </button>
      </nav>
    </aside>
  );
}
