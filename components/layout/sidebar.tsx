'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { CategoryTree, ArticleNode } from '@/lib/content';

interface SidebarProps {
  contentTree: CategoryTree[];
}

interface ArticleItemProps {
  article: ArticleNode;
  categorySlug: string;
  level?: number;
}

function ArticleItem({ article, categorySlug, level = 0 }: ArticleItemProps) {
  const pathname = usePathname();
  const hasChildren = article.children && article.children.length > 0;
  const articleHref = `/${categorySlug}/${article.slug}`;
  const isActive = pathname === articleHref;
  const [isExpanded, setIsExpanded] = useState(isActive && hasChildren);

  return (
    <li>
      <div className="flex items-start">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        <Link
          href={articleHref}
          className={`
            flex-1 px-3 py-1.5 text-sm rounded transition-colors
            ${hasChildren ? '' : 'ml-5'}
            ${isActive
              ? 'bg-[var(--surface)] text-[var(--link)] font-medium'
              : 'text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--link)]'
            }
          `}
          aria-current={isActive ? 'page' : undefined}
        >
          {article.title}
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l border-[var(--border)] pl-2">
          {article.children!.map(child => (
            <ArticleItem
              key={child.slug}
              article={child}
              categorySlug={categorySlug}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({ contentTree }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(contentTree.map(cat => cat.slug))
  );

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const isActive = (href: string) => pathname === href;
  const isCategoryActive = (categorySlug: string) => pathname.startsWith(`/${categorySlug}`);

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] overflow-y-auto">
      <nav className="p-4" aria-label="Sidebar navigation">
        <div className="space-y-1">
          {contentTree.map(category => {
            const isExpanded = expandedCategories.has(category.slug);
            const isCatActive = isCategoryActive(category.slug);

            return (
              <div key={category.slug}>
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm rounded
                    transition-colors
                    ${isCatActive
                      ? 'bg-[var(--surface)] text-[var(--text)] font-medium'
                      : 'text-[var(--text)] hover:bg-[var(--surface)]'
                    }
                  `}
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category.slug}`}
                >
                  <span className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span>{category.name}</span>
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {category.count}
                  </span>
                </button>

                {/* Category articles */}
                {isExpanded && (
                  <ul
                    id={`category-${category.slug}`}
                    className="ml-6 mt-1 space-y-0.5"
                  >
                    {category.articles.map(article => (
                      <ArticleItem
                        key={article.slug}
                        article={article}
                        categorySlug={category.slug}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Wikipedia-style utilities */}
        <div className="mt-8 pt-4 border-t border-[var(--border)]">
          <h3 className="px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Tools
          </h3>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/random"
                className="block px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--surface)] rounded transition-colors"
              >
                Random article
              </Link>
            </li>
            <li>
              <Link
                href="/recent"
                className="block px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--surface)] rounded transition-colors"
              >
                Recent changes
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
