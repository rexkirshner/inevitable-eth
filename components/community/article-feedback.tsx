'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleFeedbackProps {
  articleTitle: string;
  articleSlug: string;
  category: string;
}

export function ArticleFeedback({ articleTitle, articleSlug, category }: ArticleFeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const storageKey = `feedback-${category}-${articleSlug}`;

  useEffect(() => {
    // Check if user already provided feedback
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setHasSubmitted(true);
      setFeedback(saved as 'helpful' | 'not-helpful');
    }
  }, [storageKey]);

  const handleHelpful = () => {
    setFeedback('helpful');
    setHasSubmitted(true);
    localStorage.setItem(storageKey, 'helpful');
  };

  const handleNotHelpful = () => {
    setFeedback('not-helpful');
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = (details: string) => {
    const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'https://github.com/rexkirshner/inevitable-eth';
    const repoPath = githubRepo.replace('https://github.com/', '');

    const issueTitle = `Feedback: "${articleTitle}" was not helpful`;
    const issueBody = `**Article**: [${articleTitle}](${typeof window !== 'undefined' ? window.location.href : ''})
**Category**: ${category}
**Slug**: ${articleSlug}

## User Feedback

${details || 'No additional details provided.'}

---

_This issue was automatically created from the article feedback widget._`;

    const url = `https://github.com/${repoPath}/issues/new?` +
      `title=${encodeURIComponent(issueTitle)}&` +
      `body=${encodeURIComponent(issueBody)}&` +
      `labels=feedback,article-improvement`;

    window.open(url, '_blank');

    setHasSubmitted(true);
    setShowFeedbackForm(false);
    localStorage.setItem(storageKey, 'not-helpful');
  };

  if (hasSubmitted && !showFeedbackForm) {
    return (
      <div className="my-8 p-4 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          {feedback === 'helpful' ? (
            <>
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-[var(--text)]">Thank you for your feedback!</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  We're glad this article was helpful.
                </p>
              </div>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-[var(--text)]">Thank you for your feedback!</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  We'll work on improving this article.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (showFeedbackForm) {
    return (
      <FeedbackForm
        onSubmit={handleSubmitFeedback}
        onCancel={() => {
          setShowFeedbackForm(false);
          setFeedback(null);
        }}
      />
    );
  }

  return (
    <div className="my-8 p-6 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
        Was this article helpful?
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        Your feedback helps us improve our content.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md",
            "border border-[var(--border)]",
            "hover:bg-green-50 dark:hover:bg-green-900/20",
            "hover:border-green-500 dark:hover:border-green-600",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-green-500"
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Yes, it was helpful</span>
        </button>
        <button
          onClick={handleNotHelpful}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md",
            "border border-[var(--border)]",
            "hover:bg-red-50 dark:hover:bg-red-900/20",
            "hover:border-red-500 dark:hover:border-red-600",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-red-500"
          )}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>No, it wasn't helpful</span>
        </button>
      </div>
    </div>
  );
}

function FeedbackForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (details: string) => void;
  onCancel: () => void;
}) {
  const [details, setDetails] = useState('');

  return (
    <div className="my-8 p-6 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">
            Help us improve
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            What could we do better? (optional)
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-[var(--background)] rounded"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Tell us what was unclear, incorrect, or missing..."
        className={cn(
          "w-full px-3 py-2 rounded-md",
          "border border-[var(--border)]",
          "bg-[var(--background)]",
          "text-[var(--text)]",
          "placeholder:text-[var(--text-secondary)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--link)]",
          "min-h-[120px] resize-y"
        )}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onSubmit(details)}
          className={cn(
            "px-4 py-2 rounded-md",
            "bg-[var(--link)] text-white",
            "hover:opacity-90",
            "transition-opacity",
            "focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus:ring-offset-2"
          )}
        >
          Submit Feedback
        </button>
        <button
          onClick={onCancel}
          className={cn(
            "px-4 py-2 rounded-md",
            "border border-[var(--border)]",
            "hover:bg-[var(--background)]",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
          )}
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-[var(--text-secondary)] mt-3">
        This will create a GitHub issue. You'll be redirected to GitHub to submit.
      </p>
    </div>
  );
}
