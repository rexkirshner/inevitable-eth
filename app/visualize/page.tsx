import { getAllContent, getContentBySlug } from '@/lib/content';
import { getDefaultOgImage } from '@/lib/og-image';
import type { Metadata } from 'next';
import VisualizeClient from './visualize-client';

export const metadata: Metadata = {
  title: 'Visualize Pages - Inevitable Ethereum',
  description: 'Interactive visualization of all articles and their relationships',
  openGraph: {
    title: 'Visualize Pages - Inevitable Ethereum',
    description: 'Interactive visualization of all articles and their relationships',
    images: [{ url: getDefaultOgImage() }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visualize Pages - Inevitable Ethereum',
    description: 'Interactive visualization of all articles and their relationships',
    images: [getDefaultOgImage()],
  },
};

export default function VisualizePage() {
  // Get all content from all categories
  const backgroundArticles = getAllContent('background');
  const conceptsArticles = getAllContent('concepts');
  const ethereumArticles = getAllContent('ethereum');

  // Combine all articles with their content for link extraction
  const allArticles = [
    ...backgroundArticles.map(a => {
      const { content } = getContentBySlug('background', a.slug);
      return { ...a, category: 'background' as const, content };
    }),
    ...conceptsArticles.map(a => {
      const { content } = getContentBySlug('concepts', a.slug);
      return { ...a, category: 'concepts' as const, content };
    }),
    ...ethereumArticles.map(a => {
      const { content } = getContentBySlug('ethereum', a.slug);
      return { ...a, category: 'ethereum' as const, content };
    }),
  ];

  return <VisualizeClient articles={allArticles} />;
}
