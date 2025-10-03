import { Info } from 'lucide-react';

interface ArticleSummaryProps {
  description: string;
}

export function ArticleSummary({ description }: ArticleSummaryProps) {
  return (
    <aside className="mb-8 p-4 bg-[var(--surface)] border border-[var(--border)] rounded">
      <div className="flex items-start gap-3">
        <Info
          className="w-5 h-5 mt-0.5 text-[var(--link)] flex-shrink-0"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
            Summary
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </aside>
  );
}
