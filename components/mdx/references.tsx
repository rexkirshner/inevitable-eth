'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Reference {
  title: string;
  url: string;
  author?: string;
  date?: string;
}

interface ReferencesProps {
  sources: Reference[];
}

export function References({ sources }: ReferencesProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 pt-6 border-t border-[var(--border)]">
      <h2 className="text-xl font-serif font-normal mb-4">References</h2>
      <ol className="list-decimal list-inside space-y-2">
        {sources.map((source, index) => (
          <li key={index} className="text-sm">
            {source.author && (
              <span className="text-[var(--text)]">{source.author}. </span>
            )}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--link)] hover:underline inline-flex items-center gap-1"
            >
              {source.title}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            {source.date && (
              <span className="text-[var(--text-secondary)]"> ({source.date})</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
