---
name: code-review-performance
description: Deep performance audit - Core Web Vitals, bundle analysis, runtime optimization
---

# /code-review-performance Command

Conduct a thorough performance audit focused on Core Web Vitals, bundle size, and runtime efficiency. This command **NEVER makes changes** - it only identifies issues and suggests optimizations. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Focus on measurable metrics** - Core Web Vitals, bundle size, response times
3. **Consider mobile first** - Test on slow networks and devices
4. **Prioritize user impact** - Focus on what users experience

## When to Use This Command

**Good times:**
- Before launching to production
- When Lighthouse scores drop
- When pages feel slow
- After adding new features
- When users complain about performance

**Bad times:**
- Internal tools with no performance requirements
- Still in early prototype phase

## Performance Budget Reference

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5-4s | >4s |
| INP | <200ms | 200-500ms | >500ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |
| Initial JS | <250KB | 250-500KB | >500KB |
| Total Page | <1MB | 1-2MB | >2MB |
| TTFB | <600ms | 600-1800ms | >1800ms |

## Execution Steps

### Step 0: Set Expectations

```
Performance Audit

Framework: [detected]
Scope: Core Web Vitals, bundle size, runtime, caching, images

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...
```

### Step 1: Framework Detection & Build Analysis

```bash
# Detect framework
source scripts/common-functions.sh
FRAMEWORK=$(detect_framework)
echo "Framework: $FRAMEWORK"

# Run production build to analyze
npm run build 2>&1 | tail -50
```

**Collect build metrics:**
- Total build time
- Bundle sizes (main, chunks)
- Static pages generated
- Server-side routes

### Step 2: Bundle Size Analysis

**Analyze JavaScript bundles:**

```bash
# Next.js - Check .next/build-manifest.json
cat .next/build-manifest.json 2>/dev/null | head -50

# Check for large dependencies
npm ls --prod --depth=0 2>/dev/null | head -30

# Find largest files in build output
find .next -name "*.js" -size +100k 2>/dev/null | head -20
```

**Check for bundle issues:**

- [ ] **Initial bundle < 250KB** - Gzipped main bundle
- [ ] **Code splitting** - Separate chunks per route
- [ ] **Tree shaking working** - No dead code
- [ ] **No duplicate dependencies** - Check for duplicates
- [ ] **Dynamic imports** - Non-critical code lazy loaded

**Search for optimization opportunities:**
```bash
# Find large imports that could be dynamic
grep -rn "import {.*} from" --include="*.ts" --include="*.tsx" | grep -E "lodash|moment|d3|chart|three"

# Find components that could be lazy loaded
grep -rn "import.*from.*components" --include="*.tsx" app/
```

### Step 3: Core Web Vitals Analysis

#### LCP (Largest Contentful Paint)

**Target: < 2.5s**

```bash
# Find hero images (likely LCP elements)
grep -rn "hero\|banner\|above-fold" --include="*.tsx"

# Check if using Next.js Image
grep -rn "next/image\|Image" --include="*.tsx" app/

# Find large images in public
find public -name "*.jpg" -o -name "*.png" -o -name "*.webp" | xargs ls -lh 2>/dev/null | head -20
```

**Check for LCP issues:**
- [ ] **Hero images optimized** - WebP/AVIF, compressed
- [ ] **Priority loading** - Above-fold images have priority
- [ ] **No render blocking** - Critical CSS inlined
- [ ] **Server response fast** - TTFB < 600ms
- [ ] **CDN configured** - Static assets on CDN

#### INP (Interaction to Next Paint)

**Target: < 200ms**

```bash
# Find heavy event handlers
grep -rn "onClick\|onChange\|onSubmit" --include="*.tsx" | head -30

# Find potentially blocking operations
grep -rn "await.*forEach\|\.map.*await" --include="*.ts" --include="*.tsx"

# Find expensive computations in render
grep -rn "\.filter\|\.map\|\.reduce" --include="*.tsx" app/ | head -20
```

**Check for INP issues:**
- [ ] **No blocking operations in handlers** - Async where possible
- [ ] **Debounced inputs** - Search, filters debounced
- [ ] **Memoized expensive computations:**
  - React: `useMemo` / `useCallback`
  - Svelte: `$derived` / `$derived.by()`
  - Vue: `computed` / `ref` with caching
- [ ] **Virtual scrolling for lists** - Long lists virtualized

#### CLS (Cumulative Layout Shift)

**Target: < 0.1**

```bash
# Find images without dimensions
grep -rn "<img\|<Image" --include="*.tsx" | grep -v "width\|height" | head -20

# Find dynamic content insertion
grep -rn "useState.*\[\]" --include="*.tsx" | head -20
```

**Check for CLS issues:**
- [ ] **Images have dimensions** - Width/height specified
- [ ] **Fonts don't shift** - font-display: swap
- [ ] **Ads/embeds reserved** - Placeholder space
- [ ] **No above-fold insertion** - Content loads in place
- [ ] **Skeleton loading** - Placeholders match final size

### Step 4: Image Optimization

**Audit all images:**

```bash
# Find all image files
find public -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -exec ls -lh {} \;

# Check image usage in code
grep -rn "<img\|<Image" --include="*.tsx" --include="*.jsx" | wc -l

# Find images not using Next.js Image
grep -rn "<img " --include="*.tsx" --include="*.jsx"
```

**Check for:**
- [ ] **Modern formats** - WebP/AVIF where possible
- [ ] **Compression** - Images compressed
- [ ] **Responsive images** - srcset for different sizes
- [ ] **Lazy loading** - Below-fold images lazy loaded
- [ ] **Using Image component** - Next.js Image or similar
- [ ] **No oversized images** - Images not larger than display size

### Step 5: JavaScript Runtime Performance

**Check for common performance issues:**

```bash
# Memory leaks - effects without cleanup
# React: useEffect without return cleanup
grep -rn "useEffect" --include="*.tsx" -A 10 | grep -B 5 "addEventListener\|setInterval\|setTimeout" | grep -v "return"
# Svelte: onMount/onDestroy or $effect without cleanup
grep -rn "onMount\|\\$effect" --include="*.svelte" -A 10 | grep "addEventListener\|setInterval"
# Vue: onMounted without onUnmounted cleanup
grep -rn "onMounted" --include="*.vue" -A 10 | grep "addEventListener\|setInterval"

# Check memoization usage (framework-specific)
echo "React memoization:" && grep -rn "useMemo\|useCallback" --include="*.tsx" | wc -l
echo "Svelte derived:" && grep -rn "\\$derived" --include="*.svelte" | wc -l
echo "Vue computed:" && grep -rn "computed(" --include="*.vue" --include="*.ts" | wc -l

# Find expensive operations in render/reactive code
grep -rn "JSON.parse\|JSON.stringify" --include="*.tsx" --include="*.svelte" --include="*.vue"
```

**Performance patterns to check:**

```typescript
// BAD: Expensive calculation every render
function Component({ items }) {
  const sorted = items.sort((a, b) => a.price - b.price);  // Sorts every render!
  return <List items={sorted} />;
}

// GOOD: Memoized expensive calculation
function Component({ items }) {
  const sorted = useMemo(() =>
    [...items].sort((a, b) => a.price - b.price),
    [items]
  );
  return <List items={sorted} />;
}

// BAD: New function reference every render
<Button onClick={() => handleClick(id)} />

// GOOD: Stable function reference
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<Button onClick={handleButtonClick} />
```

### Step 6: Network Performance

**Check caching and compression:**

```bash
# Check for cache configuration
grep -rn "Cache-Control\|max-age\|stale-while-revalidate" --include="*.ts" --include="*.config.*"

# Check compression settings
grep -rn "compress" next.config.*

# Check for preload/prefetch
grep -rn "preload\|prefetch\|dns-prefetch" --include="*.tsx" --include="*.html"
```

**Check for:**
- [ ] **Static assets cached** - Long max-age with hash
- [ ] **Compression enabled** - Gzip/Brotli
- [ ] **Preload critical resources** - Fonts, above-fold images
- [ ] **Prefetch likely routes** - Next navigation
- [ ] **CDN configured** - Static assets on edge

### Step 7: Rendering Strategy Analysis

**Evaluate current rendering:**

```bash
# Check for static pages
grep -rn "generateStaticParams\|getStaticProps\|getStaticPaths" --include="*.ts" --include="*.tsx"

# Check for dynamic rendering
grep -rn "dynamic.*force-dynamic\|getServerSideProps" --include="*.ts" --include="*.tsx"

# Check for ISR
grep -rn "revalidate" --include="*.ts" --include="*.tsx"
```

**Rendering decision matrix:**

| Content | Changes | User-specific | Recommended |
|---------|---------|---------------|-------------|
| Homepage | Rarely | No | Static |
| Blog posts | Rarely | No | ISR (1 hour) |
| Product pages | Sometimes | No | ISR (15 min) |
| User dashboard | Always | Yes | SSR |
| Search results | Always | Partial | SSR + caching |

### Step 8: Third-Party Script Analysis

```bash
# Find third-party scripts
grep -rn "<script.*src=" --include="*.tsx" --include="*.html" | grep -v "self-hosted"

# Find analytics/tracking
grep -rn "gtag\|analytics\|segment\|mixpanel\|hotjar" --include="*.ts" --include="*.tsx"

# Check loading strategy
grep -rn "async\|defer\|partytown" --include="*.tsx" --include="*.html"
```

**Check for:**
- [ ] **Minimal third-party** - Only necessary scripts
- [ ] **Async/defer loading** - Non-blocking
- [ ] **Web Worker offload** - Partytown or similar
- [ ] **Self-hosting option** - Reduce DNS lookups

### Step 9: API Performance

```bash
# Find API routes
find app -name "route.ts" | head -20

# Check for response caching
grep -rn "Cache-Control\|next.*revalidate" --include="route.ts"

# Find potentially slow operations
grep -rn "findMany\|findAll" --include="route.ts"
```

**Check for:**
- [ ] **Response caching** - Cache-Control headers
- [ ] **Query optimization** - Select only needed fields
- [ ] **Pagination** - Large datasets paginated
- [ ] **N+1 prevention** - Joins or batching
- [ ] **Timeout handling** - Requests have timeouts

### Step 10: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "performance" "docs/audits"

# Option 2: Manual check - list existing performance audits
ls docs/audits/performance-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/performance-audit-NN.md`:

```markdown
# Performance Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Performance |
| Framework | [Next.js/Remix/etc.] |
| Build Tool | [webpack/turbopack/vite] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Core Web Vitals Status:**
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | [X]s | <2.5s | [Good/Needs Work/Poor] |
| INP | [X]ms | <200ms | [Good/Needs Work/Poor] |
| CLS | [X] | <0.1 | [Good/Needs Work/Poor] |

**Top 3 Performance Issues:**
1. [Most impactful issue]
2. [Second most impactful]
3. [Third most impactful]

---

## Bundle Analysis

### Build Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Initial JS | [X]KB | <250KB | [Pass/Fail] |
| Total JS | [X]KB | <500KB | [Pass/Fail] |
| CSS | [X]KB | <50KB | [Pass/Fail] |
| Build time | [X]s | <60s | [Pass/Fail] |

### Largest Dependencies

| Package | Size (gzip) | Used In | Recommendation |
|---------|-------------|---------|----------------|
| [pkg] | [X]KB | [files] | [action] |

### Code Splitting

- Static pages: [N]
- Server pages: [N]
- Chunks: [N]
- [ ] Route-based splitting: [Yes/No]
- [ ] Dynamic imports used: [Yes/No]

---

## Core Web Vitals Analysis

### LCP Analysis

**Likely LCP Elements:**
| Element | Page | Size | Priority | Issue |
|---------|------|------|----------|-------|
| Hero image | / | 800x600 | Yes | None |
| Product image | /products | 1200x800 | No | Not prioritized |

**LCP Blockers:**
- [List of issues blocking LCP]

### INP Analysis

**Heavy Event Handlers:**
| Handler | File | Line | Issue |
|---------|------|------|-------|
| onClick | Component.tsx | 45 | No debounce |

**Main Thread Blockers:**
- [List of blocking operations]

### CLS Analysis

**Layout Shift Sources:**
| Element | Page | Cause | Fix |
|---------|------|-------|-----|
| Hero image | / | No dimensions | Add width/height |

---

## Detailed Findings

### Critical

#### PERF-C1: [Issue Title]
- **Metric Impact:** LCP +[X]s / INP +[X]ms / CLS +[X]
- **Location:** `path/to/file.tsx:123`
- **Issue:** [Description]
- **Current:**
```typescript
// Problematic code
```
- **Suggested Fix:**
```typescript
// Fixed code
```
- **Estimated Impact:** LCP improves by [X]s

### High Priority

[Same format]

### Medium Priority

[Same format]

---

## Image Audit

| Image | Size | Format | Dimensions | Lazy | Using Image Component |
|-------|------|--------|------------|------|----------------------|
| hero.jpg | 500KB | JPEG | 1920x1080 | No | No |
| product-1.png | 1.2MB | PNG | 2400x2400 | Yes | Yes |

**Recommendations:**
1. Convert PNG to WebP (est. 70% reduction)
2. Add priority to above-fold images
3. Compress all images

---

## Rendering Strategy

| Route | Current | Recommended | Reason |
|-------|---------|-------------|--------|
| / | SSR | Static | No dynamic content |
| /blog/[slug] | SSR | ISR (1h) | Changes infrequently |
| /dashboard | SSR | SSR | User-specific |

---

## Caching Analysis

### Current Cache Headers

| Resource | Cache-Control | Recommendation |
|----------|---------------|----------------|
| /*.js | no-store | max-age=31536000, immutable |
| /api/* | none | max-age=300, stale-while-revalidate=600 |
| /images/* | none | max-age=31536000, immutable |

---

## Network Waterfall Issues

1. **No preloading** - Critical fonts not preloaded
2. **Sequential loads** - Resources loading one after another
3. **No prefetching** - Likely next pages not prefetched

---

## Prioritized Actions

### Immediate (High Impact, Low Effort)

1. **Add image dimensions** - Prevents CLS
   - Effort: 30 min
   - Impact: CLS 0.2 → 0.05

2. **Enable compression** - Smaller transfers
   - Effort: 5 min
   - Impact: Bundle 30% smaller

### This Sprint

1. **Convert to WebP** - Smaller images
   - Effort: 2 hours
   - Impact: Image size 60% reduction

2. **Add code splitting** - Faster initial load
   - Effort: 4 hours
   - Impact: Initial JS 40% reduction

### Long-term

1. **ISR for blog posts** - Fewer server renders
2. **Virtual scrolling** - For product lists
3. **Service worker** - Offline support

---

## Performance Budget Compliance

| Budget | Limit | Current | Status |
|--------|-------|---------|--------|
| Initial JS | 250KB | [X]KB | [Pass/Fail] |
| Total Page | 1MB | [X]KB | [Pass/Fail] |
| LCP | 2.5s | [X]s | [Pass/Fail] |
| INP | 200ms | [X]ms | [Pass/Fail] |
| CLS | 0.1 | [X] | [Pass/Fail] |

---

## Monitoring Recommendations

1. Set up Real User Monitoring (RUM)
2. Configure Core Web Vitals tracking
3. Set up alerts for:
   - LCP > 3s
   - CLS > 0.15
   - Error rate > 1%

---

## Metrics

- **Pages Analyzed:** [N]
- **Images Audited:** [N]
- **Components Reviewed:** [N]
- **Total Issues:** [N] (C:[N], H:[N], M:[N], L:[N])

---

## Next Steps

1. Fix critical issues first (biggest LCP/INP/CLS impact)
2. Run Lighthouse after each fix to measure impact
3. Set up RUM for ongoing monitoring
4. Re-run audit monthly

---

**Generated by:** Claude Code
**Audit Type:** Performance
**Version:** 4.0.1
```

### Step 11: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Performance" "performance-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Performance | [performance-audit-NN.md](./performance-audit-NN.md) | [Grade] | [LCP: Xms, CLS: X, etc.] |
```

### Step 12: Report Completion

```
Performance Audit Complete

Report saved to: docs/audits/performance-audit-NN.md

Summary:
- Grade: B
- LCP: 3.2s (target: <2.5s) - Needs Work
- INP: 150ms (target: <200ms) - Good
- CLS: 0.18 (target: <0.1) - Needs Work
- Initial JS: 320KB (target: <250KB) - Over budget

Top 3 Issues:
1. Hero image not optimized (LCP +1.2s)
2. Images missing dimensions (CLS 0.15)
3. No code splitting (Initial JS 320KB)

Quick Wins:
1. Add dimensions to images - CLS 0.18 → 0.05
2. Compress hero image - LCP 3.2s → 2.4s
3. Enable Brotli compression - Bundle -30%

Next Steps:
1. Review full report at docs/audits/performance-audit-NN.md
2. Fix image dimensions first (biggest CLS impact)
3. Optimize hero image (biggest LCP impact)
4. Run Lighthouse to verify improvements

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | All Core Web Vitals good, <250KB initial JS, optimal caching |
| B | Most metrics good, 1-2 need improvement, <400KB initial JS |
| C | Some metrics need improvement, missing optimizations |
| D | Multiple metrics poor, significant performance issues |
| F | Critical performance issues, >4s LCP, >500ms INP |

## Quick Reference

### Next.js Optimizations

```typescript
// Image optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority  // LCP image
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// Code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
});

// Static generation
export const dynamic = 'force-static';

// ISR
export const revalidate = 3600;  // 1 hour
```

### React Performance Patterns

```typescript
// Memoize expensive calculations
const sortedItems = useMemo(() =>
  items.sort((a, b) => a.price - b.price),
  [items]
);

// Stable callback references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Prevent re-renders
const MemoizedComponent = React.memo(ExpensiveComponent);
```

## References

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Version:** 4.0.1
