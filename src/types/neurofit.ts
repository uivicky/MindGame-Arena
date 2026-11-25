export type GameId =
  | 'visual-memory'
  | 'number-memory'
  | 'focus-attention'
  | 'pattern-recognition'
  | 'reaction-speed'
  | 'word-memory'
  | 'spatial-memory';

export type GameSeoSlug =
  | 'visual-memory-game'
  | 'number-memory-game'
  | 'focus-grid'
  | 'pattern-recognition-games'
  | 'reaction-time-test'
  | 'word-memory-games'
  | 'spatial-memory-games';

export type GameDifficulty = 'relaxed' | 'standard' | 'challenging';

export type CognitiveDomain = 'Memory' | 'Focus' | 'Reasoning' | 'Speed';

export interface GameFaqItem {
  question: string;
  answer: string;
}

export interface GameMeta {
  id: GameId;
  slug: GameId;
  seoSlug: GameSeoSlug;
  title: string;
  arenaTitle: string;
  domain: CognitiveDomain;
  difficulty: 'Adaptive' | 'Timed Precision' | 'Progressive Tiers' | 'Latency Trial';
  shortDescription: string;
  purpose: string;
  seoTitle: string;
  seoDescription: string;
  introParagraphs: string[];
  estimatedMinutes: number;
  metricLabel: string;
  metricUnit: string;
  higherIsBetter: boolean;
  instructions: string[];
  rules: string[];
  tips: string[];
  difficultyExplanation: string;
  faqs: GameFaqItem[];
  relatedArticles: string[];
}

export interface GameSessionResult {
  gameId: GameId;
  score: number;
  primaryMetric: number;
  accuracy: number;
  durationSeconds: number;
  difficulty?: GameDifficulty;
  levelReached?: number;
  submissionId?: string;
  details?: string;
}

export interface RecordedOutcome {
  xpEarned: number;
  isNewBest: boolean;
  previousBestLabel: string | null;
  newBestLabel: string;
  completedMissionId?: DailyMissionSlotId;
}

export interface SessionRecord {
  id: string;
  gameId: GameId;
  domain: CognitiveDomain;
  score: number;
  primaryMetric: number;
  accuracy: number;
  durationSeconds: number;
  xpEarned: number;
  timestamp: string;
  dateKey: string;
  mode: 'practice' | 'guided-session' | 'daily-challenge';
}

export type DailyMissionSlotId = 'memory' | 'focus' | 'speed';

export interface DailyMissionItem {
  slotId: DailyMissionSlotId;
  title: string;
  gameId: GameId;
  objectiveLabel: string;
  xpReward: number;
  completed: boolean;
}

export interface DailyChallengeRecord {
  dateKey: string;
  score: number;
  accuracy: number;
  durationSeconds: number;
  completedAt: string;
  missionsCompleted?: DailyMissionSlotId[];
  gameBreakdown: {
    gameId: GameId;
    score: number;
    accuracy: number;
  }[];
}

export interface PersonalBestMap {
  'visual-memory'?: { highestLevel: number; bestScore: number; bestAccuracy: number };
  'number-memory'?: { longestDigits: number; bestScore: number; bestAccuracy: number };
  'focus-attention'?: { bestScore: number; bestAccuracy: number };
  'pattern-recognition'?: { bestScore: number; bestAccuracy: number };
  'reaction-speed'?: { fastestAverageMs: number; fastestSingleMs: number };
  'word-memory'?: { bestScore: number; bestAccuracy: number; maxWords: number };
  'spatial-memory'?: { highestLevel: number; bestScore: number; bestAccuracy: number };
}

export interface ProgressState {
  sessions: SessionRecord[];
  dailyChallenges: Record<string, DailyChallengeRecord>;
  dailyMissionCompletions: Record<string, DailyMissionSlotId[]>;
  personalBests: PersonalBestMap;
  guidedSessionsCompleted: number;
  totalXp: number;
  awardedSubmissionIds: string[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ArticleCitation {
  label: string;
  url: string;
}

export type EditorialStatus = 'approved' | 'draft' | 'needs-review';

export interface Article {
  slug: string;
  title: string;
  category: 'Memory' | 'Focus' | 'Brain Training';
  editorialStatus: EditorialStatus;
  readTimeMinutes: number;
  publishedDate: string;
  lastEditedDate?: string;
  reviewedBy?: string;
  editorialNote?: string;
  metaDescription: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: GameFaqItem[];
  citations?: ArticleCitation[];
  relatedExercises: GameId[];
}
