---
name: code-review-infrastructure
description: Serverless/hosting cost optimization audit - runtime, invocations, bandwidth, caching
---

# /code-review-infrastructure Command

Conduct a thorough infrastructure and serverless cost optimization audit. This command **NEVER makes changes** - it only identifies cost drivers and suggests optimizations. Fixes happen in a separate session after review.

**Platform flags:** `--vercel`, `--aws`, `--cloudflare`, `--netlify`, `--railway`, `--fly`

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Auto-detect platform if no flag provided** - Use platform detection helpers
3. **Focus on cost drivers** - Serverless costs can explode unexpectedly
4. **Quantify impact** - Estimate cost/performance impact where possible

## When to Use This Command

**Good times:**
- Vercel/AWS/Cloudflare bill is higher than expected
- Before scaling to production
- After adding new API routes or serverless functions
- When pages are slow (cold starts, timeouts)
- When bandwidth costs are growing

**Bad times:**
- Project has no serverless components
- Still in early prototype phase
- Using traditional server hosting only

## Platform Detection

```bash
# Auto-detect platform from project files
source scripts/common-functions.sh
PLATFORM=$(detect_hosting_platform)
echo "Detected platform: $PLATFORM"
```

**Override with flag:**
- `--vercel` - Force Vercel-specific checks
- `--aws` - Force AWS Lambda/Serverless checks
- `--cloudflare` - Force Cloudflare Workers checks
- `--netlify` - Force Netlify Functions checks
- `--railway` - Force Railway checks
- `--fly` - Force Fly.io checks

## Execution Steps

### Step 0: Set Expectations

```
Infrastructure Cost Audit

Platform: [auto-detected or flag]
Scope: Runtime, invocations, bandwidth, caching, build optimization

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...
```

### Step 1: Platform Detection & Setup

```bash
# Detect platform
source scripts/common-functions.sh
PLATFORM=$(detect_hosting_platform)
FRAMEWORK=$(detect_framework)

# Report detected stack
echo "Platform: $PLATFORM"
echo "Framework: $FRAMEWORK"
```

**Find key files by platform:**

| Platform | Config Files | Cost Factors |
|----------|--------------|--------------|
| Vercel | `vercel.json`, `.vercel/` | Serverless invocations, bandwidth, build time |
| AWS | `serverless.yml`, `sam.yaml` | Lambda invocations, API Gateway, S3 |
| Cloudflare | `wrangler.toml` | Workers invocations, KV reads/writes |
| Netlify | `netlify.toml` | Functions invocations, bandwidth |

### Step 2: Cost Surface Inventory

**Identify all cost-generating components:**

```markdown
## Cost Surface Inventory

| Component | Type | Est. Invocations/Day | Cost Factor |
|-----------|------|---------------------|-------------|
| /api/auth/login | API Route | ~1,000 | Medium |
| /api/products | API Route | ~50,000 | High |
| /dashboard | SSR Page | ~10,000 | High |
| Image optimization | Built-in | ~5,000 | Medium |
| Edge middleware | Middleware | ~100,000 | High |
```

**Scan for cost-generating files:**

```bash
# Find API routes (Next.js App Router)
find app -name "route.ts" -o -name "route.js" | head -20

# Find API routes (Next.js Pages Router)
find pages/api -name "*.ts" -o -name "*.js" 2>/dev/null | head -20

# Find server components doing data fetching
grep -rn "async function" app/ --include="*.tsx" | grep -v "use client" | head -20

# Find middleware
ls middleware.ts middleware.js 2>/dev/null

# Find edge functions
grep -rn "export const runtime = 'edge'" --include="*.ts" --include="*.tsx"
```

### Step 3: Runtime Analysis

**Check for slow handlers:**

```typescript
// SLOW: Synchronous operations in serverless
export async function GET() {
  const data = await db.query();  // No timeout
  const processed = heavyComputation(data);  // CPU-bound
  return Response.json(processed);
}

// BETTER: With timeout and streaming
export async function GET() {
  const data = await Promise.race([
    db.query(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
  ]);
  return new Response(stream, { headers: { 'Content-Type': 'application/json' } });
}
```

**Check for:**

- [ ] **Function timeouts** - Default is often too short/long
- [ ] **Cold starts** - Large bundles increase cold start time
- [ ] **CPU-intensive operations** - Should be offloaded or cached
- [ ] **Memory usage** - Oversized functions cost more
- [ ] **Concurrent execution** - Can hit limits under load

**Search for issues:**
```bash
# Find potentially slow operations
grep -rn "JSON.parse\|JSON.stringify" --include="*.ts" app/api/
grep -rn "for.*await" --include="*.ts" app/api/
grep -rn "\.map.*await\|\.forEach.*await" --include="*.ts" app/api/
```

### Step 4: Invocation Pattern Analysis

**Identify chatty patterns:**

```typescript
// BAD: Multiple API calls from client
useEffect(() => {
  fetch('/api/user');
  fetch('/api/settings');
  fetch('/api/notifications');
  fetch('/api/recent-activity');
  // 4 serverless invocations per page load!
}, []);

// BETTER: Single aggregated endpoint
useEffect(() => {
  fetch('/api/dashboard-data');  // Returns all needed data
}, []);
```

**Check for:**

- [ ] **Chatty clients** - Multiple small API calls
- [ ] **Polling** - setInterval hitting serverless endpoints
- [ ] **No caching** - Same data fetched repeatedly
- [ ] **Client-side data fetching** - Could be server-side
- [ ] **Unnecessary API routes** - Could be static data

**Search commands:**
```bash
# Find polling patterns
grep -rn "setInterval" --include="*.ts" --include="*.tsx" | grep -i "fetch\|api"

# Find multiple fetches in components
grep -rn "useEffect" --include="*.tsx" -A 10 | grep "fetch.*api"
```

### Step 5: Bandwidth Analysis

**Check response sizes:**

```typescript
// BAD: Returning entire objects
export async function GET() {
  const products = await db.product.findMany();
  return Response.json(products);  // Could be megabytes
}

// BETTER: Select only needed fields
export async function GET() {
  const products = await db.product.findMany({
    select: { id: true, name: true, price: true }
  });
  return Response.json(products);
}
```

**Check for:**

- [ ] **Large responses** - Over 1MB responses
- [ ] **No compression** - gzip/brotli not enabled
- [ ] **Unoptimized images** - Not using Next.js Image or similar
- [ ] **No pagination** - Returning all records
- [ ] **Duplicate data** - Same data in multiple responses

### Step 6: Build Pipeline Analysis

**Check build configuration:**

```bash
# Check build output size
ls -la .next/standalone/ 2>/dev/null || ls -la .vercel/output/ 2>/dev/null

# Check for large dependencies
npm ls --prod --depth=0 2>/dev/null | head -30

# Check for development dependencies in production
grep -E "devDependencies" package.json
```

**Check for:**

- [ ] **Build time** - Unusually long builds
- [ ] **Bundle size** - Large client bundles
- [ ] **Dependency bloat** - Unused or large dependencies
- [ ] **Build caching** - Proper caching configured
- [ ] **Static generation** - Pages that could be pre-built

### Step 7: Rendering Strategy Analysis

**Evaluate rendering choices:**

| Page | Current | Should Be | Reason |
|------|---------|-----------|--------|
| /about | SSR | Static | Content doesn't change |
| /blog/[slug] | SSR | ISR | Changes infrequently |
| /dashboard | SSR | SSR | User-specific data |
| /products | SSR | ISR/Static | Catalog changes rarely |

**Check for:**

- [ ] **Unnecessary SSR** - Static pages rendered server-side
- [ ] **Missing ISR** - Pages that could use revalidation
- [ ] **No static generation** - Build-time rendering unused
- [ ] **Client-side only** - Heavy pages with no SSR
- [ ] **Edge rendering** - Could reduce latency

### Step 8: External Calls Analysis

**Check for problematic external calls:**

```typescript
// BAD: No timeout on external API
const data = await fetch('https://external-api.com/data');

// BAD: Sequential external calls
const user = await fetch('https://api1.com/user');
const orders = await fetch('https://api2.com/orders');

// BETTER: Parallel with timeout
const [user, orders] = await Promise.all([
  fetchWithTimeout('https://api1.com/user', 5000),
  fetchWithTimeout('https://api2.com/orders', 5000)
]);
```

**Check for:**

- [ ] **No timeouts** - External calls without timeout
- [ ] **Sequential calls** - Could be parallel
- [ ] **No retries** - Single failure causes error
- [ ] **No circuit breaker** - Cascading failures
- [ ] **Uncached external data** - Same data fetched repeatedly

### Step 9: Logging & Monitoring Analysis

**Check for logging overhead:**

```typescript
// BAD: Excessive logging in production
export async function GET() {
  console.log('Request received:', JSON.stringify(request));
  console.log('Processing...');
  console.log('Step 1 complete');
  console.log('Step 2 complete');
  // etc...
}

// BETTER: Structured logging with levels
export async function GET() {
  logger.info('Request received', { endpoint: '/api/data' });
  // Process...
  logger.debug('Processing complete', { duration: elapsed });
}
```

**Check for:**

- [ ] **Console.log in production** - Should use structured logging
- [ ] **Logging sensitive data** - PII in logs
- [ ] **No log levels** - Everything logged equally
- [ ] **Missing error tracking** - Errors not captured
- [ ] **No performance monitoring** - No visibility into issues

### Step 10: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "infrastructure" "docs/audits"

# Option 2: Manual check - list existing infrastructure audits
ls docs/audits/infrastructure-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/infrastructure-audit-NN.md`:

```markdown
# Infrastructure Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Infrastructure |
| Platform | [Vercel/AWS/Cloudflare/etc.] |
| Framework | [Next.js/Remix/etc.] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Estimated Monthly Cost Drivers:**
1. [Highest cost factor] - Est. $XX/month
2. [Second highest]
3. [Third highest]

**Quick Stats:**
- API Routes analyzed: [N]
- Pages analyzed: [N]
- High-cost endpoints: [N]
- Optimization opportunities: [N]

---

## Cost Surface Inventory

| Component | Type | Est. Daily Invocations | Est. Monthly Cost | Priority |
|-----------|------|------------------------|-------------------|----------|
| /api/products | API Route | 50,000 | $15 | High |
| Edge middleware | Middleware | 100,000 | $10 | High |
| Image optimization | Built-in | 5,000 | $5 | Medium |

**Total Estimated Monthly Cost:** $XX

---

## Findings

### Critical

#### INF-C1: [Issue Title]
- **Severity:** Critical
- **Cost Driver:** [Runtime/Invocations/Bandwidth/Build]
- **Location:** `path/to/file.ts:123`
- **Issue:** [Description]
- **Evidence:**
```typescript
// Problematic code
```
- **Impact:** Est. $XX/month savings
- **Suggested Fix:**
```typescript
// Fixed code
```

### High Priority

[Same format]

### Medium Priority

[Same format]

---

## Cross-Cutting Recommendations

### Caching Strategy

| Data | Current TTL | Recommended TTL | Method |
|------|-------------|-----------------|--------|
| Product catalog | None | 1 hour | ISR |
| User settings | None | Request-level | React cache() |
| Static assets | Default | 1 year | CDN headers |

### Rendering Strategy Changes

| Page | Current | Recommended | Impact |
|------|---------|-------------|--------|
| /about | SSR | Static | -1,000 invocations/day |
| /blog | SSR | ISR (1h) | -5,000 invocations/day |

### Build Optimizations

- [ ] Enable build caching
- [ ] Remove unused dependencies
- [ ] Optimize bundle splitting

---

## Measurement Plan

### Key Metrics to Track

| Metric | Current | Target | Tool |
|--------|---------|--------|------|
| Function invocations | ? | -30% | Vercel Analytics |
| Avg response time | ? | <200ms | Vercel Logs |
| Build time | ? | <2min | CI/CD |
| Bundle size | ? | <200KB | Bundlephobia |

### Recommended Monitoring

1. Set up Vercel Analytics for real-time insights
2. Configure alerts for:
   - Function duration > 5s
   - Error rate > 1%
   - Bandwidth spikes

---

## Prioritized Actions

### Immediate (This Sprint)

1. **[INF-C1]** Implement response caching
   - File: `app/api/products/route.ts`
   - Effort: 30 minutes
   - Est. Savings: $X/month

2. **[INF-H1]** Convert /about to static
   - File: `app/about/page.tsx`
   - Effort: 15 minutes
   - Est. Savings: $X/month

### Short-term (This Month)

[More items]

### Long-term (Backlog)

[More items]

---

## Platform-Specific Notes

### Vercel-Specific
- [Any Vercel-specific findings]
- [Vercel-specific optimizations]

---

## Metrics

- **Files Analyzed:** [N]
- **API Routes:** [N]
- **Pages:** [N]
- **Total Issues:** [N] (C:[N], H:[N], M:[N], L:[N])
- **Est. Monthly Savings:** $[X]

---

## Next Steps

1. Review findings with team
2. Implement quick wins first (caching, static pages)
3. Set up monitoring to measure impact
4. Re-run audit after optimizations

---

**Generated by:** Claude Code
**Audit Type:** Infrastructure Cost Optimization
**Version:** 4.0.1
```

### Step 11: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Infrastructure" "infrastructure-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Infrastructure | [infrastructure-audit-NN.md](./infrastructure-audit-NN.md) | [Grade] | [Cold start issues, caching gaps, etc.] |
```

### Step 12: Report Completion

```
Infrastructure Audit Complete

Report saved to: docs/audits/infrastructure-audit-NN.md

Summary:
- Grade: C+
- Critical Issues: 2 (excessive SSR, no caching)
- High Priority: 5
- Medium Priority: 8
- Est. Monthly Savings: $150

Top 3 Cost Drivers:
1. Unnecessary SSR on static pages (30,000 invocations/day)
2. No response caching on /api/products (50,000 invocations/day)
3. Chatty client-side fetching (4 calls per page load)

Quick Wins:
1. Convert /about, /pricing to static - Est. $30/month savings
2. Add Cache-Control to /api/products - Est. $40/month savings
3. Aggregate dashboard API calls - Est. $25/month savings

Next Steps:
1. Review full report at docs/audits/infrastructure-audit-NN.md
2. Implement quick wins first
3. Set up Vercel Analytics
4. Re-run audit to measure improvement

No changes were made during this audit.
```

## Common Patterns by Platform

### Vercel Patterns

**Unnecessary SSR:**
```typescript
// BAD: SSR for static content
// app/about/page.tsx
export default async function About() {
  return <div>About us...</div>;  // No dynamic data!
}

// GOOD: Force static
// app/about/page.tsx
export const dynamic = 'force-static';
export default function About() {
  return <div>About us...</div>;
}
```

**Edge Function Overuse:**
```typescript
// BAD: Edge for database access (can't connect directly)
export const runtime = 'edge';
export async function GET() {
  const data = await prisma.user.findMany();  // Won't work!
}

// GOOD: Edge for compute-only tasks
export const runtime = 'edge';
export async function GET() {
  const token = await verifyJWT(request);  // Good use of edge
}
```

### AWS Lambda Patterns

**Cold Start Mitigation:**
```typescript
// BAD: Heavy imports at top level
import { BigLibrary } from 'big-library';

// GOOD: Dynamic imports
export async function handler() {
  const { BigLibrary } = await import('big-library');
}
```

### Cloudflare Workers Patterns

**KV Optimization:**
```typescript
// BAD: KV read in every request
export async function fetch(request) {
  const config = await CONFIG.get('settings');  // KV read = cost
}

// GOOD: Cache KV reads
const configCache = new Map();
export async function fetch(request) {
  if (!configCache.has('settings')) {
    configCache.set('settings', await CONFIG.get('settings'));
  }
  const config = configCache.get('settings');
}
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | Optimal rendering strategy, proper caching, minimal cold starts, monitored |
| B | Good caching, some SSR optimization needed, reasonable bundle size |
| C | Missing caching, unnecessary SSR, some chatty patterns |
| D | Significant waste: no caching, all SSR, chatty APIs, large bundles |
| F | Critical issues: timeout errors, excessive costs, no monitoring |

## Cost Estimation Guide

| Resource | Vercel | AWS | Cloudflare |
|----------|--------|-----|------------|
| Serverless invocation | $0.60/1M | $0.20/1M | $0.50/1M |
| Bandwidth (GB) | $0.15 | $0.09 | $0.05 |
| Build minutes | $0.01/min | N/A | N/A |
| Edge requests | $2.00/1M | N/A | Free tier |

## References

- [Vercel Pricing](https://vercel.com/pricing)
- [Next.js Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

---

**Version:** 4.0.1
