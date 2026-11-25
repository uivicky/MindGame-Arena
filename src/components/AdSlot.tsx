import { useEffect, useRef } from 'react';

export type AdPlacement = 'home' | 'article' | 'content' | 'default';

interface AdSlotProps {
  placement?: AdPlacement;
  slotOverride?: string;
  format?: 'horizontal' | 'rectangle';
  placementLabel?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let adScriptLoaded = false;

function resolvePlacementSlot(placement: AdPlacement, slotOverride?: string): string {
  if (slotOverride?.trim()) {
    return slotOverride.trim();
  }

  const defaultSlot = (import.meta.env.VITE_ADSENSE_SLOT as string | undefined)?.trim() || '';
  const homeSlot = (import.meta.env.VITE_ADSENSE_SLOT_HOME as string | undefined)?.trim() || '';
  const articleSlot =
    (import.meta.env.VITE_ADSENSE_SLOT_ARTICLE as string | undefined)?.trim() || '';
  const contentSlot =
    (import.meta.env.VITE_ADSENSE_SLOT_CONTENT as string | undefined)?.trim() || '';

  switch (placement) {
    case 'home':
      return homeSlot || defaultSlot;
    case 'article':
      return articleSlot || defaultSlot;
    case 'content':
      return contentSlot || defaultSlot;
    default:
      return defaultSlot;
  }
}

export function AdSlot({
  placement = 'default',
  slotOverride,
  format = 'horizontal',
  placementLabel,
  className = '',
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const client = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() || '';
  const resolvedSlot = resolvePlacementSlot(placement, slotOverride);

  const isConfigured =
    client.startsWith('ca-pub-') && client.length > 12 && resolvedSlot.length >= 4;

  useEffect(() => {
    if (!isConfigured) return;

    if (!adScriptLoaded) {
      const existing = document.querySelector('script[data-mindgame-adsense="true"]');
      if (!existing) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          client
        )}`;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-mindgame-adsense', 'true');
        document.head.appendChild(script);
      }
      adScriptLoaded = true;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense push can throw if blocked by browser privacy extensions
    }
  }, [isConfigured, client, resolvedSlot]);

  if (!isConfigured) {
    return null;
  }

  const heightClass = format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[96px]';

  return (
    <aside
      aria-label={placementLabel ? `Advertisement — ${placementLabel}` : 'Advertisement'}
      className={`w-full rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] px-4 py-3 flex flex-col items-center justify-center ${heightClass} ${className}`}
    >
      <span className="text-[11px] tracking-wide text-[#666666] dark:text-[#A1A1AA] mb-1.5 select-none">
        Advertisement
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle block w-full text-center"
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
