import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

export function Footer() {
  const { immersivePlayActive } = useProgress();

  if (immersivePlayActive) {
    return null;
  }

  return (
    <footer className="border-t border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#0C0E12] mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]"
            >
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm bg-[#F97316]" />
              MindGame Arena
            </Link>
            <p className="mt-3 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xs">
              Play Free. Think Smarter. Play free mind games, memory games, brain puzzles, focus
              challenges and reaction tests online.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Mind Games &amp; Arenas
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
              <li>
                <Link to="/mind-games" className="hover:text-[#F97316] transition-colors">
                  All Mind Games
                </Link>
              </li>
              <li>
                <Link to="/brain-games" className="hover:text-[#F97316] transition-colors">
                  Brain Training Games
                </Link>
              </li>
              <li>
                <Link to="/memory-games" className="hover:text-[#F97316] transition-colors">
                  Memory Games
                </Link>
              </li>
              <li>
                <Link to="/focus-games" className="hover:text-[#F97316] transition-colors">
                  Focus Games
                </Link>
              </li>
              <li>
                <Link to="/visual-memory-game" className="hover:text-[#F97316] transition-colors">
                  Visual Memory Game
                </Link>
              </li>
              <li>
                <Link to="/number-memory-game" className="hover:text-[#F97316] transition-colors">
                  Number Memory Game
                </Link>
              </li>
              <li>
                <Link to="/reaction-time-test" className="hover:text-[#F97316] transition-colors">
                  Reaction Time Test
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Guides &amp; Challenges
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
              <li>
                <Link to="/daily-challenge" className="hover:text-[#F97316] transition-colors">
                  Daily Brain Challenge
                </Link>
              </li>
              <li>
                <Link to="/session" className="hover:text-[#F97316] transition-colors">
                  Guided Training Circuit
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-[#F97316] transition-colors">
                  Player Profile &amp; Stats
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-[#F97316] transition-colors">
                  Educational Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/articles/best-free-mind-games-online"
                  className="hover:text-[#F97316] transition-colors"
                >
                  Best Free Mind Games Online
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F97316] transition-colors">
                  About MindGame Arena
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F97316] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#171717] dark:text-[#F4F4F6]">
              Legal &amp; Privacy
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F97316] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#F97316] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-[#F97316] transition-colors">
                  Practice Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#F97316] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5E7EB] dark:border-[#262A35] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#666666] dark:text-[#A1A1AA]">
          <p>© {new Date().getFullYear()} MindGame Arena. Virtual XP points carry no cash value.</p>
          <p>All player stats remain stored locally in browser LocalStorage.</p>
        </div>
      </div>
    </footer>
  );
}
