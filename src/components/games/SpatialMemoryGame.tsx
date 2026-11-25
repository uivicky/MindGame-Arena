import { CheckCircle2, Circle, Diamond, Hexagon, RotateCcw, Square, Triangle, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'observe' | 'recall' | 'feedback' | 'finished';

const MARKER_ICONS = [Circle, Square, Triangle, Diamond, Hexagon];

interface MarkerPlacement {
  cellIndex: number;
  iconIndex: number;
}

export function SpatialMemoryGame({
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
  const [highestLevel, setHighestLevel] = useState(0);
  const [lives, setLives] = useState(startingLives);
  const [score, setScore] = useState(0);
  const [markers, setMarkers] = useState<MarkerPlacement[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [correctPicks, setCorrectPicks] = useState(0);
  const [totalPicks, setTotalPicks] = useState(0);
  const [roundPassed, setRoundPassed] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);
  const rngRef = useRef<() => number>(
    seed !== undefined ? createSeededRng(seed + 606) : Math.random
  );

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

  const getGridSize = (lvl: number) => (lvl <= 2 ? 4 : lvl <= 5 ? 5 : 6);
  const getMarkerCount = useCallback(
    (lvl: number) => {
      const base = difficulty === 'challenging' ? 3 : 2;
      return Math.min(10, base + lvl);
    },
    [difficulty]
  );

  const startRound = useCallback(
    (lvl: number) => {
      clearTimer();
      const size = getGridSize(lvl);
      const total = size * size;
      const count = getMarkerCount(lvl);

      const indices = Array.from({ length: total }, (_, i) => i);
      const placements: MarkerPlacement[] = [];
      for (let i = 0; i < count; i++) {
        const pick = Math.floor(rngRef.current() * indices.length);
        placements.push({
          cellIndex: indices[pick],
          iconIndex: i % MARKER_ICONS.length,
        });
        indices.splice(pick, 1);
      }

      setMarkers(placements);
      setSelectedCells([]);
      setPhase('observe');

      const viewDurationMs =
        difficulty === 'relaxed'
          ? 2500 + count * 340
          : difficulty === 'challenging'
          ? 1400 + count * 220
          : 1900 + count * 280;
      timeoutRef.current = window.setTimeout(() => {
        setPhase('recall');
      }, viewDurationMs);
    },
    [clearTimer, difficulty, getMarkerCount]
  );

  const finishGame = useCallback(
    (finalScore: number, maxLvl: number, hits: number, attempts: number) => {
      clearTimer();
      setPhase('finished');
      if (recordedRef.current) return;
      recordedRef.current = true;

      const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : 0;
      const durationSeconds = Math.max(5, elapsedRef.current);
      const result: GameSessionResult = {
        gameId: 'spatial-memory',
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
    [clearTimer, difficulty, hideEmbeddedSummary, mode, onComplete, recordResult]
  );

  const handleStart = useCallback(() => {
    clearTimer();
    rngRef.current = seed !== undefined ? createSeededRng(seed + 606) : Math.random;
    recordedRef.current = false;
    runIdRef.current = `sm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setLevel(1);
    setHighestLevel(0);
    setLives(startingLives);
    setScore(0);
    setCorrectPicks(0);
    setTotalPicks(0);
    startRound(1);
  }, [clearTimer, seed, startRound, startingLives]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const prevPausedRef = useRef(paused);
  useEffect(() => {
    if (paused) {
      clearTimer();
    } else if (prevPausedRef.current && phase === 'observe') {
      startRound(level);
    }
    prevPausedRef.current = paused;
  }, [paused, phase, level, clearTimer, startRound]);

  const handleCellSelect = (cellIndex: number) => {
    if (phase !== 'recall' || paused) return;
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells((prev) => prev.filter((c) => c !== cellIndex));
      return;
    }
    if (selectedCells.length >= markers.length) return;
    setSelectedCells((prev) => [...prev, cellIndex]);
  };

  const handleVerify = () => {
    if (phase !== 'recall' || selectedCells.length === 0 || paused) return;
    const targetSet = new Set(markers.map((m) => m.cellIndex));
    let hits = 0;
    for (const c of selectedCells) {
      if (targetSet.has(c)) hits++;
    }
    const nextCorrect = correctPicks + hits;
    const nextTotal = totalPicks + markers.length;
    setCorrectPicks(nextCorrect);
    setTotalPicks(nextTotal);

    const passed = hits === markers.length && selectedCells.length === markers.length;
    setRoundPassed(passed);
    setPhase('feedback');

    if (passed) {
      const earned = level * 110 + markers.length * 20;
      const nextScore = score + earned;
      const nextMax = Math.max(highestLevel, level);
      setScore(nextScore);
      setHighestLevel(nextMax);

      const guidedLimit = mode !== 'practice' && level >= 4;
      timeoutRef.current = window.setTimeout(() => {
        if (guidedLimit) {
          finishGame(nextScore, nextMax, nextCorrect, nextTotal);
        } else {
          const nextLvl = level + 1;
          setLevel(nextLvl);
          startRound(nextLvl);
        }
      }, 900);
    } else {
      const remaining = lives - 1;
      setLives(remaining);
      timeoutRef.current = window.setTimeout(() => {
        if (remaining <= 0) {
          finishGame(score, highestLevel, nextCorrect, nextTotal);
        } else {
          startRound(level);
        }
      }, 1150);
    }
  };

  const gridSize = getGridSize(level);
  const totalCells = gridSize * gridSize;
  const accuracyPct = totalPicks > 0 ? Math.round((correctPicks / totalPicks) * 100) : 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Encode geometric node coordinates across the grid, then reconstruct their positions.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Spatial Memory
          </button>
        </div>
      )}

      {(phase === 'observe' || phase === 'recall' || phase === 'feedback') && (
        <div className="flex flex-col items-center">
          <div className="mb-4 h-7 flex items-center text-sm font-medium">
            {phase === 'observe' && (
              <span className="font-mono text-[#F97316] tracking-wide">
                OBSERVING {markers.length} COORDINATES
              </span>
            )}
            {phase === 'recall' && (
              <span className="font-mono text-[#171717] dark:text-[#F4F4F6]">
                SELECT {markers.length} NODES ({selectedCells.length}/{markers.length})
              </span>
            )}
            {phase === 'feedback' && roundPassed && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Exact Coordinates Matched
              </span>
            )}
            {phase === 'feedback' && !roundPassed && (
              <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <XCircle className="w-4 h-4" />
                Coordinate Mismatch
              </span>
            )}
          </div>

          <div
            className="grid gap-2 sm:gap-2.5 w-full max-w-[440px] aspect-square p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] shadow-lg"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: totalCells }, (_, idx) => {
              const marker = markers.find((m) => m.cellIndex === idx);
              const isSelected = selectedCells.includes(idx);
              const IconComp = marker ? MARKER_ICONS[marker.iconIndex] : null;

              let cellStyle =
                'bg-[#F8F8FA] dark:bg-[#1B1E25] border-[#E5E7EB] dark:border-[#262A35] hover:border-[#F97316]/60 active:scale-[0.96]';
              if (phase === 'observe' && marker) {
                cellStyle =
                  'bg-[#FFF0E5] dark:bg-[#F97316]/20 border-[#F97316] text-[#EA580C] dark:text-[#FB923C] ring-2 ring-[#F97316]/25';
              } else if (phase === 'recall' && isSelected) {
                cellStyle =
                  'bg-[#F97316]/20 border-[#F97316] text-[#EA580C] dark:text-[#FB923C]';
              } else if (phase === 'feedback') {
                if (marker && isSelected) {
                  cellStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
                } else if (marker && !isSelected) {
                  cellStyle = 'bg-amber-500/20 border-amber-500 text-amber-500';
                } else if (!marker && isSelected) {
                  cellStyle = 'bg-rose-500/20 border-rose-500 text-rose-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={phase !== 'recall' || paused}
                  onClick={() => handleCellSelect(idx)}
                  aria-label={`Coordinate ${idx + 1}${isSelected ? ', selected' : ''}`}
                  className={`rounded-xl border flex items-center justify-center transition-all duration-150 ${cellStyle}`}
                >
                  {(phase === 'observe' || phase === 'feedback') && IconComp ? (
                    <IconComp className="w-5 h-5" />
                  ) : phase === 'recall' && isSelected ? (
                    <span className="w-3 h-3 rounded-sm bg-current" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {phase === 'recall' && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={selectedCells.length !== markers.length || paused}
              className="mt-5 min-h-[46px] px-7 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
            >
              Confirm Coordinates
            </button>
          )}
        </div>
      )}

      {phase === 'finished' && !hideEmbeddedSummary && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="font-mono text-xs text-[#F97316] uppercase tracking-wider">
            Session Complete
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            {highestLevel === 0 ? 'Practice Run Complete' : `Level ${highestLevel} Completed`}
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
