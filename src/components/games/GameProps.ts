import type { GameDifficulty, GameSessionResult } from '../../types/neurofit';

export interface ArenaHudSnapshot {
  levelLabel: string;
  score: number;
  timerLabel: string;
}

export interface GameComponentProps {
  onComplete?: (result: GameSessionResult) => void;
  onPlayStateChange?: (isActive: boolean) => void;
  onHudUpdate?: (hud: ArenaHudSnapshot) => void;
  seed?: number;
  mode?: 'practice' | 'guided-session' | 'daily-challenge';
  difficulty?: GameDifficulty;
  autoStart?: boolean;
  paused?: boolean;
  restartNonce?: number;
  hideEmbeddedSummary?: boolean;
}
