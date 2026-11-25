import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import type { GameSessionResult } from '../../types/neurofit';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'waiting' | 'ready' | 'early' | 'trial-result' | 'finished';

export function ReactionSpeedGame({
  onComplete,
  onPlayStateChange,
  onHudUpdate,
  mode = 'practice',
  difficulty = 'standard',
  autoStart = false,
  paused = false,
  restartNonce = 0,
  hideEmbeddedSummary = false,
}: GameComponentProps) {
  const { recordResult } = useProgress();
  const totalTrials =
    mode !== 'practice' ? 5 : difficulty === 'relaxed' ? 3 : difficulty === 'challenging' ? 7 : 5;

  const [phase, setPhase] = useState<Phase>('idle');
  const [trials, setTrials] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [prematureCount, setPrematureCount] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const signalAtRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(Date.now());
  const pausedAtRef = useRef<number | null>(null);
  const pausedDurationMsRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    onPlayStateChange?.(phase !== 'idle' && phase !== 'finished');
  }, [phase, onPlayStateChange]);

  const avgMs =
    trials.length > 0 ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length) : 0;

  useEffect(() => {
    onHudUpdate?.({
      levelLabel: `Trial ${Math.min(
        trials.length + (phase === 'finished' ? 0 : 1),
        totalTrials
      )} / ${totalTrials}`,
      score: avgMs,
      timerLabel: avgMs > 0 ? `${avgMs} ms avg` : 'Ready',
    });
  }, [trials.length, phase, avgMs, totalTrials, onHudUpdate]);

  const beginTrial = useCallback(() => {
    clearTimer();
    setPhase('waiting');
    const delayMs = 1500 + Math.floor(Math.random() * 2800);
    timeoutRef.current = window.setTimeout(() => {
      signalAtRef.current = performance.now();
      setPhase('ready');
    }, delayMs);
  }, [clearTimer]);

  const startSession = useCallback(() => {
    clearTimer();
    recordedRef.current = false;
    runIdRef.current = `rs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStartRef.current = Date.now();
    pausedAtRef.current = null;
    pausedDurationMsRef.current = 0;
    setTrials([]);
    setLastTime(null);
    setPrematureCount(0);
    beginTrial();
  }, [beginTrial, clearTimer]);

  useEffect(() => {
    if (autoStart) {
      startSession();
    }
  }, [autoStart, restartNonce, startSession]);

  const prevPausedRef = useRef(paused);
  useEffect(() => {
    if (paused && !prevPausedRef.current) {
      clearTimer();
      pausedAtRef.current = Date.now();
    } else if (!paused && prevPausedRef.current) {
      if (pausedAtRef.current !== null) {
        pausedDurationMsRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = null;
      }
      if (phase === 'waiting' || phase === 'ready') {
        beginTrial();
      }
    }
    prevPausedRef.current = paused;
  }, [paused, phase, clearTimer, beginTrial]);

  const finishSession = useCallback(
    (finalTrials: number[], earlyClicks: number) => {
      clearTimer();
      setPhase('finished');
      if (recordedRef.current) return;
      recordedRef.current = true;

      const meanMs = Math.round(
        finalTrials.reduce((sum, v) => sum + v, 0) / finalTrials.length
      );
      const bestMs = Math.min(...finalTrials);
      const accuracy = Math.max(
        0,
        Math.round((totalTrials / (totalTrials + earlyClicks)) * 100)
      );
      const activeMs = Math.max(
        5000,
        Date.now() - sessionStartRef.current - pausedDurationMsRef.current
      );
      const durationSeconds = Math.max(5, Math.round(activeMs / 1000));

      const result: GameSessionResult = {
        gameId: 'reaction-speed',
        score: bestMs,
        primaryMetric: meanMs,
        levelReached: totalTrials,
        accuracy,
        durationSeconds,
        difficulty,
        submissionId: runIdRef.current,
      };
      if (mode === 'practice' && !hideEmbeddedSummary) {
        recordResult(result, 'practice');
      }
      onComplete?.(result);
    },
    [clearTimer, difficulty, hideEmbeddedSummary, mode, onComplete, recordResult, totalTrials]
  );

  const handleSurfaceTrigger = useCallback(() => {
    if (paused) return;
    if (phase === 'waiting') {
      clearTimer();
      setPrematureCount((c) => c + 1);
      setPhase('early');
      return;
    }

    if (phase === 'ready') {
      const elapsed = Math.max(80, Math.round(performance.now() - signalAtRef.current));
      const updated = [...trials, elapsed];
      setTrials(updated);
      setLastTime(elapsed);

      if (updated.length >= totalTrials) {
        finishSession(updated, prematureCount);
      } else {
        setPhase('trial-result');
      }
      return;
    }

    if (phase === 'early' || phase === 'trial-result') {
      beginTrial();
    }
  }, [beginTrial, clearTimer, finishSession, paused, phase, prematureCount, totalTrials, trials]);

  useEffect(() => {
    if (paused) return;
    const isTrialActive =
      phase === 'waiting' || phase === 'ready' || phase === 'early' || phase === 'trial-result';
    if (!isTrialActive) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) {
          handleSurfaceTrigger();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSurfaceTrigger, paused, phase]);

  const bestMs = trials.length > 0 ? Math.min(...trials) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Wait for the target surface to illuminate orange, then click, tap, or press Space
            immediately across {totalTrials} randomized trials.
          </p>
          <button
            type="button"
            onClick={startSession}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Begin {totalTrials}-Trial Test
          </button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'ready' || phase === 'early' || phase === 'trial-result') && (
        <div>
          <button
            type="button"
            disabled={paused}
            onPointerDown={handleSurfaceTrigger}
            className={`w-full min-h-[320px] sm:min-h-[360px] rounded-2xl border flex flex-col items-center justify-center px-6 text-center transition-colors select-none shadow-lg ${
              phase === 'waiting'
                ? 'bg-[#F8F8FA] dark:bg-[#111318] border-[#E5E7EB] dark:border-[#262A35] text-[#666666] dark:text-[#A1A1AA]'
                : phase === 'ready'
                ? 'bg-[#F97316] border-[#EA580C] text-white ring-4 ring-[#F97316]/25'
                : phase === 'early'
                ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-[#1B1E25] border-[#E5E7EB] dark:border-[#262A35] text-[#171717] dark:text-[#F4F4F6]'
            }`}
          >
            {phase === 'waiting' && (
              <>
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  Hold Steady — Wait for Signal
                </span>
                <span className="mt-2 font-mono text-xs uppercase tracking-widest opacity-75">
                  Trial {trials.length + 1} of {totalTrials} · Click, tap, or press Space
                </span>
              </>
            )}
            {phase === 'ready' && (
              <>
                <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
                  CLICK NOW
                </span>
                <span className="mt-2 font-mono text-xs uppercase tracking-widest opacity-90">
                  Visual Signal Active
                </span>
              </>
            )}
            {phase === 'early' && (
              <>
                <span className="font-display text-2xl sm:text-3xl font-bold">
                  Premature Input
                </span>
                <span className="mt-2 text-sm">
                  Signal had not triggered. Click or press Space to retry Trial {trials.length + 1}.
                </span>
              </>
            )}
            {phase === 'trial-result' && (
              <>
                <span className="font-mono text-5xl font-bold text-[#F97316] tabular-nums">
                  {lastTime} ms
                </span>
                <span className="mt-3 text-sm text-[#666666] dark:text-[#A1A1AA]">
                  Click or press Space to initiate Trial {trials.length + 1} of {totalTrials}
                </span>
              </>
            )}
          </button>

          {trials.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-mono tabular-nums text-[#666666] dark:text-[#A1A1AA]">
              {trials.map((ms, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25]"
                >
                  T{i + 1}: {ms} ms
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === 'finished' && !hideEmbeddedSummary && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="font-mono text-xs text-[#F97316] uppercase tracking-wider">
            Session Complete
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tabular-nums text-[#171717] dark:text-[#F4F4F6]">
            {avgMs} ms Mean Latency
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Mean</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{avgMs} ms</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Fastest</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{bestMs} ms</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Early</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{prematureCount}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
            Scores are practice metrics only and are not medical or diagnostic measurements.
          </p>

          {mode === 'practice' && (
            <button
              type="button"
              onClick={startSession}
              className="mt-5 inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Run Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
