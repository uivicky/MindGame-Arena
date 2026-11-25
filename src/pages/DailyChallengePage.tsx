import { ArrowRight, CalendarCheck2, CheckCircle2, Flame } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { GameBoardPreview } from '../components/arena/GameBoardPreview';
import { useProgress } from '../context/ProgressContext';
import { GAMES_BY_ID } from '../data/games';
import { getLocalDateKey } from '../utils/prng';

export function DailyChallengePage() {
  const { progress, todayMissions, streaks } = useProgress();
  const todayKey = getLocalDateKey();
  const completedCount = todayMissions.filter((m) => m.completed).length;
  const allCompleted = completedCount === todayMissions.length;
  const totalMissionXp = todayMissions.reduce((sum, m) => sum + m.xpReward, 0);
  const earnedMissionXp = todayMissions
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.xpReward, 0);

  const recentDates = Object.values(progress.dailyChallenges)
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .slice(0, 7);

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'Daily Missions' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Daily Brain Challenge — Free Mind Games Rotation | MindGame Arena"
        description="Complete today's deterministic Memory, Focus, and Speed Daily Challenges in MindGame Arena to earn virtual XP and keep your daily streak active."
        canonicalPath="/daily-challenge"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Mission Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
            <CalendarCheck2 className="w-4 h-4" />
            <span>Daily Mission Rotation · {todayKey}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
            Daily Missions
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
            Three date-synchronized objectives selected daily across memory, selective focus, and
            speed/logic. Complete all three to lock in today&apos;s streak.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] px-4 py-3 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
              Current Streak
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums text-[#F97316]">
              <Flame className="w-4 h-4" />
              {streaks.currentStreak}d
            </span>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] px-4 py-3 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
              Best Streak
            </span>
            <span className="font-mono text-lg font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
              {streaks.longestStreak}d
            </span>
          </div>
        </div>
      </div>

      {/* Daily Progress Bar */}
      <div className="mt-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#F97316] font-semibold">
              Daily Completion Status
            </span>
            <h2 className="font-display text-lg font-bold mt-0.5 text-[#171717] dark:text-[#F4F4F6]">
              {allCompleted
                ? 'All Daily Missions Completed'
                : `${completedCount} of 3 Missions Complete`}
            </h2>
          </div>
          <div className="font-mono text-xs tabular-nums text-[#666666] dark:text-[#A1A1AA]">
            Mission XP: <strong className="text-[#F97316]">{earnedMissionXp}</strong> /{' '}
            {totalMissionXp} XP
          </div>
        </div>

        <div className="h-2.5 w-full rounded-full bg-[#E5E7EB] dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-500"
            style={{ width: `${Math.round((completedCount / 3) * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-[#666666] dark:text-[#A1A1AA]">
          Daily streaks and XP track local training consistency only and carry no cash value.
        </p>
      </div>

      {/* 3 Mission Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayMissions.map((mission) => {
          const game = GAMES_BY_ID[mission.gameId];
          return (
            <div
              key={mission.slotId}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                mission.completed
                  ? 'border-emerald-500/45 bg-emerald-500/5'
                  : 'border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#EA580C] dark:text-[#FB923C] uppercase tracking-wider font-semibold">
                    {mission.title}
                  </span>
                  <span className="text-[#F97316] font-semibold">+{mission.xpReward} XP</span>
                </div>

                <h3 className="mt-2 font-display text-xl font-bold tracking-wide text-[#171717] dark:text-[#F4F4F6]">
                  {game.arenaTitle}
                </h3>
                <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA]">
                  {mission.objectiveLabel}
                </p>

                <div className="my-5 py-3 px-2 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12]">
                  <GameBoardPreview gameId={mission.gameId} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span>Progress</span>
                  <span
                    className={
                      mission.completed
                        ? 'text-emerald-500 font-semibold'
                        : 'text-[#666666] dark:text-[#A1A1AA]'
                    }
                  >
                    {mission.completed ? '1 / 1 DONE' : '0 / 1 PENDING'}
                  </span>
                </div>
              </div>

              {mission.completed ? (
                <div className="min-h-[46px] rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Mission Complete
                </div>
              ) : (
                <Link
                  to={`/${game.seoSlug}?mission=${mission.slotId}`}
                  className="min-h-[46px] w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                >
                  Launch Mission
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Completed Days */}
      {recentDates.length > 0 && (
        <div className="mt-10 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <h2 className="font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6]">
            Completed Daily Records
          </h2>
          <div className="mt-4 divide-y divide-[#E5E7EB] dark:divide-[#262A35] text-sm">
            {recentDates.map((rec) => (
              <div
                key={rec.dateKey}
                className="py-3 flex items-center justify-between tabular-nums"
              >
                <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                  {rec.dateKey}
                </span>
                <span className="font-mono font-semibold">{rec.score} pts</span>
                <span className="font-mono text-xs text-emerald-500">All Missions Cleared</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <AdSlot
          placement="content"
          format="horizontal"
          placementLabel="Daily Challenge Banner"
        />
      </div>
    </div>
  );
}
