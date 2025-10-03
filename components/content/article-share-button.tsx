'use client';

import { useState, useEffect } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ArticleShareButtonProps {
  title: string;
  description: string;
  url: string;
}

export function ArticleShareButton({ title, description, url }: ArticleShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if Web Share API is available
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or share failed
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--link)] hover:bg-[var(--surface)] rounded transition-colors"
      aria-label={canShare ? 'Share article' : 'Copy link to article'}
      title={canShare ? 'Share article' : 'Copy link'}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-xs">Copied!</span>
        </>
      ) : (
        <>
          {canShare ? (
            <Share2 className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-xs">Share</span>
        </>
      )}
    </button>
  );
}
