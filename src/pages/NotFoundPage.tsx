import { ArrowLeft, BookOpen, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <SeoHead
        title="404 Page Not Found — MindGame Arena"
        description="The requested page could not be found on MindGame Arena."
        noindex={true}
      />

      <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#F97316] font-semibold">
        Error 404
      </span>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
        Page Not Found
      </h1>
      <p className="mt-4 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
        The route you entered does not match any active game, guide, or page on MindGame Arena.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Link>
        <Link
          to="/mind-games"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] transition-colors"
        >
          <Gamepad2 className="w-4 h-4 text-[#F97316]" />
          Mind Games
        </Link>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] hover:border-[#F97316] text-sm font-semibold text-[#171717] dark:text-[#F4F4F6] transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#F97316]" />
          Guides
        </Link>
      </div>
    </div>
  );
}
