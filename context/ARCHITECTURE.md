# Architecture Documentation

**Last Updated:** 2025-10-04
**Project:** Inevitable Ethereum
**Stack:** Next.js 15 (App Router), TypeScript, MDX, Tailwind CSS

---

## High-Level Overview

Inevitable Ethereum is a static educational website built with Next.js 15, featuring 141+ MDX articles about Ethereum, cryptography, and finance history. The architecture follows a file-based content system with Wikipedia-inspired design principles.

**Core Principles:**
- Static site generation (SSG) for all pages
- File-based content management (no CMS)
- Server Components by default, Client Components only when needed
- Wikipedia-style information density and typography
- Performance-first (Lighthouse 93-98)

---

## Directory Structure

```
inevitable-eth/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (header, footer)
│   ├── page.tsx                  # Homepage
│   ├── [category]/               # Category pages (background, concepts, ethereum)
│   │   ├── page.tsx              # Category index
│   │   └── [slug]/page.tsx       # Individual article pages
│   ├── search/                   # Search functionality
│   ├── tags/                     # Tag pages
│   ├── about/                    # About page with visualization
│   ├── random/                   # Random article redirect
│   └── feed.xml/                 # RSS/Atom feed
│
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── header.tsx            # Two-tier header (logo + nav)
│   │   ├── footer.tsx            # Four-column footer
│   │   ├── sidebar.tsx           # Collapsible navigation tree
│   │   └── table-of-contents.tsx # Auto-generated ToC
│   ├── mdx/                      # MDX components
│   │   ├── infobox.tsx           # Wikipedia-style info boxes
│   │   ├── callout.tsx           # Warning/info/tip boxes
│   │   ├── figure.tsx            # Images with captions
│   │   └── references.tsx        # Citation system
│   ├── content/                  # Content display components
│   ├── ui/                       # UI primitives (shadcn/ui)
│   └── analytics/                # Google Analytics
│
├── lib/                          # Core utilities
│   ├── content.ts                # Content loading & validation
│   ├── content.schema.ts         # Zod frontmatter schema
│   ├── search.ts                 # Search index building
│   ├── sanitize.ts               # XSS protection (DOMPurify)
│   ├── og-image.ts               # Social media preview images
│   └── utils.ts                  # General utilities
│
├── content/                      # MDX articles (141 files)
│   ├── background/               # Finance history (1492-2008)
│   ├── concepts/                 # CS, crypto, math fundamentals
│   └── ethereum/                 # Ethereum core, DeFi, scaling
│
├── public/                       # Static assets
│   ├── images/                   # 624 images (6 variants each)
│   └── _headers                  # Cloudflare CSP headers
│
├── context/                      # Project documentation
│   ├── .context-config.json      # Claude Context System config
│   ├── CLAUDE.md                 # Claude Code instructions
│   ├── PRD.md                    # Product requirements
│   ├── ARCHITECTURE.md           # This file
│   ├── CODE_STYLE.md             # Code style guide
│   ├── SESSIONS.md               # Session history
│   ├── DECISIONS.md              # Technical decisions
│   ├── KNOWN_ISSUES.md           # Known issues & limitations
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── tasks/                    # Todo lists, next steps
│
├── artifacts/                    # Build reports & audits
│   ├── lighthouse/               # Lighthouse performance reports
│   └── code-reviews/             # Code review reports
│
└── scripts/                      # Build & migration scripts
    ├── migrate-html-to-mdx.ts    # One-time HTML → MDX migration
    ├── check-broken-links.ts     # Link validation
    ├── optimize-images.ts        # Image optimization (6 variants)
    └── build-search-index.ts     # Search index generation
```

---

## Core Systems

### 1. Content System (`lib/content.ts`)

**File-Based Content Management:**
- All articles stored as `.mdx` files in `content/[category]/`
- Frontmatter validated with Zod schema (`lib/content.schema.ts`)
- Server-side utilities (cannot run in browser - uses Node.js `fs`)

**Key Functions:**
- `getContentBySlug(category, slug)` - Load single article with validated frontmatter
- `getAllContent(category?)` - Get all articles, optionally filtered by category
- `getRelatedContent(category, slug, limit)` - Get related articles via tags
- `buildContentTree()` - Build hierarchical navigation tree
- `generateBreadcrumbs(category, slug?)` - Generate breadcrumb navigation
- `getPrevNextArticles(category, slug)` - Get adjacent articles for navigation
- `searchArticles(query, filters?)` - Basic server-side search
- `calculateReadingTime(content)` - Auto-calculate reading time (200 words/min)

**Frontmatter Schema:**
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

**Caching:**
- `buildContentTree()` and `getAllContent()` use module-level caching
- Cache persists across requests during development
- Cache cleared on rebuild in production

### 2. Routing & Pages (Next.js App Router)

**Static Site Generation (SSG):**
- All pages pre-rendered at build time
- 153 static pages generated
- `export const dynamic = 'force-static'` enforced on dynamic routes

**Key Routes:**
- `/` - Homepage (Wikipedia Main Page style)
- `/[category]` - Category index pages (difficulty grouping)
- `/[category]/[slug]` - Article pages (three-column layout)
- `/search` - Client-side search (Fuse.js)
- `/tags` - Tag cloud
- `/tags/[tag]` - Articles by tag
- `/about` - About page with D3.js visualization
- `/random` - Random article redirect
- `/feed.xml` - RSS/Atom feed (all 141 articles)

**Metadata & SEO:**
- Dynamic metadata via `generateMetadata()` in each page
- JSON-LD structured data for articles
- Open Graph + Twitter Card metadata
- OG images (first article image or default banner)
- Sitemap (`app/sitemap.ts`) - all 141 articles
- Robots.txt (`app/robots.ts`)

### 3. Styling System

**Design Philosophy:** Wikipedia-inspired
- Information density over visual flourish
- Functional minimalism
- Typography-first hierarchy
- Clean, academic credibility

**Stack:**
- Tailwind CSS for utility classes
- CSS custom properties for theming
- Global styles in `app/globals.css`
- Serif headings (Linux Libertine → Georgia → Times)
- Sans-serif body (system font stack)
- Monospace code (Courier New → Courier)

**Color Palette:**
- CSS custom properties: `--background`, `--surface`, `--border`, `--text`, `--link`, etc.
- Light/dark mode support
- Theme toggle via `.light` class and `@media (prefers-color-scheme: dark)`

**Responsive:**
- Mobile-first design
- Three-column layout on desktop (sidebar, content, ToC)
- Collapsed sidebar on mobile with hamburger menu
- Images optimized with 6 responsive variants (mobile/tablet/desktop × WebP/AVIF)

### 4. Search System

**Client-Side Search:**
- Fuse.js for fuzzy search
- Pre-built search index (`lib/search.ts`)
- 140 articles indexed (52.36 KB)
- Built at prebuild time
- Debounced search (300ms delay)

**Index Fields:**
- Title, description, category, tags, difficulty
- Weighted scoring (title > description > tags)

**Search Page:**
- Server Component (`app/search/page.tsx`) for shell
- Client Component (`search-client.tsx`) for interactive search
- Filters: category, difficulty, tags

### 5. Image Optimization

**Optimization Script:** `scripts/optimize-images.ts`

**Variants Generated:**
- 6 variants per image: mobile/tablet/desktop × WebP/AVIF
- Responsive `<picture>` tags via custom marked.js renderer
- Sharp for image processing

**Sizes:**
- Mobile: 640px wide
- Tablet: 1024px wide
- Desktop: 1920px wide

**Formats:**
- WebP (primary, modern browsers)
- AVIF (fallback, better compression)
- Original format (final fallback)

### 6. Security

**XSS Protection:**
- DOMPurify (`lib/sanitize.ts`) sanitizes all markdown-rendered HTML
- Applied to all user content

**CSP Headers:**
- Development: `next.config.ts`
- Cloudflare Pages: `public/_headers`

**Headers:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 7. Performance

**Optimizations:**
- Static site generation (no runtime rendering)
- Module-level caching for content tree
- Dynamic imports for heavy components (TableOfContents, SearchClient)
- Search debouncing (300ms)
- Lazy-loaded images with responsive variants
- Turbopack for dev server
- Code splitting via Next.js

**Lighthouse Scores:**
- Performance: 93-98
- Accessibility: 96+
- SEO: 100

---

## Data Flow

### Article Page Rendering

1. **Build Time:**
   - `generateStaticParams()` scans `content/` directory
   - Returns all `[category]/[slug]` paths
   - Next.js pre-renders all 141 article pages

2. **Page Generation:**
   - Server Component fetches article via `getContentBySlug(category, slug)`
   - Frontmatter validated with Zod
   - Related articles fetched via tags
   - Prev/Next articles calculated
   - Breadcrumbs generated
   - Metadata (title, description, OG image) returned

3. **Rendering:**
   - Three-column layout: Sidebar (left), Content (center), ToC (right)
   - MDX compiled to React components
   - Custom components: Infobox, Callout, Figure, References
   - Images optimized via custom marked.js renderer
   - ToC extracted from headings via Intersection Observer (client-side)

### Search Flow

1. **Build Time:**
   - `prebuild` script runs `build-search-index.ts`
   - Reads all 140 articles
   - Extracts title, description, category, tags, difficulty
   - Writes `public/search-index.json` (52.36 KB)

2. **Runtime:**
   - User navigates to `/search`
   - Server Component (`app/search/page.tsx`) renders shell
   - Client Component (`search-client.tsx`) loads search index
   - Fuse.js initializes with index
   - User types query → debounced search (300ms)
   - Results filtered by category, difficulty, tags
   - Results displayed with excerpt highlighting

---

## Build Process

### Development

```bash
npm run dev  # Turbopack dev server on localhost:3000
```

**Features:**
- Hot module replacement (HMR)
- Fast refresh
- Turbopack (faster than Webpack)
- `.next` cache for incremental builds

### Production Build

```bash
npm run build              # Standard Next.js build
npm run build:cloudflare   # Static export for Cloudflare Pages
```

**Standard Build:**
- Server-side rendering (SSR) capable
- 153 static pages generated
- `.next` output directory

**Cloudflare Build:**
- Static export only (`output: 'export'`)
- `out/` directory with pure HTML/CSS/JS
- No server-side features (API routes, ISR, etc.)
- 153 HTML files ready for CDN deployment

### Pre-Build Steps

1. `prebuild` script in `package.json` runs:
   - `build-search-index.ts` - Generate search index
2. (Optional) Run before build:
   - `optimize-images.ts` - Generate responsive image variants
   - `check-broken-links.ts` - Validate internal links

---

## Deployment

**Target:** Cloudflare Pages (static hosting)

**Configuration:**
- Build command: `npm run build:cloudflare`
- Output directory: `out/`
- Environment: Node.js 18+

**Files:**
- `next.config.cloudflare.ts` - Cloudflare-specific config (static export)
- `public/_headers` - CSP headers for Cloudflare Pages
- `.env.local` - Environment variables (gitignored)

**Post-Deployment:**
- 153 static pages served via CDN
- Fast global distribution
- No server runtime required
- Automatic HTTPS

---

## Key Patterns & Conventions

### Server vs Client Components

**Server Components (default):**
- All pages in `app/`
- Content utilities (`lib/content.ts`)
- Layout components (Header, Footer, Sidebar shell)
- No browser APIs (window, document, etc.)
- No state, effects, or event handlers

**Client Components (`'use client'`):**
- TableOfContents (Intersection Observer)
- SearchClient (Fuse.js, state)
- ThemeToggle (localStorage)
- VisualizeClient (D3.js)
- Any component using `useState`, `useEffect`, etc.

### Import Patterns

```typescript
// ✅ Good (Server Component)
import { getContentBySlug } from '@/lib/content';
export default async function ArticlePage({ params }) {
  const { frontmatter, content } = getContentBySlug(params.category, params.slug);
}

// ❌ Bad (Client Component)
'use client';
import { getContentBySlug } from '@/lib/content'; // Will fail - fs not available
```

**Rule:** Content utilities are server-side only. For client-side data, pass as props or use fetch().

### Styling Patterns

```tsx
// CSS variables via Tailwind
<div className="bg-[var(--background)] text-[var(--text)]" />

// Or inline styles
<div style={{ color: 'var(--link)' }} />

// Conditional classes with cn()
import { cn } from '@/lib/utils';
<div className={cn("base-class", isActive && "active-class")} />
```

### MDX Components

**Location:** `components/mdx/`
**Registration:** `mdx-components.tsx` at root

**Usage in `.mdx` files:**
```mdx
<Infobox title="Ethereum">
  Launched: July 30, 2015
</Infobox>

<Callout type="warning">
  This is important!
</Callout>

<Figure src="/images/example.png" alt="Description" caption="Figure 1: Example" />

<References>
  - [Ethereum Whitepaper](https://ethereum.org/whitepaper)
</References>
```

---

## Testing Strategy

**Current Status:** No automated tests (yet)

**Recommended:**
- Unit tests for content utilities (`lib/content.ts`)
- Integration tests for search (`lib/search.ts`)
- E2E tests for critical paths (Playwright)
- Visual regression tests (Percy, Chromatic)
- Accessibility tests (axe-core)

**Manual Testing:**
- Build verification: `npm run build` (no errors)
- Link validation: `npm run check-links`
- Lighthouse audits (performance, accessibility, SEO)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing

---

## Performance Monitoring

**Tools:**
- Lighthouse (local audits)
- Cloudflare Analytics (post-deployment)
- Core Web Vitals tracking

**Metrics to Track:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- Time to Interactive (TTI) < 3.5s

**Optimization Targets:**
- Images: All WebP/AVIF with responsive variants
- Fonts: System fonts (no web font loading)
- JavaScript: Code splitting, dynamic imports
- CSS: Tailwind purging unused styles

---

## Migration & Content Management

**Original Site:** inevitableeth.com (Wiki.js)
**Content Backup:** github.com/haymsalomon/inevitable-eth

**Migration Script:** `scripts/migrate-html-to-mdx.ts`
- One-time migration (completed 2025-10-02)
- 141 articles migrated from HTML to MDX
- 624 images migrated to `public/images/`
- Frontmatter extracted from HTML comments
- Internal links converted to Next.js format

**Adding New Articles:**
1. Create `.mdx` file in `content/[category]/`
2. Add frontmatter (validated by Zod)
3. Write content in MDX
4. Run `npm run build` to validate
5. Commit to git

**Updating Articles:**
1. Edit `.mdx` file directly
2. Update `updated:` date in frontmatter
3. Rebuild search index if title/description changed
4. Test locally, commit

---

## Future Enhancements

**Planned:**
- Automated testing (unit, integration, E2E)
- Contributor guidelines
- CMS integration (optional)
- Interactive learning modules
- User accounts & progress tracking
- Comments/discussions (Giscus)
- Translations (i18n)

**Not Planned:**
- Server-side features (API routes, auth)
- Database integration
- Real-time features
- Complex state management

---

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project PRD](./PRD.md)
- [Technical Decisions](./DECISIONS.md)
- [Deployment Guide](./DEPLOYMENT.md)
