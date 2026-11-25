# MindGame Arena — Free Online Mind Games Platform

**Tagline:** *Play Free. Think Smarter.*

**Description:** *Play free mind games, memory games, brain puzzles, focus challenges and reaction tests online.*

MindGame Arena is a client-side React, TypeScript, Vite, Tailwind CSS, React Router, and Recharts web application. All player scores, personal records, virtual XP, and daily challenge streaks are saved locally in browser `LocalStorage` with zero mandatory backend keys or accounts.

---

## Platform Routes & Games

### Category Hubs
- `/mind-games` — Free Mind Games Online
- `/brain-games` — Free Brain Training Games Online
- `/memory-games` — Free Memory Games Online
- `/focus-games` — Focus & Concentration Games Online

### Playable Game Pages
- `/visual-memory-game` — Visual Memory Game (grid sequence recall)
- `/number-memory-game` — Number Memory Game (digit span test)
- `/focus-grid` — Focus Grid Challenge (selective visual attention)
- `/pattern-recognition-games` — Pattern Recognition Games (number & visual logic)
- `/reaction-time-test` — Reaction Time Test (millisecond visual-motor latency)
- `/word-memory-games` — Word Memory Games (verbal recognition)
- `/spatial-memory-games` — Spatial Memory Games (coordinate mapping)

### Challenges, Stats & Guides
- `/daily-challenge` — Deterministic daily Memory, Focus, and Speed missions
- `/session` — 5-, 10-, and 15-minute guided multi-game circuits
- `/training` — Interactive domain-filtered game directory
- `/progress` — Local telemetry, charts, personal records, and data reset
- `/articles` & `/articles/:slug` — 16 original educational guides with FAQs and references
- `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/cookie-policy`

Legacy `/games/*` and `/exercises/*` URLs redirect cleanly to their canonical root game URLs.

---

## Local Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

Verify TypeScript types, ESLint, and production build:

```bash
npm run lint
npm run build
```

---

## Vercel Deployment & Technical SEO

1. Push your repository to GitHub and import it into [Vercel](https://vercel.com) using the **Vite** framework preset (`npm run build`, output directory `dist`). `vercel.json` handles client-side SPA routing rewrites while keeping `/assets/*`, `/robots.txt`, and `/sitemap.xml` directly served.
2. In Vercel (**Project Settings → Environment Variables**), configure:
   ```env
   VITE_SITE_URL=https://your-custom-domain.com
   ```
   When `VITE_SITE_URL` (or `VERCEL_PROJECT_PRODUCTION_URL`) is set during build, `npm run build` automatically generates `dist/sitemap.xml` and `dist/robots.txt` pointing to your live origin, and `SeoHead` emits matching canonical tags, Open Graph URLs, and JSON-LD structured data (`WebSite`, `Organization`, `CollectionPage`, `SoftwareApplication`, `Article`, `BreadcrumbList`).
3. **Editorial Publish-Gating (`src/data/articles.ts`):** Every guide includes `editorialStatus: 'approved' | 'draft' | 'needs-review'`, `lastEditedDate`, `reviewedBy`, and `editorialNote`. Only `'approved'` articles appear in the UI and `dist/sitemap.xml`. Update `reviewedBy` after owner sign-off, and mark drafts as `'draft'` or `'needs-review'` while editing.
4. **Contact & Privacy Configuration:** Set optional environment variables in Vercel or `.env.local` prior to launch so `/contact` renders live links and posts to a real form backend:
   ```env
   VITE_CONTACT_EMAIL=support@yourdomain.com
   VITE_PRIVACY_EMAIL=privacy@yourdomain.com
   VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
   ```

---

## Google AdSense Setup & Readiness

`src/components/AdSlot.tsx` provides policy-safe responsive ad containers with reserved heights (`min-h-[96px]` / `min-h-[250px]`) to prevent Cumulative Layout Shift (CLS). Ads are placed only on content pages (`home`, `article`, `content`) and never rendered during active gameplay, beside game controls, or near answer buttons.

Configure these optional environment variables in Vercel or `.env.local` once approved:

```env
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT=1234567890
VITE_ADSENSE_SLOT_HOME=1234567890
VITE_ADSENSE_SLOT_ARTICLE=2345678901
VITE_ADSENSE_SLOT_CONTENT=3456789012
```

See `ADSENSE_CHECKLIST.md` for the full pre-submission verification checklist.

---

## Search Console, GA4 & Organic Growth Setup

1. **Google Search Console:** Verify ownership of your live domain (DNS TXT record recommended), then submit `https://your-custom-domain.com/sitemap.xml` under **Indexing → Sitemaps**. Use **URL Inspection** on `/`, `/mind-games`, `/brain-games`, `/memory-games`, `/focus-games`, and individual game routes to confirm rendering and canonical tags.
2. **Google Analytics 4 (GA4):** Add your GA4 measurement script (`G-XXXXXXXXXX`) in `index.html` (ideally gated behind user consent if serving regions requiring cookie consent) to measure organic landing page sessions, bounce behavior, and game starts.
3. **Structured Data & CWV Testing:** After deploying to a public URL, validate live pages using Google's **Rich Results Test** and **PageSpeed Insights** (mobile and desktop).
