# SEO Audit Report - Inevitable Ethereum

## 1. Header

| Field | Value |
|-------|-------|
| **Date** | 2025-12-19 |
| **Repo** | inevitable-eth |
| **Framework** | Next.js 15.5.9 (App Router) with static export |
| **Hosting** | Cloudflare Pages (inferred from `next.config.ts`) |
| **Domain** | https://inevitableeth.com |
| **Content Type** | MDX-based educational articles (143 articles) |
| **Environments** | Production (inevitableeth.com), Legacy (old.inevitableeth.com) |

### Assumptions / Unknowns

1. **Assumption:** Production site is live at inevitableeth.com with HTTPS enabled
2. **Assumption:** Cloudflare handles www/non-www and HTTP/HTTPS redirects at edge
3. **Unknown:** Whether Google Search Console is configured and verified
4. **Unknown:** Current indexation status and any manual actions
5. **Unknown:** Actual Core Web Vitals field data (would require PageSpeed Insights API)
6. **Unknown:** Whether there are 301 redirects from old.inevitableeth.com paths to new site
7. **Assumption:** No staging/preview URLs are accidentally indexed (Cloudflare Pages previews)

---

## 1.1 Fixes Applied (2025-12-19)

| Priority | Issue | Status | Commit |
|----------|-------|--------|--------|
| **P0** | Tag pages missing canonical | ✅ Fixed | `dd8a563` |
| **P0** | Search canonical trailing slash | ✅ Fixed | `c2d5e80` |
| **P1** | Sitemap missing /visualize, /request | ✅ Fixed | `87e48b7` |
| **P1** | RSS autodiscovery missing | ✅ Fixed | `ba6fb4a` |
| **P1** | Sitemap lastmod accuracy | ✅ Fixed | `87e48b7` |
| **P2** | Anchor text optimization | ✅ Fixed | `e54a828` |
| **P2** | Image alt text validation | ✅ Script created | `5d322b2` |
| **P3** | Cloudflare preview indexation | ✅ Documented | `eab69bc` |

**Summary of Changes:**
- `app/tags/[tag]/page.tsx`: Added `alternates.canonical` with URL-encoded tag
- `app/search/page.tsx`: Changed canonical from `/search/` to `/search`
- `app/sitemap.ts`: Added /visualize and /request; reorganized into dynamicPages (with lastModified) and staticPages (without lastModified)
- `app/layout.tsx`: Added `<link rel="alternate" type="application/rss+xml">` for RSS autodiscovery
- `app/page.tsx`: Replaced generic "Read more" and "View all" with descriptive anchor text
- `public/_headers`: Added documentation for Cloudflare preview noindex configuration; updated CSP for Google Analytics
- `scripts/check-image-alt.ts`: New validation script to detect empty alt text (found 556 images in 135 files)

---

## 2. Executive Summary

The Inevitable Ethereum site has a **strong SEO foundation** with several best practices already implemented. However, there are **7-10 high-leverage opportunities** to improve organic search performance:

1. **Missing canonical tags on tag pages** - `/tags/[tag]` pages lack canonical URLs, risking duplicate content issues with URL-encoded variations
2. **Incomplete Open Graph images** - Tag pages and some dynamic routes use fallback images instead of topic-specific previews
3. **Search page canonical has trailing slash inconsistency** - `/search/` vs `/search` creates potential duplicate signals
4. **Missing FAQ/HowTo schema on educational content** - Articles could benefit from FAQ structured data for rich snippets
5. **No image alt text validation** - MDX content relies on author-provided alt text with no enforcement
6. **Visualize and Request pages missing from sitemap** - Two utility pages are not included in sitemap.xml
7. **Tag page URLs use encoded characters** - Tags like "proof-of-stake" work fine, but multi-word tags create ugly URLs
8. **Missing lastmod accuracy** - Sitemap uses `new Date()` for non-article pages instead of actual last modification
9. **No explicit pagination handling** - Category pages show all articles; if pagination is added, SEO considerations needed
10. **RSS feed not linked in HTML head** - Feed exists at `/feed.xml` but no `<link rel="alternate">` autodiscovery

**Overall Assessment:** The site is well-optimized for its size. The Next.js App Router metadata API is used correctly, JSON-LD structured data is comprehensive, and the sitemap/robots setup is solid. Fixing the identified gaps should improve crawlability and rich snippet eligibility.

---

## 3. Audit Method

### Route Discovery

Routes were discovered by:
1. **Scanning `app/` directory** for `page.tsx` files (Next.js App Router convention)
2. **Analyzing `generateStaticParams()`** functions to identify dynamic route patterns
3. **Reading `app/sitemap.ts`** to understand programmatic route generation
4. **Counting MDX files** in `content/` directory (143 articles)
5. **Reviewing `lib/content.ts`** for category/tag extraction logic

### Files Inspected

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root metadata, JSON-LD schemas (WebSite, Organization, Person) |
| `app/page.tsx` | Homepage metadata, Open Graph |
| `app/[category]/page.tsx` | Category page metadata |
| `app/[category]/[slug]/page.tsx` | Article metadata, Article + BreadcrumbList JSON-LD |
| `app/tags/page.tsx` | Tags index metadata |
| `app/tags/[tag]/page.tsx` | Tag page metadata |
| `app/search/page.tsx` | Search page metadata |
| `app/about/page.tsx` | About page metadata |
| `app/robots.ts` | Robots.txt generation |
| `app/sitemap.ts` | Sitemap.xml generation |
| `app/feed.xml/route.ts` | RSS feed generation |
| `app/not-found.tsx` | 404 page behavior |
| `next.config.ts` | Static export configuration |
| `public/_headers` | Security headers for Cloudflare |
| `lib/content.schema.ts` | Frontmatter validation schema |
| `content/ethereum/world-computer.mdx` | Sample content structure |

### Tools/Commands (Not Run)

The following could be run for deeper analysis:
- `npx lighthouse https://inevitableeth.com --output=json` - Core Web Vitals
- `curl -I https://inevitableeth.com` - Header inspection
- Google Search Console - Indexation status, coverage errors
- Screaming Frog / Sitebulb - Full crawl analysis

---

## 4. Findings (Prioritized)

| Priority | Opportunity | Impact | Evidence | Recommendation | Effort | Risk | Status |
|----------|-------------|--------|----------|----------------|--------|------|--------|
| **P0** | Tag pages missing canonical | High - Duplicate content risk with URL encoding | `app/tags/[tag]/page.tsx` has no `alternates.canonical` | Add canonical tag with normalized URL | S | Low | ✅ Fixed |
| **P0** | Search canonical trailing slash | Med - Conflicting signals | `/search/` in metadata vs `/search` in links | Standardize to `/search` (no trailing slash) | S | Low | ✅ Fixed |
| **P1** | Sitemap missing pages | Med - Pages not discovered | `/visualize`, `/request`, `/random` not in sitemap | Add to static pages array in `sitemap.ts` | S | Low | ✅ Fixed |
| **P1** | RSS autodiscovery missing | Med - Feed not discoverable | No `<link rel="alternate" type="application/rss+xml">` in head | Add to `app/layout.tsx` | S | Low | ✅ Fixed |
| **P1** | Sitemap lastmod accuracy | Low - Misleading freshness signals | Static pages use `new Date()` | Use build timestamp or omit for static pages | S | Low | ✅ Fixed |
| **P2** | FAQ schema for articles | Med - Rich snippet opportunity | Articles have Q&A-style content but no FAQ schema | Add FAQ JSON-LD for articles with FAQs | M | Low | ✅ Won't fix (uncertain ROI) |
| **P2** | Missing OG images on tag pages | Low - Social sharing quality | Tag pages use default banner instead of topic-relevant image | Generate or select topic-specific images | M | Low | ✅ Won't fix (banner is appropriate) |
| **P2** | Image alt text validation | Med - Accessibility/SEO | MDX images rely on author-provided alt | Add build-time validation for missing alt | M | Low | ✅ Script created (556 images need fixes) |
| **P2** | Anchor text optimization | Low - Internal link equity | Some "Read more" / "View all" generic anchors | Use descriptive anchor text | M | Low | ✅ Fixed |
| **P3** | Cloudflare preview indexation | Med - Duplicate content risk | Preview deployments may be indexable | Add `X-Robots-Tag: noindex` header for preview branches | S | Med | ✅ Documented |

---

## 5. Detailed Recommendations

### 5.1 Indexability

#### 5.1.1 Tag Pages Missing Canonical

**What's happening now:**
`app/tags/[tag]/page.tsx` generates metadata but does not include `alternates.canonical`. Tags are URL-encoded (e.g., `/tags/proof-of-stake` vs `/tags/proof%20of%20stake`).

**Why it matters:**
Search engines may treat URL-encoded variations as separate pages, diluting ranking signals. Canonical tags consolidate duplicate/similar URLs.

**Recommended change:**
```typescript
// In generateMetadata()
return {
  // ...existing metadata
  alternates: {
    canonical: `/tags/${encodeURIComponent(decodedTag)}`,
  },
};
```

**Where to implement:** `app/tags/[tag]/page.tsx:32-35`

**Acceptance criteria:**
- Tag pages render `<link rel="canonical">` in HTML head
- Canonical URL uses consistent encoding

#### 5.1.2 Search Page Canonical Inconsistency

**What's happening now:**
`app/search/page.tsx` sets `canonical: '/search/'` (with trailing slash), but site navigation links to `/search` (no trailing slash).

**Why it matters:**
Google treats `/search` and `/search/` as different URLs unless canonicalized. This creates duplicate content signals.

**Recommended change:**
```typescript
alternates: {
  canonical: '/search', // Remove trailing slash
},
```

**Where to implement:** `app/search/page.tsx:10-12`

**Acceptance criteria:**
- Canonical matches the URL used in navigation
- No trailing slash in canonical

#### 5.1.3 Sitemap Missing Pages

**What's happening now:**
`app/sitemap.ts` includes homepage, about, search, tags, categories, articles, and tag pages. Missing: `/visualize`, `/request`, `/random`.

**Why it matters:**
Pages not in sitemap may take longer to be discovered and indexed, especially if they have few inbound links.

**Recommended change:**
Add to static pages array:
```typescript
{
  url: `${baseUrl}/visualize`,
  lastModified: new Date('2025-01-01'), // Use actual build date
  changeFrequency: 'monthly' as const,
  priority: 0.5,
},
{
  url: `${baseUrl}/request`,
  lastModified: new Date('2025-01-01'),
  changeFrequency: 'monthly' as const,
  priority: 0.4,
},
// Note: /random redirects, so may not need to be in sitemap
```

**Where to implement:** `app/sitemap.ts:10-35`

**Acceptance criteria:**
- `/visualize` and `/request` appear in sitemap.xml
- `/random` excluded (it's a redirect, not content)

#### 5.1.4 Cloudflare Preview Deployments

**What's happening now:**
Cloudflare Pages creates preview URLs for branches/PRs (e.g., `branch-name.inevitable-eth.pages.dev`). These may be indexable.

**Why it matters:**
Preview deployments can create massive duplicate content issues if indexed.

**Recommended change:**
Add to `public/_headers`:
```
https://:project.pages.dev/*
  X-Robots-Tag: noindex

https://*.pages.dev/*
  X-Robots-Tag: noindex
```

Or configure in Cloudflare dashboard.

**Where to implement:** `public/_headers` or Cloudflare dashboard

**Acceptance criteria:**
- Preview URLs return `X-Robots-Tag: noindex` header
- Only production domain is indexable

---

### 5.2 Metadata

#### 5.2.1 RSS Feed Autodiscovery

**What's happening now:**
RSS feed exists at `/feed.xml` but there's no `<link rel="alternate">` tag in HTML for autodiscovery.

**Why it matters:**
RSS readers and some tools discover feeds via autodiscovery links. Without it, users must manually find the feed URL.

**Recommended change:**
Add to `app/layout.tsx` `<head>`:
```tsx
<link
  rel="alternate"
  type="application/rss+xml"
  title="Inevitable Ethereum RSS Feed"
  href="https://inevitableeth.com/feed.xml"
/>
```

**Where to implement:** `app/layout.tsx:58-59` (inside `<head>`)

**Acceptance criteria:**
- HTML source contains RSS autodiscovery link
- Feed readers can auto-detect the feed

#### 5.2.2 Tag Page Open Graph Images

**What's happening now:**
Tag pages use `getDefaultOgImage()` which returns the site banner. All tag pages share the same social preview.

**Why it matters:**
Unique, relevant OG images improve click-through rates from social media and can appear in Google Discover.

**Recommended change:**
Options:
1. Generate OG images at build time with tag name overlaid
2. Select representative article image for each tag
3. Create category-specific fallback images (one per main topic)

**Where to implement:** `app/tags/[tag]/page.tsx:21-35`

**Acceptance criteria:**
- Tag pages have topic-relevant OG images
- Images render correctly in social media debuggers

---

### 5.3 Schema / Structured Data

#### 5.3.1 FAQ Schema for Educational Articles

**What's happening now:**
Articles have Article schema with headline, description, author, publisher. No FAQ schema despite educational Q&A-style content.

**Why it matters:**
FAQ schema can generate rich snippets in search results, increasing click-through rates. Educational content often answers common questions.

**Recommended change:**
For articles that contain FAQ-style sections, add:
```typescript
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Ethereum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ethereum is a decentralized computing platform...'
      }
    }
  ]
};
```

**Where to implement:**
- Add `faqs` field to frontmatter schema (`lib/content.schema.ts`)
- Render FAQ JSON-LD in `app/[category]/[slug]/page.tsx`

**Acceptance criteria:**
- Articles with FAQs render FAQPage JSON-LD
- Schema validates in Google Rich Results Test

#### 5.3.2 CollectionPage Schema for Category Pages

**What's happening now:**
Category pages (`/background`, `/concepts`, `/ethereum`) have no structured data.

**Why it matters:**
CollectionPage or ItemList schema helps search engines understand the page structure and may enable list rich snippets.

**Recommended change:**
Add ItemList schema:
```typescript
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Background & Context Articles',
  itemListElement: articles.map((article, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://inevitableeth.com/${category}/${article.slug}`,
    name: article.frontmatter.title,
  })),
};
```

**Where to implement:** `app/[category]/page.tsx`

**Acceptance criteria:**
- Category pages render ItemList JSON-LD
- Schema validates in Rich Results Test

---

### 5.4 Internal Linking

#### 5.4.1 Generic Anchor Text

**What's happening now:**
Links like "Read more →", "View all →" use generic anchor text that doesn't describe the destination.

**Why it matters:**
Descriptive anchor text helps search engines understand link context and passes more relevant signals to linked pages.

**Recommended change:**
Change:
- "Read more →" → "Read more about {title}"
- "View all →" → "View all {category} articles"

**Where to implement:**
- `app/page.tsx:82-87` (Featured article "Read more")
- `app/page.tsx:109-114` (Category "View all")

**Acceptance criteria:**
- All internal links have descriptive anchor text
- No generic "click here" or "read more" without context

#### 5.4.2 Related Articles Linking

**What's happening now:**
Article pages have `RelatedArticles` component showing 3 related articles based on tags. This is good internal linking.

**Assessment:** Already well-implemented. Consider increasing to 5 related articles if above-fold space allows.

---

### 5.5 Performance (SEO-Relevant)

#### 5.5.1 Dynamic Imports for Heavy Components

**What's happening now:**
`TableOfContents` and `ReadingProgress` are dynamically imported. Visualization component is lazy-loaded. This is good practice.

**Assessment:** Performance optimization is well-implemented for a static export.

#### 5.5.2 Image Optimization

**What's happening now:**
`next.config.ts` sets `images.unoptimized: true` because static export doesn't support Next.js Image Optimization. Custom optimization via `scripts/optimize-images.ts` generates WebP/AVIF variants.

**Assessment:** Images are pre-optimized at build time. Ensure all images have width/height to prevent CLS.

#### 5.5.3 Font Loading

**What's happening now:**
Google Fonts (Geist) loaded via `next/font/google` with `subsets: ["latin"]`. Font is properly optimized.

**Assessment:** Font loading is optimized with automatic subsetting.

---

### 5.6 Accessibility (SEO-Adjacent)

#### 5.6.1 Image Alt Text

**What's happening now:**
MDX images rely on author-provided alt text: `![alt](/images/file.png)`. No build-time validation ensures alt text is present and meaningful.

**Why it matters:**
Images without alt text are inaccessible and may be ignored by image search.

**Recommended change:**
Add build-time check in content validation:
```typescript
// In content loading, warn if image has empty alt
const images = content.match(/!\[([^\]]*)\]\([^)]+\)/g);
images?.forEach(img => {
  if (img.match(/!\[\]\(/)) {
    console.warn(`Empty alt text in ${filepath}`);
  }
});
```

**Where to implement:** `lib/content.ts` or build-time script

**Acceptance criteria:**
- Build warns on images with empty alt text
- All images have descriptive alt text

#### 5.6.2 Skip Link and Landmarks

**What's happening now:**
`app/layout.tsx` includes skip-to-content link and proper landmark structure (`<main id="main-content">`). ARIA attributes on interactive elements.

**Assessment:** Accessibility foundations are solid.

---

### 5.7 Technical Hygiene

#### 5.7.1 404 Page

**What's happening now:**
Custom 404 page provides helpful navigation with links to home, search, and popular articles. Includes callout about site rebuild with link to old site.

**Assessment:** Excellent 404 handling. Consider adding 404 page to Google Search Console monitoring.

#### 5.7.2 Sitemap lastModified Accuracy

**What's happening now:**
Static pages in sitemap use `new Date()` which generates current timestamp at build time, not actual last modification date.

**Why it matters:**
Misleading lastmod dates can cause search engines to recrawl unchanged pages unnecessarily, or lose trust in sitemap accuracy.

**Recommended change:**
Either:
1. Use actual file modification timestamps
2. Use a fixed build date
3. Omit `lastModified` for static pages (it's optional)

**Where to implement:** `app/sitemap.ts:10-35`

**Acceptance criteria:**
- Static pages have accurate or omitted lastModified
- Article pages continue using frontmatter `updated` date

#### 5.7.3 Redirect Handling

**What's happening now:**
`/random` page uses client-side redirect via `router.push()`. No server-side 301/302 configured.

**Assessment:** Random article is not content, so client-side redirect is acceptable. Ensure old site URLs redirect to new site (configured externally).

---

## 6. Next Steps We Can Decide Together

### Phase 1: Quick Wins (1-2 hours)

1. Add canonical tags to tag pages
2. Fix search page canonical trailing slash
3. Add missing pages to sitemap
4. Add RSS autodiscovery link to layout

### Phase 2: Medium Effort (4-8 hours)

5. Add ItemList schema to category pages
6. Improve anchor text for internal links
7. Add build-time alt text validation
8. Configure Cloudflare preview noindex headers

### Phase 3: Larger Work (1-2 days)

9. Implement FAQ schema for relevant articles
10. Generate topic-specific OG images for tag pages

### Decisions Needed

1. **Canonical policy for tags:** Use encoded or decoded tag in canonical URL?
2. **Sitemap lastmod:** Use build date, omit, or implement file-based timestamps?
3. **FAQ schema:** Which articles should have FAQ markup? Manual or automatic detection?
4. **OG images:** Generate at build time, select from article images, or category-specific fallbacks?
5. **Preview indexation:** Configure in Cloudflare dashboard or via `_headers` file?
6. **Rich snippets priority:** Focus on FAQ, HowTo, or both for educational content?
7. **Internal link audit:** Systematic review of anchor text or opportunistic updates?
8. **Alt text enforcement:** Warning only, or fail build on empty alt?
9. **Analytics integration:** Is Google Analytics tracking search referrals and landing pages?
10. **Search Console:** Is GSC verified and monitored for coverage issues?

---

## 7. Appendix

### A. Route Inventory

#### Static Routes
| Route | File | Metadata | Canonical | Sitemap |
|-------|------|----------|-----------|---------|
| `/` | `app/page.tsx` | Yes | No (implicit) | Yes |
| `/about` | `app/about/page.tsx` | Yes | Yes | Yes |
| `/search` | `app/search/page.tsx` | Yes | Yes ✅ | Yes |
| `/tags` | `app/tags/page.tsx` | Yes | No | Yes |
| `/visualize` | `app/visualize/page.tsx` | No | No | Yes ✅ |
| `/request` | `app/request/page.tsx` | Yes | No | Yes ✅ |
| `/random` | `app/random/page.tsx` | N/A | N/A | No (redirect) |

#### Dynamic Routes
| Pattern | File | Count | Metadata | Canonical | Sitemap |
|---------|------|-------|----------|-----------|---------|
| `/[category]` | `app/[category]/page.tsx` | 3 | Yes | Yes | Yes |
| `/[category]/[slug]` | `app/[category]/[slug]/page.tsx` | 143 | Yes | Yes | Yes |
| `/tags/[tag]` | `app/tags/[tag]/page.tsx` | ~50 | Yes | Yes ✅ | Yes |

#### API/Feed Routes
| Route | File | Purpose |
|-------|------|---------|
| `/feed.xml` | `app/feed.xml/route.ts` | RSS feed |
| `/sitemap.xml` | `app/sitemap.ts` | XML sitemap |
| `/robots.txt` | `app/robots.ts` | Robots directives |

### B. Notable Files Inspected

| File | SEO Relevance |
|------|---------------|
| `app/layout.tsx` | Root metadata, JSON-LD (WebSite, Organization, Person) |
| `app/robots.ts` | Crawl directives, sitemap reference |
| `app/sitemap.ts` | Sitemap generation logic |
| `app/[category]/[slug]/page.tsx` | Article schema (Article, BreadcrumbList) |
| `lib/content.schema.ts` | Frontmatter validation (title, description, tags) |
| `next.config.ts` | Static export, image handling |
| `public/_headers` | Security headers (CSP) |

### C. Recommended Verification Commands

```bash
# Check robots.txt
curl https://inevitableeth.com/robots.txt

# Check sitemap
curl https://inevitableeth.com/sitemap.xml | head -50

# Check canonical tags
curl -s https://inevitableeth.com/tags/ethereum | grep -i canonical

# Check Open Graph tags
curl -s https://inevitableeth.com/ethereum/world-computer | grep -i "og:"

# Check JSON-LD
curl -s https://inevitableeth.com/ethereum/world-computer | grep -i "application/ld+json"

# Validate schema
# Use: https://validator.schema.org/ or https://search.google.com/test/rich-results

# Check Core Web Vitals
npx lighthouse https://inevitableeth.com --only-categories=performance --output=json

# Check headers
curl -I https://inevitableeth.com
```

### D. Content Statistics

| Category | Article Count |
|----------|---------------|
| Background | ~17 |
| Concepts | ~49 |
| Ethereum | ~77 |
| **Total** | **143** |

---

*Report generated by Claude Code SEO Audit*
*No code changes were made during this audit*
