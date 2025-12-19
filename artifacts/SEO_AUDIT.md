# SEO Audit - Inevitable Ethereum
**Date:** 2025-10-05
**Auditor:** Claude Code
**Goal:** World-class SEO optimization

---

## Current SEO Status: Grade B+

### ✅ Strengths

**Technical SEO:**
- ✅ Sitemap.xml properly generated (141+ articles)
- ✅ Robots.txt configured
- ✅ Clean URL structure (/category/slug)
- ✅ Static site generation (fast load times)
- ✅ Mobile-responsive design
- ✅ HTTPS ready
- ✅ Proper HTML5 semantic markup

**On-Page SEO:**
- ✅ Title tags on all pages
- ✅ Meta descriptions on all articles
- ✅ Keywords meta tag (articles)
- ✅ Alt text on images (from MDX)
- ✅ Header hierarchy (H1 → H2 → H3)
- ✅ Internal linking structure

**Social & Sharing:**
- ✅ Open Graph tags (title, description, images)
- ✅ Twitter Card tags (summary_large_image)
- ✅ Social media preview images

**Structured Data:**
- ✅ JSON-LD for articles (Article schema)
- ✅ JSON-LD for breadcrumbs (BreadcrumbList)

---

## ⚠️ Missing / Suboptimal

### Critical Issues

**1. Missing metadataBase**
- **Impact:** HIGH - Social images may not resolve correctly
- **Issue:** No canonical base URL set
- **Fix:** Add metadataBase to root layout

**2. Missing Canonical URLs**
- **Impact:** HIGH - Duplicate content issues
- **Issue:** No canonical tags on pages
- **Fix:** Add canonical to all metadata

**3. Incomplete JSON-LD**
- **Impact:** MEDIUM - Missing rich snippets opportunity
- **Issue:** Only Article and BreadcrumbList schemas
- **Missing:**
  - WebSite schema (sitelinks searchbox)
  - Organization schema
  - FAQPage schema (for /about, /request)
  - CollectionPage schema (for categories)

**4. Tags/Topics Page Not in Sitemap**
- **Impact:** MEDIUM - Missing 155 tag pages from search engines
- **Issue:** /tags and /tags/[tag] not in sitemap
- **Fix:** Add to sitemap generation

**5. No Author Information**
- **Impact:** LOW - Missing authorship signals
- **Issue:** Articles don't specify author
- **Fix:** Add Person schema or author frontmatter

### Optimization Opportunities

**6. Article Last Modified Dates**
- **Current:** Uses frontmatter.updated (often old)
- **Better:** Use git commit dates for true freshness
- **Benefit:** Better rankings for recently updated content

**7. Missing Article Publisher**
- **Issue:** JSON-LD Article missing publisher field
- **Fix:** Add Organization schema reference

**8. No Image Optimization Metadata**
- **Issue:** OG images lack width/height
- **Fix:** Add image dimensions to metadata

**9. Missing Nofollow on External Links**
- **Issue:** Linking to external sites without rel attributes
- **Fix:** Add rel="noopener noreferrer" (already done via MDX renderer)

**10. Request Article Page**
- **Missing:** Dedicated metadata
- **Should have:** Better title/description for SEO

---

## Recommended Improvements

### Priority 1 (High Impact)

1. **Add metadataBase** to root layout
2. **Add canonical URLs** to all pages
3. **Add WebSite JSON-LD** with sitelinks searchbox
4. **Add Organization JSON-LD** to root layout
5. **Add tags pages to sitemap**

### Priority 2 (Medium Impact)

6. **Enhance Article JSON-LD** with publisher, author
7. **Add FAQPage JSON-LD** to /request page
8. **Add CollectionPage JSON-LD** to category pages
9. **Add image dimensions** to OG metadata
10. **Improve meta descriptions** (ensure 150-160 chars optimal)

### Priority 3 (Nice to Have)

11. **Add lastmod dates from git** for true freshness
12. **Add language alternates** (if planning i18n)
13. **Add article:tag** OG tags for better social sharing
14. **Add reading time to metadata**
15. **Add "dateModified" to Article JSON-LD**

---

## Competitor Analysis

**Best practices from top-ranking crypto education sites:**

- Ethereum.org: Excellent JSON-LD, canonical URLs, multilingual
- CoinDesk: Strong authorship, publish/modified dates
- Decrypt: Good social sharing, author profiles
- The Block: Excellent structured data coverage

**We're competitive on:** Content depth, technical accuracy, page speed
**We're behind on:** Structured data completeness, canonical URLs, authorship

---

## Success Metrics

**After implementing recommendations:**

- Google Search Console: Index coverage 100%
- Rich results: Article, Breadcrumb, Sitelinks searchbox
- Core Web Vitals: All green
- Mobile usability: 0 issues
- Social sharing: Perfect preview cards
- Internal linking: Full graph connectivity

---

## Implementation Checklist

- [ ] Add metadataBase to root layout
- [ ] Add canonical URLs everywhere
- [ ] Add WebSite JSON-LD with searchbox
- [ ] Add Organization JSON-LD
- [ ] Add tags pages to sitemap
- [ ] Enhance Article JSON-LD (publisher, author, dateModified)
- [ ] Add FAQPage JSON-LD to /request
- [ ] Add CollectionPage JSON-LD to categories
- [ ] Add image dimensions to metadata
- [ ] Review all meta descriptions for optimal length

---

## Notes

**Strengths to preserve:**
- Fast load times (93-98 Lighthouse Performance)
- Clean URLs
- Good internal linking
- Semantic HTML
- Accessibility (96+ A11y score)

**Don't break:**
- Existing social sharing (works well)
- Current search visibility
- Page performance scores
