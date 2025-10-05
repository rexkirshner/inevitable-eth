# Code Style Guide

**Last Updated:** 2025-10-04
**Project:** Inevitable Ethereum
**Languages:** TypeScript, React, MDX, CSS

---

## Core Principles

### 1. Simplicity Above All

**Every change should impact minimal code:**
- Make the smallest possible change to fix an issue
- Surgical precision over broad refactors
- When in doubt, choose the simpler solution
- Avoid introducing new bugs through complexity

### 2. Root Cause Solutions

**No temporary fixes or band-aids:**
- Always find and fix root causes, not symptoms
- Trace through ENTIRE code flows when debugging
- No assumptions - verify what you think you know
- Document the problem and solution

### 3. Senior Developer Mindset

**Professional standards:**
- Never be lazy - find the actual problem
- No shortcuts that create technical debt
- Think about maintainability and readability
- Consider future developers (including yourself)

---

## TypeScript

### General Style

```typescript
// ✅ Good: Explicit types
interface ArticleFrontmatter {
  title: string;
  description: string;
  category: 'background' | 'concepts' | 'ethereum';
  updated: string;
}

// ❌ Bad: Implicit any
function getArticle(slug) {
  // ...
}

// ✅ Good: Type annotations
function getArticle(slug: string): Article | null {
  // ...
}
```

### Import Organization

```typescript
// 1. React imports
import React from 'react';
import { useState, useEffect } from 'react';

// 2. Next.js imports
import Image from 'next/image';
import Link from 'next/link';

// 3. Third-party libraries
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// 4. Local utilities
import { cn } from '@/lib/utils';
import { getContentBySlug } from '@/lib/content';

// 5. Components
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

// 6. Types
import type { Metadata } from 'next';
```

### Naming Conventions

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_ARTICLES = 10;
const DEFAULT_CATEGORY = 'concepts';

// Variables: camelCase
const articleSlug = 'proof-of-work';
const relatedArticles = getRelatedContent(category, slug);

// Functions: camelCase (verbs)
function getContentBySlug(category: string, slug: string) { }
function calculateReadingTime(content: string) { }

// Components: PascalCase (nouns)
function ArticlePage() { }
function TableOfContents() { }

// Types/Interfaces: PascalCase
interface Article { }
type Category = 'background' | 'concepts' | 'ethereum';
```

### File Naming

```
// Components: kebab-case.tsx
components/layout/table-of-contents.tsx
components/mdx/infobox.tsx

// Pages: kebab-case or Next.js conventions
app/page.tsx
app/[category]/page.tsx
app/search/search-client.tsx

// Utilities: kebab-case.ts
lib/content.ts
lib/search.ts
lib/og-image.ts

// Config files: kebab-case or conventions
next.config.ts
tsconfig.json
.context-config.json
```

---

## React Components

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 2. Types (if component-specific)
interface ArticleCardProps {
  title: string;
  description: string;
  href: string;
}

// 3. Component
export function ArticleCard({ title, description, href }: ArticleCardProps) {
  // 3a. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 3b. Event handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // 3c. Render
  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "block p-4 border rounded",
        isHovered && "bg-gray-100"
      )}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
}
```

### Server vs Client Components

```typescript
// Server Component (default)
// app/page.tsx
export default async function HomePage() {
  const articles = getAllContent();
  return <div>{/* ... */}</div>;
}

// Client Component (explicit 'use client')
// components/search-client.tsx
'use client';

import { useState } from 'react';

export function SearchClient() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**Rule:** Use Client Components ONLY when needed:
- Browser APIs (window, document, localStorage)
- State (`useState`, `useReducer`)
- Effects (`useEffect`, `useLayoutEffect`)
- Event handlers
- Third-party libraries requiring browser

### Props Destructuring

```typescript
// ✅ Good: Destructure in function params
function ArticleCard({ title, description, href }: ArticleCardProps) {
  return <a href={href}>{title}</a>;
}

// ❌ Bad: Destructure in body
function ArticleCard(props: ArticleCardProps) {
  const { title, description, href } = props;
  return <a href={href}>{title}</a>;
}
```

### Conditional Rendering

```typescript
// ✅ Good: Ternary for simple conditions
{isLoading ? <Spinner /> : <Content />}

// ✅ Good: && for single branch
{error && <ErrorMessage error={error} />}

// ✅ Good: Early return for complex conditions
if (!article) return <NotFound />;
return <Article data={article} />;

// ❌ Bad: Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : data ? <Content /> : null}
```

---

## Styling (Tailwind CSS)

### Class Organization

```typescript
// Order: layout → spacing → typography → colors → effects
<div className="
  flex items-center justify-between
  px-4 py-2 gap-2
  text-lg font-semibold
  bg-white text-gray-900
  rounded shadow-sm hover:shadow-md
" />
```

### Using `cn()` Utility

```typescript
import { cn } from '@/lib/utils';

// ✅ Good: Conditional classes with cn()
<button className={cn(
  "px-4 py-2 rounded",
  isPrimary && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// ❌ Bad: String concatenation
<button className={`px-4 py-2 ${isPrimary ? 'bg-blue-500' : ''}`} />
```

### CSS Variables

```typescript
// ✅ Good: Tailwind arbitrary values
<div className="bg-[var(--background)] text-[var(--text)]" />

// ✅ Good: Inline styles for dynamic values
<div style={{ color: 'var(--link)' }} />

// ❌ Bad: Hardcoded colors (breaks theming)
<div className="bg-white text-black" />
```

### Responsive Design

```typescript
// Mobile-first: base → sm → md → lg → xl
<div className="
  flex-col
  sm:flex-row
  md:gap-4
  lg:gap-8
  xl:max-w-7xl
" />
```

---

## MDX Content

### Frontmatter

```yaml
---
title: "Proof of Work"
description: "A consensus mechanism where miners solve cryptographic puzzles to validate transactions."
category: "concepts"
updated: "2025-10-04"
tags: ["consensus", "mining", "security"]
difficulty: "intermediate"
readingTime: 8
related: ["proof-of-stake", "nakamoto-consensus"]
hero: "/images/proof-of-work.png"
toc: true
sources:
  - title: "Bitcoin Whitepaper"
    url: "https://bitcoin.org/bitcoin.pdf"
    author: "Satoshi Nakamoto"
---
```

**Required Fields:**
- `title` - Article title
- `description` - Summary (min 10 chars)
- `category` - One of: background, concepts, ethereum
- `updated` - Date in YYYY-MM-DD format

**Optional but Recommended:**
- `tags` - Array of tag strings
- `difficulty` - intro, intermediate, or advanced
- `related` - Array of article slugs

### MDX Writing Style

```mdx
# Main Heading (h1)

Introduction paragraph with clear explanation.

## Major Section (h2)

Content for this section.

### Subsection (h3)

Detailed explanation.

**Bold** for emphasis, _italic_ for terms, `code` for technical terms.

- Bullet lists for unordered items
- Clear, concise points
- No unnecessary nesting

1. Numbered lists for steps
2. Sequential instructions
3. Ordered processes

[Internal links](/concepts/consensus) to other articles.
[External links](https://ethereum.org) to resources.

<Infobox title="Key Concept">
  Important information in a box.
</Infobox>

<Callout type="warning">
  Critical warning or note.
</Callout>

<Figure src="/images/example.png" alt="Description" caption="Figure 1: Example" />
```

---

## File Organization

### Content Files

```
content/
├── background/       # Finance history, mass communication
│   ├── gold-standard.mdx
│   ├── fractional-reserve.mdx
│   └── 2008-crisis.mdx
├── concepts/         # CS, crypto, math fundamentals
│   ├── cryptography.mdx
│   ├── hash-functions.mdx
│   └── public-key-crypto.mdx
└── ethereum/         # Ethereum-specific topics
    ├── proof-of-stake.mdx
    ├── evm.mdx
    └── smart-contracts.mdx
```

### Component Files

```
components/
├── layout/           # Layout components (Header, Footer, etc.)
├── mdx/              # MDX custom components
├── content/          # Content display components
├── ui/               # UI primitives (shadcn/ui)
└── analytics/        # Analytics tracking
```

### Utility Files

```
lib/
├── content.ts        # Content loading & validation
├── content.schema.ts # Zod frontmatter schema
├── search.ts         # Search index building
├── sanitize.ts       # XSS protection
├── og-image.ts       # Social media images
└── utils.ts          # General utilities
```

---

## Error Handling

### Content Loading

```typescript
// ✅ Good: Graceful error handling
export function getContentBySlug(category: string, slug: string): Article | null {
  try {
    const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data, content } = matter(fileContent);
    const frontmatter = validateFrontmatter(data, filePath);

    return { frontmatter, content };
  } catch (error) {
    console.error(`Failed to load article: ${category}/${slug}`, error);
    return null;
  }
}

// Page component
export default async function ArticlePage({ params }) {
  const article = getContentBySlug(params.category, params.slug);

  if (!article) {
    notFound(); // Next.js 404 handler
  }

  return <Article data={article} />;
}
```

### User Input Validation

```typescript
// ✅ Good: Validate and sanitize
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'class']
  });
}

// Usage
const safeHtml = sanitizeHtml(userProvidedContent);
```

---

## Performance Best Practices

### 1. Server Components by Default

```typescript
// ✅ Good: Server Component (no 'use client')
export default async function ArticlePage({ params }) {
  const article = getContentBySlug(params.category, params.slug);
  return <Article data={article} />;
}
```

### 2. Dynamic Imports for Heavy Components

```typescript
// ✅ Good: Lazy load client components
import dynamic from 'next/dynamic';

const TableOfContents = dynamic(() => import('./table-of-contents'), {
  loading: () => <div>Loading...</div>
});
```

### 3. Caching

```typescript
// ✅ Good: Module-level cache
let contentTreeCache: ContentTree | null = null;

export function buildContentTree(): ContentTree {
  if (contentTreeCache) return contentTreeCache;

  // Expensive operation
  const tree = /* ... */;
  contentTreeCache = tree;
  return tree;
}
```

### 4. Debouncing

```typescript
// ✅ Good: Debounce expensive operations
import { debounce } from 'lodash';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);
```

---

## Git Commit Messages

### Format

```
Type: Brief description in imperative mood

Longer explanation if needed (wrap at 72 characters). Explain the "why"
not the "what". Reference issues or PRs if relevant.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **refactor:** Code restructuring (no behavior change)
- **docs:** Documentation changes
- **style:** Formatting, whitespace (no code change)
- **test:** Adding or updating tests
- **chore:** Build, dependencies, tooling

### Examples

```
feat: Add table of contents to article pages

Implements auto-generated ToC with active heading tracking via
Intersection Observer. Smooth scroll with offset for sticky header.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix: Resolve theme toggle not switching colors in dark mode

Root cause: @media (prefers-color-scheme: dark) was overriding .light
class. Changed to :root:not(.light) selector in media query.

Location: app/globals.css:34-60

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Documentation Standards

### Code Comments

```typescript
// ✅ Good: Explain "why" not "what"
// Use client-side rendering to access browser APIs
'use client';

// Cache at module level to avoid rebuilding on every request
let contentTreeCache: ContentTree | null = null;

// ❌ Bad: Redundant comments
// Set the title to the article title
const title = article.title;
```

### Function Documentation

```typescript
/**
 * Load and validate article content by category and slug.
 *
 * @param category - Article category (background, concepts, ethereum)
 * @param slug - Article slug (URL-friendly identifier)
 * @returns Article object with validated frontmatter and content, or null if not found
 *
 * @example
 * const article = getContentBySlug('concepts', 'proof-of-work');
 * if (article) {
 *   console.log(article.frontmatter.title);
 * }
 */
export function getContentBySlug(
  category: string,
  slug: string
): Article | null {
  // Implementation
}
```

### README Files

- **Location:** Component directories, utility folders
- **Purpose:** Explain module purpose, API, usage examples
- **Format:** Markdown with code examples

---

## Testing Conventions

*Note: Automated tests not yet implemented. Guidelines for future.*

### File Naming

```
lib/content.ts              → lib/__tests__/content.test.ts
components/article-card.tsx → components/__tests__/article-card.test.tsx
```

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { getContentBySlug } from '@/lib/content';

describe('getContentBySlug', () => {
  it('should return article for valid category and slug', () => {
    const article = getContentBySlug('concepts', 'proof-of-work');
    expect(article).toBeDefined();
    expect(article?.frontmatter.title).toBe('Proof of Work');
  });

  it('should return null for invalid slug', () => {
    const article = getContentBySlug('concepts', 'nonexistent');
    expect(article).toBeNull();
  });
});
```

---

## Accessibility

### Semantic HTML

```tsx
// ✅ Good: Semantic elements
<article>
  <header>
    <h1>{title}</h1>
  </header>
  <main>{content}</main>
  <footer>{metadata}</footer>
</article>

// ❌ Bad: Div soup
<div>
  <div className="title">{title}</div>
  <div>{content}</div>
</div>
```

### ARIA Labels

```tsx
// ✅ Good: ARIA for interactive elements
<button aria-label="Toggle dark mode" onClick={toggleTheme}>
  <MoonIcon />
</button>

<nav aria-label="Main navigation">
  <ul>{/* ... */}</ul>
</nav>
```

### Keyboard Navigation

```tsx
// ✅ Good: Support keyboard navigation
<a
  href="#content"
  className="skip-to-content"
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Skip to content
</a>
```

---

## Security

### XSS Prevention

```typescript
// ✅ Good: Sanitize all user content
import DOMPurify from 'isomorphic-dompurify';

const safeHtml = DOMPurify.sanitize(userContent);
```

### Environment Variables

```typescript
// ✅ Good: Never commit secrets
// .env.local (gitignored)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

// ❌ Bad: Hardcoded secrets
const GA_ID = 'G-XXXXXXXXXX'; // DON'T DO THIS
```

### CSP Headers

```
// public/_headers (Cloudflare Pages)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

---

## References

- [Next.js 15 Best Practices](https://nextjs.org/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/utility-first)
- [Project Architecture](./ARCHITECTURE.md)
- [Technical Decisions](./DECISIONS.md)
