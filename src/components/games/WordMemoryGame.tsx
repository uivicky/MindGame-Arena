import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { WORD_MEMORY_BANK } from '../../data/questionBank';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng, shuffleWithRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'study' | 'recall' | 'round-review' | 'finished';

export function WordMemoryGame({
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
  const MAX_ROUNDS = mode !== 'practice' ? 3 : difficulty === 'relaxed' ? 3 : 4;

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(1);
  const [studyWords, setStudyWords] = useState<string[]>([]);
  const [mixedWords, setMixedWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [studySecondsLeft, setStudySecondsLeft] = useState(8);
  const [score, setScore] = useState(0);
  const [totalAccuracySum, setTotalAccuracySum] = useState(0);
  const [maxWordsCleared, setMaxWordsCleared] = useState(0);
  const [roundStats, setRoundStats] = useState<{
    hits: number;
    totalTargets: number;
    falsePos: number;
  } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const elapsedRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);
  const rngRef = useRef<() => number>(
    seed !== undefined ? createSeededRng(seed + 505) : Math.random
  );

  useEffect(() => {
    onPlayStateChange?.(phase === 'study' || phase === 'recall' || phase === 'round-review');
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
      levelLabel: `Round ${round} / ${MAX_ROUNDS}`,
      score,
      timerLabel: phase === 'study' ? `${studySecondsLeft}s study` : `${mins}:${secs}`,
    });
  }, [round, MAX_ROUNDS, score, phase, studySecondsLeft, elapsedSeconds, onHudUpdate]);

  useEffect(() => {
    if (phase !== 'study' || paused) return;
    const id = window.setInterval(() => {
      setStudySecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  useEffect(() => {
    if (phase === 'study' && studySecondsLeft === 0) {
      setPhase('recall');
    }
  }, [phase, studySecondsLeft]);

  const startRound = useCallback(
    (roundNum: number) => {
      const targetCount = 4 + roundNum * 2;
      const distractorCount = difficulty === 'challenging' ? targetCount + 2 : targetCount;
      const shuffledBank = shuffleWithRng(WORD_MEMORY_BANK, rngRef.current);
      const targets = shuffledBank.slice(0, targetCount);
      const distractors = shuffledBank.slice(targetCount, targetCount + distractorCount);
      const mixed = shuffleWithRng([...targets, ...distractors], rngRef.current);

      setStudyWords(targets);
      setMixedWords(mixed);
      setSelectedWords([]);
      setRoundStats(null);
      const studyDur =
        difficulty === 'relaxed'
          ? Math.min(15, 7 + roundNum * 2)
          : difficulty === 'challenging'
          ? Math.min(10, 4 + roundNum)
          : Math.min(12, 5 + roundNum * 2);
      setStudySecondsLeft(studyDur);
      setPhase('study');
    },
    [difficulty]
  );

  const handleStart = useCallback(() => {
    rngRef.current = seed !== undefined ? createSeededRng(seed + 505) : Math.random;
    recordedRef.current = false;
    runIdRef.current = `wm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setRound(1);
    setScore(0);
    setTotalAccuracySum(0);
    setMaxWordsCleared(0);
    startRound(1);
  }, [seed, startRound]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const toggleWord = (word: string) => {
    if (phase !== 'recall' || paused) return;
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleSubmitRecall = () => {
    if (phase !== 'recall' || paused) return;
    const targetSet = new Set(studyWords);
    let hits = 0;
    let falsePos = 0;
    for (const w of selectedWords) {
      if (targetSet.has(w)) hits++;
      else falsePos++;
    }
    const missed = studyWords.length - hits;
    const roundAcc =
      studyWords.length > 0
        ? Math.max(0, Math.round(((hits - falsePos * 0.5) / studyWords.length) * 100))
        : 0;
    const clampedAcc = Math.min(100, Math.max(0, roundAcc));
    const roundPoints = Math.max(0, hits * 45 - falsePos * 30 - missed * 10);

    const nextScore = score + roundPoints;
    const nextAccSum = totalAccuracySum + clampedAcc;
    const nextMaxWords =
      hits === studyWords.length && falsePos === 0
        ? Math.max(maxWordsCleared, studyWords.length)
        : Math.max(maxWordsCleared, hits);

    setScore(nextScore);
    setTotalAccuracySum(nextAccSum);
    setMaxWordsCleared(nextMaxWords);
    setRoundStats({ hits, totalTargets: studyWords.length, falsePos });
    setPhase('round-review');
  };

  const handleContinue = () => {
    if (paused) return;
    if (round >= MAX_ROUNDS) {
      setPhase('finished');
      if (!recordedRef.current) {
        recordedRef.current = true;
        const avgAcc = Math.round(totalAccuracySum / MAX_ROUNDS);
        const durationSeconds = Math.max(5, elapsedRef.current);
        const result: GameSessionResult = {
          gameId: 'word-memory',
          score,
          primaryMetric: maxWordsCleared,
          levelReached: MAX_ROUNDS,
          accuracy: avgAcc,
          durationSeconds,
          difficulty,
          submissionId: runIdRef.current,
        };
        if (mode === 'practice' && !hideEmbeddedSummary) {
          recordResult(result, 'practice');
        }
        onComplete?.(result);
      }
    } else {
      const nextRound = round + 1;
      setRound(nextRound);
      startRound(nextRound);
    }
  };

  const avgAccuracy = round > 0 ? Math.round(totalAccuracySum / round) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Encode the study words before the countdown expires, then separate them from new
            distractors across {MAX_ROUNDS} rounds.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Word Memory
          </button>
        </div>
      )}

      {phase === 'study' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F97316]">
              Memorize {studyWords.length} Words
            </span>
            <span className="font-mono text-sm font-bold text-[#F97316] tabular-nums">
              {studySecondsLeft}s remaining
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {studyWords.map((word) => (
              <div
                key={word}
                className="px-4 py-3.5 rounded-xl border border-[#F97316]/35 bg-[#FFF0E5]/70 dark:bg-[#1B1E25] text-center font-medium text-base text-[#171717] dark:text-[#F4F4F6]"
              >
                {word}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              disabled={paused}
              onClick={() => setPhase('recall')}
              className="min-h-[44px] px-6 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] hover:border-[#F97316] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] transition-colors"
            >
              Ready for Recall
            </button>
          </div>
        </div>
      )}

      {(phase === 'recall' || phase === 'round-review') && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-6 sm:p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <p className="text-sm font-medium text-[#171717] dark:text-[#F4F4F6]">
              {phase === 'recall'
                ? `Select the ${studyWords.length} study words (${selectedWords.length} selected)`
                : `Round ${round}: ${roundStats?.hits} of ${roundStats?.totalTargets} recalled · ${roundStats?.falsePos} false picks`}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {mixedWords.map((word) => {
              const isSelected = selectedWords.includes(word);
              const isTarget = studyWords.includes(word);
              let style =
                'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] text-[#171717] dark:text-[#F4F4F6] hover:border-[#F97316]/60 active:scale-[0.97]';
              if (phase === 'recall' && isSelected) {
                style =
                  'border-[#F97316] bg-[#FFF0E5] dark:bg-[#F97316]/20 text-[#EA580C] dark:text-[#FB923C]';
              } else if (phase === 'round-review') {
                if (isTarget && isSelected) {
                  style =
                    'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300';
                } else if (!isTarget && isSelected) {
                  style = 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300';
                } else if (isTarget && !isSelected) {
                  style = 'border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-300';
                } else {
                  style = 'border-[#E5E7EB] dark:border-[#262A35] opacity-45';
                }
              }

              return (
                <button
                  key={word}
                  type="button"
                  disabled={phase === 'round-review' || paused}
                  onClick={() => toggleWord(word)}
                  aria-pressed={phase === 'recall' ? isSelected : undefined}
                  className={`min-h-[46px] px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${style}`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            {phase === 'recall' ? (
              <button
                type="button"
                onClick={handleSubmitRecall}
                disabled={selectedWords.length === 0 || paused}
                className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                Verify Selection
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                disabled={paused}
                className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {round >= MAX_ROUNDS ? 'View Results' : 'Next Round'}
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'finished' && !hideEmbeddedSummary && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="font-mono text-xs text-[#F97316] uppercase tracking-wider">
            Session Complete
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            {avgAccuracy}% Verbal Recall
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Score</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{score}</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Max Words</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {maxWordsCleared}
              </span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Accuracy</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{avgAccuracy}%</span>
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
