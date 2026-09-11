import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import { listProjects } from '../services/portfolioService';
import { PORTFOLIO_PLACEHOLDERS } from '../data/portfolioPlaceholders';
import { PROJECT_CATEGORIES } from '../data/projectCategories';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [usingPlaceholders, setUsingPlaceholders] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    listProjects()
      .then((items) => {
        if (items?.length) {
          setProjects(items);
          setUsingPlaceholders(false);
        } else {
          setProjects(PORTFOLIO_PLACEHOLDERS);
          setUsingPlaceholders(true);
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load projects');
        setProjects(PORTFOLIO_PLACEHOLDERS);
        setUsingPlaceholders(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    if (!usingPlaceholders || filter === 'all') return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter, usingPlaceholders]);

  return (
    <>
      <PageMeta
        title="Portfolio"
        description="Sample project directions and published work from Vignak Solutions project assistance."
        path="/portfolio"
      />
      <section className="page-hero">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Portfolio</p>
          <h1>Project directions across AI, web, and full stack.</h1>
          <p className="lead mt-3">
            {usingPlaceholders
              ? 'Illustrative samples for marketing — replace with published case studies when ready.'
              : 'Published projects from Vignak.'}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          {loading && <Loading />}
          {!loading && error && usingPlaceholders && (
            <p className="mb-4 text-sm text-muted">Showing illustrative samples while the portfolio feed is unavailable.</p>
          )}
          {!loading && error && !usingPlaceholders && (
            <ErrorState title="Portfolio unavailable" description={error} onRetry={load} />
          )}

          {usingPlaceholders && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === 'all' ? 'bg-accent text-white' : 'bg-line-soft'}`}
              >
                All
              </button>
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === cat.id ? 'bg-accent text-white' : 'bg-line-soft'}`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project) => {
              const slug = project.slug;
              const image = project.image || project.coverImage || '/portfolio/placeholder-web.svg';
              const categoryLabel = project.categoryLabel || project.category;
              const techs = project.technologies || [];
              return (
                <Link
                  key={project.id || project._id || slug}
                  to={`/portfolio/${slug}`}
                  className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <img src={image} alt="" className="h-44 w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">{categoryLabel}</p>
                    <h2 className="mt-1 !font-sans !text-lg !font-semibold">{project.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm">{project.description}</p>
                    {techs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {techs.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-full border border-line px-2 py-0.5 text-[11px] font-medium">{tech}</span>
                        ))}
                      </div>
                    )}
                    <span className="mt-4 inline-block text-sm font-semibold text-accent">View details →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
