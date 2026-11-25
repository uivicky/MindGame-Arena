import { ArrowRight, Award, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { GAMES, GAMES_BY_ID } from '../../data/games';
import type { GameSessionResult, RecordedOutcome } from '../../types/neurofit';

interface ArenaResultsViewProps {
  result: GameSessionResult;
  outcome: RecordedOutcome;
  onPlayAgain: () => void;
  nextPath?: string;
  nextLabel?: string;
}

export function ArenaResultsView({
  result,
  outcome,
  onPlayAgain,
  nextPath,
  nextLabel,
}: ArenaResultsViewProps) {
  const { playerLevel, xpProgress } = useProgress();
  const game = GAMES_BY_ID[result.gameId];

  const currentIdx = GAMES.findIndex((g) => g.id === result.gameId);
  const nextGame = GAMES[(currentIdx + 1) % GAMES.length];

  const resolvedNextPath = nextPath || `/${nextGame.seoSlug}`;
  const resolvedNextLabel = nextLabel || `Next Challenge: ${nextGame.arenaTitle}`;

  const primaryDisplay =
    result.gameId === 'reaction-speed'
      ? `${result.primaryMetric} ms`
      : `${result.score} pts`;

  const levelDisplay =
    result.gameId === 'reaction-speed'
      ? `${result.score} ms peak`
      : result.gameId === 'number-memory'
      ? `${result.primaryMetric} digits`
      : result.gameId === 'word-memory'
      ? `${result.primaryMetric} words`
      : result.levelReached !== undefined
      ? result.levelReached === 0
        ? '0 cleared'
        : `Level ${result.levelReached}`
      : `${result.primaryMetric} ${game.metricUnit}`;

  const difficultyLabel = result.difficulty
    ? `${result.difficulty.charAt(0).toUpperCase()}${result.difficulty.slice(1)}`
    : null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316]">
            {game.arenaTitle} · Session Complete{difficultyLabel ? ` · ${difficultyLabel}` : ''}
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
            {primaryDisplay}
          </h2>
        </div>

        {outcome.isNewBest && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F97316]/50 bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#EA580C] dark:text-[#FB923C] text-xs font-mono font-semibold">
            <Award className="w-4 h-4" />
            NEW PERSONAL BEST
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
            Final Score
          </span>
          <span className="mt-1 block font-mono text-lg font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
            {primaryDisplay}
          </span>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
            Accuracy
          </span>
          <span className="mt-1 block font-mono text-lg font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
            {result.accuracy}%
          </span>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
            Time Taken
          </span>
          <span className="mt-1 block font-mono text-lg font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
            {result.durationSeconds}s
          </span>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3.5">
          <span className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
            Level / Span
          </span>
          <span className="mt-1 block font-mono text-lg font-bold text-[#171717] dark:text-[#F4F4F6] tabular-nums">
            {levelDisplay}
          </span>
        </div>
      </div>

      {/* Personal Best & XP Progression */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4">
          <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">
            Personal Best Comparison
          </span>
          <p className="mt-1 font-mono text-sm font-semibold text-[#171717] dark:text-[#F4F4F6]">
            {outcome.isNewBest
              ? outcome.previousBestLabel
                ? `Beat previous record (${outcome.previousBestLabel})`
                : `Baseline set: ${outcome.newBestLabel}`
              : `Best on record: ${outcome.newBestLabel}`}
          </p>
        </div>

        <div className="rounded-xl border border-[#F97316]/35 bg-[#FFF0E5]/70 dark:bg-[#F97316]/10 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-[#EA580C] dark:text-[#FB923C]">
              +{outcome.xpEarned} XP Earned
            </span>
            <span className="font-mono text-[#666666] dark:text-[#A1A1AA] tabular-nums">
              Level {playerLevel} ({xpProgress.progressPct}%)
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#E5E7EB] dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-500"
              style={{ width: `${xpProgress.progressPct}%` }}
            />
          </div>
          <span className="mt-1.5 block text-[11px] text-[#666666] dark:text-[#A1A1AA]">
            Virtual game points for local progression only (no cash value).
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
        Scores reflect your practice session on this task and are not medical or diagnostic
        measurements.
      </p>

      {outcome.completedMissionId && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Daily Mission Completed: {outcome.completedMissionId.toUpperCase()} MISSION bonus XP
          awarded.
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>

        <Link
          to={resolvedNextPath}
          className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] hover:border-[#F97316] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] transition-colors"
        >
          {resolvedNextLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/training"
          className="min-h-[46px] inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] text-xs font-medium text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-[#F4F4F6] transition-colors"
        >
          All Mind Games
        </Link>
      </div>
    </div>
  );
}
