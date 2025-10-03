'use client';

import { CheckCircle } from 'lucide-react';
import { useReadingProgress } from '@/hooks/use-reading-progress';

interface ArticleReadIndicatorProps {
  category: string;
  slug: string;
}

export function ArticleReadIndicator({ category, slug }: ArticleReadIndicatorProps) {
  const { isRead, isHydrated } = useReadingProgress();

  // Don't render anything until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  const read = isRead(category, slug);

  if (!read) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
      title="You've read this article"
    >
      <CheckCircle className="h-3.5 w-3.5" />
      <span className="font-medium">Read</span>
    </div>
  );
}
