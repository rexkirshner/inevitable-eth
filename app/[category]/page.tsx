import { notFound } from 'next/navigation';
import { getAllContent, getAllCategories } from '@/lib/content';
import { getDefaultOgImage } from '@/lib/og-image';
import { ArticleListItem } from '@/components/content/article-list-item';

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

const featuredArticles = {
  background: 'background',
  ethereum: 'world-computer',
  concepts: null,
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
  const ogImage = getDefaultOgImage();

  return {
    title: `${title} | Inevitable Ethereum`,
    description,
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      title: `${title} - Inevitable Ethereum`,
      description,
      images: [{
        url: ogImage.url,
        width: ogImage.width,
        height: ogImage.height,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Inevitable Ethereum`,
      description,
      images: [ogImage.url],
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

  // Extract featured article if one exists for this category
  const featuredSlug = featuredArticles[category as keyof typeof featuredArticles];
  const featuredArticle = featuredSlug ? articles.find(a => a.slug === featuredSlug) : null;

  // Filter out featured article from other groups
  const remainingArticles = featuredArticle
    ? articles.filter(a => a.slug !== featuredSlug)
    : articles;

  // Group remaining articles by difficulty
  const introArticles = remainingArticles.filter(a => a.frontmatter.difficulty === 'intro');
  const intermediateArticles = remainingArticles.filter(a => a.frontmatter.difficulty === 'intermediate');
  const advancedArticles = remainingArticles.filter(a => a.frontmatter.difficulty === 'advanced');
  const uncategorizedArticles = remainingArticles.filter(a => !a.frontmatter.difficulty);

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

      {/* Featured article */}
      {featuredArticle && (
        <section className="mb-8 p-6 border-2 border-[var(--link)] bg-[var(--surface)] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--link)]">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <h2 className="text-sm font-semibold text-[var(--link)] uppercase tracking-wide">
              Featured Overview
            </h2>
          </div>
          <ArticleListItem
            category={category}
            slug={featuredArticle.slug}
            title={featuredArticle.frontmatter.title}
            description={featuredArticle.frontmatter.description}
            readingTime={featuredArticle.frontmatter.readingTime}
            updated={featuredArticle.frontmatter.updated}
          />
        </section>
      )}

      {/* Articles grouped by difficulty */}
      <div className="space-y-8">
        {introArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-normal mb-4 text-[var(--text)]">
              Introductory
            </h2>
            <ul className="space-y-3">
              {introArticles.map((article) => (
                <ArticleListItem
                  key={article.slug}
                  category={category}
                  slug={article.slug}
                  title={article.frontmatter.title}
                  description={article.frontmatter.description}
                  readingTime={article.frontmatter.readingTime}
                  updated={article.frontmatter.updated}
                />
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
                <ArticleListItem
                  key={article.slug}
                  category={category}
                  slug={article.slug}
                  title={article.frontmatter.title}
                  description={article.frontmatter.description}
                  readingTime={article.frontmatter.readingTime}
                  updated={article.frontmatter.updated}
                />
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
                <ArticleListItem
                  key={article.slug}
                  category={category}
                  slug={article.slug}
                  title={article.frontmatter.title}
                  description={article.frontmatter.description}
                  readingTime={article.frontmatter.readingTime}
                  updated={article.frontmatter.updated}
                />
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
                <ArticleListItem
                  key={article.slug}
                  category={category}
                  slug={article.slug}
                  title={article.frontmatter.title}
                  description={article.frontmatter.description}
                  readingTime={article.frontmatter.readingTime}
                  updated={article.frontmatter.updated}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
