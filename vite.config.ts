import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function resolveSiteUrl(): string {
  const raw =
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.APP_URL ||
    '';
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed || trimmed.includes('example.com') || trimmed.includes('.example')) {
    return '';
  }
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
}

function extractSlugs(filePath: string, key: 'seoSlug' | 'slug'): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`${key}:\\s*'([^']+)'`, 'g');
  const out: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] && !out.includes(match[1])) {
      out.push(match[1]);
    }
  }
  return out;
}

function extractApprovedArticleSlugs(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const blockRegex =
    /slug:\s*'([^']+)'[\s\S]*?editorialStatus:\s*'([^']+)'/g;
  const out: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(content)) !== null) {
    if (match[1] && match[2] === 'approved' && !out.includes(match[1])) {
      out.push(match[1]);
    }
  }
  return out;
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }

          if (!fs.existsSync(distDir)) return;

          const siteUrl = resolveSiteUrl();
          if (!siteUrl) return;

          const gameSlugs = extractSlugs(path.resolve(__dirname, 'src/data/games.ts'), 'seoSlug');
          const hubSlugs = ['brain-games', 'mind-games', 'memory-games', 'focus-games'];
          const articleSlugs = extractApprovedArticleSlugs(
            path.resolve(__dirname, 'src/data/articles.ts')
          );

          const entries: {path: string; changefreq: string; priority: string}[] = [
            {path: '/', changefreq: 'weekly', priority: '1.0'},
            ...hubSlugs.map((slug) => ({
              path: `/${slug}`,
              changefreq: 'weekly',
              priority: '0.9',
            })),
            ...gameSlugs.map((slug) => ({
              path: `/${slug}`,
              changefreq: 'monthly',
              priority: '0.85',
            })),
            {path: '/daily-challenge', changefreq: 'daily', priority: '0.9'},
            {path: '/training', changefreq: 'weekly', priority: '0.85'},
            {path: '/session', changefreq: 'weekly', priority: '0.85'},
            {path: '/progress', changefreq: 'weekly', priority: '0.7'},
            {path: '/articles', changefreq: 'weekly', priority: '0.85'},
            ...articleSlugs.map((slug) => ({
              path: `/articles/${slug}`,
              changefreq: 'monthly',
              priority: '0.75',
            })),
            {path: '/about', changefreq: 'monthly', priority: '0.6'},
            {path: '/contact', changefreq: 'monthly', priority: '0.5'},
            {path: '/privacy-policy', changefreq: 'yearly', priority: '0.3'},
            {path: '/terms', changefreq: 'yearly', priority: '0.3'},
            {path: '/disclaimer', changefreq: 'yearly', priority: '0.3'},
            {path: '/cookie-policy', changefreq: 'yearly', priority: '0.3'},
          ];

          const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...entries.map(
              (entry) =>
                `  <url><loc>${siteUrl}${entry.path}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
            ),
            '</urlset>',
            '',
          ].join('\n');

          fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), xml, 'utf-8');
          fs.writeFileSync(
            path.resolve(distDir, 'robots.txt'),
            `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
            'utf-8'
          );
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
