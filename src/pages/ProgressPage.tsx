import { Flame, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { useProgress } from '../context/ProgressContext';
import { GAMES, GAMES_BY_ID } from '../data/games';
import type { GameId } from '../types/neurofit';

export function ProgressPage() {
  const {
    progress,
    totalMinutes,
    totalSessions,
    focusAccuracyAverage,
    playerLevel,
    totalXp,
    xpProgress,
    streaks,
    weeklyActivity,
    resetAllProgress,
  } = useProgress();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [filterGame, setFilterGame] = useState<'all' | GameId>('all');

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'Player Profile & Stats' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  const memorySessions = progress.sessions.filter((s) => s.domain === 'Memory');
  const memoryAvgAccuracy =
    memorySessions.length > 0
      ? Math.round(
          memorySessions.reduce((sum, s) => sum + s.accuracy, 0) / memorySessions.length
        )
      : null;

  const reactionRecord = progress.personalBests['reaction-speed']?.fastestAverageMs;

  const accuracyTrendData = [...progress.sessions]
    .slice(0, 14)
    .reverse()
    .map((s, idx) => ({
      session: `#${idx + 1}`,
      accuracy: s.accuracy,
      game: GAMES_BY_ID[s.gameId].arenaTitle,
    }));

  const filteredHistory =
    filterGame === 'all'
      ? progress.sessions.slice(0, 25)
      : progress.sessions.filter((s) => s.gameId === filterGame).slice(0, 25);

  const getRecordRow = (id: GameId) => {
    const b = progress.personalBests;
    switch (id) {
      case 'visual-memory':
        return b['visual-memory']
          ? `Level ${b['visual-memory'].highestLevel} · ${b['visual-memory'].bestScore} pts`
          : 'Unranked';
      case 'number-memory':
        return b['number-memory']
          ? `${b['number-memory'].longestDigits} digits · ${b['number-memory'].bestScore} pts`
          : 'Unranked';
      case 'focus-attention':
        return b['focus-attention']
          ? `${b['focus-attention'].bestAccuracy}% acc · ${b['focus-attention'].bestScore} pts`
          : 'Unranked';
      case 'pattern-recognition':
        return b['pattern-recognition']
          ? `${b['pattern-recognition'].bestScore} pts · ${b['pattern-recognition'].bestAccuracy}% acc`
          : 'Unranked';
      case 'reaction-speed':
        return b['reaction-speed']
          ? `${b['reaction-speed'].fastestAverageMs} ms avg (${b['reaction-speed'].fastestSingleMs} ms best)`
          : 'Unranked';
      case 'word-memory':
        return b['word-memory']
          ? `${b['word-memory'].bestAccuracy}% acc · ${b['word-memory'].maxWords} words`
          : 'Unranked';
      case 'spatial-memory':
        return b['spatial-memory']
          ? `Level ${b['spatial-memory'].highestLevel} · ${b['spatial-memory'].bestScore} pts`
          : 'Unranked';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Player Profile & Stats — MindGame Arena"
        description="Inspect your MindGame Arena player level, virtual XP progression, memory accuracy, focus precision, reaction speed records, and daily activity."
        canonicalPath="/progress"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Player Profile Banner */}
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#F97316] font-semibold">
              Player Profile · Local Telemetry
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-4">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
                Level {playerLevel} Operator
              </h1>
              <span className="font-mono text-sm font-semibold text-[#EA580C] dark:text-[#FB923C] tabular-nums">
                {totalXp} XP Total
              </span>
            </div>

            <div className="mt-4 max-w-xl">
              <div className="flex items-center justify-between text-xs font-mono text-[#666666] dark:text-[#A1A1AA] mb-1.5 tabular-nums">
                <span>
                  {xpProgress.currentLevelXp} / {xpProgress.nextLevelXp} XP to Level{' '}
                  {playerLevel + 1}
                </span>
                <span>{xpProgress.progressPct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#E5E7EB] dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-500"
                  style={{ width: `${xpProgress.progressPct}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-[#666666] dark:text-[#A1A1AA]">
                XP represents virtual game points stored in browser LocalStorage with no cash value.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/session"
              className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold whitespace-nowrap transition-colors"
            >
              Launch Session
            </Link>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              disabled={totalSessions === 0 && totalXp === 0}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] text-sm font-medium text-[#666666] dark:text-[#A1A1AA] hover:border-rose-500 hover:text-rose-500 disabled:opacity-40 whitespace-nowrap transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Reset Profile
            </button>
          </div>
        </div>
      </div>

      {/* Inline Reset Confirmation Modal */}
      {confirmResetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 shadow-2xl">
            <h2
              id="reset-dialog-title"
              className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]"
            >
              Reset Local Player Profile?
            </h2>
            <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
              This permanently clears all XP, player level, personal records, session history, and
              daily mission streaks from this browser.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllProgress();
                  setConfirmResetOpen(false);
                }}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Performance Strip */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Games Completed', value: String(totalSessions) },
          { label: 'Practice Time', value: `${totalMinutes} min` },
          {
            label: 'Memory Performance',
            value: memoryAvgAccuracy !== null ? `${memoryAvgAccuracy}%` : '—',
          },
          {
            label: 'Focus Accuracy',
            value: focusAccuracyAverage !== null ? `${focusAccuracyAverage}%` : '—',
          },
          {
            label: 'Reaction Record',
            value: reactionRecord ? `${reactionRecord} ms` : '—',
          },
          {
            label: 'Daily Streak',
            value: `${streaks.currentStreak}d`,
            icon: true,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA] block">
              {kpi.label}
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xl font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
              {kpi.icon && <Flame className="w-4 h-4 text-[#F97316]" />}
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Daily Training Activity
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA]">
              Active practice minutes across the last 7 days
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(161,161,170,0.18)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#A1A1AA' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#A1A1AA' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111318',
                    borderColor: '#262A35',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#F4F4F6',
                  }}
                />
                <Bar
                  dataKey="minutes"
                  name="Minutes"
                  fill="#F97316"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Accuracy Trajectory
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA]">
              Precision percentage across recent completed runs
            </p>
          </div>
          {accuracyTrendData.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center px-4">
              <p className="text-sm text-[#666666] dark:text-[#A1A1AA]">
                Complete a training module to populate your accuracy telemetry.
              </p>
              <Link
                to="/mind-games"
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition-colors"
              >
                Explore Mind Games
              </Link>
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={accuracyTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(161,161,170,0.18)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="session"
                    tick={{ fontSize: 12, fill: '#A1A1AA' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#A1A1AA' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111318',
                      borderColor: '#262A35',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#F4F4F6',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy %"
                    stroke="#EA580C"
                    fill="rgba(249, 115, 22, 0.22)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Personal Records & Session History */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <h2 className="font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6]">
            Personal Records
          </h2>
          <div className="mt-4 divide-y divide-[#E5E7EB] dark:divide-[#262A35] text-sm">
            {GAMES.map((g) => (
              <div key={g.id} className="py-3 flex items-center justify-between gap-4">
                <Link
                  to={`/${g.seoSlug}`}
                  className="font-mono text-xs font-semibold tracking-wide text-[#171717] dark:text-[#F4F4F6] hover:text-[#F97316] transition-colors"
                >
                  {g.arenaTitle}
                </Link>
                <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA] tabular-nums text-right">
                  {getRecordRow(g.id)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-lg font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Match & Session Log
            </h2>
            <select
              aria-label="Filter history by module"
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value as 'all' | GameId)}
              className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] px-3 py-1.5 text-xs font-medium text-[#171717] dark:text-[#F4F4F6] focus:outline-none focus:border-[#F97316]"
            >
              <option value="all">All Modules</option>
              {GAMES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.arenaTitle}
                </option>
              ))}
            </select>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#666666] dark:text-[#A1A1AA]">
              No completed runs logged yet for this selection.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#262A35] text-xs text-[#666666] dark:text-[#A1A1AA]">
                    <th className="py-2 pr-3 font-medium">Date</th>
                    <th className="py-2 pr-3 font-medium">Module</th>
                    <th className="py-2 pr-3 font-medium text-right">Result</th>
                    <th className="py-2 pr-3 font-medium text-right">Acc</th>
                    <th className="py-2 font-medium text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262A35] tabular-nums">
                  {filteredHistory.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2.5 pr-3 font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                        {row.dateKey}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-xs text-[#171717] dark:text-[#F4F4F6]">
                        {GAMES_BY_ID[row.gameId].arenaTitle}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono text-xs">
                        {row.gameId === 'reaction-speed'
                          ? `${row.primaryMetric} ms`
                          : `${row.score} pts`}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                        {row.accuracy}%
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs text-[#F97316] font-semibold">
                        +{row.xpEarned ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
