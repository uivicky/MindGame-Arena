import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { GameBoardPreview } from '../components/arena/GameBoardPreview';
import { useProgress } from '../context/ProgressContext';
import { GAMES } from '../data/games';
import type { CognitiveDomain, GameId } from '../types/neurofit';

type FilterTab = 'All' | CognitiveDomain;
const TABS: FilterTab[] = ['All', 'Memory', 'Focus', 'Reasoning', 'Speed'];

export function TrainingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const domainParam = searchParams.get('domain') as FilterTab | null;
  const [activeTab, setActiveTab] = useState<FilterTab>(
    domainParam && TABS.includes(domainParam) ? domainParam : 'All'
  );
  const { progress } = useProgress();

  useEffect(() => {
    if (domainParam && TABS.includes(domainParam)) {
      setActiveTab(domainParam);
    } else if (!domainParam) {
      setActiveTab('All');
    }
  }, [domainParam]);

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'All Mind Games' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  const handleSelectTab = (tab: FilterTab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ domain: tab });
    }
  };

  const filteredGames =
    activeTab === 'All' ? GAMES : GAMES.filter((g) => g.domain === activeTab);

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="All Mind Games — Filter by Cognitive Domain | MindGame Arena"
        description="Browse and filter all seven free online mind games in MindGame Arena across Memory, Focus, Reasoning, and Speed."
        canonicalPath="/training"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
            MindGame Arena
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
            Select Mind Game Mode
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
            Filter all seven games by skill area or launch a guided multi-game circuit in
            full-screen arena mode.
          </p>
        </div>
        <Link
          to="/session"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
        >
          Start Guided Circuit
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter games by cognitive domain"
        className="mt-6 inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#E5E7EB]/60 dark:bg-[#1B1E25] border border-[#E5E7EB] dark:border-[#262A35]"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectTab(tab)}
              className={`min-h-[38px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-[#F4F4F6]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Immersive Game Tiles */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
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
                {game.arenaTitle}
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

      <div className="mt-12">
        <AdSlot
          placement="content"
          format="horizontal"
          placementLabel="Game Directory Banner"
        />
      </div>
    </div>
  );
}
