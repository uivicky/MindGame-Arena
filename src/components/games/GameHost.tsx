import type { GameId } from '../../types/neurofit';
import { FocusAttentionGame } from './FocusAttentionGame';
import type { GameComponentProps } from './GameProps';
import { NumberMemoryGame } from './NumberMemoryGame';
import { PatternRecognitionGame } from './PatternRecognitionGame';
import { ReactionSpeedGame } from './ReactionSpeedGame';
import { SpatialMemoryGame } from './SpatialMemoryGame';
import { VisualMemoryGame } from './VisualMemoryGame';
import { WordMemoryGame } from './WordMemoryGame';

interface GameHostProps extends GameComponentProps {
  gameId: GameId;
}

export function GameHost({ gameId, ...props }: GameHostProps) {
  switch (gameId) {
    case 'visual-memory':
      return <VisualMemoryGame {...props} />;
    case 'number-memory':
      return <NumberMemoryGame {...props} />;
    case 'focus-attention':
      return <FocusAttentionGame {...props} />;
    case 'pattern-recognition':
      return <PatternRecognitionGame {...props} />;
    case 'reaction-speed':
      return <ReactionSpeedGame {...props} />;
    case 'word-memory':
      return <WordMemoryGame {...props} />;
    case 'spatial-memory':
      return <SpatialMemoryGame {...props} />;
  }
}
