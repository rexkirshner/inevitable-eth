import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getContentBySlug, getAllSlugsInCategory, getAllCategories, buildContentTree } from '@/lib/content';
import { renderMarkdown } from '@/lib/mdx';
import { sanitizeHtml } from '@/lib/sanitize';
import { getArticleOgImage } from '@/lib/og-image';
import { Sidebar } from '@/components/layout/sidebar';
import type { Metadata } from 'next';

const TableOfContents = dynamic(() => import('@/components/layout/table-of-contents').then(mod => ({ default: mod.TableOfContents })));

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const paths: Array<{ category: string; slug: string }> = [];

  for (const category of categories) {
    const slugs = getAllSlugsInCategory(category);
    for (const slug of slugs) {
      paths.push({ category, slug });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;

  try {
    const { frontmatter, content } = getContentBySlug(category, slug);
    const ogImage = getArticleOgImage(frontmatter.hero, content);

    return {
      title: `${frontmatter.title} | Inevitable Ethereum`,
      description: frontmatter.description,
      keywords: frontmatter.tags,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        images: [{ url: ogImage }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: 'Article Not Found | Inevitable Ethereum',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;

  let article;
  try {
    article = getContentBySlug(category, slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = article;
  const contentTree = buildContentTree();
  const renderedContent = await renderMarkdown(content);
  const sanitizedContent = sanitizeHtml(renderedContent);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.updated,
    dateModified: frontmatter.updated,
    author: {
      '@type': 'Person',
      name: 'Rex Kirshner',
      url: 'https://twitter.com/logarithmicrex',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inevitable Ethereum',
      url: 'https://inevitableeth.com',
    },
    keywords: frontmatter.tags.join(', '),
    articleSection: category,
    inLanguage: 'en-US',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar contentTree={contentTree} />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-normal mb-4" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
            {frontmatter.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] pb-4 border-b border-[var(--border)]">
            {frontmatter.difficulty && (
              <span className="px-2 py-1 bg-[var(--surface)] rounded text-xs">
                {frontmatter.difficulty}
              </span>
            )}
            {frontmatter.readingTime && (
              <span>{frontmatter.readingTime} min read</span>
            )}
            {frontmatter.updated && (
              <span>Updated: {frontmatter.updated}</span>
            )}
          </div>

          {/* Tags */}
          {frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[var(--surface)] text-[var(--text-secondary)] rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </article>
      </main>

      {/* Right TOC */}
      {frontmatter.toc && <TableOfContents />}
    </div>
    </>
  );
}
