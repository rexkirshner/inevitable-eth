'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface Article {
  category: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: string;
  readingTime?: number;
  updated: string;
}

interface RandomClientProps {
  allArticles: Article[];
}

export default function RandomClient({ allArticles }: RandomClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  // Get a random article based on filters
  const getRandomArticle = () => {
    const filtered = allArticles.filter(article => {
      const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });

    if (filtered.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  };

  // Initialize with a random article on mount
  useEffect(() => {
    setCurrentArticle(getRandomArticle());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get new random article when filters change or user clicks "Get Another"
  const handleRefresh = () => {
    setCurrentArticle(getRandomArticle());
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-[var(--link)]" />
          <h1 className="text-4xl font-serif font-normal">
            Discover Articles
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] text-lg">
          Let serendipity guide your learning journey
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentArticle(null); // Clear current article when filter changes
            }}
            className="px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--text)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
          >
            <option value="all">All Categories</option>
            <option value="background">Background</option>
            <option value="concepts">Concepts</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentArticle(null); // Clear current article when filter changes
            }}
            className="px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--text)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
          >
            <option value="all">All Levels</option>
            <option value="intro">Introductory</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Refresh Button */}
        <div className="flex items-end">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[var(--link)] text-white rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Get Another
          </button>
        </div>
      </div>

      {/* Random Article Display */}
      {currentArticle ? (
        <article className="border border-[var(--border)] bg-[var(--surface)] p-8 rounded-lg shadow-sm">
          {/* Article Header */}
          <h2 className="text-3xl font-serif font-normal text-[var(--text)] mb-4">
            {currentArticle.title}
          </h2>

          {/* Description */}
          <p className="text-[var(--text)] text-lg mb-6 leading-relaxed">
            {currentArticle.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 mb-6 text-sm text-[var(--text-secondary)]">
            <span className="px-3 py-1 bg-[var(--background)] rounded capitalize">
              {currentArticle.category}
            </span>
            {currentArticle.difficulty && (
              <span className="px-3 py-1 bg-[var(--background)] rounded capitalize">
                {currentArticle.difficulty}
              </span>
            )}
            {currentArticle.readingTime && (
              <span className="px-3 py-1 bg-[var(--background)] rounded">
                {currentArticle.readingTime} min read
              </span>
            )}
            <span className="px-3 py-1 bg-[var(--background)] rounded">
              Updated {currentArticle.updated}
            </span>
          </div>

          {/* Tags */}
          {currentArticle.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentArticle.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[var(--background)] text-[var(--text-secondary)] rounded border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read Article Button */}
          <Link
            href={`/${currentArticle.category}/${currentArticle.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--link)] text-white rounded hover:opacity-90 transition-opacity font-medium"
          >
            Read Article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      ) : (
        <div className="text-center py-12 border border-[var(--border)] bg-[var(--surface)] rounded-lg">
          <p className="text-[var(--text-secondary)] mb-4">
            No articles match your selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setCurrentArticle(getRandomArticle());
            }}
            className="px-4 py-2 text-[var(--link)] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        {allArticles.filter(a => {
          const categoryMatch = selectedCategory === 'all' || a.category === selectedCategory;
          const difficultyMatch = selectedDifficulty === 'all' || a.difficulty === selectedDifficulty;
          return categoryMatch && difficultyMatch;
        }).length}{' '}
        articles available with current filters
      </div>
    </div>
  );
}
