import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';

export function AboutPage() {
  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'About MindGame Arena' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="About MindGame Arena — Free Online Mind Games Platform"
        description="Learn how MindGame Arena builds free browser-based mind games, memory challenges, focus grids, and educational guides with local-first privacy."
        canonicalPath="/about"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F97316]">
          About MindGame Arena · Play Free. Think Smarter.
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
          Free Online Mind Games Built for Clarity and Focus
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
          MindGame Arena offers free online mind games, memory tests, focus grids, number puzzles,
          and reaction speed challenges designed for distraction-free play directly in your browser.
        </p>
      </header>

      <div className="mt-10 space-y-8 text-base text-[#171717]/90 dark:text-[#F4F4F6]/90 leading-[1.75]">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Design Philosophy
          </h2>
          <p>
            Many puzzle websites hide simple games behind intrusive pop-ups, account walls, or
            exaggerated promises. MindGame Arena focuses on clean game boards, transparent scoring
            rules, responsive mobile and desktop controls, and honest interpretations of practice
            scores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            What Practice Metrics Mean
          </h2>
          <p>
            Consistent practice with visual sequences, digit spans, and selective search grids builds
            task familiarity, deliberate pacing, and concentration habits during structured games.
            MindGame Arena does not diagnose medical conditions, offer clinical therapy, or claim
            outcomes outside the exercises themselves.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Local-First Architecture
          </h2>
          <p>
            Your game history, personal bests, and daily challenge streaks are stored directly in
            your browser via LocalStorage. You can inspect or reset your data anytime from the{' '}
            <Link to="/progress" className="text-[#F97316] font-medium hover:underline">
              My Stats
            </Link>{' '}
            page without creating an account.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-8 border-t border-[#E5E7EB] dark:border-[#262A35] flex flex-wrap gap-3">
        <Link
          to="/mind-games"
          className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
        >
          Explore Mind Games
        </Link>
        <Link
          to="/contact"
          className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] text-sm font-semibold hover:border-[#F97316] transition-colors"
        >
          Contact MindGame Arena
        </Link>
      </div>
    </div>
  );
}
