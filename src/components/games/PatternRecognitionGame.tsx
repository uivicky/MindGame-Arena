import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  PATTERN_QUESTIONS,
  type PatternQuestion,
  type VisualSequenceGlyph,
} from '../../data/questionBank';
import type { GameSessionResult } from '../../types/neurofit';
import { createSeededRng, shuffleWithRng } from '../../utils/prng';
import type { GameComponentProps } from './GameProps';

type Phase = 'idle' | 'question' | 'review' | 'finished';

function GlyphRenderer({ glyph }: { glyph: VisualSequenceGlyph }) {
  const halfFillId = useId();
  const countArr = Array.from({ length: glyph.count }, (_, i) => i);

  const renderShape = (idx: number) => {
    const strokeColor = 'currentColor';
    const fillColor =
      glyph.fill === 'solid'
        ? 'currentColor'
        : glyph.fill === 'half'
        ? `url(#${halfFillId})`
        : 'none';

    return (
      <svg
        key={idx}
        viewBox="0 0 24 24"
        className="w-5 h-5"
        style={{ transform: `rotate(${glyph.rotation}deg)` }}
        aria-hidden="true"
      >
        {glyph.fill === 'half' && (
          <defs>
            <linearGradient id={halfFillId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        )}
        {glyph.shape === 'circle' && (
          <circle cx="12" cy="12" r="8" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
        )}
        {glyph.shape === 'square' && (
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke={strokeColor}
            strokeWidth="2"
            fill={fillColor}
          />
        )}
        {glyph.shape === 'triangle' && (
          <polygon
            points="12,3 21,20 3,20"
            stroke={strokeColor}
            strokeWidth="2"
            fill={fillColor}
          />
        )}
        {glyph.shape === 'diamond' && (
          <polygon
            points="12,2 22,12 12,22 2,12"
            stroke={strokeColor}
            strokeWidth="2"
            fill={fillColor}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1 max-w-[54px]">
      {countArr.map(renderShape)}
    </div>
  );
}

export function PatternRecognitionGame({
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
  const TOTAL_QUESTIONS = mode === 'practice' ? 9 : 6;

  const [phase, setPhase] = useState<Phase>('idle');
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const elapsedRef = useRef<number>(0);
  const runIdRef = useRef<string>('');
  const recordedRef = useRef(false);

  useEffect(() => {
    onPlayStateChange?.(phase === 'question' || phase === 'review');
  }, [phase, onPlayStateChange]);

  useEffect(() => {
    if ((phase !== 'question' && phase !== 'review') || paused) return;
    const id = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  const currentQuestion = questions[index];

  useEffect(() => {
    const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(elapsedSeconds % 60).padStart(2, '0');
    onHudUpdate?.({
      levelLabel: currentQuestion
        ? `${currentQuestion.tier} · ${index + 1}/${questions.length}`
        : 'Pattern Set',
      score,
      timerLabel: `${mins}:${secs}`,
    });
  }, [currentQuestion, index, questions.length, score, elapsedSeconds, onHudUpdate]);

  const buildDeck = useCallback((): PatternQuestion[] => {
    const rng = seed !== undefined ? createSeededRng(seed + 404) : Math.random;
    const foundation = shuffleWithRng(
      PATTERN_QUESTIONS.filter((q) => q.tier === 'Foundation'),
      rng
    );
    const intermediate = shuffleWithRng(
      PATTERN_QUESTIONS.filter((q) => q.tier === 'Intermediate'),
      rng
    );
    const advanced = shuffleWithRng(
      PATTERN_QUESTIONS.filter((q) => q.tier === 'Advanced'),
      rng
    );

    if (mode !== 'practice') {
      return [...foundation.slice(0, 2), ...intermediate.slice(0, 2), ...advanced.slice(0, 2)];
    }

    if (difficulty === 'relaxed') {
      return [...foundation.slice(0, 5), ...intermediate.slice(0, 3), ...advanced.slice(0, 1)];
    }
    if (difficulty === 'challenging') {
      return [...foundation.slice(0, 1), ...intermediate.slice(0, 4), ...advanced.slice(0, 4)];
    }

    return [...foundation.slice(0, 3), ...intermediate.slice(0, 3), ...advanced.slice(0, 3)];
  }, [difficulty, mode, seed]);

  const handleStart = useCallback(() => {
    recordedRef.current = false;
    runIdRef.current = `pr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setQuestions(buildDeck());
    setIndex(0);
    setSelectedId(null);
    setCorrectCount(0);
    setScore(0);
    setPhase('question');
  }, [buildDeck]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart, restartNonce, handleStart]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (phase !== 'question' || !currentQuestion || paused) return;
      setSelectedId(optionId);
      const isCorrect = optionId === currentQuestion.correctOptionId;
      if (isCorrect) {
        const tierPoints =
          currentQuestion.tier === 'Advanced'
            ? 160
            : currentQuestion.tier === 'Intermediate'
            ? 120
            : 90;
        setCorrectCount((c) => c + 1);
        setScore((s) => s + tierPoints);
      }
      setPhase('review');
    },
    [currentQuestion, paused, phase]
  );

  const handleNext = useCallback(() => {
    if (paused || phase !== 'review') return;
    if (index + 1 >= questions.length) {
      setPhase('finished');
      if (!recordedRef.current) {
        recordedRef.current = true;
        const accuracy =
          questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        const durationSeconds = Math.max(5, elapsedRef.current);
        const result: GameSessionResult = {
          gameId: 'pattern-recognition',
          score,
          primaryMetric: score,
          levelReached: correctCount,
          accuracy,
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
      setIndex((i) => i + 1);
      setSelectedId(null);
      setPhase('question');
    }
  }, [
    correctCount,
    difficulty,
    hideEmbeddedSummary,
    index,
    mode,
    onComplete,
    paused,
    phase,
    questions.length,
    recordResult,
    score,
  ]);

  useEffect(() => {
    if (paused) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === 'question' && currentQuestion) {
        const num = Number(e.key);
        if (num >= 1 && num <= currentQuestion.options.length) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[num - 1].id);
        }
      } else if (phase === 'review' && (e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentQuestion, handleNext, handleSelectOption, paused, phase]);

  const accuracyPct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {phase === 'idle' && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-md mx-auto">
            Solve {TOTAL_QUESTIONS} numerical and geometric sequences. Use keys 1–4 or tap an option
            to answer.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 min-h-[46px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            Start Pattern Master
          </button>
        </div>
      )}

      {(phase === 'question' || phase === 'review') && currentQuestion && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-[#666666] dark:text-[#A1A1AA] mb-4">
            <span className="text-[#F97316] uppercase tracking-wider">
              {currentQuestion.tier} Tier
            </span>
            <span>
              Puzzle {index + 1} of {questions.length}
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-[#171717] dark:text-[#F4F4F6] mb-6">
            {currentQuestion.prompt}
          </p>

          {currentQuestion.sequenceText && (
            <div className="flex flex-wrap items-center justify-center gap-3 p-5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] mb-6">
              {currentQuestion.sequenceText.map((item, idx) => (
                <div
                  key={idx}
                  className={`min-w-[56px] h-14 px-3 rounded-xl border flex items-center justify-center font-mono text-xl font-bold tabular-nums ${
                    item === '?'
                      ? 'border-[#F97316] text-[#EA580C] dark:text-[#FB923C] bg-[#FFF0E5] dark:bg-[#F97316]/15'
                      : 'border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] text-[#171717] dark:text-[#F4F4F6]'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {currentQuestion.visualSequence && (
            <div className="flex flex-wrap items-center justify-center gap-3 p-5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] mb-6">
              {currentQuestion.visualSequence.map((g, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] text-[#171717] dark:text-[#F4F4F6] flex items-center justify-center"
                >
                  <GlyphRenderer glyph={g} />
                </div>
              ))}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#F97316] bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#EA580C] dark:text-[#FB923C] font-mono text-2xl font-bold flex items-center justify-center">
                ?
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedId === opt.id;
              const isCorrectOption = opt.id === currentQuestion.correctOptionId;
              let stateStyle =
                'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] text-[#171717] dark:text-[#F4F4F6] hover:border-[#F97316] active:scale-[0.97]';
              if (phase === 'review') {
                if (isCorrectOption) {
                  stateStyle =
                    'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300';
                } else if (isSelected && !isCorrectOption) {
                  stateStyle = 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300';
                } else {
                  stateStyle = 'border-[#E5E7EB] dark:border-[#262A35] opacity-45';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={phase === 'review' || paused}
                  onClick={() => handleSelectOption(opt.id)}
                  aria-label={`Option ${optIdx + 1}${opt.label ? `: ${opt.label}` : ''}`}
                  className={`relative min-h-[70px] p-3 rounded-xl border flex items-center justify-center font-mono text-lg font-bold transition-all ${stateStyle}`}
                >
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono opacity-45">
                    {optIdx + 1}
                  </span>
                  {opt.glyph ? <GlyphRenderer glyph={opt.glyph} /> : opt.label}
                </button>
              );
            })}
          </div>

          {phase === 'review' && (
            <div className="mt-6 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#1B1E25] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {selectedId === currentQuestion.correctOptionId ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct Rule Identified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" />
                      Incorrect Choice
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
              >
                {index + 1 >= questions.length ? 'Finish Set' : 'Next Puzzle'}
                <ArrowRight className="w-4 h-4" />
              </button>
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
            {correctCount} of {questions.length} Solved
          </h3>
          <div className="mt-5 grid grid-cols-3 gap-3 text-left max-w-md mx-auto">
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Score</span>
              <span className="font-mono text-lg font-semibold tabular-nums">{score}</span>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] p-3">
              <span className="text-xs text-[#666666] dark:text-[#A1A1AA] block">Solved</span>
              <span className="font-mono text-lg font-semibold tabular-nums">
                {correctCount}/{questions.length}
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
              New Question Set
            </button>
          )}
        </div>
      )}
    </div>
  );
}
