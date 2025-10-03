'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';

interface ArticleBookmarkButtonProps {
  category: string;
  slug: string;
  title: string;
}

interface BookmarkedArticle {
  category: string;
  slug: string;
  title: string;
  bookmarkedAt: string;
}

const LOCAL_STORAGE_KEY = 'bookmarked-articles';

export function ArticleBookmarkButton({ category, slug, title }: ArticleBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load bookmarks from localStorage
    const bookmarks = getBookmarks();
    const exists = bookmarks.some(b => b.category === category && b.slug === slug);
    setIsBookmarked(exists);
    setMounted(true);
  }, [category, slug]);

  const getBookmarks = (): BookmarkedArticle[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const toggleBookmark = () => {
    const bookmarks = getBookmarks();

    if (isBookmarked) {
      // Remove bookmark
      const filtered = bookmarks.filter(b => !(b.category === category && b.slug === slug));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const newBookmark: BookmarkedArticle = {
        category,
        slug,
        title,
        bookmarkedAt: new Date().toISOString(),
      };
      bookmarks.push(newBookmark);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
        isBookmarked
          ? 'text-[var(--link)] bg-[var(--surface)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--link)] hover:bg-[var(--surface)]'
      }`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
    >
      <Bookmark
        className="h-4 w-4"
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
      <span className="text-xs">{isBookmarked ? 'Saved' : 'Save'}</span>
    </button>
  );
}
