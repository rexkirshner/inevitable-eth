import dynamic from 'next/dynamic';

const SearchClient = dynamic(() => import('./search-client'), {
  loading: () => <div className="p-8 text-center">Loading search...</div>
});

export default function SearchPage() {
  // Articles will be loaded from the optimized search index client-side
  // This reduces initial page load significantly
  return <SearchClient />;
}
