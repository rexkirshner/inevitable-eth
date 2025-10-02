# InevitableETH.com Complete Rebuild - Product Requirements Document

**Version:** 2.0
**Date:** 2025-10-02
**Status:** In Progress - Phase 1 Complete ✅

---

## Executive Summary

Migrate inevitableeth.com from Wiki.js to a custom-built Next.js application with Wikipedia-inspired design. Transform 141 educational articles about Ethereum, finance history, and cryptography into a performant, flexible, and visually stunning knowledge base.

**Current State**: https://inevitableeth.com/ (Wiki.js platform, dated design, performance limitations)
**Content Backup**: https://github.com/haymsalomon/inevitable-eth (141 HTML files, 600+ images)
**Goal**: Modern, performant, flexible, easy-to-update, design-forward educational platform

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

### Phase 2: Wikipedia-Style Design System (NEXT UP)

#### 2.1 Tailwind Configuration ⏳
Update `tailwind.config.js` with Wikipedia-inspired palette

#### 2.2 Global Styles ⏳
Update `/app/globals.css`:
- Wikipedia-style link underlines (show on hover)
- Heading styles (h2 with bottom border like Wikipedia)
- Code block styling
- Print CSS (for "Printable version" link)
- Focus states for accessibility

#### 2.3 Font Configuration ⏳
Update `/app/layout.tsx`:
- Keep Geist Sans for headings and UI
- Add Georgia or system-ui serif for body text
- Preload critical fonts, subset to Latin

---

### Phase 3: Core Layout Components

#### 3.1 Header (Revamp existing) ⏳
Wikipedia-style: Minimal, functional, search-prominent

#### 3.2 Sidebar Navigation (New) ⏳
Sticky left sidebar with collapsible category tree

#### 3.3 Table of Contents (Right Sidebar) ⏳
Wikipedia-style sticky TOC with scroll-spy

#### 3.4 Footer (Enhance existing) ⏳
Minimal, Wikipedia-style

---

### Phase 4: MDX Content Components

#### 4.1 Infobox ⏳
Wikipedia's signature feature - right-aligned box with key facts

#### 4.2 Callout ⏳
Note/Warning/Tip boxes (Wikipedia-style colored note boxes)

#### 4.3 Figure ⏳
Centered image with border and caption

#### 4.4 References ⏳
Footnote-style citations at article end

#### 4.5 Additional Components ⏳
- Definition (bold term with hover tooltip)
- Equation (math formula wrapper)
- Quote (styled blockquote)
- Badge (difficulty/category tags)

---

### Phase 5: Pages & Routes

#### 5.1 Homepage (Revamp) ⏳
Wikipedia Main Page inspired

#### 5.2 Category Pages ⏳
`/app/[category]/page.tsx`

#### 5.3 Article Pages ⏳
`/app/[category]/[slug]/page.tsx` - Full three-column layout

#### 5.4 Search Page ⏳
`/app/search/page.tsx`

#### 5.5 Error Pages ⏳
- Custom 404
- Error boundary

---

### Phase 6: Performance & Polish

#### 6.1 Performance Optimizations ⏳
- Static generation for all pages
- Image optimization
- Font optimization
- Code splitting
- Route prefetching

#### 6.2 SEO & Metadata ⏳
- Sitemap.xml + RSS feed
- Open Graph images
- JSON-LD structured data
- Meta descriptions

#### 6.3 Accessibility ⏳
- Semantic HTML
- Keyboard navigation
- ARIA labels
- Color contrast testing
- prefers-reduced-motion support

---

### Phase 7: Quality Assurance

#### 7.1 Content QA ⏳
- Broken link checker CI script
- Verify all internal links
- Redirects from old Wiki.js URLs
- Image reference validation

#### 7.2 Testing ⏳
- Lighthouse scores (Performance, A11y, SEO, Best Practices)
- Mobile responsiveness
- Cross-browser testing
- Search functionality
- Theme switching

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

### Design & UX
- ✅ Looks and feels like Wikipedia (information density, clean layout)
- ✅ Professional, academic, authoritative presentation
- ✅ Superior to original Wiki.js site (modern, polished, fast)
- ✅ Responsive across all devices (mobile-first)
- ✅ Accessible (WCAG 2.1 AA minimum)

### Content
- ✅ All 141 articles migrated and validated
- ✅ All 624+ images optimized and working
- ✅ Zero broken internal links (verified in CI)
- ✅ Proper citations and sources

### Functionality
- ✅ Full-text search with filters (category, difficulty, tags)
- ✅ Instant search results (<200ms)
- ✅ Related articles suggestions
- ✅ Dark mode with smooth transitions
- ✅ Keyboard navigation throughout

### Maintainability
- ✅ Easy content updates (edit MDX files directly)
- ✅ Clear documentation for adding new articles
- ✅ Type-safe (TypeScript + Zod validation)
- ✅ No platform lock-in (custom Next.js, open source)

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

## Timeline Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| **Phase 1** | Content migration infrastructure | ✅ COMPLETE |
| **Phase 2** | Wikipedia design system | ⏳ NEXT UP |
| **Phase 3** | Core layout components | ⏳ PENDING |
| **Phase 4** | MDX content components | ⏳ PENDING |
| **Phase 5** | Page templates & routes | ⏳ PENDING |
| **Phase 6** | Performance & polish | ⏳ PENDING |
| **Phase 7** | Quality assurance | ⏳ PENDING |

**Estimated Total**: 6-7 days for complete rebuild

---

## Progress Log

### 2025-10-02
- ✅ Created comprehensive Zod schema for frontmatter validation
- ✅ Built HTML → MDX migration script with Turndown
- ✅ Successfully migrated 141 articles from Wiki.js to MDX
- ✅ Migrated 624 images to `/public/images/`
- ✅ Enhanced content utilities with all necessary functions
- ✅ **Phase 1 Complete**
- 📝 Created PRD.md for ongoing reference

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

**Last Updated**: 2025-10-02
**Current Phase**: Phase 2 - Wikipedia Design System
**Next Milestone**: Tailwind config + global CSS
