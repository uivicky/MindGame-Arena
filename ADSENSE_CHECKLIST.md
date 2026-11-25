# MindGame Arena — Google AdSense Readiness Checklist

Use this checklist before submitting your deployed site for Google AdSense review. Meeting technical and policy requirements prepares the site for review; approval remains at Google's sole discretion.

## 1. Site Structure & Publisher Pages
- [ ] Live custom domain deployed over HTTPS with zero broken navigation links (`404` returns `noindex, follow`).
- [ ] **About Page (`/about`)** clearly describes MindGame Arena's purpose and local-first architecture without medical or exaggerated claims.
- [ ] **Contact Page (`/contact`)** updated with real, monitored publisher email addresses and an active form delivery endpoint (Formspree, Resend, or Vercel Serverless Function) before submission.
- [ ] **Privacy Policy (`/privacy-policy`)** discloses browser `LocalStorage` usage and Google/third-party vendor advertising cookies.
- [ ] **Cookie Policy (`/cookie-policy`)** documents `mindgame_arena_theme`, `mindgame_arena_progress_v1`, and Google Ad Settings controls.
- [ ] **Terms (`/terms`)** and **Practice Disclaimer (`/disclaimer`)** accessible from the global footer on every page.

## 2. Ad Placement & User Experience Policy
- [ ] Ads are **never** rendered during active gameplay (`countdown`, `playing`, or `results` arena states).
- [ ] Ads are **never** placed adjacent to interactive game boards, number keypads, or answer buttons where accidental clicks could occur.
- [ ] `AdSlot` components display an explicit `Advertisement` label and reserve container height (`min-h-[96px]` / `min-h-[250px]`) to prevent layout shifts (CLS).
- [ ] Configure `VITE_ADSENSE_CLIENT` and `VITE_ADSENSE_SLOT_*` in Vercel environment variables only after creating your AdSense property.
- [ ] Add `ads.txt` to `public/ads.txt` with your publisher ID (`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`) once assigned by Google AdSense.

## 3. Content Quality & Technical SEO
- [ ] Original instructional content, rules, tips, and FAQs on every game page (`/visual-memory-game`, `/number-memory-game`, `/focus-grid`, `/pattern-recognition-games`, `/reaction-time-test`, `/word-memory-games`, `/spatial-memory-games`).
- [ ] Unique editorial content across all four category hubs (`/mind-games`, `/brain-games`, `/memory-games`, `/focus-games`).
- [ ] Original educational guides published under `/articles/*` with clear headings, takeaways, and external academic references where appropriate.
- [ ] `VITE_SITE_URL` configured in Vercel so `sitemap.xml`, `robots.txt`, canonical tags, and JSON-LD resolve to your live production domain.
