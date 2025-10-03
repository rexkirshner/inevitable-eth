import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getAllContent } from '@/lib/content';

interface ArticlePrerequisitesProps {
  prerequisites: string[];
  currentCategory: string;
}

export function ArticlePrerequisites({ prerequisites, currentCategory }: ArticlePrerequisitesProps) {
  if (!prerequisites || prerequisites.length === 0) {
    return null;
  }

  // Get full article metadata for each prerequisite
  const allArticles = getAllContent();
  const prerequisiteArticles = prerequisites
    .map(slug => {
      // Try to find in current category first
      const article = allArticles.find(a =>
        a.slug === slug && a.category === currentCategory
      ) || allArticles.find(a => a.slug === slug); // Fallback to any category
      return article;
    })
    .filter((article): article is NonNullable<typeof article> => article !== undefined);

  if (prerequisiteArticles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-[var(--surface)] border-l-4 border-[var(--link)] rounded">
      <div className="flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-[var(--link)] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            Before reading this article
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            We recommend reading {prerequisiteArticles.length === 1 ? 'this article' : 'these articles'} first:
          </p>
          <ul className="space-y-3">
            {prerequisiteArticles.map((article) => (
              <li key={`${article.category}-${article.slug}`}>
                <Link
                  href={`/${article.category}/${article.slug}`}
                  className="group flex items-start gap-2 hover:text-[var(--link)] transition-colors"
                >
                  <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--text-secondary)] group-hover:text-[var(--link)] transition-colors flex-shrink-0" />
                  <div>
                    <div className="font-medium">{article.frontmatter.title}</div>
                    <div className="text-sm text-[var(--text-secondary)] mt-0.5">
                      {article.frontmatter.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                      <span className="capitalize">{article.category}</span>
                      {article.frontmatter.difficulty && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{article.frontmatter.difficulty}</span>
                        </>
                      )}
                      {article.frontmatter.readingTime && (
                        <>
                          <span>•</span>
                          <span>{article.frontmatter.readingTime} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
