import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  schemas?: Record<string, unknown>[];
}

export function getSiteBaseUrl(): string {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  return window.location.origin;
}

export function SeoHead({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  noindex = false,
  schemas,
}: SeoHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      selector: string,
      attr: 'name' | 'property',
      key: string,
      content: string
    ) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'MindGame Arena');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, follow' : 'index, follow'
    );

    const baseUrl = getSiteBaseUrl();
    const path = canonicalPath ?? window.location.pathname;
    const canonicalUrl = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    const existingSchemas = document.querySelectorAll('script[data-mindgame-schema="true"]');
    existingSchemas.forEach((node) => node.remove());

    if (schemas && schemas.length > 0) {
      schemas.forEach((schemaObj) => {
        const script = document.createElement('script');
        script.setAttribute('data-mindgame-schema', 'true');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      });
    }

    return () => {
      const cleanupSchemas = document.querySelectorAll('script[data-mindgame-schema="true"]');
      cleanupSchemas.forEach((node) => node.remove());
    };
  }, [title, description, canonicalPath, ogType, noindex, schemas]);

  return null;
}
