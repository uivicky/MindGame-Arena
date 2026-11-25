import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { label: 'Mind Games', to: '/mind-games' },
  { label: 'Memory Games', to: '/memory-games' },
  { label: 'Focus Games', to: '/focus-games' },
  { label: 'Daily Challenge', to: '/daily-challenge' },
  { label: 'Guides', to: '/articles' },
  { label: 'My Stats', to: '/progress' },
];

function BrandLogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#111318" className="dark:fill-[#1B1E25]" />
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="11"
        stroke="#F97316"
        strokeOpacity="0.65"
        strokeWidth="3"
      />
      <path
        d="M17 45V19L32 34L47 19V45"
        stroke="#F97316"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="18" r="4" fill="#EA580C" />
    </svg>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { immersivePlayActive, playerLevel } = useProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (immersivePlayActive) {
    return null;
  }

  const isNavItemActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA]/95 dark:bg-[#111318]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F97316] rounded"
        >
          <BrandLogoMark />
          <span>MindGame Arena</span>
        </Link>

        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5"
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item.to);
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 ${
                  active
                    ? 'border-[#F97316] text-[#171717] dark:text-[#F4F4F6] font-semibold'
                    : 'border-transparent text-[#666666] hover:text-[#171717] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F6]'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-md border border-[#E5E7EB] dark:border-[#262A35] bg-[#FFF0E5] dark:bg-[#F97316]/12 font-mono text-xs font-semibold text-[#EA580C] dark:text-[#FB923C] whitespace-nowrap mr-1 tabular-nums">
            LVL {playerLevel}
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] text-[#171717] dark:text-[#F4F4F6] hover:border-[#F97316]/70 focus-visible:outline-2 focus-visible:outline-[#F97316] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/session"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white whitespace-nowrap shrink-0 shadow-sm transition-colors"
          >
            Play Free Games
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] text-[#171717] dark:text-[#F4F4F6]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#111318] px-4 py-4">
          <nav aria-label="Mobile Navigation" className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center text-[#171717] dark:text-[#A1A1AA] hover:bg-[#F8F8FA] dark:hover:bg-[#1B1E25]"
            >
              Arena Home
            </Link>
            <Link
              to="/brain-games"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center text-[#171717] dark:text-[#A1A1AA] hover:bg-[#F8F8FA] dark:hover:bg-[#1B1E25]"
            >
              Brain Games
            </Link>
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    active
                      ? 'bg-[#FFF0E5] dark:bg-[#F97316]/15 text-[#EA580C] dark:text-[#FB923C] font-semibold'
                      : 'text-[#171717] dark:text-[#A1A1AA] hover:bg-[#F8F8FA] dark:hover:bg-[#1B1E25]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262A35]">
            <Link
              to="/session"
              onClick={() => setMobileOpen(false)}
              className="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white transition-colors"
            >
              Play Free Games
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
