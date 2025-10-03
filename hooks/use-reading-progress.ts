'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'inevitable-eth-reading-progress';

interface ReadingProgress {
  [articleId: string]: {
    readAt: string; // ISO timestamp
    category: string;
    slug: string;
    title: string;
  };
}

export function useReadingProgress() {
  const [readArticles, setReadArticles] = useState<ReadingProgress>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReadArticles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
    setIsHydrated(true);
  }, []);

  // Mark an article as read
  const markAsRead = (category: string, slug: string, title: string) => {
    const articleId = `${category}/${slug}`;
    const updated: ReadingProgress = {
      ...readArticles,
      [articleId]: {
        readAt: new Date().toISOString(),
        category,
        slug,
        title,
      },
    };
    setReadArticles(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  };

  // Mark an article as unread
  const markAsUnread = (category: string, slug: string) => {
    const articleId = `${category}/${slug}`;
    const updated = { ...readArticles };
    delete updated[articleId];
    setReadArticles(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  };

  // Check if an article is read
  const isRead = (category: string, slug: string) => {
    const articleId = `${category}/${slug}`;
    return articleId in readArticles;
  };

  // Get all read articles sorted by most recent
  const getReadArticles = () => {
    return Object.values(readArticles).sort((a, b) =>
      new Date(b.readAt).getTime() - new Date(a.readAt).getTime()
    );
  };

  // Clear all reading progress
  const clearAll = () => {
    setReadArticles({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing reading progress:', error);
    }
  };

  return {
    markAsRead,
    markAsUnread,
    isRead,
    getReadArticles,
    clearAll,
    isHydrated, // Used to prevent hydration mismatches
    readCount: Object.keys(readArticles).length,
  };
}
