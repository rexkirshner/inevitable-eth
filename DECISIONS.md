# Technical Decisions & Architecture Choices

**Purpose:** Document why we made specific technical choices to inform future decisions and help new contributors understand the codebase.

**Last Updated:** 2025-10-02

---

## Table of Contents

1. [Framework & Core Stack](#framework--core-stack)
2. [Content Management](#content-management)
3. [Styling & Design](#styling--design)
4. [Performance](#performance)
5. [Deployment](#deployment)
6. [Security](#security)
7. [Search](#search)
8. [Images](#images)

---

## Framework & Core Stack

### Next.js 15 with App Router

**Decision:** Use Next.js 15 with App Router (not Pages Router)

**Why:**
- **Modern patterns:** Server Components, streaming, better data fetching
- **Performance:** Built-in optimizations (image optimization, font optimization, code splitting)
- **File-based routing:** Intuitive, scalable
- **Static generation:** Can export fully static site for Cloudflare Pages
- **Future-proof:** App Router is the current direction for Next.js

**Trade-offs:**
- ❌ Learning curve for new patterns (Server vs Client Components)
- ❌ Some third-party libraries not yet compatible
- ✅ Better performance and DX long-term

**Alternatives considered:**
- Astro: Great for content sites, but less flexible for future interactive features
- Gatsby: Outdated, slower build times
- Plain React + Vite: More setup, lose Next.js optimizations

---

### TypeScript

**Decision:** Use TypeScript throughout

**Why:**
- Type safety prevents runtime errors
- Better IDE autocomplete and refactoring
- Self-documenting code via types
- Catches bugs at compile time

**Trade-offs:**
- ✅ Minimal overhead with modern tooling
- ✅ Worth it for project of this complexity

---

### Turbopack

**Decision:** Use Turbopack for both dev and build

**Why:**
- Significantly faster than Webpack
- Native Next.js 15 support
- Better HMR (Hot Module Replacement)
- Future default for Next.js

**Trade-offs:**
- Still beta, but stable enough for this use case
- Some edge cases may need fallback to Webpack

**Configuration:**
```typescript
// next.config.ts
experimental: {
  turbo: {
    root: __dirname, // Fixed directory warning
  },
}
```

---

## Content Management

### MDX Files (Not CMS)

**Decision:** Store content as MDX files in `content/` directory, not in a CMS

**Why:**
- **Version control:** All content in git, easy to track changes
- **No database:** Simpler deployment, no backend needed
- **Developer-friendly:** Write in Markdown, use React components when needed
- **Flexibility:** Can use custom components (Infobox, Callout, etc.)
- **Portability:** Easy to migrate, export, backup

**Trade-offs:**
- ❌ Non-technical contributors need git knowledge
- ❌ No admin UI (but can add later if needed)
- ✅ Perfect for technical content with developer contributors
- ✅ No CMS hosting costs or complexity

**Alternatives considered:**
- Contentful/Sanity: Overkill, vendor lock-in, costs money
- Notion API: Not designed for this, rate limits
- Keep Wiki.js: Original problem - wanted to move away from platform dependency

---

### Zod for Frontmatter Validation

**Decision:** Use Zod schema validation for all frontmatter

**Why:**
- **Runtime validation:** Catches errors before they reach production
- **Type inference:** TypeScript types generated from schema
- **Clear errors:** Descriptive messages when validation fails
- **Single source of truth:** Schema defines both runtime and compile-time types

**Schema location:** `lib/content.schema.ts`

**Example:**
```typescript
const articleSchema = z.object({
  title: z.string(),
  description: z.string().min(10),
  category: z.enum(['background', 'concepts', 'ethereum']),
  // ... etc
});
```

**Trade-offs:**
- ✅ Small runtime cost (milliseconds) worth it for safety
- ✅ Prevents broken content from reaching users

---

### Gray-matter for Frontmatter Parsing

**Decision:** Use gray-matter to parse YAML frontmatter

**Why:**
- Industry standard for MDX/Markdown frontmatter
- Simple, reliable, well-maintained
- Works perfectly with Zod validation

**Alternatives:**
- None considered - gray-matter is the de facto solution

---

## Styling & Design

### Tailwind CSS 4

**Decision:** Use Tailwind CSS for styling (not CSS Modules, not CSS-in-JS)

**Why:**
- **Rapid development:** Utility classes speed up UI work
- **Consistency:** Design system enforced via config
- **Performance:** Purges unused CSS automatically
- **Maintainability:** Easier to understand than scattered CSS files
- **Dark mode:** Built-in support with class strategy

**Trade-offs:**
- ❌ HTML can look verbose
- ✅ Faster development, easier to maintain

**Configuration:**
- CSS variables for colors (`var(--background)`, `var(--text)`, etc.)
- System font stacks for performance
- Custom prose styles for article content

---

### Wikipedia Design Philosophy

**Decision:** Use Wikipedia-inspired design (not original inevitableeth.com design)

**Why:**
- **Information density:** Maximize content visibility
- **Credibility:** Academic, professional appearance
- **Accessibility:** Proven patterns for readability
- **Timeless:** Won't look dated in 5 years
- **Familiar:** Users already know how to navigate Wikipedia-style sites

**Key principles:**
1. Typography-first design
2. Functional minimalism
3. Generous whitespace
4. Clear hierarchy
5. No visual gimmicks

**Trade-offs:**
- ❌ Less "flashy" than modern marketing sites
- ✅ Perfect for educational content
- ✅ Stands out by NOT following trends

---

### No Component Library (Except shadcn/ui)

**Decision:** Build custom components, use shadcn/ui only for primitives

**Why:**
- **Full control:** No fighting library defaults
- **Performance:** No unused component library code
- **Learning:** Better understanding of React patterns
- **Customization:** Easy to modify for Wikipedia style

**shadcn/ui usage:**
- Only using primitive utilities (cn helper, etc.)
- Not using full component library
- Copy components only when needed

---

## Performance

### Static Site Generation (SSG)

**Decision:** Pre-render all pages at build time (not SSR or ISR)

**Why:**
- **Performance:** Fastest possible - just serving static HTML
- **Reliability:** No server runtime errors
- **Cost:** Free hosting on Cloudflare Pages
- **Security:** No server to attack
- **Scalability:** CDN handles any traffic spike

**Trade-offs:**
- ❌ Must rebuild to update content (acceptable for infrequent updates)
- ✅ Perfect for content that doesn't change hourly

**Build result:**
- 153 static HTML pages
- All generated at build time
- No runtime rendering

---

### Image Optimization Strategy

**Decision:** Pre-optimize all images with Sharp, serve via responsive `<picture>` tags

**Why:**
- **Performance:** LCP improved 90% (27.3s → 2.6s)
- **Browser support:** WebP with AVIF fallback
- **Responsive:** 3 sizes (mobile 640w, tablet 1024w, desktop 1920w)
- **Quality:** 85% quality strikes perfect balance

**Process:**
```bash
npm run optimize-images
# Generates 6 files per image:
# - mobile.webp, mobile.avif
# - tablet.webp, tablet.avif
# - desktop.webp, desktop.avif
```

**Trade-offs:**
- ❌ ~3,000 optimized files for 498 source images
- ❌ Takes several minutes to run
- ✅ Only runs when images change
- ✅ Massive performance win

**Why not Next/Image?**
- Next/Image requires server runtime (incompatible with static export)
- Our approach generates static files at build time
- Works perfectly with Cloudflare Pages

---

### Module-Level Caching

**Decision:** Cache `buildContentTree()` and `getAllContent()` results

**Why:**
- **Performance:** Build content tree once per server instance
- **Simplicity:** No Redis or external cache needed
- **Effective:** Content doesn't change between requests

**Implementation:**
```typescript
// lib/content.ts
let cachedTree: ContentTree | null = null;

export function buildContentTree(): ContentTree {
  if (cachedTree) return cachedTree;
  cachedTree = /* build tree */;
  return cachedTree;
}
```

**Trade-offs:**
- ✅ No complexity, big performance win
- ✅ Perfect for static content

---

### Dynamic Imports for Client Components

**Decision:** Lazy load TableOfContents and SearchClient

**Why:**
- **Performance:** Reduce initial JavaScript bundle
- **Code splitting:** Only load when needed
- **Better metrics:** Improves FCP, LCP

**Implementation:**
```typescript
const TableOfContents = dynamic(() => import('@/components/layout/table-of-contents'), {
  loading: () => <div>Loading TOC...</div>
});
```

**Trade-offs:**
- ✅ Minimal complexity, clear performance win

---

## Deployment

### Dual Config Strategy (Dev vs Production)

**Decision:** Separate `next.config.ts` (dev) and `next.config.cloudflare.ts` (production)

**Why:**
- **Dev mode:** Needs dynamic features, image optimization, headers function
- **Production:** Needs static export (`output: 'export'`)
- **Incompatible:** Can't use both in same config

**Solution:**
```json
// package.json
"build:cloudflare": "cp next.config.cloudflare.ts next.config.ts && npm run build && git checkout next.config.ts"
```

**Why not environment variables?**
- `output: 'export'` breaks dev mode completely
- Temporary swap is cleanest solution
- Auto-reverts via git checkout

**Trade-offs:**
- ❌ Slightly hacky
- ✅ Works reliably, simple to understand
- ✅ Maintains separate configs for clarity

**Alternatives considered:**
- Single config with env vars: Doesn't work, `output: 'export'` breaks dev
- Build script that modifies config: More complex, harder to debug

---

### Cloudflare Pages (Primary Deployment)

**Decision:** Deploy to Cloudflare Pages (not Vercel)

**Why:**
- **Cost:** Free tier more generous (unlimited bandwidth)
- **Performance:** Excellent global CDN
- **Static export:** Perfect fit for our use case
- **Headers:** `_headers` file for CSP headers
- **Simplicity:** Just upload `out/` directory

**Trade-offs:**
- ❌ Lose some Next.js features (Image Optimization API, Middleware)
- ✅ Don't need those features, static is perfect

**Why not Vercel?**
- Vercel is great, but costs more at scale
- We don't need server runtime
- Cloudflare's free tier better for open source project

---

### Security Headers via `_headers` File

**Decision:** Use Cloudflare `_headers` file instead of next.config.ts headers

**Why:**
- **Static export:** `async headers()` doesn't work with `output: 'export'`
- **Cloudflare native:** `_headers` is Cloudflare Pages standard
- **Simplicity:** Plain text file, easy to understand

**Content:**
```
/*
  Content-Security-Policy: ...
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  ...
```

**Trade-offs:**
- ✅ Works perfectly, no complexity

---

## Security

### DOMPurify for XSS Protection

**Decision:** Sanitize all markdown-rendered HTML with DOMPurify

**Why:**
- **Defense in depth:** Even though content is trusted, sanitize anyway
- **Future-proof:** Safe if user submissions added later
- **Industry standard:** DOMPurify is the gold standard
- **Whitelist approach:** Only allow safe tags/attributes

**Implementation:**
```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'code', 'pre', ...],
    ALLOWED_ATTR: ['href', 'class', 'id', ...],
  });
}
```

**Trade-offs:**
- Small runtime cost (milliseconds)
- Worth it for security guarantee

---

### Content Security Policy (CSP)

**Decision:** Strict CSP headers on all pages

**Why:**
- **XSS prevention:** Blocks inline scripts, eval, unsafe-eval
- **Defense in depth:** Multiple layers of protection
- **Best practice:** Expected for modern web apps

**Configuration:**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
```

**Trade-offs:**
- `unsafe-inline` needed for Tailwind and Next.js
- Still provides significant protection

---

## Search

### Client-Side Search with Fuse.js

**Decision:** Use Fuse.js for client-side fuzzy search (not server-side)

**Why:**
- **Static export:** No server to run search queries
- **Performance:** Instant results, no network latency
- **Fuzzy matching:** Better UX than exact match
- **Offline:** Works without server
- **Simple:** No search infrastructure needed

**Process:**
1. Build search index at build time (`npm run build-search-index`)
2. Output to `public/search-index.json` (52.36 KB)
3. Load index client-side on search page
4. Fuse.js handles fuzzy matching

**Trade-offs:**
- ❌ Index size grows with content (52KB currently, manageable)
- ✅ Perfect for 141 articles
- ✅ No backend needed

**Alternatives considered:**
- Algolia: Overkill, costs money, vendor lock-in
- Elasticsearch: Way overkill, need server
- Server-side search: Incompatible with static export

**When to reconsider:**
- If search index exceeds 500KB
- If content grows beyond 500 articles
- If need advanced features (faceted search, analytics)

---

### Search Debouncing (300ms)

**Decision:** Debounce search input to prevent excessive re-renders

**Why:**
- **Performance:** Don't re-run search on every keystroke
- **UX:** Smoother experience
- **Battery:** Less CPU usage on mobile

**Implementation:**
```typescript
const [debouncedQuery] = useDebounce(searchQuery, 300);
```

**Trade-offs:**
- ✅ No downside, clear win

---

## Images

### Custom marked.js Renderer (Not rehype-remark)

**Decision:** Use custom marked.js renderer for images (not rehype plugin)

**Why:**
- **Control:** Full control over `<picture>` tag generation
- **Simplicity:** Direct manipulation easier than rehype AST
- **Performance:** No extra parsing steps
- **Maintenance:** Easier to understand and modify

**Implementation:**
```typescript
// lib/mdx.ts
renderer.image = (href, title, text) => {
  return `
    <picture>
      <source srcset="${mobile}.avif" media="(max-width: 640px)" type="image/avif">
      <source srcset="${mobile}.webp" media="(max-width: 640px)" type="image/webp">
      <source srcset="${tablet}.avif" media="(max-width: 1024px)" type="image/avif">
      <source srcset="${tablet}.webp" media="(max-width: 1024px)" type="image/webp">
      <source srcset="${desktop}.avif" type="image/avif">
      <source srcset="${desktop}.webp" type="image/webp">
      <img src="${desktop}.webp" alt="${text}" loading="lazy" />
    </picture>
  `;
};
```

**Trade-offs:**
- ✅ Works perfectly
- ✅ Easy to debug and maintain

**Alternatives considered:**
- rehype-image-size: Doesn't generate responsive images
- next/image: Incompatible with static export
- Manual `<picture>` tags in MDX: Repetitive, error-prone

---

### OG Images via Metadata

**Decision:** Extract first image from article for OG metadata (not dynamic generation)

**Why:**
- **Simplicity:** No OG image generation API needed
- **Static export:** Works with fully static site
- **Relevant:** First image usually represents article well
- **Fast:** No runtime generation

**Implementation:**
```typescript
// lib/og-image.ts
export function extractFirstImage(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}
```

**Trade-offs:**
- ❌ Can't customize OG image layout/styling
- ✅ Simple, reliable, works great for articles
- ✅ Fallback to default banner for pages without images

**Alternatives considered:**
- @vercel/og: Requires server runtime, can't use with static export
- Cloudflare Workers: Additional complexity, not needed
- Pre-generated OG images: Manual work, hard to maintain

---

## Future Decisions

### When to Add Database

**Criteria for adding Supabase/PostgreSQL:**
1. User submissions exceed 50/week
2. Community requests edit suggestions feature
3. Admin moderation becomes necessary
4. Analytics show need for user accounts

**Until then:** Keep it simple, static, database-free

---

### When to Add Server Runtime

**Criteria for moving to SSR/ISR:**
1. Content updates need to be live within minutes (not currently true)
2. Personalization features requested (user-specific views)
3. Real-time features needed (live comments, notifications)
4. Server-side search becomes necessary (>500 articles)

**Until then:** Static export is perfect

---

## Decision Review Process

**When reconsidering decisions:**
1. Has context changed? (traffic, content volume, team size)
2. Do benefits outweigh migration costs?
3. Is there clear user/business value?
4. Can we A/B test or pilot first?

**Documentation:**
- Update this file when decisions change
- Include reasoning for change
- Link to relevant PRs/issues

---

## Related Documentation

- **CLAUDE.md** - Developer guide
- **PRD.md** - Product requirements
- **tasks/next-steps.md** - Immediate actions
- **KNOWN_ISSUES.md** - Current limitations
