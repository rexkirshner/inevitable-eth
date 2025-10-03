'use client';

import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts, KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts';

interface ArticleKeyboardShortcutsProps {
  prevUrl?: string;
  nextUrl?: string;
}

export function ArticleKeyboardShortcuts({ prevUrl, nextUrl }: ArticleKeyboardShortcutsProps) {
  const router = useRouter();

  const handlePrevious = prevUrl ? () => router.push(prevUrl) : undefined;
  const handleNext = nextUrl ? () => router.push(nextUrl) : undefined;

  const { shortcutsOpen, setShortcutsOpen } = useKeyboardShortcuts(
    handlePrevious,
    handleNext
  );

  return (
    <KeyboardShortcutsModal
      isOpen={shortcutsOpen}
      onClose={() => setShortcutsOpen(false)}
    />
  );
}
