import { getAllContent } from '@/lib/content';
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

  // Combine all articles
  const allArticles = [
    ...backgroundArticles.map(a => ({ ...a, category: 'background' as const })),
    ...conceptsArticles.map(a => ({ ...a, category: 'concepts' as const })),
    ...ethereumArticles.map(a => ({ ...a, category: 'ethereum' as const })),
  ];

  return <VisualizeClient articles={allArticles} />;
}
