# Performance Review Checklist

Comprehensive performance audit for web applications and APIs.

**When to use:** During `/code-review` for all projects, especially client-facing applications.

## Quick Check (5 minutes)

Essential performance items:

- [ ] **Core Web Vitals** - LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Bundle size** - JavaScript bundles reasonably sized (<250KB initial)
- [ ] **Images optimized** - Compressed, modern formats (WebP/AVIF), lazy loaded
- [ ] **No render blocking** - Critical CSS inline, defer non-critical JS
- [ ] **Caching configured** - Appropriate cache headers on static assets

## Core Web Vitals

### LCP (Largest Contentful Paint)
**Target: < 2.5 seconds**

What it measures: Time until largest content element renders

**Common Issues:**
- Unoptimized images
- Slow server response time
- Render-blocking JavaScript/CSS
- Client-side rendering delays
- No resource prioritization

**Fixes:**
```markdown
- Optimize and compress images
- Use Next.js Image component or similar
- Preload critical resources
- Server-side render or static generate
- Use CDN for static assets
- Optimize server response time
```

### FID (First Input Delay) / INP (Interaction to Next Paint)
**Target: < 100ms (FID) or < 200ms (INP)**

What it measures: Responsiveness to user interactions

**Common Issues:**
- Long-running JavaScript tasks
- Large bundles blocking main thread
- Heavy third-party scripts
- Unoptimized event handlers

**Fixes:**
```markdown
- Code splitting and lazy loading
- Break up long tasks
- Use Web Workers for heavy computation
- Defer non-critical third-party scripts
- Optimize event handlers (debounce/throttle)
```

### CLS (Cumulative Layout Shift)
**Target: < 0.1**

What it measures: Visual stability during page load

**Common Issues:**
- Images without dimensions
- Ads/embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamic content injection above existing content

**Fixes:**
```markdown
- Specify width/height on all images
- Reserve space for ads and embeds
- Use font-display: swap or optional
- Load content below fold, not above
- Use CSS aspect-ratio for responsive images
```

## JavaScript Performance

### Bundle Size

- [ ] **Initial bundle** - < 250KB (gzipped)
- [ ] **Code splitting** - Route-based splitting implemented
- [ ] **Lazy loading** - Non-critical components lazy loaded
- [ ] **Tree shaking** - Unused code eliminated
- [ ] **Minification** - Production builds minified
- [ ] **Source maps** - Separate, not inline in production

**Check bundle size:**
```bash
# Next.js
npm run build
# Look for "First Load JS" in output

# Vite
npm run build
# Check dist/ folder sizes

# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer
```

### Code Efficiency

- [ ] **Memoization** - Expensive calculations memoized (React.memo, useMemo)
- [ ] **Avoid re-renders** - useCallback for functions passed to children
- [ ] **Virtual scrolling** - Long lists virtualized (react-window, react-virtualized)
- [ ] **Debouncing/throttling** - Frequent events debounced (scroll, resize, search)
- [ ] **Web Workers** - CPU-intensive tasks moved off main thread

**Example optimizations:**
```javascript
// Bad: Re-renders on every parent render
const ChildComponent = ({ data }) => {
  return <div>{expensiveOperation(data)}</div>;
};

// Good: Memoized to prevent unnecessary re-renders
const ChildComponent = React.memo(({ data }) => {
  const result = useMemo(() => expensiveOperation(data), [data]);
  return <div>{result}</div>;
});

// Bad: New function on every render
<SearchInput onChange={(e) => handleSearch(e.target.value)} />

// Good: Debounced search
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
<SearchInput onChange={(e) => debouncedSearch(e.target.value)} />
```

## Image Optimization

- [ ] **Modern formats** - WebP or AVIF with fallbacks
- [ ] **Compression** - Images compressed (TinyPNG, ImageOptim)
- [ ] **Responsive images** - srcset for different screen sizes
- [ ] **Lazy loading** - loading="lazy" on below-fold images
- [ ] **Dimensions specified** - width/height prevent CLS
- [ ] **CDN delivery** - Images served from CDN
- [ ] **Next-gen components** - Next.js Image or similar optimizer

**Good image implementation:**
```jsx
// Next.js
<Image
  src="/product.jpg"
  alt="Product name"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
  placeholder="blur"
/>

// Standard HTML
<img
  src="/product.webp"
  alt="Product name"
  width="800"
  height="600"
  loading="lazy"
  srcset="/product-400.webp 400w, /product-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
/>
```

## Network Performance

### Resource Loading

- [ ] **Critical CSS inline** - Above-fold CSS inline in <head>
- [ ] **Defer non-critical CSS** - Load non-critical CSS async
- [ ] **Defer JavaScript** - Use defer or async on scripts
- [ ] **Preload critical resources** - <link rel="preload"> for fonts, critical images
- [ ] **Prefetch next pages** - Prefetch likely next navigation
- [ ] **DNS prefetch** - <link rel="dns-prefetch"> for external domains

**Resource hints:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.webp" as="image">

<!-- Prefetch likely next page -->
<link rel="prefetch" href="/about">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="https://api.example.com">
```

### Caching

- [ ] **Cache-Control headers** - Aggressive caching on static assets
- [ ] **Versioned filenames** - Hash in filename for cache busting
- [ ] **Service Worker** - Offline support, cache API responses
- [ ] **CDN caching** - Static assets served from CDN
- [ ] **Browser caching** - Appropriate max-age values

**Cache header examples:**
```
# Static assets (images, fonts, JS, CSS with hash in filename)
Cache-Control: public, max-age=31536000, immutable

# HTML pages
Cache-Control: public, max-age=0, must-revalidate

# API responses (if appropriate)
Cache-Control: public, max-age=300, s-maxage=600
```

### Compression

- [ ] **Gzip/Brotli** - Server compression enabled
- [ ] **Text resources** - All text (HTML, CSS, JS, JSON) compressed
- [ ] **Brotli preferred** - Better compression than gzip if available

**Server config (Next.js):**
```javascript
// next.config.js
module.exports = {
  compress: true, // Enables gzip
};
```

## API Performance

### Response Time

- [ ] **Fast responses** - API responses < 200ms (P95)
- [ ] **Database indexing** - Queries use proper indexes
- [ ] **N+1 queries avoided** - Use joins or batching
- [ ] **Query optimization** - Only fetch needed fields
- [ ] **Connection pooling** - Database connections pooled

### Caching Strategy

- [ ] **Response caching** - Cache expensive API responses
- [ ] **Redis/Memcached** - In-memory cache for frequent queries
- [ ] **Stale-while-revalidate** - Serve stale while updating
- [ ] **Cache invalidation** - Proper invalidation on updates

### Rate Limiting

- [ ] **Rate limits** - Prevent abuse and overload
- [ ] **Graceful degradation** - Handle rate limit errors
- [ ] **Client-side throttling** - Avoid hitting limits

## Rendering Strategy

- [ ] **SSR/SSG when possible** - Server-side render or static generate
- [ ] **Incremental Static Regeneration** - Update static pages without rebuild
- [ ] **Streaming SSR** - Stream HTML as it's generated (React 18)
- [ ] **Selective hydration** - Only hydrate interactive components
- [ ] **Islands architecture** - Ship minimal JS, hydrate islands

**Next.js rendering:**
```javascript
// Static generation (best performance)
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}

// With revalidation
export const revalidate = 3600; // Revalidate every hour

// Server-side rendering (when needed)
export const dynamic = 'force-dynamic';
```

## Database Performance

- [ ] **Proper indexing** - Indexes on frequently queried fields
- [ ] **Query analysis** - EXPLAIN queries to verify index usage
- [ ] **Avoid SELECT *** - Only fetch needed columns
- [ ] **Batch operations** - Bulk inserts/updates when possible
- [ ] **Connection pooling** - Reuse database connections
- [ ] **Read replicas** - Separate read/write databases if needed

**Query optimization:**
```sql
-- Bad: Full table scan
SELECT * FROM users WHERE email = 'user@example.com';

-- Good: Uses index on email column
SELECT id, name, email FROM users WHERE email = 'user@example.com';
-- With index: CREATE INDEX idx_email ON users(email);

-- Bad: N+1 query problem
-- Fetching posts, then author for each post in loop

-- Good: Join to get all data in one query
SELECT posts.*, users.name as author_name
FROM posts
JOIN users ON posts.author_id = users.id
WHERE posts.published = true;
```

## Third-Party Scripts

- [ ] **Audit necessity** - Only include truly necessary scripts
- [ ] **Async/defer loading** - Don't block rendering
- [ ] **Self-host when possible** - Reduce external requests
- [ ] **Partytown** - Run third-party scripts in Web Worker
- [ ] **Monitor impact** - Track third-party script performance

**Optimization strategies:**
```html
<!-- Bad: Blocking third-party script -->
<script src="https://analytics.example.com/script.js"></script>

<!-- Good: Async loading -->
<script async src="https://analytics.example.com/script.js"></script>

<!-- Better: Partytown (off main thread) -->
<script type="text/partytown" src="https://analytics.example.com/script.js"></script>
```

## Common Performance Issues

### Critical

**Massive bundle size:**
```markdown
**Issue:** Initial JavaScript bundle > 1MB
**Location:** Build output
**Severity:** Critical
**Impact:** Slow page loads, poor mobile experience
**Fix:** Implement code splitting, lazy loading, remove unused dependencies
```

**Unoptimized images:**
```markdown
**Issue:** Large PNG images (>1MB each) not optimized
**Location:** public/images/
**Severity:** Critical
**Impact:** Slow LCP (>5s), poor mobile performance
**Fix:** Convert to WebP, compress, use Next.js Image component
```

**No caching:**
```markdown
**Issue:** Static assets have no cache headers
**Location:** Server configuration
**Severity:** Critical
**Impact:** Users re-download same assets on every visit
**Fix:** Add Cache-Control headers with long max-age for versioned assets
```

### High Priority

**Render-blocking resources:**
```markdown
**Issue:** Multiple CSS/JS files block initial render
**Location:** <head> section
**Severity:** High
**Impact:** Slow FCP, poor user experience
**Fix:** Inline critical CSS, defer non-critical resources
```

**N+1 database queries:**
```markdown
**Issue:** Fetching related data in loop (N+1 problem)
**Location:** app/api/posts/route.ts
**Severity:** High
**Impact:** Slow API responses (>2s), database overload
**Fix:** Use JOIN query or batch fetching (DataLoader pattern)
```

**Heavy client-side rendering:**
```markdown
**Issue:** Entire app renders client-side
**Location:** App architecture
**Severity:** High
**Impact:** Slow FCP, poor SEO, high JavaScript cost
**Fix:** Implement SSR or SSG for public pages
```

## Testing Tools

### Automated Tools

- **Lighthouse** - Comprehensive performance audit (Chrome DevTools)
- **WebPageTest** - Detailed performance analysis, filmstrip view
- **PageSpeed Insights** - Google's performance testing with field data
- **Chrome DevTools Performance** - Detailed profiling and analysis
- **Webpack Bundle Analyzer** - Visualize bundle composition

### Manual Testing

- **Network throttling** - Test on 3G/4G speeds (DevTools)
- **CPU throttling** - Test on slower devices (DevTools)
- **Real device testing** - Test on actual mobile devices
- **Performance.mark()** - Custom performance markers
- **React DevTools Profiler** - Profile React component renders

### Monitoring

- **Vercel Analytics** - Real user monitoring for Next.js
- **Sentry Performance** - Track performance in production
- **New Relic** - Application performance monitoring
- **Google Analytics** - Core Web Vitals reporting

## Documentation Format

When documenting performance issues:

```markdown
### Performance Issues

**PERF1: Massive JavaScript bundle**
- **Severity:** Critical
- **Location:** Build output - main bundle 1.2MB (gzipped)
- **Issue:** No code splitting, all routes in single bundle
- **Impact:** Slow page loads (LCP 4.5s), poor mobile experience
- **Metric:** LCP 4.5s (target: <2.5s), FID 250ms (target: <100ms)
- **Suggestion:** Implement route-based code splitting, lazy load non-critical components

**PERF2: Unoptimized images**
- **Severity:** High
- **Location:** public/images/ - 15 images averaging 800KB each
- **Issue:** Large PNG images, no compression, no lazy loading
- **Impact:** Slow LCP (3.8s), wasted bandwidth
- **Metric:** LCP 3.8s, Total image weight: 12MB
- **Suggestion:** Convert to WebP, compress to ~100KB each, add lazy loading, use Next.js Image component
```

## Quick Wins

High-impact, low-effort optimizations:

1. **Add lazy loading to images** - 30 seconds per image
2. **Enable gzip/Brotli compression** - Server config change
3. **Defer non-critical JavaScript** - Add defer attribute
4. **Compress images** - Run through TinyPNG or similar
5. **Add cache headers** - Server configuration update

## Priority Guidelines

**Critical (Block Launch):**
- LCP >4 seconds
- FID >300ms
- Initial bundle >1MB
- No image optimization
- No compression

**High (Fix Before Launch):**
- LCP 2.5-4s
- FID 100-300ms
- No code splitting
- Render-blocking resources
- N+1 database queries

**Medium (Fix Post-Launch):**
- CLS 0.1-0.25
- Suboptimal caching
- Large third-party scripts
- Missing resource hints

**Low (Nice to Have):**
- Further bundle optimization
- Additional caching strategies
- Service Worker implementation
- Advanced image formats (AVIF)

## Performance Budget

Recommended budgets for most web apps:

**Page Weight:**
- HTML: < 50KB (gzipped)
- CSS: < 50KB (gzipped)
- JavaScript: < 250KB initial (gzipped)
- Images: < 500KB total above-fold
- Total: < 1MB initial load

**Timing:**
- Time to First Byte (TTFB): < 600ms
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 200ms

**Network:**
- HTTP requests: < 50 for initial load
- Third-party requests: < 10
- DNS lookups: < 4 domains

## References

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
