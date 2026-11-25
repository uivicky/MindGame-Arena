import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng, shuffleWithRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'playing' | 'finished';

interface SymbolPair {
  target: string;
  distractors: string[];
}

const SYMBOL_SETS: SymbolPair[] = [
  { target: 'Q', distractors: ['O', 'C', 'G', '0'] },
  { target: 'E', distractors: ['F', 'B', 'L', 'I'] },
  { target: 'b', distractors: ['d', 'p', 'q', 'h'] },
  { target: 'M', distractors: ['W', 'N', 'H', 'V'] },
  { target: '5', distractors: ['S', '2', '3', '8'] },
  { target: '△', distractors: ['▽', '◇', '□', '○'] },
  { target: 'Z', distractors: ['N', '2', '7', 'X'] },
];

interface GridCell {
  id: number;
  symbol: string;
  isTarget: boolean;
  found: boolean;
  mistakeFlash: boolean;
}

export function FocusAttentionGame({
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
  const SESSION_SECONDS =
    mode !== 'practice'
      ? difficulty === 'relaxed'
        ? 45
        : difficulty === 'challenging'
        ? 30
        : 35
      : difficulty === 'relaxed'
      ? 60
      : difficulty === 'challenging'
      ? 35
      : 45;

  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [roundNumber, setRoundNumber] = useState(1);
  const [targetSymbol, setTargetSymbol] = useState('Q');
  const [cells, setCells] = useState<GridCell[]>([]);
  const [hits, setHits] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [boardsCleared, setBoardsCleared] = useState(0);

  const flashTimerRef = useRef<number | null>(null);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);
  const rngRef = useRef<() => number>(
    seed !== undefined ? createSeededRng(seed + 303) : Math.random
  );
  const statsRef = useRef({ hits: 0, mistakes: 0, boardsCleared: 0 });

  useEffect(() => {
    statsRef.current = { hits, mistakes, boardsCleared };
  }, [hits, mistakes, boardsCleared]);

  useEffect(() => {
    onPlayStateChange?.(phase === 'playing');
  }, [phase, onPlayStateChange]);

  const liveScore = Math.max(0, hits * 35 + boardsCleared * 100 - mistakes * 25);

  useEffect(() => {
    onHudUpdate?.({
      levelLabel: `Board ${roundNumber} · ${hits} Hits`,
      score: liveScore,
      timerLabel: `00:${String(timeLeft).padStart(2, '0')}`,
    });
  }, [roundNumber, hits, liveScore, timeLeft, onHudUpdate]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const buildBoard = useCallback(
    (round: number) => {
      const rng = rngRef.current;
      const setIdx = Math.floor(rng() * SYMBOL_SETS.length);
      const chosen = SYMBOL_SETS[setIdx];
      const largeThreshold =
        difficulty === 'relaxed' ? 4 : difficulty === 'challenging' ? 2 : 3;
      const gridTotal = round >= largeThreshold ? 36 : 25;
      const targetCount = Math.min(9, 4 + Math.floor(round / 2));

      const pool: { symbol: string; isTarget: boolean }[] = [];
      for (let i = 0; i < targetCount; i++) {
        pool.push({ symbol: chosen.target, isTarget: true });
      }
      for (let i = targetCount; i < gridTotal; i++) {
        const dist = chosen.distractors[Math.floor(rng() * chosen.distractors.length)];
        pool.push({ symbol: dist, isTarget: false });
      }

      const shuffled = shuffleWithRng(pool, rng).map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        isTarget: item.isTarget,
        found: false,
        mistakeFlash: false,
      }));

      setTargetSymbol(chosen.target);
      setCells(shuffled);
    },
    [difficulty]
  );

  const finishSession = useCallback(() => {
    setPhase('finished');
    if (recordedRef.current) return;
    recordedRef.current = true;

    const { hits: h, mistakes: m, boardsCleared: b } = statsRef.current;
    const totalClicks = h + m;
    const accuracy = totalClicks > 0 ? Math.round((h / totalClicks) * 100) : 0;
    const score = Math.max(0, h * 35 + b * 100 - m * 25);

    const result: GameSessionResult = {
      gameId: 'focus-attention',
      score,
      primaryMetric: accuracy,
      levelReached: b,
      accuracy,
      durationSeconds: SESSION_SECONDS,
      difficulty,
      submissionId: runIdRef.current,
    };
    if (mode === 'practice' && !hideEmbeddedSummary) {
      recordResult(result, 'practice');
    }
    onComplete?.(result);
  }, [SESSION_SECONDS, difficulty, hideEmbeddedSummary, mode, onComplete, recordResult]);

  useEffect(() => {
    if (phase !== 'playing' || paused) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      finishSession();
    }
  }, [phase, timeLeft, finishSession]);

  const handleStart = useCallback(() => {
    rngRef.current = seed !== undefined ? createSeededRng(seed + 303) : Math.random;
    recordedRef.current = false;
    runIdRef.current = `fa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setHits(0);
    setMistakes(0);
    setBoardsCleared(0);
    statsRef.current = { hits: 0, mistakes: 0, boardsCleared: 0 };
    setRoundNumber(1);
    setTimeLeft(SESSION_SECONDS);
    buildBoard(1);
    setPhase('playing');
  }, [SESSION_SECONDS, buildBoard, seed]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const handleCellClick = (cellId: number) => {
    if (phase !== 'playing' || paused) return;
    const targetCell = cells.find((c) => c.id === cellId);
    if (!targetCell || targetCell.found) return;

    if (targetCell.isTarget) {
      const updated = cells.map((c) => (c.id === cellId ? { ...c, found: true } : c));
      const nextHits = hits + 1;
      setHits(nextHits);
      statsRef.current.hits = nextHits;
      setCells(updated);

      const remaining = updated.filter((c) => c.isTarget && !c.found).length;
      if (remaining === 0) {
        const nextBoards = boardsCleared + 1;
        const nextRound = roundNumber + 1;
        setBoardsCleared(nextBoards);
        statsRef.current.boardsCleared = nextBoards;
        setRoundNumber(nextRound);
        buildBoard(nextRound);
      }
    } else {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      statsRef.current.mistakes = nextMistakes;
      setCells((prev) =>
        prev.map((c) => (c.id === cellId ? { ...c, mistakeFlash: true } : c))
      );
      flashTimerRef.current = window.setTimeout(() => {
        setCells((prev) =>
          prev.map((c) => (c.id === cellId ? { ...c, mistakeFlash: false } : c))
        );
      }, 300);
    }
  };

  const totalTargetsOnBoard = cells.filter((c) => c.isTarget).length;
  const remainingTargets = cells.filter((c) => c.isTarget && !c.found).length;
  const totalClicks = hits + mistakes;
  const finalAccuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
  const cols = cells.length > 25 ? 6 : 5;

  return (
    <div className="w-full max-w-xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Locate all matching target characters inside the matrix during your {SESSION_SECONDS}
            -second sprint.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Focus Grid
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[440px] flex items-center justify-between mb-4 px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#666666] dark:text-[#A1A1AA]">
                Target
              </span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#F97316] text-white font-mono text-xl font-bold">
                {targetSymbol}
              </span>
            </div>
            <div className="text-right font-mono text-xs tabular-nums">
              <span className="block text-[#171717] dark:text-[#F4F4F6] font-semibold">
                {totalTargetsOnBoard - remainingTargets} / {totalTargetsOnBoard} Found
              </span>
              <span className="text-rose-500">{mistakes} Errors</span>
            </div>
          </div>

          <div
            className="grid gap-2 w-full max-w-[440px] p-3 sm:p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] shadow-lg"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cells.map((cell) => {
              const row = Math.floor(cell.id / cols) + 1;
              const col = (cell.id % cols) + 1;
              return (
                <button
                  key={cell.id}
                  type="button"
                  disabled={paused}
                  onClick={() => handleCellClick(cell.id)}
                  aria-label={`Symbol ${cell.symbol}, row ${row} column ${col}${
                    cell.found ? ', matched' : ''
                  }`}
                  className={`aspect-square min-h-[44px] rounded-xl border font-mono text-lg sm:text-xl font-bold transition-all duration-150 select-none ${
                    cell.found
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 scale-[0.96]'
                      : cell.mistakeFlash
                      ? 'bg-rose-500/25 border-rose-500 text-rose-500'
                      : 'bg-[#F8F8FA] dark:bg-[#1B1E25] border-[#E5E7EB] dark:border-[#262A35] hover:border-[#F97316]/60 text-[#171717] dark:text-[#F4F4F6] active:scale-[0.96]'
                  }`}
                >
                  {cell.symbol}
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
            {finalAccuracy}% Focus Accuracy
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Score</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{liveScore}</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Hits / Err</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {hits} / {mistakes}
              </span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Boards</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {boardsCleared}
              </span>
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
