import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllContent, getAllCategories } from '@/lib/content';
import { getDefaultOgImage } from '@/lib/og-image';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryDescriptions = {
  background: 'Historical context and foundational knowledge about finance, economics, and mass communication that led to Ethereum.',
  concepts: 'Technical concepts and principles underlying blockchain technology, cryptography, and decentralized systems.',
  ethereum: 'Deep dive into Ethereum - the World Computer, its architecture, consensus, scaling solutions, and ecosystem.',
};

const categoryTitles = {
  background: 'Background & Context',
  concepts: 'Technical Concepts',
  ethereum: 'Ethereum',
};

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!categoryTitles[category as keyof typeof categoryTitles]) {
    return {};
  }

  const title = categoryTitles[category as keyof typeof categoryTitles];
  const description = categoryDescriptions[category as keyof typeof categoryDescriptions];

  return {
    title: `${title} | Inevitable Ethereum`,
    description,
    openGraph: {
      title: `${title} - Inevitable Ethereum`,
      description,
      images: [{ url: getDefaultOgImage() }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Inevitable Ethereum`,
      description,
      images: [getDefaultOgImage()],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!categoryTitles[category as keyof typeof categoryTitles]) {
    notFound();
  }

  const articles = getAllContent(category);
  const title = categoryTitles[category as keyof typeof categoryTitles];
  const description = categoryDescriptions[category as keyof typeof categoryDescriptions];

  // Group articles by difficulty
  const introArticles = articles.filter(a => a.frontmatter.difficulty === 'intro');
  const intermediateArticles = articles.filter(a => a.frontmatter.difficulty === 'intermediate');
  const advancedArticles = articles.filter(a => a.frontmatter.difficulty === 'advanced');
  const uncategorizedArticles = articles.filter(a => !a.frontmatter.difficulty);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8">
      {/* Category header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-normal border-b border-[var(--border)] pb-2 mb-4">
          {title}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      {/* Article count */}
      <div className="mb-6 text-sm text-[var(--text-secondary)]">
        Showing {articles.length} {articles.length === 1 ? 'article' : 'articles'}
      </div>

      {/* Articles grouped by difficulty */}
      <div className="space-y-8">
        {introArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-normal mb-4 text-[var(--text)]">
              Introductory
            </h2>
            <ul className="space-y-3">
              {introArticles.map((article) => (
                <li key={article.slug} className="border-b border-[var(--border)] pb-3">
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="text-lg text-[var(--link)] hover:underline font-semibold"
                  >
                    {article.frontmatter.title}
                  </Link>
                  {article.frontmatter.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {article.frontmatter.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)] mt-2">
                    {article.frontmatter.readingTime && (
                      <span>{article.frontmatter.readingTime} min read</span>
                    )}
                    {article.frontmatter.updated && (
                      <span>Updated {article.frontmatter.updated}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {intermediateArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-normal mb-4 text-[var(--text)]">
              Intermediate
            </h2>
            <ul className="space-y-3">
              {intermediateArticles.map((article) => (
                <li key={article.slug} className="border-b border-[var(--border)] pb-3">
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="text-lg text-[var(--link)] hover:underline font-semibold"
                  >
                    {article.frontmatter.title}
                  </Link>
                  {article.frontmatter.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {article.frontmatter.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)] mt-2">
                    {article.frontmatter.readingTime && (
                      <span>{article.frontmatter.readingTime} min read</span>
                    )}
                    {article.frontmatter.updated && (
                      <span>Updated {article.frontmatter.updated}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {advancedArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-normal mb-4 text-[var(--text)]">
              Advanced
            </h2>
            <ul className="space-y-3">
              {advancedArticles.map((article) => (
                <li key={article.slug} className="border-b border-[var(--border)] pb-3">
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="text-lg text-[var(--link)] hover:underline font-semibold"
                  >
                    {article.frontmatter.title}
                  </Link>
                  {article.frontmatter.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {article.frontmatter.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)] mt-2">
                    {article.frontmatter.readingTime && (
                      <span>{article.frontmatter.readingTime} min read</span>
                    )}
                    {article.frontmatter.updated && (
                      <span>Updated {article.frontmatter.updated}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {uncategorizedArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-normal mb-4 text-[var(--text)]">
              All Articles
            </h2>
            <ul className="space-y-3">
              {uncategorizedArticles.map((article) => (
                <li key={article.slug} className="border-b border-[var(--border)] pb-3">
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="text-lg text-[var(--link)] hover:underline font-semibold"
                  >
                    {article.frontmatter.title}
                  </Link>
                  {article.frontmatter.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {article.frontmatter.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-[var(--text-secondary)] mt-2">
                    {article.frontmatter.readingTime && (
                      <span>{article.frontmatter.readingTime} min read</span>
                    )}
                    {article.frontmatter.updated && (
                      <span>Updated {article.frontmatter.updated}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
