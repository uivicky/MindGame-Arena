import { Circle, Diamond, Square, Triangle } from 'lucide-react';
import type { GameId } from '../../types/neurofit';

export function GameBoardPreview({ gameId }: { gameId: GameId }) {
  switch (gameId) {
    case 'visual-memory': {
      const lit = new Set([1, 4, 5, 7]);
      return (
        <div className="grid grid-cols-3 gap-1.5 w-24 h-24 mx-auto">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={`rounded border transition-colors ${
                lit.has(i)
                  ? 'bg-[#F97316] border-[#EA580C] shadow-[0_0_10px_rgba(249,115,22,0.35)]'
                  : 'bg-[#F8F8FA] dark:bg-[#0C0E12] border-[#E5E7EB] dark:border-[#262A35]'
              }`}
            />
          ))}
        </div>
      );
    }

    case 'number-memory':
      return (
        <div className="flex flex-col items-center justify-center h-24 gap-2">
          <div className="px-4 py-2 rounded-lg border border-[#F97316]/40 bg-[#FFF0E5] dark:bg-[#F97316]/12 font-mono text-xl font-bold tracking-[0.22em] text-[#171717] dark:text-[#F4F4F6] tabular-nums">
            74920
          </div>
          <div className="w-28 h-1 rounded-full bg-[#E5E7EB] dark:bg-white/10 overflow-hidden">
            <div className="w-2/3 h-full bg-[#F97316]" />
          </div>
        </div>
      );

    case 'focus-attention': {
      const chars = ['O', 'Q', 'C', 'O', 'G', 'Q', 'O', 'C', 'O', 'Q', 'O', 'G'];
      return (
        <div className="grid grid-cols-4 gap-1 w-32 h-24 mx-auto">
          {chars.map((c, idx) => (
            <div
              key={idx}
              className={`rounded border flex items-center justify-center font-mono text-xs font-semibold ${
                c === 'Q'
                  ? 'bg-[#FFF0E5] dark:bg-[#F97316]/15 border-[#F97316]/60 text-[#EA580C] dark:text-[#FB923C]'
                  : 'bg-[#F8F8FA] dark:bg-[#0C0E12] border-[#E5E7EB] dark:border-[#262A35] text-[#666666] dark:text-[#A1A1AA]'
              }`}
            >
              {c}
            </div>
          ))}
        </div>
      );
    }

    case 'pattern-recognition':
      return (
        <div className="flex items-center justify-center gap-1.5 h-24">
          {['3', '7', '15', '31', '?'].map((n, i) => (
            <div
              key={i}
              className={`w-8 h-9 rounded border flex items-center justify-center font-mono text-xs font-bold tabular-nums ${
                n === '?'
                  ? 'border-[#F97316] bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#EA580C] dark:text-[#FB923C]'
                  : 'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12] text-[#171717] dark:text-[#F4F4F6]'
              }`}
            >
              {n}
            </div>
          ))}
        </div>
      );

    case 'reaction-speed':
      return (
        <div className="flex flex-col items-center justify-center h-24 gap-2">
          <div className="w-36 h-12 rounded-lg border border-[#F97316]/60 bg-[#F97316] flex items-center justify-center gap-2 shadow-sm">
            <span className="font-mono text-sm font-bold text-white tabular-nums">
              214 ms
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#666666] dark:text-[#A1A1AA]">
            5-Trial Reflex Signal
          </span>
        </div>
      );

    case 'word-memory':
      return (
        <div className="grid grid-cols-2 gap-1.5 w-36 h-24 mx-auto content-center">
          {['PRISM', 'VECTOR', 'ORBIT', 'CIPHER'].map((word, idx) => (
            <div
              key={word}
              className={`px-2 py-1.5 rounded border text-center font-mono text-[10px] font-semibold tracking-wider ${
                idx < 2
                  ? 'border-[#F97316]/50 bg-[#FFF0E5] dark:bg-[#F97316]/12 text-[#EA580C] dark:text-[#FB923C]'
                  : 'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12] text-[#666666] dark:text-[#A1A1AA]'
              }`}
            >
              {word}
            </div>
          ))}
        </div>
      );

    case 'spatial-memory': {
      const icons = new Map<number, typeof Circle>([
        [0, Circle],
        [5, Triangle],
        [10, Square],
        [13, Diamond],
      ]);
      return (
        <div className="grid grid-cols-4 gap-1 w-24 h-24 mx-auto">
          {Array.from({ length: 16 }, (_, idx) => {
            const Icon = icons.get(idx);
            return (
              <div
                key={idx}
                className={`rounded border flex items-center justify-center ${
                  Icon
                    ? 'border-[#F97316]/60 bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#EA580C] dark:text-[#FB923C]'
                    : 'border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#0C0E12]'
                }`}
              >
                {Icon && <Icon className="w-2.5 h-2.5" />}
              </div>
            );
          })}
        </div>
      );
    }
  }
}
