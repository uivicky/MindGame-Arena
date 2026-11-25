import { ArrowLeft, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AdSlot } from '../components/AdSlot';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';
import {
  APPROVED_ARTICLES,
  APPROVED_ARTICLES_BY_SLUG,
  LEGACY_ARTICLE_REDIRECTS,
} from '../data/articles';
import { GAMES_BY_ID } from '../data/games';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (slug && LEGACY_ARTICLE_REDIRECTS[slug]) {
    return <Navigate to={`/articles/${LEGACY_ARTICLE_REDIRECTS[slug]}`} replace />;
  }

  const article = slug ? APPROVED_ARTICLES_BY_SLUG[slug] : undefined;

  const breadcrumbItems = useMemo(
    () =>
      article
        ? [
            { label: 'Home', to: '/' },
            { label: 'Articles', to: '/articles' },
            { label: article.title },
          ]
        : [],
    [article]
  );

  const schemas = useMemo(() => {
    if (!article) return [];
    const baseUrl = getSiteBaseUrl();
    const articleUrl = `${baseUrl}/articles/${article.slug}`;
    return [
      buildBreadcrumbSchema(breadcrumbItems, baseUrl),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedDate,
        mainEntityOfPage: articleUrl,
        author: {
          '@type': 'Organization',
          name: 'MindGame Arena',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MindGame Arena',
        },
      },
    ];
  }, [article, breadcrumbItems]);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <SeoHead
          title="Article Not Found — MindGame Arena"
          description="The requested educational guide could not be found."
          noindex={true}
        />
        <h1 className="font-display text-2xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Article Not Found
        </h1>
        <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA]">
          The requested educational guide could not be found. Browse all guides in our library.
        </p>
        <Link
          to="/articles"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
        >
          Back to Articles
        </Link>
      </div>
    );
  }

  const relatedArticles = APPROVED_ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  ).slice(0, 2);

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title={`${article.title} — MindGame Arena`}
        description={article.metaDescription}
        canonicalPath={`/articles/${article.slug}`}
        ogType="article"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <Link
        to="/articles"
        className="inline-flex items-center gap-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] hover:text-[#F97316] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Articles
      </Link>

      <header className="mt-6 pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#666666] dark:text-[#A1A1AA]">
          <span className="font-semibold text-[#EA580C] dark:text-[#FB923C]">
            {article.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>{article.readTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>Published {article.publishedDate}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-balance leading-[1.15] text-[#171717] dark:text-[#F4F4F6]">
          {article.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
        <h2 className="font-display text-base font-bold text-[#171717] dark:text-[#F4F4F6]">
          Key Takeaways
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[#171717]/85 dark:text-[#F4F4F6]/85 list-disc list-inside leading-relaxed">
          {article.keyTakeaways.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-8">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                className="text-base text-[#171717]/90 dark:text-[#F4F4F6]/90 leading-[1.75]"
              >
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="space-y-2 pl-5 list-disc text-base text-[#171717]/90 dark:text-[#F4F4F6]/90 leading-[1.7]">
                {section.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            )}

            {idx === 0 && (
              <div className="pt-4">
                <AdSlot
                  placement="article"
                  format="horizontal"
                  placementLabel="In-Article Content Placement"
                />
              </div>
            )}
          </section>
        ))}
      </div>

      {article.faqs && article.faqs.length > 0 && (
        <section className="mt-10 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs uppercase tracking-wider font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions &amp; Answers</span>
          </div>
          <h2 className="mt-1.5 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 divide-y divide-[#E5E7EB] dark:divide-[#262A35]">
            {article.faqs.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-display text-base font-semibold text-[#171717] dark:text-[#F4F4F6]">
                  {faq.question}
                </h3>
                <p className="mt-1.5 text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {article.citations && article.citations.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-[#FFF0E5]/50 dark:bg-[#1B1E25] p-6">
          <h2 className="font-display text-base font-bold text-[#171717] dark:text-[#F4F4F6]">
            References &amp; Further Reading
          </h2>
          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA]">
            {article.citations.map((cite, idx) => (
              <li key={idx}>
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 hover:text-[#F97316] transition-colors"
                >
                  <span>{cite.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 pt-8 border-t border-[#E5E7EB] dark:border-[#262A35]">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Related MindGame Arena Games
        </h2>
        <p className="mt-1 text-sm text-[#666666] dark:text-[#A1A1AA]">
          Apply the strategies covered in this guide with these interactive browser games.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {article.relatedExercises.map((gid) => {
            const game = GAMES_BY_ID[gid];
            return (
              <Link
                key={gid}
                to={`/${game.seoSlug}`}
                className="group rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-5 hover:border-[#F97316] transition-colors"
              >
                <span className="text-xs font-semibold text-[#EA580C] dark:text-[#FB923C]">
                  {game.domain}
                </span>
                <h3 className="mt-1 font-display font-bold text-[#171717] dark:text-[#F4F4F6] group-hover:text-[#F97316]">
                  {game.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#666666] dark:text-[#A1A1AA]">
                  Play Exercise <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-base font-bold text-[#171717] dark:text-[#F4F4F6]">
              More in {article.category}
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/articles/${rel.slug}`}
                  className="rounded-xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-4 hover:border-[#F97316] transition-colors"
                >
                  <span className="font-display text-sm font-bold text-[#171717] dark:text-[#F4F4F6]">
                    {rel.title}
                  </span>
                  <p className="mt-1 text-xs text-[#666666] dark:text-[#A1A1AA] line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
