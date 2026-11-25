import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'showing' | 'input' | 'round-feedback' | 'finished';

export function VisualMemoryGame({
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
  const startingLives = difficulty === 'relaxed' ? 4 : difficulty === 'challenging' ? 2 : 3;

  const [phase, setPhase] = useState<Phase>('idle');
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(startingLives);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [userInputs, setUserInputs] = useState<number[]>([]);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [roundOutcome, setRoundOutcome] = useState<'passed' | 'missed' | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timersRef = useRef<number[]>([]);
  const elapsedRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);
  const rngRef = useRef<() => number>(
    seed !== undefined ? createSeededRng(seed + 101) : Math.random
  );

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

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
      levelLabel: `Level ${level} · ${lives}/${startingLives} Lives`,
      score,
      timerLabel: `${mins}:${secs}`,
    });
  }, [level, lives, startingLives, score, elapsedSeconds, onHudUpdate]);

  const getGridSize = (lvl: number): number => {
    if (lvl <= 2) return 3;
    if (lvl <= 5) return 4;
    if (lvl <= 8) return 5;
    return 6;
  };

  const getSequenceLength = useCallback(
    (lvl: number): number => {
      const base = difficulty === 'challenging' ? 3 : 2;
      return Math.min(12, base + lvl);
    },
    [difficulty]
  );

  const gridSize = getGridSize(level);
  const totalCells = gridSize * gridSize;

  const startRound = useCallback(
    (targetLevel: number) => {
      clearAllTimers();
      const size = getGridSize(targetLevel);
      const count = size * size;
      const seqLen = getSequenceLength(targetLevel);

      const indices = Array.from({ length: count }, (_, i) => i);
      const nextSeq: number[] = [];
      for (let i = 0; i < seqLen; i++) {
        const pickIdx = Math.floor(rngRef.current() * indices.length);
        nextSeq.push(indices[pickIdx]);
        indices.splice(pickIdx, 1);
      }

      setSequence(nextSeq);
      setUserInputs([]);
      setWrongCell(null);
      setRoundOutcome(null);
      setActiveCell(null);
      setPhase('showing');

      const stepMs = difficulty === 'relaxed' ? 680 : difficulty === 'challenging' ? 400 : 540;
      const onMs = difficulty === 'relaxed' ? 460 : difficulty === 'challenging' ? 260 : 360;

      nextSeq.forEach((cellIdx, step) => {
        const showTimer = window.setTimeout(() => {
          setActiveCell(cellIdx);
        }, 320 + step * stepMs);
        const hideTimer = window.setTimeout(() => {
          setActiveCell(null);
        }, 320 + step * stepMs + onMs);
        timersRef.current.push(showTimer, hideTimer);
      });

      const doneTimer = window.setTimeout(() => {
        setActiveCell(null);
        setPhase('input');
      }, 320 + nextSeq.length * stepMs + 100);
      timersRef.current.push(doneTimer);
    },
    [clearAllTimers, difficulty, getSequenceLength]
  );

  const finishGame = useCallback(
    (finalScore: number, maxLvl: number, hits: number, attempts: number) => {
      clearAllTimers();
      setPhase('finished');
      if (recordedRef.current) return;
      recordedRef.current = true;
      const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : 0;
      const durationSeconds = Math.max(5, elapsedRef.current);
      const result: GameSessionResult = {
        gameId: 'visual-memory',
        score: finalScore,
        primaryMetric: maxLvl,
        levelReached: maxLvl,
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
    [clearAllTimers, difficulty, hideEmbeddedSummary, mode, onComplete, recordResult]
  );

  const handleStart = useCallback(() => {
    clearAllTimers();
    rngRef.current = seed !== undefined ? createSeededRng(seed + 101) : Math.random;
    recordedRef.current = false;
    runIdRef.current = `vm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setLevel(1);
    setHighestLevel(0);
    setLives(startingLives);
    setScore(0);
    setCorrectClicks(0);
    setTotalClicks(0);
    startRound(1);
  }, [clearAllTimers, seed, startRound, startingLives]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const prevPausedRef = useRef(paused);
  useEffect(() => {
    if (paused) {
      clearAllTimers();
    } else if (prevPausedRef.current && phase === 'showing') {
      startRound(level);
    }
    prevPausedRef.current = paused;
  }, [paused, phase, level, clearAllTimers, startRound]);

  const handleCellClick = (cellIndex: number) => {
    if (phase !== 'input' || paused) return;
    if (userInputs.includes(cellIndex)) return;

    const expected = sequence[userInputs.length];
    const nextTotal = totalClicks + 1;
    setTotalClicks(nextTotal);

    if (cellIndex === expected) {
      const nextInputs = [...userInputs, cellIndex];
      const nextHits = correctClicks + 1;
      setUserInputs(nextInputs);
      setCorrectClicks(nextHits);

      if (nextInputs.length === sequence.length) {
        const earned = level * 120 + sequence.length * 25;
        const nextScore = score + earned;
        const nextLevel = level + 1;
        const nextMax = Math.max(highestLevel, level);
        setScore(nextScore);
        setHighestLevel(nextMax);
        setRoundOutcome('passed');
        setPhase('round-feedback');

        const isGuidedLimit = mode !== 'practice' && level >= 4;
        const t = window.setTimeout(() => {
          if (isGuidedLimit) {
            finishGame(nextScore, nextMax, nextHits, nextTotal);
          } else {
            setLevel(nextLevel);
            startRound(nextLevel);
          }
        }, 700);
        timersRef.current.push(t);
      }
    } else {
      setWrongCell(cellIndex);
      setRoundOutcome('missed');
      setPhase('round-feedback');
      const remainingLives = lives - 1;
      setLives(remainingLives);

      const t = window.setTimeout(() => {
        if (remainingLives <= 0) {
          finishGame(score, highestLevel, correctClicks, nextTotal);
        } else {
          startRound(level);
        }
      }, 850);
      timersRef.current.push(t);
    }
  };

  const accuracyPct = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Watch the grid illuminate sequentially, then select the exact cells in order.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Visual Memory
          </button>
        </div>
      )}

      {(phase === 'showing' || phase === 'input' || phase === 'round-feedback') && (
        <div className="flex flex-col items-center">
          <div className="mb-5 h-7 flex items-center justify-center text-sm font-medium">
            {phase === 'showing' && (
              <span className="font-mono text-[#F97316] tracking-wide">
                OBSERVING SEQUENCE ({sequence.length} CELLS)
              </span>
            )}
            {phase === 'input' && (
              <span className="font-mono text-[#171717] dark:text-[#F4F4F6]">
                SELECT CELL {userInputs.length + 1} OF {sequence.length}
              </span>
            )}
            {phase === 'round-feedback' && roundOutcome === 'passed' && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Sequence Verified · Level Up
              </span>
            )}
            {phase === 'round-feedback' && roundOutcome === 'missed' && (
              <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <XCircle className="w-4 h-4" />
                Mismatch · {lives} {lives === 1 ? 'life' : 'lives'} remaining
              </span>
            )}
          </div>

          <div
            className="grid gap-2.5 sm:gap-3 w-full max-w-[440px] aspect-square p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] shadow-lg"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: totalCells }, (_, idx) => {
              const isShowing = activeCell === idx;
              const stepIdx = userInputs.indexOf(idx);
              const isSelected = stepIdx !== -1;
              const isWrong = wrongCell === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={phase !== 'input' || isSelected || paused}
                  onClick={() => handleCellClick(idx)}
                  aria-label={`Grid cell ${idx + 1}${isSelected ? `, selected step ${stepIdx + 1}` : ''}`}
                  className={`rounded-xl border transition-all duration-150 flex items-center justify-center font-mono text-sm font-bold tabular-nums select-none ${
                    isShowing
                      ? 'bg-[#F97316] border-[#EA580C] text-white scale-[0.96] ring-2 ring-[#F97316]/35'
                      : isWrong
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                      : isSelected
                      ? 'bg-[#FFF0E5] dark:bg-[#F97316]/20 border-[#F97316] text-[#EA580C] dark:text-[#FB923C]'
                      : 'bg-[#F8F8FA] dark:bg-[#1B1E25] border-[#E5E7EB] dark:border-[#262A35] hover:border-[#F97316]/60 active:scale-[0.97]'
                  }`}
                >
                  {isSelected ? stepIdx + 1 : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'finished' && !hideEmbeddedSummary && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="font-mono text-xs text-[#F97316] uppercase tracking-wider">
            Session Complete
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            {highestLevel === 0 ? 'Practice Run Complete' : `Level ${highestLevel} Cleared`}
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Score</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{score}</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Cleared</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{highestLevel}</span>
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
