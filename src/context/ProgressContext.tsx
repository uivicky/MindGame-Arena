import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  DailyChallengeRecord,
  DailyMissionItem,
  GameSessionResult,
  ProgressState,
  RecordedOutcome,
  SessionRecord,
} from '../types/neurofit';
import { getLocalDateKey } from '../utils/prng';
import {
  calculateLevelFromXp,
  clearProgress,
  computeStreaks,
  getDailyMissionsForDate,
  getWeeklyActivity,
  loadProgress,
  recordDailyChallengeCompletion,
  recordGameResult,
  saveProgress,
} from '../utils/storage';

interface ProgressContextValue {
  progress: ProgressState;
  todayMinutes: number;
  totalMinutes: number;
  totalSessions: number;
  focusAccuracyAverage: number | null;
  playerLevel: number;
  totalXp: number;
  xpProgress: { currentLevelXp: number; nextLevelXp: number; progressPct: number };
  todayMissions: DailyMissionItem[];
  streaks: { currentStreak: number; longestStreak: number; totalCompleted: number };
  weeklyActivity: { day: string; dateKey: string; minutes: number; sessions: number }[];
  immersivePlayActive: boolean;
  setImmersivePlayActive: (active: boolean) => void;
  recordResult: (result: GameSessionResult, mode?: SessionRecord['mode']) => RecordedOutcome;
  recordDailyChallenge: (record: DailyChallengeRecord) => void;
  incrementGuidedSessions: () => void;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [immersivePlayActive, setImmersivePlayActive] = useState(false);
  const progressRef = React.useRef<ProgressState>(progress);
  progressRef.current = progress;

  const recordResult = useCallback(
    (result: GameSessionResult, mode: SessionRecord['mode'] = 'practice'): RecordedOutcome => {
      const { nextState, outcome } = recordGameResult(progressRef.current, result, mode);
      progressRef.current = nextState;
      setProgress(nextState);
      return outcome;
    },
    []
  );

  const recordDailyChallenge = useCallback((record: DailyChallengeRecord) => {
    setProgress((prev) => recordDailyChallengeCompletion(prev, record));
  }, []);

  const incrementGuidedSessions = useCallback(() => {
    setProgress((prev) => {
      const next: ProgressState = {
        ...prev,
        guidedSessionsCompleted: prev.guidedSessionsCompleted + 1,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(clearProgress());
  }, []);

  const derived = useMemo(() => {
    const todayKey = getLocalDateKey();
    const todaySeconds = progress.sessions
      .filter((s) => s.dateKey === todayKey)
      .reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalSeconds = progress.sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const focusSessions = progress.sessions.filter((s) => s.gameId === 'focus-attention');
    const focusAccuracyAverage =
      focusSessions.length > 0
        ? Math.round(
            focusSessions.reduce((acc, s) => acc + s.accuracy, 0) / focusSessions.length
          )
        : null;

    const levelInfo = calculateLevelFromXp(progress.totalXp);
    const todaySlots = progress.dailyMissionCompletions[todayKey] ?? [];
    const todayMissions = getDailyMissionsForDate(todayKey, todaySlots);

    return {
      todayMinutes: Math.round((todaySeconds / 60) * 10) / 10,
      totalMinutes: Math.round((totalSeconds / 60) * 10) / 10,
      totalSessions: progress.sessions.length,
      focusAccuracyAverage,
      playerLevel: levelInfo.level,
      totalXp: progress.totalXp,
      xpProgress: {
        currentLevelXp: levelInfo.currentLevelXp,
        nextLevelXp: levelInfo.nextLevelXp,
        progressPct: levelInfo.progressPct,
      },
      todayMissions,
      streaks: computeStreaks(progress.dailyChallenges, progress.sessions),
      weeklyActivity: getWeeklyActivity(progress.sessions),
    };
  }, [progress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        ...derived,
        immersivePlayActive,
        setImmersivePlayActive,
        recordResult,
        recordDailyChallenge,
        incrementGuidedSessions,
        resetAllProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
