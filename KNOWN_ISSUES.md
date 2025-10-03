# Known Issues, Limitations & Technical Debt

**Last Updated:** 2025-10-02 Session 6
**Status:** No blocking issues. Site is deployment-ready.

---

## 🟢 No Blocking Issues

**Current Status:** All critical bugs fixed. No blockers for deployment.

- ✅ All 141 articles rendering correctly
- ✅ All 498 images loading (desktop variants fixed)
- ✅ Search working
- ✅ Dark mode working
- ✅ Mobile responsive
- ✅ Build succeeds (153 pages)
- ✅ Security headers configured

---

## 🟡 Non-Critical Warnings

### 1. Build Warning: Missing `metadataBase`

**Severity:** Low
**Impact:** None for static export
**Status:** Monitor

**Warning Message:**
```
Warning: metadata should have metadataBase property for absolute URLs in Open Graph images
```

**Context:**
- Only matters if using absolute URLs in OG images
- We use relative paths (`/images/...`)
- Works fine for static export

**Fix (if needed):**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://inevitableeth.com'),
  // ... rest of metadata
};
```

**Decision:** Don't fix unless OG images don't render correctly on social media platforms. Test after deployment.

---

### 2. Turbopack Beta Status

**Severity:** Low
**Impact:** Minimal
**Status:** Monitor

**Context:**
- Turbopack still in beta
- Works perfectly for our use case
- Next.js 15 officially supports it

**Risks:**
- Edge cases may require fallback to Webpack
- Breaking changes possible (unlikely)

**Mitigation:**
- Can fallback to Webpack by removing `--turbopack` flag
- Lock Next.js version to prevent surprise updates

**Decision:** Continue using Turbopack. It's stable and much faster.

---

## 🔵 Limitations (By Design)

### 1. Static Export Limitations

**What doesn't work with `output: 'export'`:**
- ❌ Server-side rendering (SSR)
- ❌ Incremental Static Regeneration (ISR)
- ❌ API routes
- ❌ next/image Image Optimization API
- ❌ Middleware
- ❌ `async headers()` function

**Why this is OK:**
- We don't need any of these features
- Static export gives us best performance and deployment options
- All features are working via alternatives (custom image optimization, `_headers` file)

**If we ever need these:**
- Deploy to Vercel with standard Next.js build
- Add server runtime
- Re-evaluate static export decision

---

### 2. Client-Side Search Limitations

**Current approach:** Fuse.js client-side search

**Limitations:**
- ❌ Search index must be downloaded (currently 52.36 KB)
- ❌ No server-side analytics on search queries
- ❌ Limited to fuzzy text search (no faceted search)
- ❌ Index size grows with content

**When to reconsider:**
- Search index exceeds 500 KB
- Content grows beyond 500 articles
- Need advanced search features (faceted, filters, analytics)
- User feedback indicates search is too slow

**Alternatives for future:**
- Algolia (costs money, vendor lock-in, but excellent UX)
- Typesense (open source, self-hosted)
- Server-side search with Vercel deployment

---

### 3. No User Authentication

**By design:** No user accounts, no auth

**Limitations:**
- ❌ Can't track individual user progress
- ❌ Can't personalize content
- ❌ Can't restrict access
- ❌ Community contributions require GitHub account

**Why this is OK:**
- Educational content should be open
- GitHub-based contributions work well for technical audience
- Can add auth later if needed (Clerk, Supabase Auth, NextAuth)

**If we add auth later:**
- Use Clerk (easiest) or Supabase Auth
- Progressive enhancement: site works without login
- Only require auth for submissions, not reading

---

### 4. No Real-Time Features

**By design:** Static site, no WebSocket/real-time

**Limitations:**
- ❌ No live comments/chat
- ❌ No real-time collaboration
- ❌ No live notifications
- ❌ Content updates require rebuild

**Why this is OK:**
- Content doesn't change frequently (articles, not tweets)
- GitHub Discussions (via Giscus) provides async comments
- Build + deploy takes 2-3 minutes (acceptable)

**If we add real-time later:**
- Ably, Pusher, or Supabase Realtime
- Only for specific features (comments, notifications)
- Keep content delivery static

---

## 📝 Technical Debt

### 1. Image Optimization Build Time

**Issue:** Optimizing 498 images takes several minutes

**Impact:** Slows down CI/CD if running on every commit

**Current approach:**
- Only run when images actually change
- Commit optimized images to git
- ~3,000 optimized files in repo

**Future optimization:**
- Cache optimized images in CI/CD
- Only re-optimize changed images
- Consider CDN with on-demand optimization (Cloudflare Images)

**Priority:** Low (not blocking, workaround exists)

---

### 2. Dual Config Strategy

**Issue:** Maintaining two Next.js configs (`next.config.ts` and `next.config.cloudflare.ts`)

**Impact:** Must remember to update both when changing config

**Current approach:**
```bash
npm run build:cloudflare
# Temporarily swaps configs, builds, then reverts
```

**Why this exists:**
- `output: 'export'` breaks dev mode
- Can't use single config with env vars

**Future improvement:**
- Script to merge configs
- Better validation that configs stay in sync
- Or: accept this is simplest approach

**Priority:** Low (works reliably, just slightly inelegant)

---

### 3. Search Index Prebuild

**Issue:** Search index auto-builds on every `npm run build`

**Impact:** Adds ~1-2 seconds to build time

**Current approach:**
```json
"prebuild": "npm run build-search-index"
```

**Future optimization:**
- Only rebuild if content changed
- Cache index if content hash unchanged
- Parallelize with main build

**Priority:** Low (1-2 seconds is acceptable)

---

### 4. No Automated Testing

**Issue:** No unit tests, integration tests, or E2E tests

**Impact:** Regressions possible when making changes

**Current mitigation:**
- TypeScript catches type errors
- Manual testing before deploy
- Lighthouse CI will catch performance regressions

**Future improvement:**
- Vitest for unit tests (lib utilities)
- Playwright for E2E tests (critical paths)
- Visual regression testing (Chromatic, Percy)

**Priority:** Medium (would improve confidence, but not urgent)

---

### 5. No CI/CD Pipeline

**Issue:** No automated checks on PRs

**Impact:** Can merge broken code

**Future setup:**
1. GitHub Actions workflow
2. Run on every PR:
   - Lint (`npm run lint`)
   - Type check (`npx tsc --noEmit`)
   - Build (`npm run build`)
   - Link checker (`npm run check-links`)
   - Lighthouse CI (performance budgets)
3. Auto-deploy on merge to main

**Priority:** Medium (important for multi-contributor project)

---

## 🐛 Edge Cases to Monitor

### 1. Very Long Articles

**Scenario:** Article with >10,000 words or >100 images

**Potential issues:**
- Page size may exceed reasonable limits
- TOC may become unwieldy
- Reading time calculation may be inaccurate for very technical content

**Mitigation:**
- Monitor article sizes
- Consider pagination or "read more" for extremely long articles
- Adjust reading time for dense technical content (slower than 200 wpm)

**Status:** No articles this long yet

---

### 2. Special Characters in Slugs

**Scenario:** Article slug with emojis, non-ASCII, or special characters

**Current handling:**
- Slugs are file names, so limited to filesystem-safe characters
- Migration script handles this

**Potential issues:**
- URL encoding edge cases
- Cross-platform compatibility (Windows vs Unix)

**Mitigation:**
- Stick to lowercase alphanumeric + hyphens
- Validate slugs in frontmatter schema

**Status:** No issues observed

---

### 3. Circular Related Articles

**Scenario:** Article A → Article B → Article C → Article A

**Potential issues:**
- Infinite loops in related article traversal
- Confusing navigation

**Current handling:**
- Related articles only go 1 level deep
- No traversal algorithm to cause loops

**Mitigation:**
- If we add "related article chains" feature, implement cycle detection

**Status:** No issue currently

---

### 4. Missing Images

**Scenario:** MDX references image that doesn't exist

**Current handling:**
- Browser shows broken image
- No build-time validation

**Future improvement:**
- Script to validate all image references exist
- Run in CI to catch before deploy

**Workaround:**
- Run `npm run check-links` (checks internal links, but not images)
- Manual testing

**Priority:** Low (hasn't been an issue)

---

## 🔒 Security Considerations

### 1. User-Generated Content (Future)

**If/when we add user submissions:**

**Required security measures:**
1. ✅ DOMPurify sanitization (already implemented)
2. ✅ CSP headers (already implemented)
3. ⏳ Rate limiting on submission endpoints
4. ⏳ reCAPTCHA or similar spam prevention
5. ⏳ Moderation queue before publishing
6. ⏳ Input validation (max lengths, allowed characters)

**Status:** Not needed yet (no user submissions)

---

### 2. Third-Party Scripts

**Current:** No third-party scripts (no analytics, no ads, no tracking)

**If adding analytics (Plausible/PostHog):**
- Ensure privacy-focused
- Update CSP headers to allow analytics domain
- Add to privacy policy

**If adding comments (Giscus):**
- Runs in iframe (isolated)
- Verify CSP allows GitHub Discussions domain
- Users authenticate via GitHub (we don't handle auth)

---

### 3. Dependency Vulnerabilities

**Current approach:** Manual `npm audit`

**Future improvement:**
- Dependabot alerts (GitHub)
- Automated PR for dependency updates
- Snyk or similar scanning

**Priority:** Medium (should set up before going multi-contributor)

---

## 📊 Performance Monitoring

### Areas to Monitor Post-Launch

1. **Core Web Vitals**
   - LCP: Target < 2s (currently 2.6s)
   - CLS: Target < 0.05 (currently excellent)
   - INP: Target < 200ms (currently excellent)

2. **Search Performance**
   - Index load time
   - Search query time
   - User feedback on search quality

3. **Image Loading**
   - Ensure all images load
   - Monitor for 404s
   - Check CDN cache hit rates

4. **Build Times**
   - Currently ~2-3 minutes
   - Watch for increases as content grows

---

## 🔄 When to Revisit

### Content Growth Triggers

- **500 articles:** Reconsider search strategy, category organization
- **1,000 images:** Evaluate CDN strategy, build optimization
- **10,000+ daily visitors:** Review hosting plan, consider CDN upgrades

### Feature Requests Triggers

- **User submissions:** Add database, moderation, auth
- **Real-time needs:** Evaluate server runtime
- **Personalization:** Add auth, user profiles

### Technical Triggers

- **Build time > 10 minutes:** Optimize image processing, search indexing
- **Search index > 500 KB:** Move to server-side search or better compression
- **Performance regression:** Review bundle sizes, lazy loading, caching

---

## 📝 How to Report New Issues

**For contributors:**

1. Check this file first (may already be known)
2. Reproduce in clean environment
3. Create GitHub issue with:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (browser, OS, etc.)
4. Label appropriately (bug, enhancement, technical-debt)
5. Update this file if confirmed issue

---

## Related Documentation

- **CLAUDE.md** - Developer guide
- **PRD.md** - Product requirements
- **DECISIONS.md** - Technical decisions
- **tasks/next-steps.md** - Action items
