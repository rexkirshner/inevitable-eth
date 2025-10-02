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
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Migrate HTML content to MDX (one-time)
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

## 📋 Development Status

**Phase 1: Content Migration** ✅ Complete
- 141 articles migrated from Wiki.js to MDX
- 624 images migrated and optimized
- Content utilities and validation implemented

**Phase 2: Design System** ⏳ In Progress
- Wikipedia-style color palette
- Typography and layout system

**Phase 3-7**: See [PRD.md](./PRD.md) for full roadmap

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
