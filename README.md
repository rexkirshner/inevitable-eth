# Inevitable Ethereum

A comprehensive educational resource about Ethereum, finance history, and cryptography. Built with Next.js, MDX, and Wikipedia-inspired design principles.

**Original Site**: [inevitableeth.com](https://inevitableeth.com/) (Wiki.js)
**New Site**: Modern, performant, Wikipedia-style rebuild

---

## 📚 About

This project is dedicated to Ethereum, the World Computer. It contains 141+ educational articles covering:

- **Background**: Finance history (1492-2008), mass communication, economic context
- **Concepts**: Computer science, cryptography, cryptocurrency, finance, mathematics
- **Ethereum**: Core concepts, consensus, scaling, DeFi, and the future

All content is original, created to help people understand why Ethereum is inevitable.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rexkirshner/inevitable-eth.git
cd inevitable-eth

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

```bash
npm run dev                 # Start development server with Turbopack
npm run build               # Build for production with Turbopack
npm run build:cloudflare    # Build for Cloudflare Pages (static export)
npm run start               # Start production server
npm run lint                # Run ESLint

# Content & Scripts
npm run migrate             # Migrate HTML content to MDX (one-time, complete)
npm run check-links         # Check for broken internal links
npm run optimize-images     # Optimize all images (Sharp + WebP/AVIF)
npm run validate-images     # Validate image references and variants
npm run build-search-index  # Build optimized search index (auto-runs in prebuild)
```

---

## 🏗️ Project Structure

```
inevitable-eth/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── layout/            # Header, Footer, Sidebar
│   ├── mdx/               # MDX custom components
│   └── ui/                # shadcn/ui components
├── content/               # MDX articles (141 files)
│   ├── background/        # Finance history & context
│   ├── concepts/          # Technical foundations
│   └── ethereum/          # Ethereum-specific content
├── lib/                   # Utilities
│   ├── content.ts         # Content loading & utilities
│   └── content.schema.ts  # Zod validation schemas
├── public/
│   └── images/            # 624+ images
├── scripts/
│   └── migrate-html-to-mdx.ts  # Migration script
└── PRD.md                 # Product Requirements Document
```

---

## 🎨 Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Content**: MDX with gray-matter
- **Validation**: Zod
- **Search**: Fuse.js (client-side)
- **Math**: rehype-katex
- **Theme**: next-themes (dark mode)

---

## 📖 Content Management

### Adding a New Article

1. Create a new `.mdx` file in the appropriate category folder:
   - `content/background/` - Historical and economic context
   - `content/concepts/` - Technical foundations
   - `content/ethereum/` - Ethereum-specific topics

2. Add frontmatter (see schema in `lib/content.schema.ts`):

```mdx
---
title: "Article Title"
description: "Brief description for SEO and previews"
category: "concepts"
tags: ["tag1", "tag2"]
difficulty: "intermediate"
updated: "2025-10-02"
readingTime: 5
toc: true
related: ["related-article-slug"]
---

# Article Title

Your content here...
```

3. The article will automatically appear in navigation and search.

### Frontmatter Schema

- `title` (required): Article title
- `description` (required): SEO description
- `category` (required): "background" | "concepts" | "ethereum"
- `tags` (array): Tags for search and filtering
- `difficulty`: "intro" | "intermediate" | "advanced"
- `updated` (required): ISO date (YYYY-MM-DD)
- `readingTime`: Estimated minutes (auto-calculated if omitted)
- `related` (array): Slugs of related articles
- `hero` (optional): Path to hero image
- `infobox` (optional): Key-value pairs for sidebar infobox
- `toc` (boolean): Show table of contents (default: true)

---

## 🔒 Environment Variables

Create a `.env.local` file for local development (ignored by git):

```bash
# Copy from .env.example
cp .env.example .env.local
```

Add any API keys or secrets to `.env.local` (never commit this file).

---

## 🎯 Design Philosophy

Wikipedia-inspired information density with modern aesthetics:

- **Information-first**: Maximize content, minimize chrome
- **Typography**: Serif body text, sans-serif headings
- **Layout**: Three-column on desktop (nav, content, TOC)
- **Accessibility**: Semantic HTML, keyboard navigation, WCAG AA
- **Performance**: Static generation, optimized images, <2s load times

---

## 🚢 Deployment

**Recommended**: Deploy to Vercel for automatic builds and preview deployments.

```bash
# Deploy to production
vercel --prod
```

**Alternative**: Static export for IPFS or other static hosts.

```bash
npm run build
npm run export
```

---

## ✨ Features

### Navigation & Discovery
- **Smart Sidebar**: Collapsible category tree with article counts and active state tracking
- **Table of Contents**: Auto-generated with Intersection Observer and smooth scroll
- **Breadcrumbs**: Wikipedia-style navigation with rich snippet support (BreadcrumbList JSON-LD)
- **Prev/Next Navigation**: Sequential article browsing
- **Related Articles**: Tag-based recommendations (3 per article)
- **Search**: Client-side fuzzy search with Fuse.js
- **Random Article**: Serendipitous discovery at `/random`

### Content & Reading Experience
- **Enhanced Code Blocks**: Copy button, language badges, syntax highlighting
- **Keyboard Shortcuts**: Power user navigation (/, ?, n, p, r, Esc)
- **Reading Progress**: Scroll-based indicator with smooth animation
- **Article Summaries**: Info boxes with descriptions
- **Font Size Adjuster**: 3 sizes with localStorage persistence for accessibility
- **Article Bookmarking**: Save articles for later with localStorage
- **Share Button**: Web Share API with copy fallback
- **Scroll-to-Top**: Appears after scrolling 400px

### Content Types
- **Infoboxes**: Wikipedia-style sidebar boxes
- **Callouts**: Warning, info, tip boxes
- **Figures**: Images with captions
- **References**: Footnote/citation system
- **Mathematical Notation**: KaTeX support
- **Responsive Images**: 6 variants per image (mobile/tablet/desktop × WebP/AVIF)

### SEO & Performance
- **Static Generation**: All 154 pages pre-rendered at build time
- **Image Optimization**: Sharp-powered responsive images with blur placeholders
- **RSS Feed**: All 141 articles with 1-hour ISR caching
- **Open Graph**: Social media preview images for all pages
- **JSON-LD**: Structured data for articles and breadcrumbs
- **Lighthouse Scores**: 93-98 Performance, 96+ Accessibility, 100 SEO
- **LCP**: 2.6s (90% improvement from 27.3s)

### Accessibility
- **Dark Mode**: Light/dark theme with system preference detection
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Keyboard Navigation**: Full keyboard support throughout
- **Skip to Content**: Accessibility link for screen readers
- **Focus Management**: Proper focus indicators and tab order
- **WCAG AA Compliant**: All interactive elements accessible

### Developer Experience
- **TypeScript**: Full type safety with Zod runtime validation
- **MDX**: Flexible content with React component support
- **Hot Reload**: Turbopack-powered instant updates
- **Image Validation**: Script to check missing/broken images
- **Link Checker**: CI-ready broken link detection
- **Environment Variables**: Configurable GitHub URLs and site settings
- **Cloudflare Ready**: Static export for Cloudflare Pages

---

## 📋 Development Status

**Status**: ✅ Production Ready v1 (Phases 1-8 Complete + Session 8 Polish)

**Phase 1-8** ✅ Complete
- ✅ Content migration (141 articles, 624+ images)
- ✅ Design system (Wikipedia-inspired, light/dark mode)
- ✅ Layout components (Header, Sidebar, TOC, Footer)
- ✅ MDX components (Infobox, Callout, Figure, References, Code Blocks)
- ✅ Page templates (Home, Category, Article, Search, About, Random, 404, Error)
- ✅ Performance & SEO (Sitemap, Robots, JSON-LD, OG images, CSP headers)
- ✅ QA & Optimization (Link checker, security hardening, Lighthouse 93-98/100)
- ✅ Cloudflare deployment ready

**Session 7 (8 Features)** ✅ Complete
- Breadcrumbs, Prev/Next navigation, Related articles, Article summaries
- Reading progress, BreadcrumbList JSON-LD, RSS feed, Edit on GitHub links

**Session 8 (12 Features)** ✅ Complete
- Mobile menu, Enhanced code blocks (copy button), Keyboard shortcuts
- Share button, Font size adjuster, Article bookmarking, Scroll-to-top
- Image validation script, GitHub URLs to env vars, RSS ISR optimization

**Current State**:
- 154 static pages generated
- 498 images optimized (6 variants each: mobile/tablet/desktop × WebP/AVIF)
- Comprehensive code review: A- overall
- Roadmap brainstormed: 40+ future features

**Next**: Phase 9+ (Enhanced Discovery, Learning Tools, Community, Content Enhancement) - See [roadmap-brainstorm.md](./tasks/roadmap-brainstorm.md)

**Full Roadmap**: See [PRD.md](./PRD.md) for complete product requirements

---

## 🤝 Contributing

This is a personal educational project. If you find errors or have suggestions:

1. Open an issue
2. Submit a pull request
3. Reach out directly

---

## 📄 License

All content is original and created by the repository owner. Code is open source.

---

## 🔗 Links

- **Original Site**: [inevitableeth.com](https://inevitableeth.com/)
- **Content Backup**: [github.com/haymsalomon/inevitable-eth](https://github.com/haymsalomon/inevitable-eth)
- **Next.js**: [nextjs.org](https://nextjs.org/)
- **MDX**: [mdxjs.com](https://mdxjs.com/)

---

**Built with ❤️ for the Ethereum community**
