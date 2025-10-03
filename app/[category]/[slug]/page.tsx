import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getContentBySlug, getAllSlugsInCategory, getAllCategories, buildContentTree, generateBreadcrumbs, getPrevNextArticles, getRelatedContent } from '@/lib/content';
import { renderMarkdown } from '@/lib/mdx';
import { sanitizeHtml } from '@/lib/sanitize';
import { getArticleOgImage } from '@/lib/og-image';
import { Sidebar } from '@/components/layout/sidebar';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ArticleNavigation } from '@/components/content/article-navigation';
import { RelatedArticles } from '@/components/content/related-articles';
import { ArticleSummary } from '@/components/content/article-summary';
import { ArticleKeyboardShortcuts } from '@/components/content/article-keyboard-shortcuts';
import type { Metadata } from 'next';

const TableOfContents = dynamic(() => import('@/components/layout/table-of-contents').then(mod => ({ default: mod.TableOfContents })));
const ReadingProgress = dynamic(() => import('@/components/content/reading-progress').then(mod => ({ default: mod.ReadingProgress })));

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
  const breadcrumbs = generateBreadcrumbs(category, slug);
  const { prev, next } = getPrevNextArticles(category, slug);
  const relatedArticles = getRelatedContent(category, slug, 3);
  const renderedContent = await renderMarkdown(content);
  const sanitizedContent = sanitizeHtml(renderedContent);

  // JSON-LD structured data for Article
  const articleJsonLd = {
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

  // JSON-LD structured data for BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `https://inevitableeth.com${crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ReadingProgress />
      <ArticleKeyboardShortcuts
        prevUrl={prev ? `/${category}/${prev.slug}` : undefined}
        nextUrl={next ? `/${category}/${next.slug}` : undefined}
      />
      <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar contentTree={contentTree} />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-normal mb-4" style={{ fontFamily: '"Linux Libertine", Georgia, Times, serif' }}>
            {frontmatter.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)] pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-4">
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
            <a
              href={`https://github.com/rexkirshner/inevitable-eth/blob/main/content/${category}/${slug}.mdx`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-[var(--link)] hover:underline transition-colors flex items-center gap-1"
            >
              Edit on GitHub
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
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

        {/* Article Summary */}
        <ArticleSummary description={frontmatter.description} />

        {/* Article Content */}
        <article className="prose">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </article>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Previous/Next Navigation */}
        <ArticleNavigation prev={prev} next={next} />
      </main>

      {/* Right TOC */}
      {frontmatter.toc && <TableOfContents />}
    </div>
    </>
  );
}
