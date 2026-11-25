import { ArrowRight, CheckCircle2, Flame, HelpCircle, Play, Target, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { GameBoardPreview } from '../components/arena/GameBoardPreview';
import { NeuralCoreVisual } from '../components/arena/NeuralCoreVisual';
import { useProgress } from '../context/ProgressContext';
import { APPROVED_ARTICLES } from '../data/articles';
import { GAMES, GAMES_BY_ID } from '../data/games';
import type { GameId } from '../types/neurofit';

const HOME_FAQS = [
  {
    question: 'Are all mind games on MindGame Arena free to play?',
    answer:
      'Yes. All seven interactive mind games, daily brain challenges, and guided multi-game circuits are completely free to play online with no subscription or registration required.',
  },
  {
    question: 'Do I need to create an account to save my scores and streaks?',
    answer:
      'No. Your personal best scores, virtual XP level, daily challenge streaks, and session logs are stored automatically in your browser’s LocalStorage.',
  },
  {
    question: 'Can I play MindGame Arena games on mobile phones and tablets?',
    answer:
      'Yes. Every game grid, numeric keypad, word recognition matrix, and reaction target panel scales cleanly for touchscreens as well as desktop browsers.',
  },
  {
    question: 'What types of cognitive skills do these games exercise?',
    answer:
      'MindGame Arena includes modules for visual sequence memory, digit span recall, verbal word recognition, spatial coordinate mapping, selective visual focus, logical pattern recognition, and visual reaction speed.',
  },
];

export function HomePage() {
  const {
    progress,
    todayMinutes,
    playerLevel,
    totalXp,
    xpProgress,
    todayMissions,
    streaks,
  } = useProgress();

  const completedMissionsCount = todayMissions.filter((m) => m.completed).length;

  const homeSchemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MindGame Arena',
        alternateName: 'Play Free. Think Smarter.',
        url: baseUrl,
        description:
          'Play free mind games, memory games, brain puzzles, focus challenges and reaction tests online.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MindGame Arena',
        url: baseUrl,
        description:
          'Online mind games and cognitive practice platform offering free browser-based memory, focus, logic, and reaction speed challenges.',
      },
    ];
  }, []);

  const getBestLabel = (id: GameId): string => {
    const b = progress.personalBests;
    switch (id) {
      case 'visual-memory':
        return b['visual-memory'] ? `LVL ${b['visual-memory'].highestLevel}` : 'UNRANKED';
      case 'number-memory':
        return b['number-memory'] ? `${b['number-memory'].longestDigits} DIGITS` : 'UNRANKED';
      case 'focus-attention':
        return b['focus-attention'] ? `${b['focus-attention'].bestScore} PTS` : 'UNRANKED';
      case 'pattern-recognition':
        return b['pattern-recognition']
          ? `${b['pattern-recognition'].bestScore} PTS`
          : 'UNRANKED';
      case 'reaction-speed':
        return b['reaction-speed'] ? `${b['reaction-speed'].fastestAverageMs} MS` : 'UNRANKED';
      case 'word-memory':
        return b['word-memory'] ? `${b['word-memory'].bestAccuracy}% ACC` : 'UNRANKED';
      case 'spatial-memory':
        return b['spatial-memory'] ? `LVL ${b['spatial-memory'].highestLevel}` : 'UNRANKED';
    }
  };

  const memoryGames = GAMES.filter((g) => g.domain === 'Memory');
  const focusGames = GAMES.filter((g) => g.id === 'focus-attention' || g.id === 'reaction-speed');
  const numberAndLogicGames = GAMES.filter(
    (g) => g.id === 'number-memory' || g.id === 'pattern-recognition'
  );
  const reactionGame = GAMES_BY_ID['reaction-speed'];

  return (
    <>
      <SeoHead
        title="MindGame Arena — Free Mind Games Online | Play Free. Think Smarter."
        description="Play free mind games, memory games, brain puzzles, focus challenges and reaction tests online. Play instantly without registration in MindGame Arena."
        canonicalPath="/"
        schemas={homeSchemas}
      />

      {/* HERO LOBBY */}
      <section className="border-b border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#151820]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F97316] font-semibold">
                MindGame Arena · Play Free. Think Smarter.
              </p>

              <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6] leading-[1.08] text-balance">
                Free Mind Games Online – Play Brain &amp; Memory Games
              </h1>

              <p className="mt-3 font-display text-lg sm:text-xl font-bold text-[#EA580C] dark:text-[#FB923C]">
                Challenge Your Mind. Play Smarter.
              </p>

              <p className="mt-3 text-base text-[#666666] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
                Explore free online mind games, memory challenges, focus tests, number puzzles and
                brain training exercises. Play instantly without registration.
              </p>

              {/* Player Summary Strip */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 border border-[#E5E7EB] dark:border-[#262A35] rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] dark:divide-[#262A35] bg-[#F8F8FA] dark:bg-[#111318]">
                <div className="p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
                    Player Level
                  </span>
                  <span className="mt-1 block font-mono text-xl font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
                    LVL {playerLevel}
                  </span>
                </div>

                <div className="p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
                    Total XP
                  </span>
                  <span className="mt-1 block font-mono text-xl font-bold text-[#F97316] tabular-nums">
                    {totalXp}
                  </span>
                </div>

                <div className="p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
                    Daily Progress
                  </span>
                  <span className="mt-1 block font-mono text-xl font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
                    {completedMissionsCount}/3 · {todayMinutes}m
                  </span>
                </div>

                <div className="p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
                    Active Streak
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-xl font-bold text-[#EA580C] dark:text-[#FB923C] tabular-nums">
                    <Flame className="w-4 h-4" />
                    {streaks.currentStreak}d
                  </span>
                </div>
              </div>

              {/* Primary Hero CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/session"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[50px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-display text-sm sm:text-base font-bold tracking-wide transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play Free Games
                </Link>
                <Link
                  to="/mind-games"
                  className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] hover:border-[#F97316] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] transition-colors"
                >
                  Explore All Games
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="mt-4 text-[11px] text-[#666666] dark:text-[#A1A1AA]">
                XP reflects virtual game points saved locally with no cash value.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <NeuralCoreVisual playerLevel={playerLevel} xpPct={xpProgress.progressPct} />
            </div>
          </div>
        </div>
      </section>

      {/* 1. FEATURED MIND GAMES */}
      <section id="featured-games" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
              Instant Browser Play
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
              Featured Mind Games
            </h2>
          </div>
          <Link
            to="/mind-games"
            className="text-sm font-semibold text-[#EA580C] dark:text-[#FB923C] hover:underline whitespace-nowrap"
          >
            Explore all mind games →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="group rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316]/75 p-5 flex flex-col justify-between transition-colors duration-150"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#666666] dark:text-[#A1A1AA]">
                  <span className="text-[#EA580C] dark:text-[#FB923C] uppercase tracking-wider font-semibold">
                    {game.domain}
                  </span>
                  <span>{game.difficulty}</span>
                </div>

                <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-[#171717] dark:text-[#F4F4F6]">
                  {game.arenaTitle}
                </h3>

                <div className="my-5 py-3 px-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12]">
                  <GameBoardPreview gameId={game.id} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[#666666] dark:text-[#A1A1AA]">
                  <span>Best: {getBestLabel(game.id)}</span>
                  <span>~{game.estimatedMinutes} min</span>
                </div>
              </div>

              <Link
                to={`/${game.seoSlug}`}
                className="mt-5 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] dark:bg-[#111318] border border-transparent dark:border-[#262A35] hover:bg-[#F97316] dark:hover:bg-[#F97316] dark:hover:border-[#F97316] text-white text-sm font-semibold transition-colors"
              >
                Play Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 2. POPULAR MEMORY GAMES (Clean Hairline Directory Band) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
              Memory Arena
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
              Popular Memory Games
            </h2>
            <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
              Practice visual grid sequences, multi-digit span recall, verbal word recognition, and
              coordinate mapping.
            </p>
          </div>
          <Link
            to="/memory-games"
            className="text-sm font-semibold text-[#EA580C] dark:text-[#FB923C] hover:underline whitespace-nowrap"
          >
            Browse all memory games →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-[#E5E7EB] dark:border-[#262A35] divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB] dark:divide-[#262A35]">
          {memoryGames.map((game, idx) => (
            <Link
              key={game.id}
              to={`/${game.seoSlug}`}
              className={`group py-6 md:px-6 first:md:pl-0 flex flex-col justify-between transition-colors ${
                idx >= 2 ? 'md:border-t md:border-[#E5E7EB] dark:md:border-[#262A35]' : ''
              } ${idx % 2 === 0 ? 'md:pl-0' : 'md:pr-0'}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6] group-hover:text-[#F97316] transition-colors">
                    {game.title}
                  </h3>
                  <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                    {getBestLabel(game.id)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {game.shortDescription}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] dark:text-[#FB923C]">
                Play {game.arenaTitle} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. COGNITIVE PRACTICE CATEGORIES (Split Editorial Grid) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Brain Training Games */}
          <div className="pb-8 lg:pb-0 border-b lg:border-b-0 border-[#E5E7EB] dark:border-[#262A35] flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
                Structured Circuits
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                Brain Training Games
              </h2>
              <p className="mt-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xl">
                Combine multiple cognitive domains inside guided 5-, 10-, and 15-minute circuits
                designed to alternate memory, selective attention, and reasoning drills seamlessly.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/brain-games"
                className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
              >
                Explore Brain Games
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/session"
                className="min-h-[42px] inline-flex items-center px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] text-sm font-semibold hover:border-[#F97316] transition-colors"
              >
                Guided Circuits
              </Link>
            </div>
          </div>

          {/* Focus and Concentration Games */}
          <div className="pb-8 lg:pb-0 border-b lg:border-b-0 border-[#E5E7EB] dark:border-[#262A35] flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
                Attention &amp; Precision
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                Focus and Concentration Games
              </h2>
              <p className="mt-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xl">
                Filter look-alike letters on Focus Grid and verify sustained vigilance under clean
                timers without noisy clutter.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {focusGames.map((fg) => (
                  <Link
                    key={fg.id}
                    to={`/${fg.seoSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] text-xs font-mono font-semibold hover:border-[#F97316] transition-colors"
                  >
                    {fg.arenaTitle} →
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/focus-games"
                className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316] text-sm font-semibold transition-colors"
              >
                Open Focus Games Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Number and Logic Puzzles */}
          <div className="pt-2 lg:pt-8 lg:border-t border-[#E5E7EB] dark:border-[#262A35] pb-8 lg:pb-0 border-b lg:border-b-0 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
                Sequences &amp; Rules
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                Number and Logic Puzzles
              </h2>
              <p className="mt-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xl">
                Stretch your digit span in Number Memory Game or solve progressive numerical and
                geometric sequences with instant rule explanations in Pattern Master.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {numberAndLogicGames.map((g) => (
                <Link
                  key={g.id}
                  to={`/${g.seoSlug}`}
                  className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316] text-sm font-semibold transition-colors"
                >
                  {g.title}
                  <ArrowRight className="w-4 h-4 text-[#F97316]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Reaction Time Challenges */}
          <div className="pt-2 lg:pt-8 lg:border-t border-[#E5E7EB] dark:border-[#262A35] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
                  Millisecond Latency
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                  Reaction Time Challenges
                </h2>
                <p className="mt-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xl">
                  {reactionGame.shortDescription} Compare your fastest single trial against your
                  session average.
                </p>
              </div>
              <Zap className="w-6 h-6 text-[#F97316] shrink-0 hidden sm:block mt-1" />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                Record: <strong className="text-[#F97316]">{getBestLabel('reaction-speed')}</strong>
              </span>
              <Link
                to="/reaction-time-test"
                className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#171717] dark:bg-[#1B1E25] border border-transparent dark:border-[#262A35] hover:bg-[#F97316] dark:hover:bg-[#F97316] text-white text-sm font-semibold transition-colors"
              >
                Test Reaction Time
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DAILY BRAIN CHALLENGE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
              Daily Rotation
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
              Daily Brain Challenge ({completedMissionsCount} / 3 Completed)
            </h2>
          </div>
          <Link
            to="/daily-challenge"
            className="text-sm font-semibold text-[#EA580C] dark:text-[#FB923C] hover:underline whitespace-nowrap"
          >
            Open Daily Challenge Hub →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayMissions.map((mission) => (
            <Link
              key={mission.slotId}
              to={`/${GAMES_BY_ID[mission.gameId].seoSlug}?mission=${mission.slotId}`}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-colors ${
                mission.completed
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#EA580C] dark:text-[#FB923C] uppercase font-semibold">
                    {mission.title}
                  </span>
                  <span className="text-[#F97316] font-semibold">+{mission.xpReward} XP</span>
                </div>
                <p className="mt-2.5 text-sm font-medium text-[#171717] dark:text-[#F4F4F6]">
                  {mission.objectiveLabel}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                {mission.completed ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    COMPLETED
                  </span>
                ) : (
                  <span className="text-[#666666] dark:text-[#A1A1AA]">STATUS: ACTIVE</span>
                )}
                <span className="text-[#F97316] font-semibold">Launch →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Home AdSlot strictly between content blocks */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot
          placement="home"
          format="horizontal"
          placementLabel="Homepage Content Banner"
        />
      </div>

      {/* 8. LATEST EDUCATIONAL GUIDES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
              Latest Educational Guides
            </h2>
            <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA]">
              Practical reading on memory practice, visual focus, digit chunking, and mind games.
            </p>
          </div>
          <Link
            to="/articles"
            className="text-sm font-semibold text-[#EA580C] dark:text-[#FB923C] hover:underline whitespace-nowrap"
          >
            All {APPROVED_ARTICLES.length} guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {APPROVED_ARTICLES.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="group rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 hover:border-[#F97316] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-[#666666] dark:text-[#A1A1AA] flex items-center gap-2">
                  <span className="text-[#EA580C] dark:text-[#FB923C] font-medium">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTimeMinutes} min read</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6] group-hover:text-[#F97316] transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] dark:text-[#FB923C]">
                Read Guide <Target className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (Clean Editorial Two-Column List) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Platform Overview</span>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
              Quick answers about browser storage, mobile support, and how scores work across our
              seven games.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-[#E5E7EB] dark:divide-[#262A35] border-y border-[#E5E7EB] dark:border-[#262A35]">
            {HOME_FAQS.map((faq, idx) => (
              <div key={idx} className="py-5">
                <h3 className="font-display text-base font-semibold text-[#171717] dark:text-[#F4F4F6]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
