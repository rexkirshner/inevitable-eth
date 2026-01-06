---
name: code-review-seo
description: Technical SEO audit - metadata, structured data, crawlability, Core Web Vitals
---

# /code-review-seo Command

Conduct a thorough technical SEO audit. This command **NEVER makes changes** - it only identifies issues and suggests improvements. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Focus on technical SEO** - Code and configuration, not content strategy
3. **Consider rendering mode** - SSR/SSG/ISR/CSR affects what bots see
4. **Verify what crawlers see** - Client-rendered content may be invisible

## When to Use This Command

**Good times:**
- Before launching public website
- After major site restructure
- When organic traffic is declining
- Before migration to new framework
- When adding new content types

**Bad times:**
- Internal-only applications
- Auth-gated applications
- Still in prototype phase

## Execution Steps

### Step 0: Set Expectations

```
Technical SEO Audit

Framework: [detected]
Rendering: [SSR/SSG/ISR/CSR]
Scope: Crawlability, metadata, structured data, Core Web Vitals

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...
```

### Step 1: Framework & Rendering Detection

```bash
# Detect framework
source scripts/common-functions.sh
FRAMEWORK=$(detect_framework)
echo "Framework: $FRAMEWORK"

# Check rendering mode
# Next.js: Look for generateStaticParams, dynamic exports
grep -rn "generateStaticParams\|dynamic.*force-static\|dynamic.*force-dynamic" app/ 2>/dev/null
```

**Framework-specific locations:**

| Framework | Metadata Location | Sitemap | Robots |
|-----------|-------------------|---------|--------|
| Next.js App | `app/layout.tsx`, `metadata.ts` | `app/sitemap.ts` | `app/robots.ts` |
| Next.js Pages | `pages/_document.tsx`, `next-seo` | `public/sitemap.xml` | `public/robots.txt` |
| Remix | `root.tsx`, meta functions | Manual | `public/robots.txt` |
| Astro | `<head>` in layouts | `@astrojs/sitemap` | `public/robots.txt` |

### Step 2: Crawlability & Indexability

**Check robots.txt:**

```bash
# Find robots.txt
cat public/robots.txt 2>/dev/null || cat app/robots.ts 2>/dev/null
```

**Verify:**
- [ ] **Robots.txt exists** - Must be at site root
- [ ] **Not blocking important pages** - Check Disallow rules
- [ ] **Sitemap referenced** - Sitemap URL in robots.txt
- [ ] **No accidental blocks** - Common: blocking /api/, /_next/

**Check sitemap:**

```bash
# Find sitemap
cat public/sitemap.xml 2>/dev/null
ls app/sitemap.ts 2>/dev/null
grep -rn "generateSitemap\|sitemap" --include="*.ts" --include="*.tsx"
```

**Verify:**
- [ ] **Sitemap exists** - XML sitemap at /sitemap.xml
- [ ] **All pages included** - Important pages listed
- [ ] **No noindex pages** - Don't include pages you don't want indexed
- [ ] **Dynamic generation** - Updates when content changes
- [ ] **Proper format** - Valid XML sitemap format

**Check canonical URLs:**

```bash
# Find canonical tags
grep -rn "canonical\|alternates" --include="*.ts" --include="*.tsx" app/
```

**Verify:**
- [ ] **Canonical URLs set** - Prevents duplicate content issues
- [ ] **Self-referencing** - Each page canonicals to itself
- [ ] **Consistent format** - www vs non-www, trailing slash

### Step 3: Metadata Analysis

**Check global metadata:**

```bash
# Next.js App Router
cat app/layout.tsx 2>/dev/null | head -100
grep -A 20 "export const metadata" app/layout.tsx 2>/dev/null

# Look for metadata files
ls app/*/metadata.ts 2>/dev/null
```

**Check for:**

- [ ] **Title tags** - 50-60 chars, unique per page
- [ ] **Meta descriptions** - 150-160 chars, unique per page
- [ ] **Viewport meta** - Proper mobile viewport
- [ ] **Language** - `lang` attribute on `<html>`
- [ ] **Character encoding** - UTF-8 specified

**Example issues:**

```typescript
// BAD: Generic title
export const metadata = {
  title: 'My App',  // Not descriptive
  // Missing description!
};

// GOOD: Descriptive with template
export const metadata = {
  title: {
    default: 'Acme Store - Premium Widgets',
    template: '%s | Acme Store'
  },
  description: 'Shop premium widgets with free shipping...',
};
```

### Step 4: Open Graph & Social Tags

**Check OG tags:**

```bash
grep -rn "openGraph\|og:" --include="*.ts" --include="*.tsx" app/
```

**Required tags:**
- [ ] **og:title** - Compelling title for social shares
- [ ] **og:description** - Description for social shares
- [ ] **og:image** - Share image (1200x630px recommended)
- [ ] **og:url** - Canonical URL
- [ ] **og:type** - Content type (website, article, product)

**Check Twitter cards:**

```bash
grep -rn "twitter:" --include="*.ts" --include="*.tsx" app/
```

**Required tags:**
- [ ] **twitter:card** - Card type (summary_large_image recommended)
- [ ] **twitter:title** - Title for Twitter
- [ ] **twitter:description** - Description for Twitter
- [ ] **twitter:image** - Image for Twitter cards

### Step 5: Structured Data Analysis

**Check JSON-LD:**

```bash
grep -rn "application/ld+json\|@context.*schema.org" --include="*.ts" --include="*.tsx" app/
```

**Check for schema types:**

| Page Type | Required Schema | Priority |
|-----------|-----------------|----------|
| Homepage | Organization, WebSite | High |
| Articles | Article, BreadcrumbList | High |
| Products | Product, Offer | High |
| Services | Service, LocalBusiness | Medium |
| FAQ | FAQPage | Medium |
| Reviews | Review, AggregateRating | Medium |

**Verify:**
- [ ] **JSON-LD format** - Not microdata
- [ ] **Valid schema** - Test with Schema Validator
- [ ] **Required properties** - Name, description, image
- [ ] **No errors** - No missing required fields

**Example issues:**

```typescript
// BAD: Incomplete Article schema
const schema = {
  "@type": "Article",
  "headline": "Title"  // Missing author, datePublished, etc.
};

// GOOD: Complete Article schema
const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2025-01-05",
  "dateModified": "2025-01-05",
  "image": "https://example.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Acme Corp",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
};
```

### Step 6: Content Architecture

**Check heading hierarchy:**

```bash
# Find heading usage
grep -rn "<h1\|<h2\|<h3\|<H1\|<H2\|<H3" --include="*.tsx" app/
```

**Verify:**
- [ ] **Single H1 per page** - Primary heading
- [ ] **Sequential levels** - H1 → H2 → H3 (no skips)
- [ ] **Semantic hierarchy** - Reflects content structure
- [ ] **Keywords in headings** - Natural inclusion

**Check breadcrumbs:**

```bash
grep -rn "breadcrumb\|Breadcrumb" --include="*.tsx" app/
```

**Verify:**
- [ ] **Breadcrumbs present** - On deep pages
- [ ] **BreadcrumbList schema** - JSON-LD for breadcrumbs
- [ ] **Clickable links** - Each level is navigable

**Check internal links:**

- [ ] **Descriptive anchor text** - Not "click here"
- [ ] **No broken links** - All links resolve
- [ ] **Important pages linked** - From homepage/navigation
- [ ] **Reasonable depth** - All pages within 3-4 clicks

### Step 7: Image SEO

**Check image handling:**

```bash
# Find image usage
grep -rn "<img\|<Image\|next/image" --include="*.tsx" app/
```

**Verify:**
- [ ] **Alt text present** - All images have alt
- [ ] **Descriptive alt** - Not "image" or filename
- [ ] **Dimensions specified** - Width/height to prevent CLS
- [ ] **Lazy loading** - Below-fold images lazy loaded
- [ ] **Optimized format** - WebP/AVIF where possible
- [ ] **Responsive** - srcset for different sizes

**Example issues:**

```tsx
// BAD: Missing alt, no dimensions
<img src="/hero.jpg" />

// GOOD: Complete image
<Image
  src="/hero.jpg"
  alt="Product dashboard showing analytics"
  width={1200}
  height={630}
  priority  // for above-fold
/>
```

### Step 8: Technical Hygiene

**Check URL structure:**

- [ ] **Clean URLs** - Descriptive, no query params
- [ ] **Lowercase** - Consistent casing
- [ ] **Hyphens** - Not underscores
- [ ] **No trailing slashes** - Or consistent trailing slashes

**Check redirects:**

```bash
# Check for redirect handling
grep -rn "redirect\|permanentRedirect\|301\|302" --include="*.ts" --include="*.tsx"
```

**Verify:**
- [ ] **301 for permanent** - Not 302
- [ ] **No redirect chains** - A → B, not A → B → C
- [ ] **No loops** - A doesn't redirect to A

**Check 404 handling:**

```bash
ls app/not-found.tsx 2>/dev/null || ls pages/404.tsx 2>/dev/null
```

**Verify:**
- [ ] **Custom 404 page** - Not browser default
- [ ] **Helpful content** - Search, navigation, popular pages
- [ ] **Proper status code** - Returns 404, not 200

### Step 9: Performance (SEO-Relevant)

**Core Web Vitals targets:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5-4s | >4s |
| INP | <200ms | 200-500ms | >500ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |

**Check for common issues:**

```bash
# Large images without optimization
grep -rn "src=.*\.(png|jpg|jpeg)" --include="*.tsx" | grep -v "next/image\|Image"

# Render-blocking scripts
grep -rn "<script" --include="*.tsx" | grep -v "async\|defer"

# Fonts without display strategy
grep -rn "font-family\|@font-face" --include="*.css" --include="*.scss"
```

### Step 10: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "seo" "docs/audits"

# Option 2: Manual check - list existing SEO audits
ls docs/audits/seo-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/seo-audit-NN.md`:

```markdown
# SEO Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | SEO |
| Framework | [Next.js/Remix/Astro/etc.] |
| Rendering | [SSR/SSG/ISR/CSR] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Critical Issues:**
1. [Most critical issue]
2. [Second critical]
3. [Third critical]

**Quick Stats:**
- Pages analyzed: [N]
- Pages with metadata: [N]/[N]
- Pages with structured data: [N]/[N]
- Core Web Vitals: [Good/Needs Work/Poor]

---

## Methodology

### What Was Analyzed
- [X] Robots.txt and sitemap
- [X] Metadata (title, description, OG, Twitter)
- [X] Structured data (JSON-LD)
- [X] Content architecture (headings, breadcrumbs)
- [X] Image optimization
- [X] Technical hygiene (URLs, redirects, 404s)

### Rendering Considerations
- Framework: [Next.js/etc.]
- Rendering mode: [SSR/SSG/ISR/CSR]
- Bot visibility: [What bots see vs users]

---

## Findings

### Critical (Block Launch)

#### SEO-C1: [Issue Title]
- **Category:** [Crawlability/Metadata/Structured Data/etc.]
- **Location:** `path/to/file.tsx:123`
- **Issue:** [Description]
- **Impact:** [SEO impact]
- **Current:**
```tsx
// Problematic code
```
- **Suggested Fix:**
```tsx
// Fixed code
```

### High Priority (Fix Before Launch)

[Same format]

### Medium Priority (Fix Post-Launch)

[Same format]

### Low Priority (Nice to Have)

[Same format]

---

## Crawlability & Indexability

### Robots.txt
- Status: [Present/Missing]
- Issues: [List any issues]

### Sitemap
- Status: [Present/Missing/Dynamic]
- Coverage: [N]/[N] pages included
- Issues: [List any issues]

### Canonical URLs
- Status: [Implemented/Partial/Missing]
- Issues: [List any issues]

---

## Metadata Coverage

| Page | Title | Description | OG | Twitter | Status |
|------|-------|-------------|----|---------| -------|
| / | [Title] | [Desc] | Yes | Yes | Good |
| /about | Missing | Missing | No | No | Bad |
| /blog | [Title] | [Desc] | Yes | No | Partial |

---

## Structured Data

| Page Type | Schema | Status | Issues |
|-----------|--------|--------|--------|
| Homepage | Organization | Present | None |
| Articles | Article | Missing | Add schema |
| Products | Product | Partial | Missing price |

---

## Content Architecture

### Heading Analysis

| Page | H1 Count | Hierarchy | Status |
|------|----------|-----------|--------|
| / | 1 | H1→H2→H3 | Good |
| /about | 2 | H1→H3 (skip) | Bad |

### Internal Linking
- Navigation depth: [Max clicks from homepage]
- Orphan pages: [Pages with no internal links]
- Broken links: [Count]

---

## Image SEO

| Issue | Count | Priority |
|-------|-------|----------|
| Missing alt text | [N] | High |
| Missing dimensions | [N] | High |
| Not using next/image | [N] | Medium |
| Large unoptimized images | [N] | Medium |

---

## Decisions Needed

Before implementing fixes, decide:

1. **Trailing slashes** - With or without?
2. **www vs non-www** - Which is canonical?
3. **Default OG image** - What image for pages without specific image?
4. **Schema types** - Which schemas are priorities?

---

## Implementation Roadmap

### Immediate (This Sprint)

1. **Add missing meta descriptions** - All pages
2. **Fix heading hierarchy** - /about, /services
3. **Add robots.txt** - If missing

### Short-term (This Month)

1. **Implement structured data** - Article, Product schemas
2. **Add Open Graph tags** - All pages
3. **Create dynamic sitemap** - Auto-updated

### Long-term (Backlog)

1. **Breadcrumb implementation** - With schema
2. **Image optimization pass** - All images
3. **Core Web Vitals optimization** - LCP, CLS focus

---

## Metrics

- **Pages Analyzed:** [N]
- **Total Issues:** [N] (C:[N], H:[N], M:[N], L:[N])
- **Metadata Coverage:** [N]%
- **Structured Data Coverage:** [N]%

---

## Testing Tools

Before and after fixes, test with:
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Next Steps

1. Review findings and prioritize
2. Decide on configuration questions
3. Implement critical fixes first
4. Submit sitemap to Search Console
5. Re-run audit to verify fixes

---

**Generated by:** Claude Code
**Audit Type:** Technical SEO
**Version:** 4.0.1
```

### Step 11: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "SEO" "seo-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | SEO | [seo-audit-NN.md](./seo-audit-NN.md) | [Grade] | [Missing meta, sitemap issues, etc.] |
```

### Step 12: Report Completion

```
SEO Audit Complete

Report saved to: docs/audits/seo-audit-NN.md

Summary:
- Grade: B-
- Critical Issues: 2 (missing sitemap, no structured data)
- High Priority: 5
- Medium Priority: 8
- Metadata Coverage: 60%

Top 3 Issues:
1. Missing sitemap.xml - Crawlers can't discover all pages
2. No JSON-LD structured data - Missing rich snippets
3. 5 pages missing meta descriptions

Quick Wins:
1. Add meta descriptions to 5 pages
2. Create sitemap.ts in app/
3. Add Organization schema to homepage

Next Steps:
1. Review full report at docs/audits/seo-audit-NN.md
2. Decide on trailing slash policy
3. Implement structured data
4. Submit sitemap to Google Search Console

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | Complete metadata, structured data, sitemap, good Core Web Vitals |
| B | Most metadata present, some structured data, minor issues |
| C | Basic metadata, missing structured data, some crawlability issues |
| D | Incomplete metadata, no structured data, crawlability problems |
| F | Critical issues: blocked by robots, no metadata, major problems |

## Quick Reference

### Next.js App Router Metadata

```typescript
// app/layout.tsx - Global metadata
export const metadata: Metadata = {
  title: { default: 'Site Name', template: '%s | Site Name' },
  description: 'Site description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'Site Name',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@handle',
  },
};

// app/blog/[slug]/page.tsx - Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}
```

### JSON-LD Structured Data

```typescript
// components/JsonLd.tsx
export function ArticleJsonLd({ article }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          author: { "@type": "Person", name: article.author },
          datePublished: article.date,
          image: article.image,
        }),
      }}
    />
  );
}
```

## References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web.dev SEO](https://web.dev/learn/seo/)

---

**Version:** 4.0.1
