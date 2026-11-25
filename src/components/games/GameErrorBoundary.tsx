import { AlertTriangle, RotateCcw } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface GameErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface GameErrorBoundaryState {
  hasError: boolean;
}

export class GameErrorBoundary extends React.Component<
  GameErrorBoundaryProps,
  GameErrorBoundaryState
> {
  constructor(props: GameErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): GameErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-md mx-auto rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-[#F97316] mx-auto" />
          <h2 className="mt-3 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Unable to Load Game Board
          </h2>
          <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
            Something interrupted this round. Reset the board or return to the game library.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry?.();
              }}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Game
            </button>
            <Link
              to="/mind-games"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] hover:border-[#F97316] transition-colors"
            >
              All Mind Games
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
