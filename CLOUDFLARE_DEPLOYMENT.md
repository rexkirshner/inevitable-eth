# Cloudflare Pages Deployment Guide

## Configuration Complete ✅

Your project is now configured for Cloudflare Pages static export deployment!

### Changes Made

1. **next.config.ts**
   - Added `output: 'export'` for static site generation
   - Added `images: { unoptimized: true }` (images already optimized via custom renderer)
   - Removed `async headers()` (not compatible with static export)

2. **public/_headers**
   - Created Cloudflare Pages headers file with security policies:
     - Content Security Policy (CSP)
     - X-Frame-Options: DENY
     - X-Content-Type-Options: nosniff
     - Referrer-Policy: strict-origin-when-cross-origin
     - Permissions-Policy for camera/microphone/geolocation

3. **app/robots.ts & app/sitemap.ts**
   - Added `export const dynamic = 'force-static'` to both files

### Build Verification

✅ Static export successful: **153 pages generated**
✅ Output directory: `out/`
✅ Security headers: `out/_headers` (417 bytes)
✅ All 624 images copied to `out/images/`

---

## Deployment Steps

### Option 1: Cloudflare Dashboard (Recommended for first deploy)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Cloudflare Pages static export"
   git push
   ```

2. **Connect Cloudflare Pages to GitHub**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** > **Create a project**
   - Click **Connect to Git**
   - Select your GitHub repository: `inevitable-eth`

3. **Configure Build Settings**:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (unless monorepo)
   - **Node version**: 18 or higher (set via environment variable if needed)

4. **Environment Variables** (if any):
   - Currently none required
   - Add in **Settings** > **Environment variables** if needed in future

5. **Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will build and deploy your site
   - First build takes ~2-5 minutes

### Option 2: Cloudflare Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy (from project root)
npx wrangler pages deploy out --project-name=inevitable-eth
```

---

## Post-Deployment

### Custom Domain Setup

1. Go to **Pages** > **Your Project** > **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `inevitableeth.com`
4. Follow DNS configuration instructions
5. Cloudflare will automatically provision SSL certificate

### Verify Security Headers

After deployment, verify headers are working:

```bash
curl -I https://your-site.pages.dev
```

You should see:
- `content-security-policy`
- `x-frame-options: DENY`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy`

### Cloudflare Pages Features (Free Tier)

✅ **Unlimited bandwidth** (no caps!)
✅ **Unlimited requests**
✅ **500 builds per month**
✅ **Automatic SSL/TLS**
✅ **Global CDN** (300+ cities)
✅ **DDoS protection**
✅ **Git integration** (auto-deploy on push)
✅ **Preview deployments** (for PRs)
✅ **Rollback support**
✅ **Web Analytics** (free, privacy-first)

---

## Local Testing of Static Export

Before deploying, test the static export locally:

```bash
# Build static export
npm run build

# Serve the out directory (choose one):

# Option 1: Using npx serve
npx serve out

# Option 2: Using Python
cd out && python3 -m http.server 8000

# Option 3: Using Node.js http-server
npx http-server out
```

Then visit http://localhost:8000 (or whatever port shown) to verify.

---

## Continuous Deployment

Once connected to GitHub, Cloudflare Pages will automatically:
- Build and deploy on every push to `main` branch
- Create preview deployments for pull requests
- Send build status notifications

### Build Settings Summary

| Setting | Value |
|---------|-------|
| Framework | Next.js (Static Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 18+ |

---

## Troubleshooting

### Build Fails on Cloudflare

1. **Check Node version**: Ensure Node 18+ via environment variable:
   - Key: `NODE_VERSION`
   - Value: `18`

2. **Check build logs**: Cloudflare dashboard shows detailed build output

3. **Test locally first**: Always run `npm run build` locally before pushing

### Headers Not Working

- Verify `public/_headers` exists (it should be auto-copied to `out/_headers`)
- Check Cloudflare Pages docs: https://developers.cloudflare.com/pages/platform/headers/

### Images Not Loading

- Verify images exist in `out/images/` after build
- Check browser console for 404s
- Ensure image paths start with `/images/...`

---

## Performance Optimizations Already Applied

✅ Responsive image tags (WebP/AVIF with fallbacks)
✅ Content caching (module-level & Map-based)
✅ Dynamic imports (code splitting)
✅ Search debouncing (300ms)
✅ DOMPurify sanitization
✅ Prebuild search index optimization

---

## Monitoring & Analytics

### Free Options:

1. **Cloudflare Web Analytics** (recommended):
   - Privacy-first (no cookies)
   - Free unlimited page views
   - Enable in **Pages** > **Settings** > **Web Analytics**

2. **Vercel Analytics** (alternative):
   - Can still use on Cloudflare Pages
   - Requires `@vercel/analytics` package

3. **Google Analytics** (if needed):
   - Add via custom script in `app/layout.tsx`

---

## Next Steps

1. ✅ Configuration complete
2. ✅ Static export verified
3. 🔜 Push to GitHub
4. 🔜 Connect Cloudflare Pages to repo
5. 🔜 Configure build settings
6. 🔜 Deploy!
7. 🔜 Set up custom domain
8. 🔜 Enable Web Analytics

---

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Community](https://community.cloudflare.com/)

---

**Project is production-ready for Cloudflare Pages deployment! 🚀**
