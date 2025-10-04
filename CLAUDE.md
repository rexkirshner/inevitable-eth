# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inevitable Ethereum** is an educational resource about Ethereum, finance history, and cryptography. This is a custom Next.js rebuild of inevitableeth.com (originally Wiki.js), featuring 141+ MDX articles and 624+ images with Wikipedia-inspired design principles.

**Key References:**
- Original site: https://inevitableeth.com/
- Content backup: https://github.com/haymsalomon/inevitable-eth
- PRD: See `PRD.md` for complete roadmap and design philosophy

## Working with Rex

### Workflow Preferences

**Git & Deployment:**
- ⚠️ **ALWAYS wait for explicit approval before pushing to GitHub** unless specifically told to push
- Test all changes in dev environment before committing
- Make incremental commits with clear, detailed messages
- Use the standardized commit message format with "🤖 Generated with Claude Code" footer
- Push only after user confirms changes work correctly

**Development Approach:**
- **Simplicity is paramount** - every change should impact as little code as possible
- Make the smallest possible change to fix an issue
- NO temporary fixes or band-aids - always find and fix root causes
- Operate with a senior developer mindset - never take shortcuts
- Trace through ENTIRE code flows when debugging - no assumptions

**Planning & Communication:**
- For complex tasks:
  1. Write a plan to `tasks/todo.md`
  2. Check in with user before starting work
  3. Provide high-level explanations of what changed (not verbose code walkthroughs unless asked)
  4. Mark todo items complete as you go
  5. Add a review section summarizing changes
- For simple tasks: just do the work directly
- User provides screenshots to show issues - always read them with the Read tool

**Code Quality Standards:**
- Every fix must address the root cause, not symptoms
- Impact minimal code - surgical precision over broad changes
- No lazy coding - find the actual problem and fix it properly
- Avoid introducing new bugs through overly complex changes
- When in doubt, choose the simpler solution

### Communication Style

**What Rex Prefers:**
- Direct, concise responses without preamble
- High-level summaries of changes made (e.g., "Changed X to Y in file.ts:123")
- Clear indication when waiting for approval vs. when work is complete
- Honest assessment of what you're confident about vs. uncertain

**What to Avoid:**
- Verbose explanations unless specifically requested
- Pushing to GitHub without explicit approval
- Making assumptions about what user wants
- Complex changes when simple ones will work
- Temporary fixes instead of root cause solutions

### Testing & Verification

**Before Committing:**
1. Verify changes work in dev environment (npm run dev)
2. Check for any console errors or warnings
3. Test on both desktop and mobile when UI is involved
4. Confirm no unintended side effects

**When User Says "let's make sure it works first":**
- This means: make the change, verify in dev, then WAIT for user's explicit approval
- Do NOT push to GitHub until user confirms it works on their end
- Be patient - user will test and give feedback

### Examples from Past Sessions

**Good Workflow (Session 12):**
1. User: "Visualization is off-screen on about page"
2. Claude: Investigates, finds root cause (window vs container dimensions)
3. Makes minimal change (2 lines modified)
4. User: "looks good, let's make sure it works before you push"
5. Claude: Makes change, waits for approval
6. User: "ok great, push to GitHub"
7. Claude: Pushes with detailed commit message

**What NOT to Do:**
- Making broad refactors when a small change would work
- Using temporary workarounds instead of fixing root issues
- Pushing to GitHub without approval when user requested verification first
- Assuming a fix works without actually testing it

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack on localhost:3000

# Production
npm run build               # Build for production with Turbopack
npm run build:cloudflare    # Build for Cloudflare Pages (static export)
npm run start               # Start production server

# Code Quality
npm run lint         # Run ESLint

# Content & Scripts
npm run migrate            # Migrate HTML content to MDX from backup repo (one-time)
npm run check-links        # Check for broken internal links
npm run optimize-images    # Optimize all images (Sharp + WebP/AVIF)
npm run build-search-index # Build optimized search index (auto-runs in prebuild)
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

**Phase 4: MDX Components** ✅ Complete (2025-10-02 Session 3)
- Infobox (`components/mdx/infobox.tsx`)
- Callout (`components/mdx/callout.tsx`)
- Figure (`components/mdx/figure.tsx`)
- References (`components/mdx/references.tsx`)
- All wired up in `mdx-components.tsx`

**Phase 5: Page Templates** ✅ Complete (2025-10-02 Session 4)
- ✅ Homepage revamped (`app/page.tsx`) - Wikipedia Main Page style
- ✅ Category page template (`app/[category]/page.tsx`) - Difficulty grouping
- ✅ Article page template (`app/[category]/[slug]/page.tsx`) - Three-column layout working
- ✅ Search page (`app/search/page.tsx` + `search-client.tsx`) - Server/client separation
- ✅ About page (`app/about/page.tsx`)
- ✅ Random article redirect (`app/random/page.tsx`)
- ✅ 404 page (`app/not-found.tsx`)
- ✅ Error boundary (`app/error.tsx`)

**Phase 6: Performance & SEO** ✅ Complete (2025-10-02 Session 4)
- ✅ Sitemap (`app/sitemap.ts`) - All 141 articles
- ✅ Robots.txt (`app/robots.ts`)
- ✅ JSON-LD structured data (article pages)
- ✅ Open Graph + Twitter Card metadata
- ✅ Accessibility (skip-to-content, prefers-reduced-motion, ARIA, viewport)
- ✅ Turbopack optimization

**Phase 7: QA & Optimization** ✅ Complete (2025-10-02 Session 5)
- ✅ Broken link checker script (`scripts/check-broken-links.ts`)
- ✅ Security hardening (XSS protection, CSP headers)
- ✅ Performance optimizations (caching, dynamic imports, debouncing)
- ✅ Image optimization wired to MDX renderer
- ✅ Lighthouse audits (93-98 Performance, 96+ A11y, 100 SEO)
- ✅ Production build (153 pages)

**Phase 8: Cloudflare Deployment & Final Polish** ✅ Complete (2025-10-02 Session 6)
- ✅ Cloudflare Pages static export configuration
- ✅ Fixed image optimization bug (desktop variants 404s)
- ✅ OG images for social media sharing
- ✅ Deployment ready (153 pages, tested)

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

**Security & Performance**:
- **XSS Protection**: All markdown-rendered HTML sanitized with DOMPurify (`lib/sanitize.ts`)
- **CSP Headers**: Security headers in `next.config.ts` (dev) and `public/_headers` (Cloudflare)
- **Caching**: Module-level caching for buildContentTree() and getAllContent()
- **Dynamic Imports**: TableOfContents and SearchClient lazy-loaded
- **Search Debouncing**: 300ms delay prevents excessive re-renders
- **Image Optimization**: Custom marked.js renderer generates responsive `<picture>` tags with WebP/AVIF sources
- **OG Images**: Social media preview images via metadata (`lib/og-image.ts`)

**Next.js 15 App Router**:
- File-based routing in `app/` directory
- Server Components by default (use 'use client' when needed)
- Metadata via `export const metadata` in pages/layouts
- Dynamic routes: `[param]/page.tsx`

## Critical Path (As of 2025-10-03 Session 12)

**Current Status:** Phases 1-8 Complete ✅ | All UI Polish Complete ✅ | Production Ready 🚀

**Completed in Session 12 (Visualization Fixes & Deployment Prep):**
- ✅ **Fixed Visualization Positioning on About Page**
  - Root cause: D3 was using window dimensions instead of container dimensions
  - Changed to use `svgRef.current.clientWidth/clientHeight` for accurate sizing
  - Location: `app/visualize/visualize-client.tsx:85-86`
- ✅ **Increased Visualization Circle Size**
  - Changed radius padding from 150px to 20px for 95% container fill
  - Location: `app/visualize/visualize-client.tsx:389`
- ✅ **Fixed Mobile Responsiveness**
  - Changed container from fixed `h-[600px]` to `aspect-square max-h-[600px]`
  - Ensures square container on mobile for properly centered circle
  - Location: `app/about/page.tsx:140`
- ✅ **UI Polish**
  - Removed dot separator between article count and "View full size" link
  - Location: `app/about/page.tsx:144`

**Completed in Session 11 (Post-Revert UI Polish & Bug Fixes):**
- ✅ **Restored Lost UI Improvements** (from Session 10)
  - Homepage: Equal height boxes, correct icons (Star for Featured, BookOpen for Background)
  - Header: Ethereum logo SVG replacing BookOpen icon
  - About page: Visualization without labels, centered layout, improved author section
  - Contact links: Email, LinkedIn, Twitter, Telegram with icons
- ✅ **Missing Features Implemented**
  - Updated all original site links to use old.inevitableeth.com subdomain
  - Added Google Analytics tracking (G-9K8VQGCQ5D) to root layout
  - 404 page callout with dynamic old site URL based on current path
  - Fixed tags page button text visibility (white text on blue background)
- ✅ **Critical Bug Fixes**
  - Fixed theme toggle not switching colors (added .light class, :root:not(.light) media query)
  - Resolved build cache corruption issues
  - Fixed visualization component props (hideLabels support)
- ✅ **Code Quality**
  - All changes verified working in dev environment
  - 5 commits documenting incremental fixes
  - Zero breaking changes

**Completed in Session 7 (Navigation, Discovery & SEO):**
- ✅ **8 New Features Shipped** (Phase 7.5 Day 3-4 complete)
  - Breadcrumbs navigation with Wikipedia-style separators
  - Previous/Next article links at bottom of pages
  - Related articles section (tag-based matching, 3 per page)
  - Article summary boxes with description
  - Reading progress indicator (scroll-based, top bar)
  - BreadcrumbList JSON-LD for Google rich snippets
  - RSS/Atom feed at /feed.xml (all 141 articles)
  - "Edit on GitHub" links on every article
- ✅ **Comprehensive Code Review**
  - Performance audit: Grade A- (3 minor optimizations suggested)
  - Security audit: Grade A- (no critical issues)
  - All 8 new components reviewed and approved
  - Build verified: 154 pages compile successfully
  - Documentation: tasks/session-7-code-review.md created
- ✅ **Meta-Documentation System**
  - Created slash commands: /update-docs, /review-docs
  - Fixed YAML frontmatter formatting for claude commands
  - Both commands functional and tested
- ✅ **Deployment Fix**
  - Fixed RSS feed route for Cloudflare static export
  - Added `export const dynamic = 'force-static'` to app/feed.xml/route.ts
  - Build tested locally: 154 static pages generated
  - Ready for Cloudflare Pages deployment

**Completed in Session 6 (Cloudflare Deployment & Final Polish):**
- ✅ Cloudflare Pages configuration
  - Created `next.config.cloudflare.ts` for static export
  - Created `public/_headers` for CSP headers
  - Added `build:cloudflare` npm script
  - Added `dynamic = 'force-static'` to robots.ts and sitemap.ts
- ✅ Fixed critical image optimization bug
  - Root cause: script skipped desktop variants for images < 1920px
  - MDX renderer always tried to load all sizes → 404s
  - Fixed in `scripts/optimize-images.ts` line 67
  - Re-optimized all 498 images (6 variants each = ~3,000 files)
- ✅ OG images for social media sharing
  - Created `lib/og-image.ts` utility
  - Article pages use first image from content
  - Other pages use default banner
  - Updated metadata in all pages
- ✅ Deployment testing
  - Static export build successful (153 pages)
  - Verified `out/` directory structure
  - Confirmed `_headers` file copied correctly

**Build Status:**
- ✅ 153 static pages generated
- ✅ 140 articles indexed (52.36 KB search index)
- ✅ 498 images optimized (mobile/tablet/desktop × WebP/AVIF)
- ✅ Zero build errors
- ✅ All 141 articles compile successfully
- ✅ All images loading correctly (desktop variants fixed)

**Key Files Modified/Created:**
- `next.config.cloudflare.ts` - NEW: Static export config for Cloudflare
- `public/_headers` - NEW: CSP headers for Cloudflare Pages
- `lib/og-image.ts` - NEW: OG image extraction utilities
- `scripts/optimize-images.ts` - FIXED: Removed size check causing 404s
- `app/[category]/[slug]/page.tsx` - Added OG image metadata
- `app/page.tsx` - Added OG image metadata
- `app/about/page.tsx` - Added OG image metadata
- `app/search/page.tsx` - Added OG image metadata
- `app/[category]/page.tsx` - Added OG image metadata
- `package.json` - Added `build:cloudflare` script

**Project is deployment-ready for Cloudflare Pages**

## Troubleshooting & Known Issues

### Build & Cache Issues

**Problem: Inexplicable import errors (e.g., "BookOpen is not defined" despite correct imports)**
- **Root Cause**: Corrupted `.next` build cache with stale manifest files
- **Solution**: Delete `.next` directory and rebuild
  ```bash
  rm -rf .next
  npm run dev
  ```
- **Prevention**: When seeing import errors that don't make sense, always check build cache first

**Problem: "Internal Server Error" after making changes**
- **Diagnosis Steps**:
  1. Check for corrupted build cache (delete `.next`)
  2. Look for multiple dev servers running (kill all: `lsof -ti:3000 | xargs kill -9`)
  3. Check for Next.js 15 incompatibilities (e.g., `ssr: false` in Server Components)
- **Session 11 Example**: `dynamic(..., { ssr: false })` not allowed in Server Components - remove the option

### Theme & Styling Issues

**Problem: Theme toggle button changes icon but colors don't switch**
- **Root Cause**: `@media (prefers-color-scheme: dark)` overrides class-based theme
- **Solution**: Use `:root:not(.light)` selector in media query + explicit `.light` class
  ```css
  @media (prefers-color-scheme: dark) {
    :root:not(.light) { /* dark colors */ }
  }
  .light { /* light colors - overrides media query */ }
  ```
- **Location**: `app/globals.css` lines 34-60

**Problem: CSS variable text color invisible on background**
- **Root Cause**: Variables like `--background` change value between light/dark mode
- **Bad**: `text-[var(--background)]` - dark text on dark bg in dark mode
- **Good**: `style={{ color: '#ffffff' }}` - consistent across themes
- **Session 11 Example**: Tags page buttons (app/tags/page.tsx:103)

### Git & Version Control

**Problem: Lost uncommitted work after reverting changes**
- **Bad**: `git checkout .` - DESTROYS all uncommitted changes permanently
- **Good**: `git stash` - Saves changes for later recovery
- **Prevention**: Always verify uncommitted work exists before reverting
  ```bash
  git status  # Check what you'll lose
  git stash   # Save instead of destroy
  git stash pop  # Restore later
  ```

### Next.js 15 Specific Gotchas

**Dynamic Imports in Server Components**
- ❌ `dynamic(() => import('./component'), { ssr: false })` - NOT allowed in Server Components
- ✅ `dynamic(() => import('./component'))` - Works fine
- ✅ Add `'use client'` to component if it needs browser APIs

**CSS Custom Properties in Tailwind**
- ✅ `className="bg-[var(--background)]"` - Works for backgrounds, borders
- ⚠️ `className="text-[var(--background)]"` - Problematic when variable changes (light/dark)
- ✅ `style={{ color: 'var(--link)' }}` - Inline styles more reliable for dynamic values

### Development Workflow

**Before Making Breaking Changes:**
1. Verify what uncommitted work exists: `git status`
2. Consider `git stash` instead of `git checkout .`
3. Test in dev environment before committing
4. Make smallest possible change to fix issue
5. Verify build still works: `npm run build`

**Debugging Checklist:**
1. Check `.next` cache corruption (delete and rebuild)
2. Verify no conflicting dev servers running
3. Check browser console for client-side errors
4. Review recent git changes: `git log --oneline -5`
5. Trace through ENTIRE code flow (no assumptions)

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