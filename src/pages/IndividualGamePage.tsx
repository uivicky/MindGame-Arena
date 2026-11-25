import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  Lightbulb,
  LogOut,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { ArenaResultsView } from '../components/arena/ArenaResultsView';
import { GameBoardPreview } from '../components/arena/GameBoardPreview';
import { GameErrorBoundary } from '../components/games/GameErrorBoundary';
import { GameHost } from '../components/games/GameHost';
import type { ArenaHudSnapshot } from '../components/games/GameProps';
import { useProgress } from '../context/ProgressContext';
import { APPROVED_ARTICLES } from '../data/articles';
import { GAMES, findGameByAnySlug } from '../data/games';
import type {
  GameDifficulty,
  GameSeoSlug,
  GameSessionResult,
  RecordedOutcome,
} from '../types/neurofit';
import { getLocalDateKey, hashStringToSeed } from '../utils/prng';

type ArenaStage = 'intro' | 'countdown' | 'playing' | 'results';

const DIFFICULTY_OPTIONS: {
  value: GameDifficulty;
  label: string;
  note: string;
}[] = [
  { value: 'relaxed', label: 'Relaxed', note: 'More study time & extra margin' },
  { value: 'standard', label: 'Standard', note: 'Balanced baseline pacing' },
  { value: 'challenging', label: 'Challenging', note: 'Faster windows & tighter margin' },
];

export function IndividualGamePage({ fixedSlug }: { fixedSlug?: GameSeoSlug }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const activeSlug = fixedSlug ?? paramSlug;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { progress, recordResult, setImmersivePlayActive } = useProgress();
  const game = findGameByAnySlug(activeSlug);

  const isMissionLaunch = Boolean(searchParams.get('mission'));
  const todaySeed = isMissionLaunch
    ? hashStringToSeed(`mindgame-arena-missions-${getLocalDateKey()}`)
    : undefined;

  const [stage, setStage] = useState<ArenaStage>('intro');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('standard');
  const [countdownNum, setCountdownNum] = useState(3);
  const [paused, setPaused] = useState(false);
  const [restartNonce, setRestartNonce] = useState(0);
  const [hud, setHud] = useState<ArenaHudSnapshot>({
    levelLabel: 'Level 1',
    score: 0,
    timerLabel: '00:00',
  });
  const [completedResult, setCompletedResult] = useState<GameSessionResult | null>(null);
  const [recordedOutcome, setRecordedOutcome] = useState<RecordedOutcome | null>(null);

  useEffect(() => {
    setStage('intro');
    setPaused(false);
    setCompletedResult(null);
    setRecordedOutcome(null);
  }, [activeSlug]);

  useEffect(() => {
    const active = stage !== 'intro';
    setImmersivePlayActive(active);
    return () => setImmersivePlayActive(false);
  }, [stage, setImmersivePlayActive]);

  useEffect(() => {
    if (stage !== 'countdown') return;
    setCountdownNum(3);
    const t1 = window.setTimeout(() => setCountdownNum(2), 550);
    const t2 = window.setTimeout(() => setCountdownNum(1), 1100);
    const t3 = window.setTimeout(() => {
      setPaused(false);
      setStage('playing');
    }, 1650);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage]);

  const handleHudUpdate = useCallback((nextHud: ArenaHudSnapshot) => {
    setHud(nextHud);
  }, []);

  const handleGameComplete = useCallback(
    (result: GameSessionResult) => {
      const outcome = recordResult(result, isMissionLaunch ? 'daily-challenge' : 'practice');
      setCompletedResult(result);
      setRecordedOutcome(outcome);
      setStage('results');
    },
    [isMissionLaunch, recordResult]
  );

  const breadcrumbItems = useMemo(
    () =>
      game
        ? [
            { label: 'Home', to: '/' },
            { label: 'Mind Games', to: '/mind-games' },
            { label: game.title },
          ]
        : [],
    [game]
  );

  const landingSchemas = useMemo(() => {
    if (!game) return [];
    const baseUrl = getSiteBaseUrl();
    const gameUrl = `${baseUrl}/${game.seoSlug}`;
    return [
      buildBreadcrumbSchema(breadcrumbItems, baseUrl),
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `${game.title} — MindGame Arena`,
        url: gameUrl,
        description: game.seoDescription,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ];
  }, [game, breadcrumbItems]);

  if (!game) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <SeoHead
          title="Game Not Found — MindGame Arena"
          description="The requested mind game could not be found on MindGame Arena."
          noindex={true}
        />
        <h1 className="font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Game Module Not Found
        </h1>
        <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
          The requested game route does not exist. Explore all seven modules in MindGame Arena.
        </p>
        <Link
          to="/mind-games"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
        >
          Explore All Mind Games
        </Link>
      </div>
    );
  }

  const getBestSummary = (): string => {
    const b = progress.personalBests;
    switch (game.id) {
      case 'visual-memory':
        return b['visual-memory']
          ? `Level ${b['visual-memory'].highestLevel} (${b['visual-memory'].bestScore} pts)`
          : 'No record yet';
      case 'number-memory':
        return b['number-memory']
          ? `${b['number-memory'].longestDigits} digits (${b['number-memory'].bestScore} pts)`
          : 'No record yet';
      case 'focus-attention':
        return b['focus-attention']
          ? `${b['focus-attention'].bestScore} pts (${b['focus-attention'].bestAccuracy}%)`
          : 'No record yet';
      case 'pattern-recognition':
        return b['pattern-recognition']
          ? `${b['pattern-recognition'].bestScore} pts (${b['pattern-recognition'].bestAccuracy}%)`
          : 'No record yet';
      case 'reaction-speed':
        return b['reaction-speed'] ? `${b['reaction-speed'].fastestAverageMs} ms` : 'No record yet';
      case 'word-memory':
        return b['word-memory']
          ? `${b['word-memory'].bestAccuracy}% (${b['word-memory'].bestScore} pts)`
          : 'No record yet';
      case 'spatial-memory':
        return b['spatial-memory']
          ? `Level ${b['spatial-memory'].highestLevel} (${b['spatial-memory'].bestScore} pts)`
          : 'No record yet';
    }
  };

  const relatedGames = GAMES.filter((g) => g.id !== game.id)
    .sort((a, b) => (a.domain === game.domain ? -1 : b.domain === game.domain ? 1 : 0))
    .slice(0, 3);

  const linkedArticles = APPROVED_ARTICLES.filter((a) =>
    game.relatedArticles.includes(a.slug)
  );

  if (stage === 'intro') {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <SeoHead
          title={game.seoTitle}
          description={game.seoDescription}
          canonicalPath={`/${game.seoSlug}`}
          schemas={landingSchemas}
        />

        <Breadcrumbs items={breadcrumbItems} />

        <Link
          to="/mind-games"
          className="inline-flex items-center gap-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] hover:text-[#F97316] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mind Games
        </Link>

        {/* Hero Launch Card */}
        <div className="mt-5 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                <span className="text-[#EA580C] dark:text-[#FB923C] uppercase tracking-wider font-semibold">
                  {game.domain}
                </span>
                <span aria-hidden="true">·</span>
                <span>{game.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>~{game.estimatedMinutes} min</span>
              </div>

              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
                {game.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                {game.shortDescription}
              </p>

              <div className="mt-5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] px-4 py-3 flex items-center justify-between text-xs font-mono">
                <span className="text-[#666666] dark:text-[#A1A1AA]">PERSONAL BEST</span>
                <span className="font-semibold text-[#171717] dark:text-[#F4F4F6]">
                  {getBestSummary()}
                </span>
              </div>

              {/* Selectable Difficulty */}
              <div className="mt-5">
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] mb-2">
                  Select Pacing Difficulty
                </span>
                <div
                  role="radiogroup"
                  aria-label="Game difficulty"
                  className="grid grid-cols-3 gap-2"
                >
                  {DIFFICULTY_OPTIONS.map((opt) => {
                    const selected = difficulty === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDifficulty(opt.value)}
                        className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          selected
                            ? 'border-[#F97316] bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#171717] dark:text-[#F4F4F6]'
                            : 'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] text-[#666666] dark:text-[#A1A1AA] hover:border-[#F97316]/60'
                        }`}
                      >
                        <span
                          className={`block text-xs font-semibold ${
                            selected ? 'text-[#EA580C] dark:text-[#FB923C]' : ''
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug opacity-80">
                          {opt.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage('countdown')}
                className="mt-6 w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-display text-sm font-bold tracking-wide shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Play Now
              </button>
            </div>

            <div className="md:col-span-5 py-6 px-4 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12]">
              <GameBoardPreview gameId={game.id} />
            </div>
          </div>
        </div>

        {/* Original Introduction */}
        <section className="mt-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            About {game.title}
          </h2>
          <div className="mt-3 space-y-3 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
            {game.introParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
            All game scores measure task practice performance inside your browser and are not
            medical or diagnostic evaluations.
          </p>
        </section>

        {/* How to Play & Rules */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
              <Play className="w-3.5 h-3.5" />
              <span>Step-by-Step</span>
            </div>
            <h2 className="mt-1.5 font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              How to Play
            </h2>
            <ol className="mt-4 space-y-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] list-decimal list-inside leading-relaxed">
              {game.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Scoring &amp; Constraints</span>
            </div>
            <h2 className="mt-1.5 font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Game Rules
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] list-disc list-inside leading-relaxed">
              {game.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Useful Tips & Difficulty Explanation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Technique</span>
            </div>
            <h2 className="mt-1.5 font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Useful Practice Tips
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] list-disc list-inside leading-relaxed">
              {game.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Adaptive Pacing</span>
            </div>
            <h2 className="mt-1.5 font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Difficulty Progression
            </h2>
            <p className="mt-4 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
              {game.difficultyExplanation}
            </p>
          </section>
        </div>

        {/* FAQs */}
        <section className="mt-6 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="mt-1.5 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 divide-y divide-[#E5E7EB] dark:divide-[#262A35]">
            {game.faqs.map((faq, idx) => (
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

        {/* AdSlot strictly below instructional sections, never during gameplay */}
        <div className="mt-8">
          <AdSlot
            placement="content"
            format="horizontal"
            placementLabel="Below Game Guide"
          />
        </div>

        {/* Related Games & Guides */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <h2 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Related Mind Games
            </h2>
            <div className="mt-4 space-y-3">
              {relatedGames.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/${rel.seoSlug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4 hover:border-[#F97316] transition-colors"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C] font-semibold block">
                      {rel.domain}
                    </span>
                    <span className="font-display text-sm font-bold text-[#171717] dark:text-[#F4F4F6]">
                      {rel.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#F97316] shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <h2 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Recommended Guides
            </h2>
            <div className="mt-4 space-y-3">
              {linkedArticles.map((art) => (
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
        </div>
      </div>
    );
  }

  // FULL-SCREEN IMMERSIVE GAME EXPERIENCE
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FA] dark:bg-[#111318] text-[#171717] dark:text-[#F4F4F6]">
      <SeoHead
        title={`${game.arenaTitle} — MindGame Arena`}
        description={game.shortDescription}
        canonicalPath={`/${game.seoSlug}`}
      />

      <header className="border-b border-[#E5E7EB] dark:border-[#262A35] bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-sm sm:text-base font-bold tracking-wide truncate">
              {game.arenaTitle}
            </span>
            {stage === 'playing' && (
              <span className="hidden sm:inline-block font-mono text-xs text-[#F97316] whitespace-nowrap">
                · {hud.levelLabel}
              </span>
            )}
          </div>

          {stage === 'playing' && (
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm tabular-nums">
              <div>
                <span className="text-[10px] uppercase text-[#666666] dark:text-[#A1A1AA] block">
                  Score
                </span>
                <span className="font-bold text-[#F97316]">{hud.score}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#666666] dark:text-[#A1A1AA] block">
                  Timer
                </span>
                <span className="font-bold">{hud.timerLabel}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {stage === 'playing' && (
              <>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Resume game' : 'Pause game'}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] hover:border-[#F97316] text-xs font-medium transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{paused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaused(false);
                    setRestartNonce((n) => n + 1);
                  }}
                  aria-label="Restart game"
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] hover:border-[#F97316] text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restart</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => navigate(isMissionLaunch ? '/daily-challenge' : '/mind-games')}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] text-xs font-medium text-[#666666] dark:text-[#A1A1AA] hover:text-rose-500 hover:border-rose-500/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative">
        {stage === 'countdown' && (
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F97316] mb-3">
              Starting {game.arenaTitle} · {difficulty}
            </p>
            <div
              key={countdownNum}
              className="font-display text-7xl sm:text-8xl font-extrabold tabular-nums text-[#171717] dark:text-[#F4F4F6] animate-nf-countdown"
            >
              {countdownNum}
            </div>
          </div>
        )}

        {stage === 'playing' && (
          <div className="w-full relative">
            <GameErrorBoundary onRetry={() => setRestartNonce((n) => n + 1)}>
              <GameHost
                key={`${game.id}-${restartNonce}-${difficulty}`}
                gameId={game.id}
                seed={todaySeed}
                mode={isMissionLaunch ? 'daily-challenge' : 'practice'}
                difficulty={difficulty}
                autoStart={true}
                paused={paused}
                restartNonce={restartNonce}
                hideEmbeddedSummary={true}
                onHudUpdate={handleHudUpdate}
                onComplete={handleGameComplete}
              />
            </GameErrorBoundary>

            {paused && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Game Paused"
                className="fixed inset-0 z-50 bg-[#0C0E12]/85 backdrop-blur-md flex items-center justify-center px-4"
              >
                <div className="w-full max-w-sm rounded-2xl border border-[#262A35] bg-[#1B1E25] p-7 text-center text-[#F4F4F6] shadow-2xl">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#F97316]">
                    Game Paused
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{game.arenaTitle}</h2>
                  <p className="mt-2 text-xs text-[#A1A1AA]">
                    Active timers are halted while paused. Press Esc to resume.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaused(false)}
                      className="min-h-[46px] w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
                    >
                      Resume Game
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaused(false);
                        setRestartNonce((n) => n + 1);
                      }}
                      className="min-h-[46px] w-full rounded-xl border border-[#262A35] hover:border-[#F97316] text-sm font-medium transition-colors"
                    >
                      Restart Round
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/mind-games')}
                      className="min-h-[46px] w-full rounded-xl border border-[#262A35] text-xs text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      Exit to Mind Games
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'results' && completedResult && recordedOutcome && (
          <ArenaResultsView
            result={completedResult}
            outcome={recordedOutcome}
            onPlayAgain={() => {
              setCompletedResult(null);
              setRecordedOutcome(null);
              setStage('countdown');
            }}
            nextPath={isMissionLaunch ? '/daily-challenge' : undefined}
            nextLabel={isMissionLaunch ? 'Back to Daily Challenge' : undefined}
          />
        )}
      </main>
    </div>
  );
}
