'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Search as SearchIcon, X } from 'lucide-react';

interface ArticleForSearch {
  category: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: string;
  readingTime?: number;
  updated: string;
  headings?: string[];
}

export default function SearchClient() {
  const [articles, setArticles] = useState<ArticleForSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Load search index on mount
  useEffect(() => {
    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading search index:', err);
        setIsLoading(false);
      });
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Configure Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(articles, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'headings', weight: 0.8 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [articles]);

  // Perform search
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return articles.map(article => ({ item: article, score: 0 }));
    }
    return fuse.search(debouncedQuery);
  }, [debouncedQuery, fuse, articles]);

  // Apply filters
  const filteredResults = useMemo(() => {
    return results.filter(({ item }) => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [results, selectedCategory, selectedDifficulty]);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-[var(--text-secondary)]">Loading search index...</div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-4">
              Search Articles
            </h1>
            <p className="text-[var(--text-secondary)]">
              Search through {articles.length} articles about Ethereum, blockchain, and cryptography
            </p>
          </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-10 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--text)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)]"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--text)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
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
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--text)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
          >
            <option value="all">All Levels</option>
            <option value="intro">Introductory</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-[var(--text-secondary)]">
        {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
        {query && ` for "${query}"`}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          filteredResults.map(({ item }) => (
            <article
              key={`${item.category}/${item.slug}`}
              className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded hover:border-[var(--link)] transition-colors"
            >
              <Link
                href={`/${item.category}/${item.slug}`}
                className="block"
              >
                <h2 className="text-xl font-semibold text-[var(--link)] hover:underline mb-2">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="text-[var(--text)] mb-3">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                  <span className="px-2 py-1 bg-[var(--background)] rounded capitalize">
                    {item.category}
                  </span>
                  {item.difficulty && (
                    <span className="px-2 py-1 bg-[var(--background)] rounded capitalize">
                      {item.difficulty}
                    </span>
                  )}
                  {item.readingTime && (
                    <span>{item.readingTime} min read</span>
                  )}
                  {item.updated && (
                    <span>Updated {item.updated}</span>
                  )}
                </div>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.slice(0, 5).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-[var(--background)] text-[var(--text-secondary)] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
}
