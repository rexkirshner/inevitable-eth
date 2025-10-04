import { getAllContent } from '@/lib/content';
import RandomClient from './random-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Articles | Inevitable Ethereum',
  description: 'Explore random articles about Ethereum, blockchain, and cryptography. Let serendipity guide your learning journey.',
};

export default function RandomPage() {
  // Get all articles
  const allArticles = getAllContent();

  // Map to simplified format for client component
  const articlesForClient = allArticles.map(article => ({
    category: article.category,
    slug: article.slug,
    title: article.frontmatter.title,
    description: article.frontmatter.description || article.frontmatter.title,
    tags: article.frontmatter.tags,
    difficulty: article.frontmatter.difficulty,
    readingTime: article.frontmatter.readingTime,
    updated: article.frontmatter.updated,
  }));

  return <RandomClient allArticles={articlesForClient} />;
}
