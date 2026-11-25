import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import { APPROVED_ARTICLES } from '../data/articles';
import type { Article } from '../types/neurofit';

type CategoryFilter = 'All' | Article['category'];
const CATEGORIES: CategoryFilter[] = ['All', 'Memory', 'Focus', 'Brain Training'];

export function ArticlesPage() {
  const [category, setCategory] = useState<CategoryFilter>('All');

  const visibleArticles =
    category === 'All'
      ? APPROVED_ARTICLES
      : APPROVED_ARTICLES.filter((a) => a.category === category);

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'Articles' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Educational Brain Training & Memory Guides — MindGame Arena"
        description={`Read ${APPROVED_ARTICLES.length} original, evidence-informed guides on free mind games, working memory practice, concentration exercises, pattern recognition, and reaction timing.`}
        canonicalPath="/articles"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F97316] font-semibold">
          Educational Resource Center · {APPROVED_ARTICLES.length} Guides
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
          Brain Training &amp; Cognitive Practice Guides
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
          Practical, plain-language resources explaining memory encoding, selective focus,
          distraction management, and sustainable daily cognitive routines.
        </p>

        <div
          role="tablist"
          aria-label="Filter articles by category"
          className="mt-6 inline-flex flex-wrap gap-1 p-1 rounded-xl bg-[#E5E7EB]/60 dark:bg-[#1B1E25] border border-[#E5E7EB] dark:border-[#262A35]"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={`min-h-[36px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#171717] dark:hover:text-[#F4F4F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="group rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 hover:border-[#F97316] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs text-[#666666] dark:text-[#A1A1AA] flex items-center gap-2">
                <span className="font-semibold text-[#EA580C] dark:text-[#FB923C]">
                  {article.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{article.readTimeMinutes} min read</span>
              </div>
              <h2 className="mt-2.5 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6] group-hover:text-[#F97316] transition-colors">
                {article.title}
              </h2>
              <p className="mt-2.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                {article.excerpt}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] dark:text-[#FB923C]">
              Read Article <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <AdSlot
          placement="content"
          format="horizontal"
          placementLabel="Educational Guides Banner"
        />
      </div>
    </div>
  );
}
