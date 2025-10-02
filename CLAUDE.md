# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inevitable Ethereum** is an educational resource about Ethereum, finance history, and cryptography. This is a custom Next.js rebuild of inevitableeth.com (originally Wiki.js), featuring 141+ MDX articles and 624+ images with Wikipedia-inspired design principles.

**Key References:**
- Original site: https://inevitableeth.com/
- Content backup: https://github.com/haymsalomon/inevitable-eth
- PRD: See `PRD.md` for complete roadmap and design philosophy

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack on localhost:3000

# Production
npm run build        # Build for production with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Content Migration (one-time)
npm run migrate      # Migrate HTML content to MDX from backup repo
```

## Architecture

### Content System (File-Based)

**Content Location**: `content/` directory with 3 categories:
- `content/background/` - Finance history (1492-2008), mass communication, economics
- `content/concepts/` - Computer science, cryptography, cryptocurrency, finance, math
- `content/ethereum/` - Ethereum core, consensus, scaling, DeFi, future

**Content Format**: MDX files with strict frontmatter validation via Zod

**Key Content Utilities** (`lib/content.ts`):
- `getContentBySlug(category, slug)` - Load single article with validated frontmatter
- `getAllContent(category?)` - Get all articles, optionally filtered by category
- `getRelatedContent(category, slug, limit)` - Get related articles via explicit links or tag matching
- `buildContentTree()` - Build hierarchical navigation tree (used in Sidebar)
- `generateBreadcrumbs(category, slug?)` - Generate breadcrumb navigation
- `getPrevNextArticles(category, slug)` - Get adjacent articles for navigation
- `searchArticles(query, filters?)` - Basic text search (Fuse.js provides better client-side search)
- `calculateReadingTime(content)` - Auto-calculate reading time (200 words/min)

**Frontmatter Schema** (`lib/content.schema.ts`):
```typescript
{
  // Required
  title: string
  description: string (min 10 chars)
  category: "background" | "concepts" | "ethereum"
  updated: string (YYYY-MM-DD format)

  // Optional
  tags: string[]
  difficulty: "intro" | "intermediate" | "advanced"
  readingTime: number (auto-calculated if omitted)
  related: string[] (article slugs)
  hero: string (image path)
  infobox: Record<string, string> (Wikipedia-style sidebar)
  toc: boolean (default: true)
  sources: Array<{title, url, author?}>
}
```

**Schema Validation**: All frontmatter is validated at runtime with descriptive errors. Use `validateFrontmatter(data, filepath?)` for explicit validation.

### Design System (Wikipedia-Inspired)

**Color Palette** (`app/globals.css` lines 4-47):
- CSS custom properties for light/dark modes
- Variables: `--background`, `--surface`, `--border`, `--text`, `--text-secondary`, `--link`, `--link-visited`, `--link-red`
- Access via `var(--variable-name)` in components or Tailwind with `[var(--variable-name)]`

**Typography Philosophy**:
- **Headings**: Serif font family (Linux Libertine → Georgia → Times fallback)
- **Body**: Sans-serif system font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, etc.)
- **Code**: Monospace (Courier New → Courier fallback)

**Global Styles** (`app/globals.css`):
- Wikipedia-style link behavior (underline on hover, visited states, external link indicators)
- Heading hierarchy with border-bottom on h1/h2
- `.prose` class for article content styling
- Print-optimized styles (@media print)

### Layout Components

**Three-Column Layout Pattern** (to be implemented in article pages):
1. **Left**: Sidebar navigation (`components/layout/sidebar.tsx`)
2. **Center**: Article content
3. **Right**: Table of Contents (`components/layout/table-of-contents.tsx`)

**Sidebar** (`components/layout/sidebar.tsx`):
- Collapsible category tree with article counts
- Uses `buildContentTree()` from `lib/content.ts`
- Active state tracking via `usePathname()`
- Client component ('use client')

**Table of Contents** (`components/layout/table-of-contents.tsx`):
- Auto-extracts h2, h3, h4 headings from article DOM
- Active heading tracking via Intersection Observer
- Smooth scroll behavior with offset for sticky header
- Client component ('use client')

**Header** (`components/layout/header.tsx`):
- Two-tier design: logo bar + navigation bar
- Search link (to `/search` - not yet implemented)
- Responsive with mobile menu button

**Footer** (`components/layout/footer.tsx`):
- Four-column layout: About, Categories, Resources, Community
- CC BY-SA 4.0 licensing
- External links to GitHub and original site

### Migration System

**Script**: `scripts/migrate-html-to-mdx.ts`

**Purpose**: One-time migration from HTML backup to MDX. Reads from `/private/tmp/inevitable-eth-wiki/` (cloned backup repo).

**Features**:
- Extracts frontmatter from HTML comments
- Converts HTML → Markdown using Turndown with custom rules
- Auto-calculates reading time
- Infers difficulty from keywords
- Formats dates to YYYY-MM-DD
- Generates descriptions from first paragraph if missing
- Handles internal links (`/ethereum/evm` → `[text](/ethereum/evm)`)

**Already Completed**: 141 articles migrated to `content/`, 624 images to `public/images/`

## Key Patterns

### Adding New Articles

1. Create `.mdx` file in appropriate `content/[category]/` folder
2. Add frontmatter with all required fields (see schema above)
3. Write content in MDX (Markdown + JSX components)
4. Images: use relative paths `/images/filename.ext`
5. Internal links: use Next.js Link format `[text](/category/slug)`
6. Math: use KaTeX syntax (rehype-katex handles rendering)

### Creating MDX Components

MDX components go in `components/mdx/` (to be created in Phase 4). These are imported and used within `.mdx` content files.

**Planned Components**:
- Infobox (Wikipedia-style sidebar boxes)
- Callout (warning, info, tip boxes)
- Figure (images with captions)
- References (footnote/citation system)

### Working with Content Utilities

Always use server-side content utilities from `lib/content.ts` in Server Components. These functions use Node.js `fs` module and cannot run in browser.

```typescript
// ✅ Good (Server Component)
import { getContentBySlug } from '@/lib/content';

export default async function ArticlePage({ params }) {
  const { frontmatter, content } = getContentBySlug(params.category, params.slug);
  // ...
}

// ❌ Bad (Client Component)
'use client';
import { getContentBySlug } from '@/lib/content'; // Will fail - fs not available in browser
```

For client-side search, use Fuse.js with pre-built search index (Phase 1 pending task).

### Styling Patterns

**Using CSS Variables**:
```tsx
// Tailwind arbitrary values
<div className="bg-[var(--background)] text-[var(--text)]" />

// Or inline styles
<div style={{ color: 'var(--link)' }} />
```

**Component Styling**:
- Prefer Tailwind utility classes
- Use `cn()` helper from `lib/utils.ts` to conditionally merge classes
- Wikipedia color variables for consistency

## Development Status

**Phase 1: Content Migration** ✅ Complete (2025-10-02 Session 1)
- 141 articles migrated to MDX
- 624 images migrated
- Content utilities implemented
- Zod validation schema complete

**Phase 2: Design System** ✅ Complete (2025-10-02 Session 2)
- Wikipedia color palette in CSS custom properties (light/dark)
- Global typography (serif headings, sans-serif body)
- Link styles (visited states, external indicators)
- Print styles

**Phase 3: Layout Components** ✅ Complete (2025-10-02 Session 2)
- Header (Wikipedia-style two-tier navigation)
- Sidebar (collapsible tree with active state tracking)
- Table of Contents (Intersection Observer, smooth scroll)
- Footer (four-column with CC licensing)

**Phase 4: MDX Components** ⏳ NEXT UP
- Infobox, Callout, Figure, References components
- **But first:** Need article page route to test components

**Phase 5: Page Templates** ⏳ Pending (CRITICAL PATH)
- **PRIORITY 1:** Article page template (`app/[category]/[slug]/page.tsx`)
  - Three-column layout to showcase Sidebar + TOC
  - MDX rendering with rehype plugins
  - Static generation for all 141 articles
- Category page template
- Homepage revamp (Wikipedia Main Page style)
- Search page with Fuse.js

**Phase 6: Performance & SEO** ⏳ Pending
- Sitemap, RSS, OG images, JSON-LD
- Image optimization (next/image), font optimization, code splitting
- Accessibility (keyboard nav, ARIA, WCAG AA)

**Phase 7: QA** ⏳ Pending
- Broken link checker
- Redirects from old Wiki.js URLs
- Testing (Lighthouse, cross-browser, mobile)

See `PRD.md` for complete roadmap and success criteria.
See `tasks/code-review.md` for comprehensive code audit (conducted 2025-10-02).

## Important Notes

**Wikipedia Design Philosophy**:
- Information density over visual flourish
- Functional minimalism
- Typography-first hierarchy
- Clean, academic credibility
- This is NOT the original inevitableeth.com design - it's Wikipedia-inspired

**Environment Variables**:
- Template: `.env.example`
- Local config: `.env.local` (gitignored)
- Never commit credentials

**Content Quality**:
- All articles must pass Zod validation
- Reading time auto-calculated at 200 words/min
- Related articles via explicit `related:[]` frontmatter or tag matching
- Difficulty inferred from keywords if not specified

**Next.js 15 App Router**:
- File-based routing in `app/` directory
- Server Components by default (use 'use client' when needed)
- Metadata via `export const metadata` in pages/layouts
- Dynamic routes: `[param]/page.tsx`

## Critical Path (As of 2025-10-02)

**Before starting Phase 4 MDX components:**

1. **Add ThemeProvider** (5 mins) - MEDIUM priority
   - `next-themes` is installed but not configured
   - Wrap children in `app/layout.tsx` with `<ThemeProvider>`
   - Enables dark mode toggle functionality

2. **Create article page route** (30 mins) - CRITICAL
   - File: `app/[category]/[slug]/page.tsx`
   - Needed to test Sidebar + TOC components we just built
   - Three-column layout: Sidebar | Article Content | TOC
   - Static generation with `generateStaticParams()`

3. **Add theme toggle button** (10 mins) - MEDIUM priority
   - Add to Header component
   - Use `useTheme()` hook from next-themes
   - Sun/Moon icon toggle

**Recommendation from Code Review:**
Create article page first, then Phase 4 MDX components. This allows immediate testing of the layout system.

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY


CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts. 