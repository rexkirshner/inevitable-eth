'use client';

import { useEffect, useState } from 'react';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: '/', description: 'Focus search', category: 'Navigation' },
  { key: '?', description: 'Show keyboard shortcuts', category: 'Navigation' },
  { key: 'n', description: 'Next article', category: 'Navigation' },
  { key: 'p', description: 'Previous article', category: 'Navigation' },
  { key: 'r', description: 'Random article', category: 'Navigation' },
  { key: 'Esc', description: 'Close modals', category: 'Interface' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    // Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div
          className="bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-2xl max-w-md w-full pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Command className="h-5 w-5 text-[var(--text-secondary)]" />
              <h2 id="shortcuts-title" className="text-lg font-normal" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text)] hover:text-[var(--link)] transition-colors rounded"
              aria-label="Close shortcuts"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Group by category */}
              {['Navigation', 'Interface'].map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter((s) => s.category === category)
                      .map((shortcut) => (
                        <div
                          key={shortcut.key}
                          className="flex items-center justify-between py-2 px-3 rounded hover:bg-[var(--surface)] transition-colors"
                        >
                          <span className="text-[var(--text)]">{shortcut.description}</span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-[var(--surface)] border border-[var(--border)] rounded">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] text-center">
            Press <kbd className="px-1.5 py-0.5 font-mono bg-[var(--surface)] border border-[var(--border)] rounded">?</kbd> anytime to show this menu
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to manage keyboard shortcuts globally
export function useKeyboardShortcuts(
  onPrevious?: () => void,
  onNext?: () => void
) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          // Focus search
          const searchLink = document.querySelector('a[href="/search"]');
          if (searchLink) {
            (searchLink as HTMLAnchorElement).click();
          }
          break;

        case '?':
          e.preventDefault();
          setShortcutsOpen(true);
          break;

        case 'n':
          e.preventDefault();
          if (onNext) onNext();
          break;

        case 'p':
          e.preventDefault();
          if (onPrevious) onPrevious();
          break;

        case 'r':
          e.preventDefault();
          window.location.href = '/random';
          break;

        case 'Escape':
          if (shortcutsOpen) {
            e.preventDefault();
            setShortcutsOpen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPrevious, onNext, shortcutsOpen]);

  return { shortcutsOpen, setShortcutsOpen };
}
