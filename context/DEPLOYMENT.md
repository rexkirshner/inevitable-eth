# Deployment Guide

## ✅ Google Analytics Setup Complete

Google Analytics (GA4) is now integrated with measurement ID: **G-9K8VQGCQ5D**

### What Was Done:
1. ✅ Created `components/analytics/google-analytics.tsx` - GA4 tracking component
2. ✅ Added to `app/layout.tsx` - Loads on every page
3. ✅ Updated `.env.example` with GA_MEASUREMENT_ID
4. ✅ Created `.env.local` for local testing

### Verify GA is Working:
1. Visit your local site: `http://localhost:3000`
2. Open browser DevTools → Network tab
3. Look for requests to `www.googletagmanager.com/gtag/js`
4. Or check Real-Time reports in Google Analytics dashboard

---

## 🚀 Cloudflare Pages Deployment

### Step 1: Configure Environment Variables in Cloudflare Pages

When you deploy to Cloudflare Pages, add these environment variables:

```
NEXT_PUBLIC_SITE_URL=https://inevitableeth.com
NEXT_PUBLIC_GITHUB_REPO=https://github.com/rexkirshner/inevitable-eth
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9K8VQGCQ5D
```

**How to add:**
1. Go to your Cloudflare Pages project
2. Settings → Environment variables
3. Add each variable for Production environment
4. Redeploy if already deployed

### Step 2: Build Settings (Already Configured via Worker)
Your Cloudflare Worker should build with:
- Build command: `npm run build:cloudflare`
- Build output: `out/`
- Node version: 18 or higher

---

## 🌐 DNS Configuration for Old Site

To make the old Wiki.js site available at `old.inevitableeth.com`:

### Current DNS Status:
- `inevitableeth.com` → Points to Heroku (Wiki.js)
- `www` → Points to another domain

### What to Do (After New Site is Live):

1. **Add CNAME record for old subdomain:**
   ```
   Type: CNAME
   Name: old
   Value: [your-heroku-app-name].herokuapp.com
   Proxy: OFF (DNS only - gray cloud)
   TTL: Auto
   ```

2. **Update root domain to point to Cloudflare Pages:**
   - This will happen automatically when you add custom domain in Cloudflare Pages
   - Cloudflare will provide instructions

3. **In your Heroku app settings:**
   - Add `old.inevitableeth.com` to the custom domains list
   - This ensures Heroku accepts requests for the subdomain

### Steps in Order:
1. ✅ Deploy new site to Cloudflare Pages
2. ✅ Add `inevitableeth.com` as custom domain in Cloudflare Pages
3. ✅ Verify new site works at `inevitableeth.com`
4. ✅ Add CNAME for `old.inevitableeth.com` → Heroku
5. ✅ Add `old.inevitableeth.com` in Heroku custom domains
6. ✅ Test old site at `old.inevitableeth.com`

---

## 📊 Getting Google Analytics Working on Wiki.js

Wiki.js has built-in Google Analytics support, but it can be tricky. Here's how:

### Method 1: Wiki.js Admin UI (Recommended)

1. Log into Wiki.js admin panel
2. Go to **Administration** → **Analytics**
3. Select **Google Analytics**
4. Enter your Measurement ID: `G-9K8VQGCQ5D`
5. Enable it and save

**Note:** Wiki.js might only support Universal Analytics (UA) not GA4. If this doesn't work, use Method 2.

### Method 2: Custom HTML Injection

If Wiki.js doesn't support GA4 properly:

1. Go to **Administration** → **Theme**
2. Find **HTML Head Injection** or **Custom Head Content**
3. Add this script:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9K8VQGCQ5D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9K8VQGCQ5D');
</script>
```

4. Save and verify tracking in GA Real-Time reports

### Method 3: Heroku Environment Variable

Some Wiki.js deployments read from environment variables:

1. In Heroku dashboard → Settings → Config Vars
2. Add: `GOOGLE_ANALYTICS_ID` = `G-9K8VQGCQ5D`
3. Or: `GA_MEASUREMENT_ID` = `G-9K8VQGCQ5D`
4. Restart the Heroku dyno

---

## 🔍 Testing Checklist

### Before Going Live:
- [ ] GA tracking loads on new site (check DevTools)
- [ ] All pages build successfully (`npm run build:cloudflare`)
- [ ] Images load correctly
- [ ] Links work (no 404s)
- [ ] Environment variables set in Cloudflare Pages

### After Going Live:
- [ ] `inevitableeth.com` loads new site
- [ ] `old.inevitableeth.com` loads Wiki.js site
- [ ] GA shows traffic in Real-Time reports
- [ ] 404 page link to old site works
- [ ] SSL certificates active (auto via Cloudflare)

---

## 📝 Updated 404 Page

The 404 page now includes a helpful message:

> **Coming from an old link?** This site has been rebuilt.
> The previous version is still available if you're looking for a specific page.
> → [Try this page on the old site](https://old.inevitableeth.com/path)

The link automatically appends the current path to `old.inevitableeth.com`.

---

## 🆘 Troubleshooting

### GA Not Tracking:
1. Check browser console for errors
2. Verify env var is set: `console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)`
3. Check GA Real-Time reports (can take 30 seconds to show)
4. Try incognito mode (extensions can block)

### Old Site Not Loading:
1. Verify CNAME record is set correctly
2. Check Heroku custom domains includes `old.inevitableeth.com`
3. DNS propagation can take up to 24 hours
4. Use `dig old.inevitableeth.com` to check DNS

### Build Failing:
1. Check Node version (needs 18+)
2. Verify all dependencies: `npm install`
3. Test local build: `npm run build:cloudflare`
4. Check Cloudflare Pages build logs

---

## 📞 Support Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Google Analytics Help**: https://support.google.com/analytics/
- **Wiki.js Documentation**: https://docs.requarks.io/
- **Heroku Custom Domains**: https://devcenter.heroku.com/articles/custom-domains

---

**Last Updated**: 2025-10-03
