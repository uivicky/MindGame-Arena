import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { findGameByAnySlug } from './data/games';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CategoryHubPage = lazy(() =>
  import('./pages/CategoryHubPage').then((m) => ({ default: m.CategoryHubPage }))
);
const TrainingPage = lazy(() =>
  import('./pages/TrainingPage').then((m) => ({ default: m.TrainingPage }))
);
const IndividualGamePage = lazy(() =>
  import('./pages/IndividualGamePage').then((m) => ({ default: m.IndividualGamePage }))
);
const GuidedSessionPage = lazy(() =>
  import('./pages/GuidedSessionPage').then((m) => ({ default: m.GuidedSessionPage }))
);
const DailyChallengePage = lazy(() =>
  import('./pages/DailyChallengePage').then((m) => ({ default: m.DailyChallengePage }))
);
const ProgressPage = lazy(() =>
  import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage }))
);
const ArticlesPage = lazy(() =>
  import('./pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
);
const ArticleDetailPage = lazy(() =>
  import('./pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage }))
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.TermsPage }))
);
const DisclaimerPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.DisclaimerPage }))
);
const CookiePolicyPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.CookiePolicyPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function LegacyGameRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const { search } = useLocation();
  const game = findGameByAnySlug(slug);
  if (game) {
    return <Navigate to={`/${game.seoSlug}${search}`} replace />;
  }
  return <Navigate to="/mind-games" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="h-8 w-56 rounded bg-[#E5E7EB] dark:bg-[#1B1E25] animate-pulse" />
      <div className="mt-4 h-4 w-96 max-w-full rounded bg-[#E5E7EB] dark:bg-[#1B1E25] animate-pulse" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#F8F8FA] text-[#171717] dark:bg-[#111318] dark:text-[#F4F4F6] transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  {/* Phase 5 SEO Category Hubs */}
                  <Route path="/brain-games" element={<CategoryHubPage hubSlug="brain-games" />} />
                  <Route path="/mind-games" element={<CategoryHubPage hubSlug="mind-games" />} />
                  <Route
                    path="/memory-games"
                    element={<CategoryHubPage hubSlug="memory-games" />}
                  />
                  <Route path="/focus-games" element={<CategoryHubPage hubSlug="focus-games" />} />

                  {/* Phase 5 Canonical Individual Game Landing Pages */}
                  <Route
                    path="/visual-memory-game"
                    element={<IndividualGamePage fixedSlug="visual-memory-game" />}
                  />
                  <Route
                    path="/number-memory-game"
                    element={<IndividualGamePage fixedSlug="number-memory-game" />}
                  />
                  <Route
                    path="/focus-grid"
                    element={<IndividualGamePage fixedSlug="focus-grid" />}
                  />
                  <Route
                    path="/pattern-recognition-games"
                    element={<IndividualGamePage fixedSlug="pattern-recognition-games" />}
                  />
                  <Route
                    path="/reaction-time-test"
                    element={<IndividualGamePage fixedSlug="reaction-time-test" />}
                  />
                  <Route
                    path="/word-memory-games"
                    element={<IndividualGamePage fixedSlug="word-memory-games" />}
                  />
                  <Route
                    path="/spatial-memory-games"
                    element={<IndividualGamePage fixedSlug="spatial-memory-games" />}
                  />

                  {/* Legacy Redirects so zero old links ever 404 */}
                  <Route path="/games/:slug" element={<LegacyGameRedirect />} />
                  <Route path="/exercises/:slug" element={<LegacyGameRedirect />} />

                  {/* Arena Flows & Editorial Content */}
                  <Route path="/training" element={<TrainingPage />} />
                  <Route path="/session" element={<GuidedSessionPage />} />
                  <Route path="/daily-challenge" element={<DailyChallengePage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/articles/:slug" element={<ArticleDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
}
