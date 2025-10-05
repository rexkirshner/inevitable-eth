'use client';

import { useState } from 'react';
import { Send, BookPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArticleRequestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'background' | 'concepts' | 'ethereum'>('concepts');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/rexkirshner/inevitable-eth';
    const repoPath = githubRepo.replace('https://github.com/', '');

    const issueTitle = `Article Request: ${title}`;
    const issueBody = `## Article Request

**Title**: ${title}
**Category**: ${category}
**Priority**: ${priority}

## Description

${description}

## Why this article would be valuable

<!-- Please explain why this article would be helpful to readers -->

---

**Votes**: If you'd like to see this article too, add a 👍 reaction to this issue!

_This issue was automatically created from the article request form._`;

    const url = `https://github.com/${repoPath}/issues/new?` +
      `title=${encodeURIComponent(issueTitle)}&` +
      `body=${encodeURIComponent(issueBody)}&` +
      `labels=article-request,${category},priority-${priority}`;

    window.open(url, '_blank');

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('concepts');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-[var(--text)] mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., 'Understanding Zero-Knowledge Proofs'"
            className={cn(
              "w-full px-4 py-2 rounded-md",
              "border border-[var(--border)]",
              "bg-[var(--background)]",
              "text-[var(--text)]",
              "placeholder:text-[var(--text-secondary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
            )}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-[var(--text)] mb-2">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'background' | 'concepts' | 'ethereum')}
            required
            className={cn(
              "w-full px-4 py-2 rounded-md",
              "border border-[var(--border)]",
              "bg-[var(--background)]",
              "text-[var(--text)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
            )}
          >
            <option value="background">Background (Finance History & Mass Communication)</option>
            <option value="concepts">Concepts (Cryptography, Computer Science, Math)</option>
            <option value="ethereum">Ethereum (Core, Consensus, Scaling, DeFi)</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-[var(--text)] mb-2">
            Priority
          </label>
          <div className="flex gap-3">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "px-4 py-2 rounded-md border transition-colors",
                  priority === p
                    ? "border-[var(--link)] bg-[var(--link)] text-white"
                    : "border-[var(--border)] hover:border-[var(--link)]"
                )}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            How urgently is this article needed?
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[var(--text)] mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe what the article should cover, why it's important, and who would benefit from reading it..."
            className={cn(
              "w-full px-4 py-2 rounded-md",
              "border border-[var(--border)]",
              "bg-[var(--background)]",
              "text-[var(--text)]",
              "placeholder:text-[var(--text-secondary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--link)]",
              "min-h-[200px] resize-y"
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!title || !description}
            className={cn(
              "px-6 py-3 rounded-md",
              "bg-[var(--link)] text-white",
              "hover:opacity-90",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-opacity",
              "focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus:ring-offset-2",
              "flex items-center gap-2 font-semibold"
            )}
          >
            <Send className="w-4 h-4" />
            Submit Request
          </button>
          <p className="text-sm text-[var(--text-secondary)]">
            This will create a GitHub issue that others can vote on
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
          <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
            <BookPlus className="w-5 h-5" />
            How Article Requests Work
          </h3>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>• Your request will be submitted as a GitHub issue</li>
            <li>• Other users can vote on requests by adding 👍 reactions</li>
            <li>• The most-voted requests are prioritized for development</li>
            <li>• You&apos;ll be able to track progress and discuss in the issue comments</li>
            <li>• All requests are public and transparent</li>
          </ul>
        </div>
      </div>
    </form>
  );
}
