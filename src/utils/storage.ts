import { GAMES_BY_ID } from '../data/games';
import type {
  DailyChallengeRecord,
  DailyMissionItem,
  DailyMissionSlotId,
  GameId,
  GameSessionResult,
  ProgressState,
  RecordedOutcome,
  SessionRecord,
} from '../types/neurofit';
import { createSeededRng, getLocalDateKey, hashStringToSeed } from './prng';

const STORAGE_KEY = 'mindgame_arena_progress_v1';
const LEGACY_STORAGE_KEY = 'neurofit_progress_v1';
const THEME_KEY = 'mindgame_arena_theme';
const LEGACY_THEME_KEY = 'neurofit_theme';

export const EMPTY_PROGRESS: ProgressState = {
  sessions: [],
  dailyChallenges: {},
  dailyMissionCompletions: {},
  personalBests: {},
  guidedSessionsCompleted: 0,
  totalXp: 0,
  awardedSubmissionIds: [],
};

export function getDailyMissionsForDate(
  dateKey: string,
  completedSlots: DailyMissionSlotId[] = []
): DailyMissionItem[] {
  const seed = hashStringToSeed(`mindgame-arena-missions-${dateKey}`);
  const rng = createSeededRng(seed);
  const memoryPool: GameId[] = ['visual-memory', 'number-memory', 'word-memory', 'spatial-memory'];
  const speedPool: GameId[] = ['reaction-speed', 'pattern-recognition'];

  const memoryGame = memoryPool[Math.floor(rng() * memoryPool.length)];
  const speedGame = speedPool[Math.floor(rng() * speedPool.length)];

  return [
    {
      slotId: 'memory',
      title: 'Memory Mission',
      gameId: memoryGame,
      objectiveLabel: `Complete ${GAMES_BY_ID[memoryGame].arenaTitle} with >= 50% accuracy`,
      xpReward: 120,
      completed: completedSlots.includes('memory'),
    },
    {
      slotId: 'focus',
      title: 'Focus Mission',
      gameId: 'focus-attention',
      objectiveLabel: 'Complete FOCUS GRID with >= 50% hit precision',
      xpReward: 120,
      completed: completedSlots.includes('focus'),
    },
    {
      slotId: 'speed',
      title: 'Speed & Logic Mission',
      gameId: speedGame,
      objectiveLabel:
        speedGame === 'reaction-speed'
          ? 'Complete 5 valid trials in REACTION SPEED'
          : 'Complete a puzzle circuit in PATTERN MASTER',
      xpReward: 140,
      completed: completedSlots.includes('speed'),
    },
  ];
}

export function calculateLevelFromXp(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPct: number;
} {
  const safeXp = Math.max(0, Math.floor(totalXp));
  const level = Math.floor(Math.sqrt(safeXp / 140)) + 1;
  const currentLevelFloor = Math.pow(level - 1, 2) * 140;
  const nextLevelFloor = Math.pow(level, 2) * 140;
  const span = Math.max(1, nextLevelFloor - currentLevelFloor);
  const currentLevelXp = safeXp - currentLevelFloor;
  const nextLevelXp = nextLevelFloor - currentLevelFloor;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentLevelXp / span) * 100)));

  return { level, currentLevelXp, nextLevelXp, progressPct };
}

export function computeSessionXp(result: GameSessionResult): number {
  const validDuration = result.durationSeconds >= 5;
  if (!validDuration) return 0;

  if (result.gameId === 'reaction-speed') {
    if (result.primaryMetric <= 0) return 0;
    const speedBonus = result.primaryMetric < 280 ? 35 : result.primaryMetric < 360 ? 20 : 10;
    return 45 + speedBonus;
  }

  if (result.score <= 0 && result.accuracy < 20) return 15;
  const baseXp = 35;
  const accuracyBonus = Math.round((Math.min(100, Math.max(0, result.accuracy)) / 100) * 40);
  const performanceBonus = Math.min(55, Math.round(result.score / 35));
  return baseXp + accuracyBonus + performanceBonus;
}

export function loadProgress(): ProgressState {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    const fallbackXp = sessions.reduce(
      (sum, s) => sum + (typeof s.xpEarned === 'number' ? s.xpEarned : 45),
      0
    );
    const hydrated: ProgressState = {
      sessions,
      dailyChallenges:
        parsed.dailyChallenges && typeof parsed.dailyChallenges === 'object'
          ? parsed.dailyChallenges
          : {},
      dailyMissionCompletions:
        parsed.dailyMissionCompletions && typeof parsed.dailyMissionCompletions === 'object'
          ? parsed.dailyMissionCompletions
          : {},
      personalBests:
        parsed.personalBests && typeof parsed.personalBests === 'object'
          ? parsed.personalBests
          : {},
      guidedSessionsCompleted:
        typeof parsed.guidedSessionsCompleted === 'number'
          ? parsed.guidedSessionsCompleted
          : 0,
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : fallbackXp,
      awardedSubmissionIds: Array.isArray(parsed.awardedSubmissionIds)
        ? parsed.awardedSubmissionIds
        : [],
    };
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    }
    return hydrated;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearProgress(): ProgressState {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return EMPTY_PROGRESS;
}

function getPersonalBestSummary(
  bests: ProgressState['personalBests'],
  gameId: GameId
): string | null {
  switch (gameId) {
    case 'visual-memory':
      return bests['visual-memory']
        ? `Level ${bests['visual-memory'].highestLevel} (${bests['visual-memory'].bestScore} pts)`
        : null;
    case 'number-memory':
      return bests['number-memory']
        ? `${bests['number-memory'].longestDigits} digits (${bests['number-memory'].bestScore} pts)`
        : null;
    case 'focus-attention':
      return bests['focus-attention']
        ? `${bests['focus-attention'].bestScore} pts (${bests['focus-attention'].bestAccuracy}%)`
        : null;
    case 'pattern-recognition':
      return bests['pattern-recognition']
        ? `${bests['pattern-recognition'].bestScore} pts (${bests['pattern-recognition'].bestAccuracy}%)`
        : null;
    case 'reaction-speed':
      return bests['reaction-speed'] ? `${bests['reaction-speed'].fastestAverageMs} ms` : null;
    case 'word-memory':
      return bests['word-memory']
        ? `${bests['word-memory'].bestScore} pts (${bests['word-memory'].bestAccuracy}%)`
        : null;
    case 'spatial-memory':
      return bests['spatial-memory']
        ? `Level ${bests['spatial-memory'].highestLevel} (${bests['spatial-memory'].bestScore} pts)`
        : null;
  }
}

export function recordGameResult(
  prev: ProgressState,
  result: GameSessionResult,
  mode: SessionRecord['mode'] = 'practice'
): { nextState: ProgressState; outcome: RecordedOutcome } {
  const submissionId =
    result.submissionId || `${result.gameId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (prev.awardedSubmissionIds.includes(submissionId)) {
    return {
      nextState: prev,
      outcome: {
        xpEarned: 0,
        isNewBest: false,
        previousBestLabel: getPersonalBestSummary(prev.personalBests, result.gameId),
        newBestLabel: getPersonalBestSummary(prev.personalBests, result.gameId) || 'Recorded',
      },
    };
  }

  const game = GAMES_BY_ID[result.gameId];
  const now = new Date();
  const dateKey = getLocalDateKey(now);
  const previousBestLabel = getPersonalBestSummary(prev.personalBests, result.gameId);

  let earnedXp = computeSessionXp(result);
  let isNewBest = false;
  const bests = { ...prev.personalBests };

  const roundedScore = Math.round(result.score);
  const roundedMetric = Math.round(result.primaryMetric);
  const roundedAcc = Math.round(result.accuracy);

  switch (result.gameId) {
    case 'visual-memory': {
      const cur = bests['visual-memory'];
      if (!cur || roundedScore > cur.bestScore || roundedMetric > cur.highestLevel) {
        isNewBest = true;
      }
      bests['visual-memory'] = {
        highestLevel: Math.max(cur?.highestLevel ?? 0, roundedMetric),
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
      };
      break;
    }
    case 'number-memory': {
      const cur = bests['number-memory'];
      if (!cur || roundedMetric > cur.longestDigits || roundedScore > cur.bestScore) {
        isNewBest = true;
      }
      bests['number-memory'] = {
        longestDigits: Math.max(cur?.longestDigits ?? 0, roundedMetric),
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
      };
      break;
    }
    case 'focus-attention': {
      const cur = bests['focus-attention'];
      if (!cur || roundedScore > cur.bestScore) {
        isNewBest = true;
      }
      bests['focus-attention'] = {
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
      };
      break;
    }
    case 'pattern-recognition': {
      const cur = bests['pattern-recognition'];
      if (!cur || roundedScore > cur.bestScore) {
        isNewBest = true;
      }
      bests['pattern-recognition'] = {
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
      };
      break;
    }
    case 'reaction-speed': {
      const cur = bests['reaction-speed'];
      const avgMs = roundedMetric > 0 ? roundedMetric : 9999;
      const singleMs = roundedScore > 0 ? roundedScore : avgMs;
      if (!cur || avgMs < cur.fastestAverageMs) {
        isNewBest = true;
      }
      bests['reaction-speed'] = {
        fastestAverageMs:
          cur?.fastestAverageMs && cur.fastestAverageMs > 0
            ? Math.min(cur.fastestAverageMs, avgMs)
            : avgMs,
        fastestSingleMs:
          cur?.fastestSingleMs && cur.fastestSingleMs > 0
            ? Math.min(cur.fastestSingleMs, singleMs)
            : singleMs,
      };
      break;
    }
    case 'word-memory': {
      const cur = bests['word-memory'];
      if (!cur || roundedScore > cur.bestScore) {
        isNewBest = true;
      }
      bests['word-memory'] = {
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
        maxWords: Math.max(cur?.maxWords ?? 0, roundedMetric),
      };
      break;
    }
    case 'spatial-memory': {
      const cur = bests['spatial-memory'];
      if (!cur || roundedScore > cur.bestScore || roundedMetric > cur.highestLevel) {
        isNewBest = true;
      }
      bests['spatial-memory'] = {
        highestLevel: Math.max(cur?.highestLevel ?? 0, roundedMetric),
        bestScore: Math.max(cur?.bestScore ?? 0, roundedScore),
        bestAccuracy: Math.max(cur?.bestAccuracy ?? 0, roundedAcc),
      };
      break;
    }
  }

  // Check if today's Daily Mission qualifies
  const existingTodaySlots = prev.dailyMissionCompletions[dateKey] ?? [];
  const missions = getDailyMissionsForDate(dateKey, existingTodaySlots);
  let completedMissionId: DailyMissionSlotId | undefined;
  let updatedMissionMap = prev.dailyMissionCompletions;

  const matchingMission = missions.find((m) => m.gameId === result.gameId && !m.completed);
  if (matchingMission) {
    const qualifies =
      matchingMission.slotId === 'speed'
        ? result.gameId === 'reaction-speed'
          ? roundedMetric > 0
          : roundedAcc >= 40
        : roundedAcc >= 50;

    if (qualifies) {
      completedMissionId = matchingMission.slotId;
      earnedXp += matchingMission.xpReward;
      const nextSlots = [...existingTodaySlots, matchingMission.slotId];
      updatedMissionMap = {
        ...prev.dailyMissionCompletions,
        [dateKey]: nextSlots,
      };
    }
  }

  // Record Daily Challenge streak entry once all 3 missions complete or via daily challenge mode
  let updatedDailyChallenges = prev.dailyChallenges;
  const todaySlotsAfter = updatedMissionMap[dateKey] ?? [];
  if (todaySlotsAfter.length >= 3 && !prev.dailyChallenges[dateKey]) {
    updatedDailyChallenges = {
      ...prev.dailyChallenges,
      [dateKey]: {
        dateKey,
        score: roundedScore,
        accuracy: roundedAcc,
        durationSeconds: Math.max(5, Math.round(result.durationSeconds)),
        completedAt: now.toISOString(),
        missionsCompleted: todaySlotsAfter,
        gameBreakdown: [{ gameId: result.gameId, score: roundedScore, accuracy: roundedAcc }],
      },
    };
  }

  const entry: SessionRecord = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    gameId: result.gameId,
    domain: game.domain,
    score: roundedScore,
    primaryMetric: roundedMetric,
    accuracy: roundedAcc,
    durationSeconds: Math.max(5, Math.round(result.durationSeconds)),
    xpEarned: earnedXp,
    timestamp: now.toISOString(),
    dateKey,
    mode,
  };

  const nextState: ProgressState = {
    ...prev,
    sessions: [entry, ...prev.sessions].slice(0, 250),
    personalBests: bests,
    dailyMissionCompletions: updatedMissionMap,
    dailyChallenges: updatedDailyChallenges,
    totalXp: prev.totalXp + earnedXp,
    awardedSubmissionIds: [submissionId, ...prev.awardedSubmissionIds].slice(0, 200),
  };

  saveProgress(nextState);

  return {
    nextState,
    outcome: {
      xpEarned: earnedXp,
      isNewBest,
      previousBestLabel,
      newBestLabel: getPersonalBestSummary(bests, result.gameId) || `${roundedScore} pts`,
      completedMissionId,
    },
  };
}

export function recordDailyChallengeCompletion(
  prev: ProgressState,
  record: DailyChallengeRecord
): ProgressState {
  const next: ProgressState = {
    ...prev,
    dailyChallenges: {
      ...prev.dailyChallenges,
      [record.dateKey]: record,
    },
  };
  saveProgress(next);
  return next;
}

export function computeStreaks(
  dailyChallenges: Record<string, DailyChallengeRecord>,
  sessions: SessionRecord[] = []
): {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
} {
  const dateSet = new Set<string>([
    ...Object.keys(dailyChallenges),
    ...sessions.map((s) => s.dateKey),
  ]);
  const keys = Array.from(dateSet).sort();
  if (keys.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompleted: 0 };
  }

  const toDayNumber = (dateKey: string): number => {
    const [y, m, d] = dateKey.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  };

  const dayNums = keys.map(toDayNumber);
  let longest = 1;
  let run = 1;
  for (let i = 1; i < dayNums.length; i++) {
    if (dayNums[i] === dayNums[i - 1] + 1) {
      run++;
      if (run > longest) longest = run;
    } else if (dayNums[i] !== dayNums[i - 1]) {
      run = 1;
    }
  }

  const todayNum = toDayNumber(getLocalDateKey());
  const set = new Set(dayNums);
  let current = 0;
  let cursor = set.has(todayNum) ? todayNum : set.has(todayNum - 1) ? todayNum - 1 : -1;
  while (cursor !== -1 && set.has(cursor)) {
    current++;
    cursor--;
  }

  return {
    currentStreak: current,
    longestStreak: longest,
    totalCompleted: Object.keys(dailyChallenges).length,
  };
}

export function getWeeklyActivity(sessions: SessionRecord[]): {
  day: string;
  dateKey: string;
  minutes: number;
  sessions: number;
}[] {
  const result: { day: string; dateKey: string; minutes: number; sessions: number }[] = [];
  const today = new Date();
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = getLocalDateKey(d);
    const daySessions = sessions.filter((s) => s.dateKey === key);
    const totalSeconds = daySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    result.push({
      day: labels[d.getDay()],
      dateKey: key,
      minutes: Math.round((totalSeconds / 60) * 10) / 10,
      sessions: daySessions.length,
    });
  }
  return result;
}

export function getSavedTheme(): 'light' | 'dark' {
  try {
    const saved =
      localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_THEME_KEY);
    return saved === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function persistTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage error
  }
}
