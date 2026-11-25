import { CheckCircle2, Delete, RotateCcw, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'memorize' | 'recall' | 'feedback' | 'finished';

export function NumberMemoryGame({
  onComplete,
  onPlayStateChange,
  onHudUpdate,
  seed,
  mode = 'practice',
  difficulty = 'standard',
  autoStart = false,
  paused = false,
  restartNonce = 0,
  hideEmbeddedSummary = false,
}: GameComponentProps) {
  const { recordResult } = useProgress();
  const startingDigits = difficulty === 'challenging' ? 4 : 3;
  const startingLives = difficulty === 'relaxed' ? 4 : difficulty === 'challenging' ? 2 : 3;

  const [phase, setPhase] = useState<Phase>('idle');
  const [digitsLength, setDigitsLength] = useState(startingDigits);
  const [maxDigitsReached, setMaxDigitsReached] = useState(0);
  const [lives, setLives] = useState(startingLives);
  const [score, setScore] = useState(0);
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [correctRounds, setCorrectRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [progressPct, setProgressPct] = useState(100);
  const [lastWasCorrect, setLastWasCorrect] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);
  const rngRef = useRef<() => number>(
    seed !== undefined ? createSeededRng(seed + 202) : Math.random
  );

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    onPlayStateChange?.(phase !== 'idle' && phase !== 'finished');
  }, [phase, onPlayStateChange]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'finished' || paused) return;
    const id = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  useEffect(() => {
    const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(elapsedSeconds % 60).padStart(2, '0');
    onHudUpdate?.({
      levelLabel: `${digitsLength} Digits · ${lives}/${startingLives} Lives`,
      score,
      timerLabel: `${mins}:${secs}`,
    });
  }, [digitsLength, lives, startingLives, score, elapsedSeconds, onHudUpdate]);

  const generateNumber = (len: number): string => {
    let out = '';
    for (let i = 0; i < len; i++) {
      const min = i === 0 ? 1 : 0;
      const digit = min + Math.floor(rngRef.current() * (10 - min));
      out += String(digit);
    }
    return out;
  };

  const startRound = useCallback(
    (len: number) => {
      clearTimers();
      const num = generateNumber(len);
      setTargetNumber(num);
      setUserInput('');
      setProgressPct(100);
      setPhase('memorize');

      const durationMs =
        difficulty === 'relaxed'
          ? 1700 + len * 500
          : difficulty === 'challenging'
          ? 1000 + len * 320
          : 1300 + len * 420;
      const startedAt = Date.now();

      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const pct = Math.max(0, 100 - (elapsed / durationMs) * 100);
        setProgressPct(pct);
      }, 40);

      timeoutRef.current = window.setTimeout(() => {
        clearTimers();
        setProgressPct(0);
        setPhase('recall');
        window.setTimeout(() => inputRef.current?.focus(), 40);
      }, durationMs);
    },
    [clearTimers, difficulty]
  );

  const finishGame = useCallback(
    (finalScore: number, bestSpan: number, hits: number, rounds: number) => {
      clearTimers();
      setPhase('finished');
      if (recordedRef.current) return;
      recordedRef.current = true;
      const accuracy = rounds > 0 ? Math.round((hits / rounds) * 100) : 0;
      const durationSeconds = Math.max(5, elapsedRef.current);
      const result: GameSessionResult = {
        gameId: 'number-memory',
        score: finalScore,
        primaryMetric: bestSpan,
        levelReached: bestSpan,
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
    [clearTimers, difficulty, hideEmbeddedSummary, mode, onComplete, recordResult]
  );

  const handleStart = useCallback(() => {
    clearTimers();
    rngRef.current = seed !== undefined ? createSeededRng(seed + 202) : Math.random;
    recordedRef.current = false;
    runIdRef.current = `nm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setDigitsLength(startingDigits);
    setMaxDigitsReached(0);
    setLives(startingLives);
    setScore(0);
    setCorrectRounds(0);
    setTotalRounds(0);
    startRound(startingDigits);
  }, [clearTimers, seed, startRound, startingDigits, startingLives]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const prevPausedRef = useRef(paused);
  useEffect(() => {
    if (paused) {
      clearTimers();
    } else if (prevPausedRef.current && phase === 'memorize') {
      startRound(digitsLength);
    }
    prevPausedRef.current = paused;
  }, [paused, phase, digitsLength, clearTimers, startRound]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phase !== 'recall' || userInput.trim().length === 0 || paused) return;

    const cleaned = userInput.replace(/\D/g, '');
    const isCorrect = cleaned === targetNumber;
    const nextTotal = totalRounds + 1;
    setTotalRounds(nextTotal);
    setLastWasCorrect(isCorrect);
    setPhase('feedback');

    if (isCorrect) {
      const nextHits = correctRounds + 1;
      const earned = digitsLength * 85;
      const nextScore = score + earned;
      const nextBest = Math.max(maxDigitsReached, digitsLength);
      setCorrectRounds(nextHits);
      setScore(nextScore);
      setMaxDigitsReached(nextBest);

      const isGuidedDone = mode !== 'practice' && digitsLength >= 6;
      timeoutRef.current = window.setTimeout(() => {
        if (isGuidedDone) {
          finishGame(nextScore, nextBest, nextHits, nextTotal);
        } else {
          const nextLen = digitsLength + 1;
          setDigitsLength(nextLen);
          startRound(nextLen);
        }
      }, 950);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      timeoutRef.current = window.setTimeout(() => {
        if (nextLives <= 0) {
          finishGame(score, maxDigitsReached, correctRounds, nextTotal);
        } else {
          startRound(digitsLength);
        }
      }, 1350);
    }
  };

  const appendDigit = (d: string) => {
    if (phase !== 'recall' || paused) return;
    if (userInput.length < 18) setUserInput((prev) => prev + d);
  };

  const accuracyPct = totalRounds > 0 ? Math.round((correctRounds / totalRounds) * 100) : 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Encode the displayed digits before the meter expires, then enter the sequence from memory.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Number Memory
          </button>
        </div>
      )}

      {phase === 'memorize' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-8 sm:p-12 text-center shadow-lg">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] mb-4">
            Encode {digitsLength}-Digit Sequence
          </p>
          <div className="font-mono text-4xl sm:text-6xl font-bold tracking-[0.16em] text-[#171717] dark:text-[#F4F4F6] tabular-nums py-5 select-none">
            {targetNumber}
          </div>
          <div className="mt-6 h-2 w-full max-w-sm mx-auto rounded-full bg-[#E5E7EB] dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-[width] duration-75"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-6 sm:p-8 max-w-md mx-auto text-center shadow-lg"
        >
          <label
            htmlFor="number-memory-input"
            className="block font-mono text-xs uppercase tracking-[0.16em] text-[#666666] dark:text-[#A1A1AA] mb-3"
          >
            Enter {digitsLength}-Digit Sequence
          </label>
          <input
            id="number-memory-input"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Type digits..."
            className="w-full px-4 py-3.5 text-center font-mono text-2xl sm:text-3xl tracking-[0.18em] rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] text-[#171717] dark:text-[#F4F4F6] focus:outline-none focus:border-[#F97316]"
          />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => appendDigit(d)}
                className="min-h-[48px] rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] hover:border-[#F97316] active:scale-[0.97] font-mono text-lg font-semibold text-[#171717] dark:text-[#F4F4F6] transition-all"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              aria-label="Clear entered digits"
              onClick={() => setUserInput('')}
              className="min-h-[48px] rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] text-xs font-medium text-[#666666] dark:text-[#A1A1AA]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => appendDigit('0')}
              className="min-h-[48px] rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] hover:border-[#F97316] active:scale-[0.97] font-mono text-lg font-semibold text-[#171717] dark:text-[#F4F4F6] transition-all"
            >
              0
            </button>
            <button
              type="button"
              aria-label="Delete last digit"
              onClick={() => setUserInput((p) => p.slice(0, -1))}
              className="min-h-[48px] rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] flex items-center justify-center text-[#666666] dark:text-[#A1A1AA]"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={userInput.length === 0}
            className="mt-4 w-full min-h-[48px] rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            Confirm Sequence
          </button>
        </form>
      )}

      {phase === 'feedback' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-8 sm:p-10 max-w-md mx-auto text-center shadow-lg">
          {lastWasCorrect ? (
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              <CheckCircle2 className="w-5 h-5" />
              Verified · Advancing to {digitsLength + 1} digits
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-lg">
                <XCircle className="w-5 h-5" />
                Sequence Mismatch
              </div>
              <div className="grid grid-cols-2 gap-3 text-left rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] p-4 font-mono text-sm">
                <div>
                  <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block font-sans">Target</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{targetNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block font-sans">Entered</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{userInput}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'finished' && !hideEmbeddedSummary && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="font-mono text-xs text-[#F97316] uppercase tracking-wider">
            Session Complete
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Best Span: {maxDigitsReached} Digits
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Score</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{score}</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Best Span</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {maxDigitsReached}
              </span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Accuracy</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{accuracyPct}%</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
            Scores are practice metrics only and are not medical or diagnostic measurements.
          </p>

          {mode === 'practice' && (
            <button
              type="button"
              onClick={handleStart}
              className="mt-5 inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
