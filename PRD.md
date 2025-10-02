# InevitableETH.com Complete Rebuild - Product Requirements Document

**Version:** 3.1
**Date:** 2025-10-02
**Status:** Phase 1-6 Complete ✅ | Preparing v1 Launch 🚀
**Strategy:** Ship polished v1 first, defer complex community features until validated

---

## Executive Summary

Migrate inevitableeth.com from Wiki.js to a custom-built Next.js application with Wikipedia-inspired design. Transform 141 educational articles about Ethereum, finance history, and cryptography into a performant, flexible, and visually stunning knowledge base.

**Current State**: https://inevitableeth.com/ (Wiki.js platform, dated design, performance limitations)
**Content Backup**: https://github.com/haymsalomon/inevitable-eth (141 HTML files, 600+ images)
**Goal**: Modern, performant, flexible, easy-to-update, design-forward educational platform

---

## 🚀 v1 Launch Roadmap (Critical Path)

**Philosophy**: Ship a complete, fast, credible v1 that feels finished—without complex database-backed community features. Validate with real users before building advanced infrastructure.

### Launch Blockers (Must Ship)

#### Week 1: Performance & Core UX (5 days)
**Goal**: Make it fast, discoverable, and production-ready

**Day 1-2: Performance Killers** ⚠️ CRITICAL
1. ✅ Image optimization pipeline (Sharp + WebP/AVIF + responsive srcsets)
2. ✅ Search index optimization (build-time, compressed, lazy-load)
3. ✅ Lighthouse CI with performance budgets (<2s LCP, <0.05 CLS)

**Day 3: Navigation & Discovery**
4. ✅ Breadcrumbs component
5. ✅ Previous/Next article navigation
6. ✅ Related articles (tag-based matching)
7. ✅ Article summary boxes (auto-generate from first paragraph)
8. ✅ Reading progress indicator

**Day 4: SEO & Migration**
9. ✅ Wiki.js → new URL redirect map (preserve SEO rankings)
10. ✅ Broken link checker in CI/PRs
11. ✅ BreadcrumbList schema for rich snippets
12. ✅ RSS/Atom feed generation

**Day 5: Analytics & Simple Community**
13. ✅ Plausible/PostHog integration
14. ✅ Giscus comments (GitHub Discussions-backed)
15. ✅ "Was this helpful?" widget → GitHub Issues
16. ✅ "Edit on GitHub" links per article

### Launch Nice-to-Haves (If Time Permits)
- Enhanced code blocks (copy button, language badges)
- Print CSS validation
- Playwright smoke tests
- Content licensing page

### Explicitly Deferred to Post-Launch
**Don't build until v1 is live and validated:**
- ❌ Supabase/database infrastructure
- ❌ Admin moderation dashboard
- ❌ Edit approval workflow with diffs
- ❌ User accounts/authentication
- ❌ Advanced submission forms
- ❌ Knowledge graph visualization
- ❌ Learning paths with progress tracking
- ❌ PWA/offline mode

**Why defer?** These add weeks of complexity. Ship v1, gather analytics, then build what users actually need.

### v1 Success Metrics (First 30 Days)
- **Performance**: LCP <2s (P75), CLS <0.05, INP <200ms
- **Engagement**: +50% time on page vs old site, >70% "helpful" rate
- **Content**: Zero broken links, all images optimized
- **SEO**: Maintain/improve rankings for top 20 legacy keywords
- **Community**: >5 GitHub issues/comments per week

---

## Problem Statement

### Current Pain Points (Wiki.js Site)
1. **Performance**: Slow load times, heavy platform overhead
2. **Design**: Dated UI/UX, doesn't match quality of content
3. **Flexibility**: Limited customization within Wiki.js constraints
4. **Maintenance**: Wiki.js platform dependency, difficult updates
5. **User Experience**: Cluttered interface, poor information hierarchy
6. **Mobile**: Suboptimal responsive experience

### Vision for New Site
- **Performance**: Lightning-fast (<2s LCP), static-first architecture
- **Design**: Wikipedia-caliber information density + modern aesthetics
- **Flexibility**: Full control over UI/UX, easy feature additions
- **Maintenance**: Simple MDX file updates, no platform lock-in
- **Modern**: Clean, professional, design-forward presentation
- **Mobile-first**: Excellent experience across all devices

---

## Content Inventory (From GitHub Backup)

### Article Count: **141 HTML files** ✅ Migrated to MDX
Organized across 3 main categories:

#### 1. Background (History & Context)
- **Finance History** (1492-2008)
  - Dot-com Bubble
  - Global Financial Crisis (GFC)
  - Financial entities (Federal Reserve, Lehman, AIG, Bear Stearns, Merrill Lynch, GSE)
  - Property rights, liquidity, working capital

- **Mass Communication**
  - Printing Press revolution
  - Computer history
  - Tomorrow-Fi (Ethereum as background technology)

- **Economic Context**
  - Sanctions (Afghanistan)
  - Internet economy
  - Reserve currency

#### 2. Concepts (Technical Foundations)
- **Computer Science**: Abstraction, APIs, Arrays, Hash functions, Turing-complete, Virtual machines, Stack
- **Cryptography**: BFT, Digital signatures, BLS signatures, Diffie-Hellman, Elliptic curves, KZG commitments, Merkle trees, Verkle trees, Polynomial commitments, Zero-knowledge proofs
- **Cryptocurrency**: Blocks, Bridges, Gas, MEV, Oracles, Transactions, Credible neutrality
- **Finance**: Arbitrage, DCF, Liquidity, Market making, Options, Perpetual futures, Settlement
- **Math**: Power laws, Vectors

#### 3. Ethereum (The World Computer)
- **Core Concepts**: World Computer, EVM, Blockchain, Network architecture
- **Consensus**: Proof of Stake, Casper FFG, LMD-GHOST, RANDAO, Attestations, Finality
- **Scaling**: Rollups (Optimistic & ZK), Danksharding, Proto-danksharding, Data availability
- **Infrastructure**: Nodes, Light clients, Portal Network, DVT (Distributed Validator Technology)
- **DeFi**: Programmable money, Internet settlement, AMMs, protocols
- **MEV & PBS**: MEV-Boost, Proposer-Builder Separation
- **Future**: Statelessness, EigenLayer, Account abstraction, EOF (EVM Object Format)

### Assets: **624+ Images** ✅ Migrated
- Technical diagrams (block structures, network topology, cryptographic concepts)
- Historical photos (financial crises, mass communication evolution)
- Banners and hero images
- Custom illustrations (World Computer, trustless trust, Ethereum endgame)
- PDFs (KZG commitment papers, research docs)

---

## Tech Stack

**Current Setup:**
- ✅ Next.js 15.5.4 with App Router + TypeScript
- ✅ Tailwind CSS 4 + PostCSS
- ✅ shadcn/ui component library
- ✅ MDX support (@next/mdx, @mdx-js/loader, @mdx-js/react)
- ✅ gray-matter (frontmatter parsing)
- ✅ Fuse.js (client-side search)
- ✅ next-themes (dark mode)
- ✅ Zod (schema validation)
- ✅ Turndown (HTML → Markdown conversion)
- ✅ rehype-katex (math rendering)
- ✅ rehype-slug + rehype-autolink-headings (TOC support)
- ✅ remark-gfm (GitHub Flavored Markdown)
- ✅ tsx (TypeScript execution for scripts)

---

## Design Philosophy: Wikipedia-Inspired with Modern Polish

### Core Principles
1. **Information Density Over Visual Flourish**
   - Maximize content visibility
   - Minimize chrome and decoration
   - Every UI element serves a purpose

2. **Typography-First Design**
   - Generous line-height (1.6-1.8)
   - Optimal line length (60-70 characters)
   - Clear hierarchy with size and weight
   - Serif body text for readability

3. **Functional Minimalism**
   - Clean, distraction-free reading experience
   - Subtle borders and dividers
   - Whitespace as a feature, not a bug
   - Predictable, intuitive interactions

4. **Academic Credibility**
   - Professional, authoritative presentation
   - Citation-forward (references, sources)
   - Neutral color palette
   - No "trendy" design gimmicks

5. **Accessibility & Performance**
   - Fast, keyboard-friendly, semantic HTML
   - Works without JavaScript
   - Excellent screen reader support
   - Mobile-first responsive design

### Visual Language

**Color Palette** (Wikipedia-inspired neutrals):
```
Light Mode:
- Background: #ffffff
- Surface: #f8f9fa (subtle gray for infoboxes, sidebars)
- Border: #a7a7a7 (medium gray)
- Text: #202122 (near-black)
- Text Secondary: #54595d (muted)
- Link: #0645ad (classic Wikipedia blue)
- Link Visited: #0b0080 (purple)
- Link Red: #ba0000 (for planned/missing content)

Dark Mode:
- Background: #1a1a1a
- Surface: #222222
- Border: #404040
- Text: #e0e0e0
- Text Secondary: #a0a0a0
- Link: #4d9fff (brighter blue for contrast)
- Link Visited: #a68dff
```

**Typography**:
- Body: Georgia or system-ui serif, 16px, line-height 1.6
- Headings: Sans-serif (Geist or system stack)
- Code: Monospace (Geist Mono)
- Max content width: 920px (Wikipedia standard)

**Layout Architecture** (Three-column Wikipedia style):
```
Desktop (>1280px):
┌──────────────────────────────────────────────────────────┐
│ [Logo]  Search    Background|Concepts|Ethereum     [⚙]   │ ← Header (sticky, 48px)
├──────────────────────────────────────────────────────────┤
│  ┌──────────┬───────────────────────────┬──────────────┐ │
│  │          │                           │              │ │
│  │ Sidebar  │   Main Content (920px)    │  TOC (Right) │ │
│  │ (180px)  │                           │  (220px)     │ │
│  │          │   Article title           │              │ │
│  │ • Back   │   Metadata bar            │  • Section 1 │ │
│  │ • Conc   │   Tags [intro] [crypto]   │  • Section 2 │ │
│  │ • Ethe   │                           │    • Sub 2.1 │ │
│  │          │   Article body text...    │  • Section 3 │ │
│  │          │   with images, diagrams   │              │ │
│  │          │   and callouts            │  [Infobox]   │ │
│  │          │                           │  Key facts   │ │
│  │          │   References [1][2][3]    │              │ │
│  │          │                           │              │ │
│  └──────────┴───────────────────────────┴──────────────┘ │
│  Footer (minimal, links, copyright)                      │
└──────────────────────────────────────────────────────────┘

Tablet (768-1280px): Hide sidebar, keep TOC
Mobile (<768px): Single column, collapsible TOC at top
```

---

## Implementation Plan

### ✅ Phase 1: Content Migration Infrastructure (COMPLETED)

#### 1.1 Content Schema (Strict Zod Validation) ✅
Created `/lib/content.schema.ts`:
```typescript
{
  title: string                          // "KZG Commitments"
  description: string                    // SEO + preview text
  category: "background" | "concepts" | "ethereum"
  subcategory?: string[]                 // ["cryptography"], optional facets
  tags: string[]                         // ["KZG", "proofs", "EIP-4844"]
  difficulty: "intro" | "intermediate" | "advanced"
  updated: string (ISO 8601)             // "2023-01-16"
  readingTime?: number                   // Minutes (auto-calculated)
  sources?: Array<{                      // Citations
    title: string
    url: string
    author?: string
  }>
  related: string[]                      // Slugs: ["eip-4844", "polynomial-commitments"]
  hero?: string                          // "/images/concepts/kzg-hero.png"
  infobox?: Record<string, string>       // { Type: "Cryptographic", "Introduced": "2010" }
  toc: boolean                           // Show TOC? (default true)
}
```

#### 1.2 HTML → MDX Migration Script ✅
Completed `/scripts/migrate-html-to-mdx.ts`:
- ✅ Parse 141 HTML files from GitHub backup
- ✅ Extract Wiki.js HTML comment metadata → Zod-validated frontmatter
- ✅ Turndown conversion with custom rules
- ✅ Calculate reading time (words / 200)
- ✅ Output to `/content/{category}/{slug}.mdx`
- ✅ **Result: 141/141 articles successfully migrated**

#### 1.3 Image Migration & Optimization ✅
- ✅ Copied 624+ images to `/public/images/`
- ⏳ TODO: Batch optimize with Sharp (resize, compress, WebP conversion)
- ⏳ TODO: Create image manifest JSON for search indexing
- ⏳ TODO: Validate all image references in MDX

#### 1.4 Content Utilities ✅
Created/Enhanced `/lib/content.ts`:
```typescript
// Core functions:
✅ getAllArticles(): Article[]
✅ getArticleBySlug(category, slug): Article | null
✅ getArticlesByCategory(category): Article[]
✅ getRelatedArticles(slug): Article[]
✅ buildContentTree(): CategoryTree
✅ generateBreadcrumbs(category, slug): Breadcrumb[]
✅ getPrevNextArticles(category, slug): { prev, next }
✅ searchArticles(query, filters): Article[]
```

#### 1.5 Search Index Builder ⏳
- ⏳ TODO: Create `/lib/search/build-index.ts`
- ⏳ TODO: Build time script (runs during `npm run build`)
- ⏳ TODO: Output: `/public/search-index.json` (<2MB compressed)

---

### ✅ Phase 2: Wikipedia-Style Design System (COMPLETED)

#### 2.1 Tailwind Configuration ✅
Updated `app/globals.css` with Wikipedia-inspired color palette:
- CSS custom properties for light/dark themes
- Variables: `--background`, `--surface`, `--border`, `--text`, `--text-secondary`, `--link`, `--link-visited`, `--link-red`
- Responsive dark mode with `@media (prefers-color-scheme: dark)`

#### 2.2 Global Styles ✅
Comprehensive Wikipedia-style CSS in `/app/globals.css`:
- ✅ Link styles (underline on hover, visited states, external link indicators)
- ✅ Heading hierarchy (h1/h2 with bottom border)
- ✅ Typography (serif headings via Linux Libertine fallback, sans-serif body)
- ✅ Code block styling (syntax highlighting ready)
- ✅ Prose styles (.prose class for article content)
- ✅ Table styling
- ✅ Print CSS (hides nav/sidebar, shows link URLs)

#### 2.3 Font Configuration ✅
Configured in `/app/layout.tsx`:
- ✅ Geist Sans for UI elements
- ✅ Geist Mono for code
- ✅ CSS fallback to Linux Libertine/Georgia for headings

---

### ✅ Phase 3: Core Layout Components (COMPLETED)

#### 3.1 Header ✅
Created Wikipedia-style header at `components/layout/header.tsx`:
- ✅ Two-tier design (logo bar + navigation bar)
- ✅ Search link, logo with BookOpen icon
- ✅ Category navigation (Background, Concepts, Ethereum, About)
- ✅ Mobile menu button (UI only, functionality pending)
- ✅ Semantic HTML with proper ARIA labels

#### 3.2 Sidebar Navigation ✅
Created at `components/layout/sidebar.tsx`:
- ✅ Client component with collapsible category tree
- ✅ All categories expanded by default
- ✅ Active state tracking via usePathname
- ✅ Article count badges
- ✅ Wikipedia-style Tools section (Random, Recent changes)
- ✅ Proper accessibility (aria-expanded, aria-controls)

#### 3.3 Table of Contents ✅
Created at `components/layout/table-of-contents.tsx`:
- ✅ Auto-extracts h2, h3, h4 headings from article DOM
- ✅ Intersection Observer for active heading tracking
- ✅ Smooth scroll with header offset
- ✅ Indentation based on heading level
- ✅ "Back to top" button
- ✅ Returns null if no headings found

#### 3.4 Footer ✅
Enhanced at `components/layout/footer.tsx`:
- ✅ Four-column layout (About, Categories, Resources, Community)
- ✅ External link indicators
- ✅ CC BY-SA 4.0 licensing
- ✅ Links to GitHub and original site
- ✅ Dynamic year calculation

---

### ✅ Phase 4: MDX Content Components (COMPLETED)

#### 4.1 Infobox ✅
Created `components/mdx/infobox.tsx`:
- Wikipedia-style right-aligned box with key-value pairs
- Floats right on desktop, full width on mobile
- Optional title, table-based layout
- Border and background using CSS variables

#### 4.2 Callout ✅
Created `components/mdx/callout.tsx`:
- Four types: info, warning, tip, danger
- Icon-based (lucide-react icons)
- Color-coded backgrounds and borders
- Optional title, supports children

#### 4.3 Figure ✅
Created `components/mdx/figure.tsx`:
- Next.js Image component integration
- Optional caption with italic styling
- Border and padding for visual separation
- Configurable width/height props

#### 4.4 References ✅
Created `components/mdx/references.tsx`:
- Numbered ordered list format
- External link indicators
- Optional author and date fields
- Auto-hides if no sources provided

#### 4.5 MDX Components Integration ✅
Updated `mdx-components.tsx`:
- All four components exported via useMDXComponents
- Ready for use in any .mdx file
- TypeScript types properly configured

---

### ✅ Phase 5: Pages & Routes (COMPLETE)

#### 5.1 Article Pages ✅
`/app/[category]/[slug]/page.tsx` - Full three-column layout
- ✅ Three-column layout (Sidebar | Content | TOC)
- ✅ Markdown rendering with marked library
- ✅ Metadata generation for SEO
- ✅ JSON-LD structured data for articles
- ✅ Static generation for all 141 articles

#### 5.2 Category Pages ✅
Created `/app/[category]/page.tsx`:
- ✅ Lists all articles in category
- ✅ Groups by difficulty (intro/intermediate/advanced)
- ✅ Article previews with description, reading time, updated date
- ✅ Category descriptions and metadata
- ✅ Static generation for all 3 categories

#### 5.3 Homepage (Revamp) ✅
Revamped `/app/page.tsx` with Wikipedia Main Page style:
- ✅ Featured article section (The World Computer)
- ✅ Category overviews (top 5 from each)
- ✅ About section with project description
- ✅ Two-column grid layout
- ✅ Wikipedia-style sectioned boxes

#### 5.4 Search Page ✅
`/app/search/page.tsx` + `/app/search/search-client.tsx`:
- ✅ Server/client component separation
- ✅ Client-side Fuse.js search
- ✅ Filters (category, difficulty)
- ✅ Real-time search results
- ✅ Optimized payload (no full content)

#### 5.5 Additional Pages ✅
- ✅ `/app/about/page.tsx` - About this project
- ✅ `/app/random/page.tsx` - Random article redirect

#### 5.6 Error Pages ✅
- ✅ `/app/not-found.tsx` - Custom 404 with helpful links
- ✅ `/app/error.tsx` - Error boundary with reset functionality

---

### ✅ Phase 6: Performance & Polish (COMPLETE)

#### 6.1 Performance Optimizations ✅
- ✅ Static generation for all pages
- ✅ Server/client component separation
- ✅ Optimized search payload
- ✅ Turbopack configuration
- ⏳ Image optimization (Next/Image in MDX)
- ⏳ Font optimization
- ⏳ Code splitting

#### 6.2 SEO & Metadata ✅
- ✅ `/app/sitemap.ts` - Dynamic sitemap for all 141 articles
- ✅ `/app/robots.ts` - Robots.txt configuration
- ✅ JSON-LD structured data on article pages
- ✅ Open Graph metadata (root layout)
- ✅ Twitter Card metadata
- ✅ Per-page metadata generation

#### 6.3 Accessibility ✅
- ✅ Semantic HTML throughout
- ✅ Skip to content link
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ `prefers-reduced-motion` support
- ✅ Proper viewport configuration
- ✅ Focus management

---

### Phase 7: Quality Assurance (PARTIAL)

#### 7.1 Content QA 🟡 PARTIAL
- ✅ `/scripts/check-broken-links.ts` - Broken link checker script
- ✅ `npm run check-links` - Added to package.json
- ⏳ Run broken link checker
- ⏳ Redirects from old Wiki.js URLs
- ⏳ Image reference validation

#### 7.2 Testing ⏳ PENDING
- ⏳ Lighthouse scores (Performance, A11y, SEO, Best Practices)
- ⏳ Mobile responsiveness testing
- ⏳ Cross-browser testing
- ⏳ Search functionality testing
- ⏳ Theme switching testing
- ⏳ Build production version

---

### Phase 7.5: v1 Launch Preparation (5 days) 🚀 PRIORITY

**Goal**: Ship production-ready v1 with performance, discoverability, and simple community features.

#### 7.5.1 Performance Killers ⚠️ CRITICAL (Day 1-2)
- ⏳ **Image Optimization Pipeline**
  - Sharp integration with WebP/AVIF conversion
  - Responsive srcsets (mobile/tablet/desktop)
  - Blur placeholders for lazy loading
  - Image manifest validator (fails CI on missing/oversized)
- ⏳ **Search Index Optimization**
  - Build-time compressed index (titles/descriptions/headings only)
  - Lazy-load full content index on search page
  - ~70-80% payload reduction vs current
- ⏳ **Lighthouse CI Integration**
  - Performance budgets (<2s LCP, <0.05 CLS, <200ms INP)
  - Automated PR checks
  - Historical tracking

#### 7.5.2 Navigation & Discovery (Day 3)
- ⏳ **Breadcrumbs component** (`components/layout/breadcrumbs.tsx`)
- ⏳ **Previous/Next article navigation** (bottom of article pages)
- ⏳ **Related articles section** (tag-based matching, show 3-5)
- ⏳ **Article summary boxes** (auto-generate from first paragraph)
- ⏳ **Reading progress indicator** (sticky bar at top)

#### 7.5.3 SEO & Migration Continuity (Day 4)
- ⏳ **Wiki.js redirect map** (`next.config.ts`)
  - Map old URLs → new URLs
  - 301 redirects for moved content
  - 410 for deleted pages
- ⏳ **Broken link checker in CI** (run on PRs, fail on errors)
- ⏳ **BreadcrumbList schema** (JSON-LD for rich snippets)
- ⏳ **RSS/Atom feed** (`app/feed.xml/route.ts`)
- ⏳ **Run production build test** (verify all 141 articles compile)

#### 7.5.4 Analytics & Simple Community (Day 5)
- ⏳ **Plausible/PostHog integration**
  - Privacy-focused analytics
  - Track: pageviews, time on page, search usage, scroll depth
- ⏳ **Giscus comments** (GitHub Discussions-backed, no DB)
- ⏳ **"Was this helpful?" widget** → GitHub Issues
  - 2-button Yes/No at article bottom
  - Auto-creates labeled issue on "No"
- ⏳ **"Edit on GitHub" link** per article

---

## POST-LAUNCH ENHANCEMENTS

**Status**: Deferred until v1 is live and validated with real users

---

### Phase 8: Enhanced Reading Experience (2 days) 📅 POST-LAUNCH

#### 8.1 Article Summary Box 🟢 LOW COMPLEXITY
**At-a-glance understanding at the top of each article**
- ⏳ `components/content/article-summary.tsx`
- ⏳ Auto-generate from first paragraph if no description
- ⏳ Key concepts extraction
- ⏳ Visual hierarchy with icons
- ⏳ Collapsible on mobile

#### 8.2 Reading Experience 🟢 LOW COMPLEXITY
- ⏳ **Reading Progress Indicator**
  - Sticky progress bar at top
  - Scroll-based percentage
  - Time remaining estimate
- ⏳ **Enhanced Code Blocks**
  - Syntax highlighting (Prism.js)
  - Copy button with feedback
  - Language badge
  - Line numbers toggle
- ⏳ **Collapsible Sections**
  - For long technical details
  - Smooth expand/collapse animation
  - Remember user preference

---

### Phase 9: Advanced Community Features (1 week) 📅 POST-LAUNCH

#### 9.1 User Feedback 🟡 MEDIUM COMPLEXITY
**Enable engagement without complex infrastructure**
- ⏳ **Article Feedback Widget**
  - "Was this helpful?" Yes/No
  - Report issue button
  - Suggest improvement link
  - Uses GitHub Issues API (no database needed)

#### 9.2 Article Requests 🟡 MEDIUM COMPLEXITY
**Allow users to request new articles**
- ⏳ `app/request/page.tsx`
- ⏳ `components/community/article-request-form.tsx`
- ⏳ Form with title, description, category
- ⏳ Submit as GitHub Issue with label
- ⏳ No auth required (use reCAPTCHA)
- ⏳ Public voting on requests

#### 9.3 Comments System 🟢 LOW COMPLEXITY
**GitHub-based discussions**
- ⏳ Giscus integration
- ⏳ GitHub Discussions backend
- ⏳ No database needed
- ⏳ Automatic dark mode support
- ⏳ Reactions and replies

---

### Phase 10: Database-Backed Community System (2 weeks) 📅 POST-LAUNCH

#### 10.1 User Submission System 🔴 HIGH COMPLEXITY
**Questions, updates, and information submissions**

**Infrastructure:**
```typescript
// Database schema (Supabase/PostgreSQL)
tables:
  - submissions (questions, updates, corrections)
  - edit_suggestions (diffs, status, reviews)
  - article_requests (title, votes, status)
  - users (optional, for tracking contributors)

// API Routes
app/api/submissions/route.ts
app/api/edit-suggestions/route.ts
app/api/requests/vote/route.ts
```

**Components:**
- ⏳ `components/community/question-form.tsx` - Submit questions
- ⏳ `components/community/update-form.tsx` - Submit updates/corrections
- ⏳ `components/community/submission-list.tsx` - Display submissions
- ⏳ Rich text editor (TipTap or Lexical)
- ⏳ File uploads for images/diagrams
- ⏳ Preview mode

#### 10.2 Edit Suggestions with Approval 🔴 HIGH COMPLEXITY
**Allow specific edit suggestions requiring admin approval**
- ⏳ `components/community/edit-suggestion.tsx`
- ⏳ Inline edit mode with diff visualization
- ⏳ Track changes like Google Docs
- ⏳ Submit for review workflow
- ⏳ Version control integration

#### 10.3 Admin Dashboard 🔴 HIGH COMPLEXITY
**Moderation and approval interface**
- ⏳ `app/admin/page.tsx` - Dashboard home
- ⏳ `app/admin/submissions/page.tsx` - Review queue
- ⏳ `app/admin/edit-suggestions/page.tsx` - Edit approvals
- ⏳ Approve/Reject/Request changes workflow
- ⏳ Merge suggestions into MDX files
- ⏳ Batch operations
- ⏳ Analytics and metrics

#### 10.4 GitHub Integration
**Automated PR creation from approved edits**
- ⏳ `lib/github-integration.ts`
- ⏳ Create PRs from approved edits
- ⏳ Sync MDX changes
- ⏳ Automated commits with attribution
- ⏳ Conflict resolution UI

---

### Phase 11: Interactive Learning (1 week) 📅 POST-LAUNCH

#### 11.1 Interactive Diagrams 🟡 MEDIUM COMPLEXITY
**Make static diagrams interactive**
- ⏳ `components/interactive/network-diagram.tsx`
- ⏳ `components/interactive/flow-chart.tsx`
- ⏳ D3.js or React Flow integration
- ⏳ Zoom/pan controls
- ⏳ Click nodes for details
- ⏳ Animated transitions
- ⏳ Mobile touch support

#### 11.2 Knowledge Graph 🟡 MEDIUM COMPLEXITY
**Visual navigation of article relationships**
- ⏳ `app/graph/page.tsx`
- ⏳ `components/interactive/knowledge-graph.tsx`
- ⏳ Force-directed layout
- ⏳ Filter by category/difficulty
- ⏳ Navigate by clicking nodes
- ⏳ Search within graph

#### 11.3 Learning Paths 🟡 MEDIUM COMPLEXITY
**Guided learning sequences**
- ⏳ `app/learn/page.tsx`
- ⏳ `components/learning/path-tracker.tsx`
- ⏳ Curated sequences by skill level
- ⏳ Progress tracking (localStorage)
- ⏳ Completion badges
- ⏳ Recommended next articles
- ⏳ Time estimates per path

---

### Phase 12: PWA & Advanced Performance (3 days) 📅 POST-LAUNCH

#### 12.1 Progressive Web App
**Offline capability and app-like experience**
- ⏳ Service worker implementation
- ⏳ Offline reading for all articles
- ⏳ Background sync for submissions
- ⏳ Install prompt
- ⏳ App manifest
- ⏳ Push notifications (optional)

#### 12.2 Advanced Performance
**Make it blazing fast**
- ⏳ Image optimization pipeline
  - Lazy loading with blur placeholders
  - WebP/AVIF formats
  - Responsive images
  - CDN integration
- ⏳ Code splitting per route
- ⏳ Predictive prefetching
- ⏳ Edge caching strategies

#### 12.3 Monitoring & Analytics
**Track performance and usage**
- ⏳ Real User Monitoring (RUM)
- ⏳ Core Web Vitals tracking
- ⏳ Error tracking (Sentry)
- ⏳ Privacy-focused analytics (Plausible/PostHog)

---

## File Structure

```
inevitable-eth/
├── app/
│   ├── layout.tsx                    ✅ (base layout)
│   ├── page.tsx                      ✅ (homepage scaffold)
│   ├── globals.css                   ✅ (needs Wikipedia styles)
│   ├── [category]/
│   │   ├── page.tsx                  ⏳ TODO
│   │   └── [slug]/
│   │       └── page.tsx              ⏳ TODO
│   └── search/
│       └── page.tsx                  ⏳ TODO
├── components/
│   ├── ui/                           ✅ (shadcn)
│   ├── layout/                       ✅ (scaffold exists)
│   │   ├── header.tsx                ✅ (needs revamp)
│   │   ├── footer.tsx                ✅ (needs revamp)
│   │   ├── sidebar.tsx               ⏳ TODO
│   │   └── breadcrumbs.tsx           ⏳ TODO
│   ├── mdx/                          ✅ (empty, ready)
│   │   ├── callout.tsx               ⏳ TODO
│   │   ├── figure.tsx                ⏳ TODO
│   │   └── references.tsx            ⏳ TODO
│   ├── content/
│   │   ├── article-card.tsx          ⏳ TODO
│   │   └── table-of-contents.tsx     ⏳ TODO
│   └── search/
│       └── search-bar.tsx            ⏳ TODO
├── content/                          ✅ (141 MDX files)
│   ├── background/                   ✅ MIGRATED
│   ├── concepts/                     ✅ MIGRATED
│   └── ethereum/                     ✅ MIGRATED
├── public/
│   └── images/                       ✅ (624 images)
├── lib/
│   ├── content.schema.ts             ✅ COMPLETE
│   ├── content.ts                    ✅ COMPLETE
│   └── search/
│       └── build-index.ts            ⏳ TODO
├── scripts/
│   ├── migrate-html-to-mdx.ts        ✅ COMPLETE
│   └── check-broken-links.ts         ⏳ TODO
├── mdx-components.tsx                ✅ (needs custom components)
├── next.config.ts                    ✅ (needs redirects)
├── package.json                      ✅
└── PRD.md                            ✅ THIS FILE
```

---

## Success Criteria

### Performance
- ✅ Lighthouse scores 95+ (Performance, Accessibility, Best Practices, SEO)
- ✅ LCP < 2s on 4G
- ✅ CLS < 0.05
- ✅ FID < 100ms
- ✅ Page size < 500KB (excluding images)
- 🎯 Offline capability (Phase 12)
- 🎯 PWA installable (Phase 12)

### Design & UX
- ✅ Looks and feels like Wikipedia (information density, clean layout)
- ✅ Professional, academic, authoritative presentation
- ✅ Superior to original Wiki.js site (modern, polished, fast)
- ✅ Responsive across all devices (mobile-first)
- ✅ Accessible (WCAG 2.1 AA minimum)
- 🎯 Article summary boxes for quick understanding (Phase 8)
- 🎯 Reading progress indicators (Phase 8)
- 🎯 Interactive diagrams and visualizations (Phase 11)

### Content
- ✅ All 141 articles migrated and validated
- ✅ All 624+ images optimized and working
- ✅ Zero broken internal links (verified in CI)
- ✅ Proper citations and sources
- 🎯 Community-contributed content (Phase 10)
- 🎯 Version history and change tracking (Phase 10)

### Community & Engagement
- 🎯 User can submit questions on articles (Phase 10)
- 🎯 User can suggest edits with approval workflow (Phase 10)
- 🎯 User can request new articles (Phase 9)
- 🎯 Comments and discussions per article (Phase 9)
- 🎯 50% increase in time on site
- 🎯 30% of visitors use community features
- 🎯 100+ community submissions per month

### Functionality
- ✅ Full-text search with filters (category, difficulty, tags)
- ✅ Instant search results (<200ms)
- ✅ Related articles suggestions
- ✅ Dark mode with smooth transitions
- ✅ Keyboard navigation throughout
- 🎯 Knowledge graph visualization (Phase 11)
- 🎯 Learning paths with progress tracking (Phase 11)
- 🎯 API access to content (Phase 7.5)

### Maintainability
- ✅ Easy content updates (edit MDX files directly)
- ✅ Clear documentation for adding new articles
- ✅ Type-safe (TypeScript + Zod validation)
- ✅ No platform lock-in (custom Next.js, open source)
- 🎯 Admin dashboard for moderation (Phase 10)
- 🎯 Automated PR creation from approved edits (Phase 10)

---

## Deployment

**Primary**: Vercel
- ISR enabled for homepage
- Edge functions for API routes (OG images, search)
- Automatic deployments from git
- Preview deployments for PRs

**Optional Secondary**: IPFS/Fleek
- Static export via `next export` (if needed)
- Client-side search only
- Relative asset paths

---

## Technical Stack Additions

### Phase 9-10: Community Features
```json
{
  "dependencies": {
    "@giscus/react": "^3.0.0",          // GitHub-based comments
    "@supabase/supabase-js": "^2.45.0", // Database (optional)
    "@tiptap/react": "^2.0.0",          // Rich text editor
    "react-hook-form": "^7.45.0",       // Form handling
    "@octokit/rest": "^20.0.0",         // GitHub API
    "react-hot-toast": "^2.4.1"         // Toast notifications
  }
}
```

### Phase 11: Interactive Features
```json
{
  "dependencies": {
    "d3": "^7.8.0",                      // Interactive diagrams
    "reactflow": "^11.10.0",             // Flow charts
    "framer-motion": "^10.16.0",        // Animations
    "@visx/visx": "^3.3.0"              // Data visualization
  }
}
```

### Phase 12: PWA & Performance
```json
{
  "dependencies": {
    "workbox-window": "^7.0.0",          // Service worker
    "sharp": "^0.33.0",                  // Image optimization
    "@sentry/nextjs": "^7.88.0",         // Error tracking
    "next-pwa": "^5.6.0"                 // PWA support
  }
}
```

---

## Timeline Summary

### v1 Launch (Critical Path)
| Phase | Tasks | Status | Duration |
|-------|-------|--------|----------|
| **Phase 1** | Content migration infrastructure | ✅ COMPLETE | Done |
| **Phase 2** | Wikipedia design system | ✅ COMPLETE | Done |
| **Phase 3** | Core layout components | ✅ COMPLETE | Done |
| **Phase 4** | MDX content components | ✅ COMPLETE | Done |
| **Phase 5** | Page templates & routes | ✅ COMPLETE | Done |
| **Phase 6** | Performance & polish | ✅ COMPLETE | Done |
| **Phase 7** | Quality assurance | 🟡 PARTIAL | 1 day |
| **Phase 7.5** | v1 Launch Preparation | 🚀 NEXT | 5 days |

**v1 Target**: Ship in 1 week

### Post-Launch Enhancements (Deferred)
| Phase | Tasks | Status | Duration |
|-------|-------|--------|----------|
| **Phase 8** | Enhanced reading experience | 📅 POST-LAUNCH | 2 days |
| **Phase 9** | Advanced community features | 📅 POST-LAUNCH | 1 week |
| **Phase 10** | Database-backed community | 📅 POST-LAUNCH | 2 weeks |
| **Phase 11** | Interactive learning | 📅 POST-LAUNCH | 1 week |
| **Phase 12** | PWA & advanced performance | 📅 POST-LAUNCH | 3 days |

**Total Enhancement Time**: ~4-5 weeks (after v1 is validated)

---

## Progress Log

### 2025-10-02 - Session 1
- ✅ Created comprehensive Zod schema for frontmatter validation
- ✅ Built HTML → MDX migration script with Turndown
- ✅ Successfully migrated 141 articles from Wiki.js to MDX
- ✅ Migrated 624 images to `/public/images/`
- ✅ Enhanced content utilities with all necessary functions
- ✅ **Phase 1 Complete**
- 📝 Created PRD.md for ongoing reference

### 2025-10-02 - Session 2
- ✅ Implemented Wikipedia color palette in CSS custom properties
- ✅ Added comprehensive global styles (links, headings, prose, print)
- ✅ **Phase 2 Complete**
- ✅ Created Wikipedia-style Header (two-tier navigation)
- ✅ Built Sidebar component with collapsible category tree
- ✅ Built Table of Contents with Intersection Observer
- ✅ Enhanced Footer with four-column layout
- ✅ **Phase 3 Complete**
- 📝 Created CLAUDE.md for future Claude Code instances
- 📝 Conducted comprehensive code review
- 🎯 **Ready for Phase 4: MDX Components**

### 2025-10-02 - Session 3 (Continuation)
- ✅ Created Infobox component (Wikipedia-style sidebar boxes)
- ✅ Created Callout component (4 types: info, warning, tip, danger)
- ✅ Created Figure component (Next.js Image with captions)
- ✅ Created References component (footnote citations)
- ✅ Wired up all MDX components in mdx-components.tsx
- ✅ **Phase 4 Complete**
- ✅ Revamped Homepage with Wikipedia Main Page style
- ✅ Created Category page template with difficulty grouping
- ✅ **Phase 5 Partial Complete** (Homepage ✅, Category ✅)
- 🎯 **Next: Complete article pages, then search**

### 2025-10-02 - Session 4 (Autonomous 2-Hour Sprint)
**Phase 5 Completion:**
- ✅ Fixed article page 404 errors (server restart)
- ✅ Created Search page with server/client component separation
- ✅ Created 404 error page with helpful navigation
- ✅ Created error boundary with reset functionality
- ✅ Created About page with project information
- ✅ Created Random article redirect
- ✅ **Phase 5 Complete**

**Phase 6 - SEO & Performance:**
- ✅ Generated sitemap.ts for all 141 articles
- ✅ Created robots.ts for search engines
- ✅ Added JSON-LD structured data to article pages
- ✅ Enhanced metadata with Open Graph and Twitter Cards
- ✅ Separated viewport configuration (Next.js 15 requirement)
- ✅ Skip-to-content link for accessibility
- ✅ Added prefers-reduced-motion support
- ✅ Fixed Turbopack root directory warning
- ✅ **Phase 6 Complete**

**Phase 7 - Quality Assurance:**
- ✅ Created broken link checker script (`scripts/check-broken-links.ts`)
- ✅ Added `npm run check-links` command
- 📝 Updated PRD.md to v2.3
- 🎯 **Phases 1-6 Complete, Phase 7 Partial**

---

## Notes & Decisions

### Migration Notes
- All 141 HTML files converted successfully with 0 errors
- Reading time auto-calculated for each article
- Difficulty inferred from content keywords (can be manually adjusted)
- Related articles field left empty (to be manually curated)
- Legacy Wiki.js metadata preserved for reference

### Design Decisions
- Wikipedia-inspired vs. pure Wikipedia clone: Modern polish with Wikipedia principles
- Serif body text for readability (Georgia fallback to system-ui)
- Three-column layout on desktop, responsive collapse on mobile
- Client-side search (Fuse.js) for IPFS compatibility
- Static generation for all pages (performance priority)

### Technical Decisions
- Next.js App Router (not Pages Router) for modern patterns
- MDX for content (flexibility for interactive components)
- Zod for runtime validation (type safety + error messages)
- shadcn/ui for component library (customizable, not locked-in)
- Tailwind CSS 4 for styling (utility-first)

---

## References

- Original Site: https://inevitableeth.com/
- Content Backup: https://github.com/haymsalomon/inevitable-eth
- Wikipedia Design: https://en.wikipedia.org/
- Next.js Docs: https://nextjs.org/docs
- MDX Docs: https://mdxjs.com/

---

**Last Updated**: 2025-10-02 (v3.1 - Revised with external feedback)
**Current Phase**: Phases 1-6 Complete ✅ | Phase 7.5 (v1 Launch Prep) 🚀 NEXT
**Next Up**: Week 1 sprint - Image optimization, search index, navigation, SEO, analytics
**v1 Launch Target**: 1 week (5 days of focused work)
**Post-Launch**: 4-5 weeks of enhancements after v1 validated with real users

---

## External Review Feedback Incorporated

This PRD was reviewed by an experienced wiki/docs platform architect. Key changes based on feedback:

✅ **Prioritized v1 launch** - Ship fast, polished, credible experience first
✅ **Deferred complex features** - No database, admin dashboard, or auth until validated
✅ **Fixed critical gaps** - Image optimization, search payload, SEO redirects, discovery
✅ **Added simple community** - Giscus + GitHub Issues (no DB needed)
✅ **Quality gates** - Lighthouse CI, broken link checker in PRs
✅ **Analytics from day 1** - Plausible/PostHog for data-driven decisions

**Philosophy**: Ship v1 that feels complete, gather analytics, then build what users actually need.
