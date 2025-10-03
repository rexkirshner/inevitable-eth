import dynamic from 'next/dynamic';
import { getDefaultOgImage } from '@/lib/og-image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | Inevitable Ethereum',
  description: 'Search through educational content about Ethereum, finance history, and cryptography.',
  openGraph: {
    title: 'Search Inevitable Ethereum',
    description: 'Search through educational content about Ethereum, finance history, and cryptography',
    images: [{ url: getDefaultOgImage() }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Inevitable Ethereum',
    description: 'Search through educational content about Ethereum, finance history, and cryptography',
    images: [getDefaultOgImage()],
  },
};

const SearchClient = dynamic(() => import('./search-client'), {
  loading: () => <div className="p-8 text-center">Loading search...</div>
});

export default function SearchPage() {
  // Articles will be loaded from the optimized search index client-side
  // This reduces initial page load significantly
  return <SearchClient />;
}
