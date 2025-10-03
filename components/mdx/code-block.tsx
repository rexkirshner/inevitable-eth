'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: unknown;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace(/language-/, '') || 'text';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group my-4">
      {/* Language Badge */}
      {language !== 'text' && (
        <div className="absolute top-0 left-0 px-3 py-1 text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface)] border-b border-r border-[var(--border)] rounded-tl rounded-br uppercase">
          {language}
        </div>
      )}

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-[var(--surface)] border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--background)] focus:opacity-100"
        aria-label="Copy code to clipboard"
        type="button"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Code Block */}
      <pre
        className={`${className} overflow-x-auto p-4 ${language !== 'text' ? 'pt-10' : ''} bg-[var(--surface)] border border-[var(--border)] rounded`}
        {...props}
      >
        <code className="text-sm font-mono">{children}</code>
      </pre>
    </div>
  );
}

// Inline code component
export function InlineCode({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
  return (
    <code
      className="px-1.5 py-0.5 text-sm font-mono bg-[var(--surface)] border border-[var(--border)] rounded"
      {...props}
    >
      {children}
    </code>
  );
}
