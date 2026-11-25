import { ArrowRight, BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { GameBoardPreview } from '../components/arena/GameBoardPreview';
import { useProgress } from '../context/ProgressContext';
import { APPROVED_ARTICLES_BY_SLUG } from '../data/articles';
import { GAMES_BY_ID } from '../data/games';
import { HUB_LIST, HUB_PAGES, type HubSlug } from '../data/hubPages';
import type { GameId } from '../types/neurofit';

export function CategoryHubPage({ hubSlug }: { hubSlug: HubSlug }) {
  const hub = HUB_PAGES[hubSlug];
  const { progress } = useProgress();

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: hub.navLabel }],
    [hub.navLabel]
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [
      buildBreadcrumbSchema(breadcrumbItems, baseUrl),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: hub.h1,
        description: hub.seoDescription,
        url: `${baseUrl}/${hub.slug}`,
      },
    ];
  }, [hub, breadcrumbItems]);

  const getPersonalBestDisplay = (id: GameId) => {
    const b = progress.personalBests;
    switch (id) {
      case 'visual-memory':
        return b['visual-memory'] ? `Level ${b['visual-memory'].highestLevel}` : 'Unranked';
      case 'number-memory':
        return b['number-memory'] ? `${b['number-memory'].longestDigits} digits` : 'Unranked';
      case 'focus-attention':
        return b['focus-attention'] ? `${b['focus-attention'].bestScore} pts` : 'Unranked';
      case 'pattern-recognition':
        return b['pattern-recognition'] ? `${b['pattern-recognition'].bestScore} pts` : 'Unranked';
      case 'reaction-speed':
        return b['reaction-speed'] ? `${b['reaction-speed'].fastestAverageMs} ms` : 'Unranked';
      case 'word-memory':
        return b['word-memory'] ? `${b['word-memory'].bestAccuracy}%` : 'Unranked';
      case 'spatial-memory':
        return b['spatial-memory'] ? `Level ${b['spatial-memory'].highestLevel}` : 'Unranked';
    }
  };

  const games = hub.gameIds.map((id) => GAMES_BY_ID[id]);
  const guides = hub.relatedArticles
    .map((slug) => APPROVED_ARTICLES_BY_SLUG[slug])
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const siblingHubs = HUB_LIST.filter((item) => item.slug !== hub.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title={hub.seoTitle}
        description={hub.seoDescription}
        canonicalPath={`/${hub.slug}`}
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
            MindGame Arena · {hub.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
            {hub.h1}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl leading-relaxed">
            {hub.lead}
          </p>
        </div>

        <Link
          to="/session"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
        >
          Start Guided Circuit
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Playable Game Cards */}
      <section aria-label={`${hub.navLabel} Playable Modules`} className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316]/75 p-6 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#666666] dark:text-[#A1A1AA]">
                  <span className="text-[#EA580C] dark:text-[#FB923C] uppercase tracking-wider font-semibold">
                    {game.domain}
                  </span>
                  <span>{game.difficulty}</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-bold tracking-wide text-[#171717] dark:text-[#F4F4F6]">
                  {game.title}
                </h2>
                <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {game.shortDescription}
                </p>

                <div className="my-5 py-3 px-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12]">
                  <GameBoardPreview gameId={game.id} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[#666666] dark:text-[#A1A1AA]">
                  <span>
                    Best:{' '}
                    <strong className="text-[#171717] dark:text-[#F4F4F6]">
                      {getPersonalBestDisplay(game.id)}
                    </strong>
                  </span>
                  <span>~{game.estimatedMinutes} min</span>
                </div>
              </div>

              <Link
                to={`/${game.seoSlug}`}
                className="mt-5 w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
              >
                Play Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Category Editorial Guide + Strategy */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            {hub.introHeading}
          </h2>
          <div className="mt-4 space-y-3.5 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
            {hub.introParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Practice Strategy</span>
          </div>
          <h2 className="mt-1.5 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            {hub.strategyHeading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] list-disc list-inside leading-relaxed">
            {hub.strategyPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* AdSlot strictly below content/cards */}
      <div className="mt-10">
        <AdSlot
          placement="content"
          format="horizontal"
          placementLabel={`${hub.navLabel} Banner`}
        />
      </div>

      {/* FAQs */}
      <section className="mt-10 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Questions</span>
        </div>
        <h2 className="mt-1.5 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Frequently Asked Questions
        </h2>
        <div className="mt-5 divide-y divide-[#E5E7EB] dark:divide-[#262A35]">
          {hub.faqs.map((faq, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <h3 className="font-display text-base font-semibold text-[#171717] dark:text-[#F4F4F6]">
                {faq.question}
              </h3>
              <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Guides & Other Categories */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <h2 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
            Recommended Reading
          </h2>
          <div className="mt-4 space-y-3">
            {guides.map((art) => (
              <Link
                key={art.slug}
                to={`/articles/${art.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4 hover:border-[#F97316] transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C] font-semibold block">
                    {art.category} · {art.readTimeMinutes} min read
                  </span>
                  <span className="font-display text-sm font-bold text-[#171717] dark:text-[#F4F4F6]">
                    {art.title}
                  </span>
                </div>
                <BookOpen className="w-4 h-4 text-[#F97316] shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <h2 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
            Explore More Game Hubs
          </h2>
          <div className="mt-4 space-y-3">
            {siblingHubs.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4 hover:border-[#F97316] transition-colors"
              >
                <span className="font-display text-sm font-bold text-[#171717] dark:text-[#F4F4F6]">
                  {item.h1}
                </span>
                <ArrowRight className="w-4 h-4 text-[#F97316] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
