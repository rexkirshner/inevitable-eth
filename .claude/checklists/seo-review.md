# SEO Review Checklist

Comprehensive SEO audit checklist for web applications and public sites.

**When to use:** During `/code-review` when project is a public-facing website.

## Quick Check (5 minutes)

Essential items to verify:

- [ ] **Meta descriptions present** - All pages have unique, compelling descriptions (150-160 chars)
- [ ] **Heading hierarchy correct** - Single H1 per page, sequential levels (no H1→H3 skips)
- [ ] **Core Web Vitals acceptable** - LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Mobile responsive** - Works on all screen sizes
- [ ] **Alt text on images** - All images have descriptive alt text

## Meta Tags

- [ ] **Title tags** - 50-60 chars, unique per page, include target keywords
- [ ] **Meta descriptions** - 150-160 chars, compelling call-to-action, unique per page
- [ ] **Keywords** - Target keywords naturally in content (but don't over-optimize)
- [ ] **Viewport meta** - `<meta name="viewport" content="width=device-width, initial-scale=1">`

## Social Sharing (Open Graph)

- [ ] **og:title** - Compelling title for social shares
- [ ] **og:description** - Description for social shares
- [ ] **og:image** - Share image (1200x630px recommended)
- [ ] **og:url** - Canonical URL for sharing
- [ ] **og:type** - Content type (website, article, etc.)

## Twitter Cards

- [ ] **twitter:card** - Card type (summary, summary_large_image)
- [ ] **twitter:title** - Title for Twitter
- [ ] **twitter:description** - Description for Twitter
- [ ] **twitter:image** - Image for Twitter cards

## HTML Structure

- [ ] **Semantic HTML** - Proper use of header, nav, main, article, aside, footer
- [ ] **Heading hierarchy** - H1 → H2 → H3 (no skipped levels)
- [ ] **Single H1 per page** - Primary heading includes main keyword
- [ ] **List markup** - Use ul/ol for lists, not divs
- [ ] **Table markup** - Proper thead/tbody/th for data tables

## URLs

- [ ] **Clean URLs** - Readable, descriptive (no query params if avoidable)
- [ ] **Keyword inclusion** - URLs include relevant keywords
- [ ] **Lowercase** - All URLs lowercase
- [ ] **Hyphens not underscores** - word-separation not word_separation
- [ ] **Short and descriptive** - Not excessively long

## Images

- [ ] **Alt text** - Descriptive, includes context (not just "image" or filename)
- [ ] **File names** - Descriptive (product-blue-widget.jpg not IMG_1234.jpg)
- [ ] **Optimized** - Compressed, appropriate format (WebP when possible)
- [ ] **Responsive** - srcset for different screen sizes
- [ ] **Lazy loading** - loading="lazy" for below-fold images

## Internal Linking

- [ ] **Natural anchor text** - Descriptive, not "click here"
- [ ] **Logical hierarchy** - Important pages linked from homepage
- [ ] **Breadcrumbs** - Clear navigation path on deep pages
- [ ] **No broken links** - All internal links work

## Technical SEO

- [ ] **Sitemap.xml** - Auto-generated, submitted to search engines
- [ ] **Robots.txt** - Properly configured, not blocking important pages
- [ ] **Canonical URLs** - Set for duplicate content
- [ ] **HTTPS** - Entire site on secure connection
- [ ] **404 pages** - Custom, helpful 404 page
- [ ] **Redirects** - 301 redirects for moved pages (not 302)

## Core Web Vitals

### LCP (Largest Contentful Paint)
**Target: < 2.5s**

Common issues:
- Unoptimized images
- Slow server response
- Render-blocking JavaScript
- Client-side rendering delays

Fixes:
- Optimize and compress images
- Use CDN
- Preload critical resources
- Server-side rendering or static generation

### FID (First Input Delay)
**Target: < 100ms**

Common issues:
- Long-running JavaScript
- Large bundles blocking main thread
- Heavy third-party scripts

Fixes:
- Code splitting
- Lazy load non-critical JavaScript
- Web Workers for heavy computation
- Optimize third-party scripts

### CLS (Cumulative Layout Shift)
**Target: < 0.1**

Common issues:
- Images without dimensions
- Ads/embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamic content insertion

Fixes:
- Specify width/height on images
- Reserve space for ads
- Use font-display: swap
- Avoid inserting content above existing content

## Structured Data (Schema.org)

- [ ] **JSON-LD format** - Preferred over microdata
- [ ] **Article schema** - For blog posts/articles
- [ ] **Organization schema** - On homepage
- [ ] **BreadcrumbList schema** - Navigation breadcrumbs
- [ ] **Product schema** - For e-commerce products
- [ ] **Review schema** - For reviews/ratings

**Example Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-10-04",
  "dateModified": "2025-10-04",
  "image": "https://example.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

## Content Quality

- [ ] **Original content** - Not duplicated from other sites
- [ ] **Valuable content** - Answers user questions
- [ ] **Proper length** - Sufficient depth (usually 300+ words)
- [ ] **Keyword usage** - Natural inclusion of target keywords
- [ ] **Regular updates** - Fresh content added regularly

## Mobile Optimization

- [ ] **Mobile-first design** - Designed for mobile, enhanced for desktop
- [ ] **Touch targets** - Buttons/links at least 48x48px
- [ ] **Readable text** - Minimum 16px font size
- [ ] **No horizontal scroll** - Content fits viewport
- [ ] **Fast on mobile** - Good performance on 3G/4G

## Common SEO Issues

### Critical (Fix Immediately)

**Missing meta descriptions:**
```markdown
**Issue:** Pages lack meta descriptions
**Impact:** Poor search engine snippets, lower click-through rates
**Fix:** Add unique meta descriptions (150-160 chars) to all pages
```

**Poor heading hierarchy:**
```markdown
**Issue:** Multiple H1 tags, skipped heading levels (H1 → H3)
**Impact:** Confuses search engines and screen readers
**Fix:** Single H1 per page, sequential heading levels
```

**Slow page load:**
```markdown
**Issue:** LCP > 4s, unoptimized images
**Impact:** Poor Core Web Vitals, lower rankings
**Fix:** Optimize images, lazy loading, reduce bundle size
```

### High Priority

**Missing Open Graph tags:**
```markdown
**Issue:** No OG tags for social sharing
**Impact:** Poor social media previews
**Fix:** Add og:title, og:description, og:image, og:url
```

**Missing structured data:**
```markdown
**Issue:** No JSON-LD schema markup
**Impact:** Missing rich snippets in search results
**Fix:** Add Article schema with author, datePublished, etc.
```

**Broken internal links:**
```markdown
**Issue:** Links to 404 pages
**Impact:** Poor user experience, wasted crawl budget
**Fix:** Update or remove broken links
```

## Tools for Testing

- **Google Search Console** - Index status, errors, performance
- **Google PageSpeed Insights** - Core Web Vitals, performance
- **Lighthouse** - Comprehensive audit (built into Chrome DevTools)
- **Schema Validator** - Test structured data
- **Mobile-Friendly Test** - Google's mobile usability test
- **Screaming Frog** - Crawl site for technical issues (desktop app)

## Documentation Format

When documenting SEO issues in code review:

```markdown
### SEO Issues

**SEO1: Missing meta descriptions**
- **Severity:** High
- **Location:** app/layout.tsx or pages without metadata
- **Issue:** Pages lack meta descriptions
- **Impact:** Poor search engine snippets, lower click-through rates
- **Suggestion:** Add unique, compelling meta descriptions (150-160 chars) to all pages

**SEO2: Poor heading hierarchy**
- **Severity:** Medium
- **Location:** components/ArticlePage.tsx
- **Issue:** Multiple H1 tags, skipped heading levels (H1 → H3)
- **Impact:** Confuses search engines and screen readers
- **Suggestion:** Single H1 per page, sequential heading levels
```

## Priority Guidelines

**Critical (Block Launch):**
- Missing meta tags on all pages
- No mobile responsiveness
- HTTPS not configured
- Slow page load (LCP >5s)

**High (Fix Before Launch):**
- Missing Open Graph tags
- Poor heading hierarchy
- No structured data
- Broken internal links

**Medium (Fix Post-Launch):**
- Suboptimal image alt text
- Missing breadcrumbs
- Could improve URL structure

**Low (Nice to Have):**
- Additional schema types
- Further performance optimization
- Content length on some pages

## Quick Wins

Items with high impact and low effort:

1. **Add meta descriptions** - 5 minutes per page, big SEO impact
2. **Fix heading hierarchy** - Usually just reorder existing headings
3. **Add Open Graph tags** - Copy from meta tags, minimal effort
4. **Optimize images** - Run through compression tool, huge performance gain
5. **Add alt text** - Write descriptive text for each image

## References

- [Google Search Central](https://developers.google.com/search)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
