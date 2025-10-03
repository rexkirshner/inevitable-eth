'use client';

import { useEffect } from 'react';
import { useReadingProgress } from '@/hooks/use-reading-progress';

interface ArticleReadTrackerProps {
  category: string;
  slug: string;
  title: string;
}

export function ArticleReadTracker({ category, slug, title }: ArticleReadTrackerProps) {
  const { markAsRead } = useReadingProgress();

  useEffect(() => {
    // Mark as read after user has been on page for 3 seconds
    // This prevents marking as read if user accidentally clicks
    const timer = setTimeout(() => {
      markAsRead(category, slug, title);
    }, 3000);

    return () => clearTimeout(timer);
  }, [category, slug, title, markAsRead]);

  // This component doesn't render anything
  return null;
}
