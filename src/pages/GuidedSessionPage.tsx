import { CheckCircle2, Clock, LogOut, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { GameErrorBoundary } from '../components/games/GameErrorBoundary';
import { GameHost } from '../components/games/GameHost';
import type { ArenaHudSnapshot } from '../components/games/GameProps';
import { useProgress } from '../context/ProgressContext';
import { GAMES_BY_ID } from '../data/games';
import type { GameId, GameSessionResult } from '../types/neurofit';

type SessionDuration = 5 | 10 | 15;

const CIRCUITS: Record<SessionDuration, GameId[]> = {
  5: ['visual-memory', 'focus-attention', 'reaction-speed'],
  10: ['visual-memory', 'focus-attention', 'pattern-recognition', 'number-memory'],
  15: [
    'visual-memory',
    'number-memory',
    'focus-attention',
    'pattern-recognition',
    'word-memory',
    'spatial-memory',
  ],
};

export function GuidedSessionPage() {
  const [searchParams] = useSearchParams();
  const initialDur = Number(searchParams.get('duration'));
  const validInitial: SessionDuration =
    initialDur === 5 || initialDur === 10 || initialDur === 15 ? initialDur : 5;

  const { recordResult, incrementGuidedSessions, setImmersivePlayActive, playerLevel } =
    useProgress();
  const [durationMinutes, setDurationMinutes] = useState<SessionDuration>(validInitial);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameSessionResult[]>([]);
  const [totalSessionXp, setTotalSessionXp] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(validInitial * 60);
  const [finished, setFinished] = useState(false);
  const [hud, setHud] = useState<ArenaHudSnapshot>({
    levelLabel: 'Stage 1',
    score: 0,
    timerLabel: '00:00',
  });

  const timerRef = useRef<number | null>(null);

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'Guided Circuit' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  useEffect(() => {
    setImmersivePlayActive(started && !finished);
    return () => setImmersivePlayActive(false);
  }, [started, finished, setImmersivePlayActive]);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const circuit = CIRCUITS[durationMinutes];

  const handleStartSession = (dur: SessionDuration) => {
    setDurationMinutes(dur);
    setSecondsRemaining(dur * 60);
    setCurrentIndex(0);
    setResults([]);
    setTotalSessionXp(0);
    setFinished(false);
    setStarted(true);
  };

  const handleExerciseComplete = (res: GameSessionResult) => {
    const outcome = recordResult(res, 'guided-session');
    setTotalSessionXp((prev) => prev + outcome.xpEarned);
    const updated = [...results, res];
    setResults(updated);

    if (currentIndex + 1 >= circuit.length) {
      setFinished(true);
      incrementGuidedSessions();
    } else {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentGameId = circuit[currentIndex];
  const currentGameMeta = GAMES_BY_ID[currentGameId];

  if (started && !finished) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F8FA] dark:bg-[#111318] text-[#171717] dark:text-[#F4F4F6]">
        <SeoHead
          title={`Guided ${durationMinutes}-Min Circuit — MindGame Arena`}
          description="Active guided multi-game circuit in MindGame Arena."
          canonicalPath="/session"
        />

        <header className="border-b border-[#E5E7EB] dark:border-[#262A35] bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#F97316] block">
                Circuit {currentIndex + 1} / {circuit.length} · {hud.levelLabel}
              </span>
              <span className="font-display text-sm sm:text-base font-bold truncate block">
                {currentGameMeta.arenaTitle}
              </span>
            </div>

            <div className="flex items-center gap-5 font-mono text-xs sm:text-sm tabular-nums">
              <div>
                <span className="text-[10px] uppercase text-[#666666] dark:text-[#A1A1AA] block">
                  Score
                </span>
                <span className="font-bold text-[#F97316]">{hud.score}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#666666] dark:text-[#A1A1AA] block">
                  Session Clock
                </span>
                <span className="font-bold">{formatTimer(secondsRemaining)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStarted(false)}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] text-xs font-medium text-[#666666] dark:text-[#A1A1AA] hover:text-rose-500"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
          <div className="h-1 w-full bg-[#E5E7EB] dark:bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-300"
              style={{ width: `${(results.length / circuit.length) * 100}%` }}
            />
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
          <GameErrorBoundary key={`${currentGameId}-${currentIndex}`}>
            <GameHost
              gameId={currentGameId}
              mode="guided-session"
              autoStart={true}
              hideEmbeddedSummary={true}
              onHudUpdate={setHud}
              onComplete={handleExerciseComplete}
            />
          </GameErrorBoundary>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Guided Brain Training Circuit — MindGame Arena"
        description="Choose a 5, 10, or 15-minute structured brain game circuit combining memory, attention, and reasoning challenges."
        canonicalPath="/session"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {!started && (
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
            Circuit Mode
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
            Guided Training Session
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
            Select a timed circuit. Modules launch sequentially in full-screen arena mode and award
            virtual XP on completion.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {([5, 10, 15] as SessionDuration[]).map((dur) => {
              const list = CIRCUITS[dur];
              return (
                <div
                  key={dur}
                  className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#666666] dark:text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#F97316]">
                        <Clock className="w-3.5 h-3.5" />
                        {dur} MIN
                      </span>
                      <span>{list.length} MODULES</span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                      {dur === 5
                        ? 'Focus Warm-Up'
                        : dur === 10
                        ? 'Balanced Circuit'
                        : 'Full Simulator Run'}
                    </h2>
                    <ul className="mt-4 space-y-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
                      {list.map((gid, idx) => (
                        <li key={gid} className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[#F97316] font-semibold">0{idx + 1}</span>
                          <span>{GAMES_BY_ID[gid].arenaTitle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartSession(dur)}
                    className="mt-6 w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
                  >
                    Launch {dur}-Min Circuit
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {started && finished && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5E7EB] dark:border-[#262A35]">
            <div>
              <p className="font-mono text-xs text-emerald-500 uppercase tracking-wider font-semibold">
                Circuit Complete
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171717] dark:text-[#F4F4F6]">
                {durationMinutes}-Minute Circuit Summary
              </h1>
            </div>
            <div className="font-mono text-sm font-semibold text-[#F97316]">
              +{totalSessionXp} XP Earned · LVL {playerLevel}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">
                Modules Cleared
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
                {results.length} / {circuit.length}
              </span>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">
                Mean Accuracy
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
                {results.length > 0
                  ? Math.round(
                      results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-4">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">
                Active Practice Time
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
                {Math.max(
                  1,
                  Math.round(results.reduce((sum, r) => sum + r.durationSeconds, 0) / 60)
                )}{' '}
                min
              </span>
            </div>
          </div>

          <div className="mt-6 divide-y divide-[#E5E7EB] dark:divide-[#262A35] border border-[#E5E7EB] dark:border-[#262A35] rounded-xl">
            {results.map((r, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono text-xs font-semibold text-[#171717] dark:text-[#F4F4F6]">
                    {GAMES_BY_ID[r.gameId].arenaTitle}
                  </span>
                </div>
                <div className="font-mono text-xs tabular-nums flex items-center gap-5">
                  <span>
                    {r.gameId === 'reaction-speed' ? `${r.primaryMetric} ms` : `${r.score} pts`}
                  </span>
                  <span className="text-[#666666] dark:text-[#A1A1AA]">{r.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
            Scores reflect your practice session on these exercises and are not medical or
            diagnostic measurements.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Run Another Circuit
            </button>
            <Link
              to="/progress"
              className="inline-flex items-center min-h-[46px] px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] text-sm font-semibold hover:border-[#F97316] transition-colors"
            >
              View Player Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
