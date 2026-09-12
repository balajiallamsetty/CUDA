import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import { getProjectBySlug } from '../services/portfolioService';
import PageMeta from '../components/common/PageMeta';
import { PORTFOLIO_PLACEHOLDERS } from '../data/portfolioPlaceholders';

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [illustrative, setIllustrative] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProjectBySlug(slug)
      .then((item) => {
        if (item) {
          setProject(item);
          setIllustrative(false);
        } else {
          const placeholder = PORTFOLIO_PLACEHOLDERS.find((p) => p.slug === slug);
          setProject(placeholder || null);
          setIllustrative(Boolean(placeholder));
        }
      })
      .catch(() => {
        const placeholder = PORTFOLIO_PLACEHOLDERS.find((p) => p.slug === slug);
        setProject(placeholder || null);
        setIllustrative(Boolean(placeholder));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6">
        <ErrorState title="Project not found" description="This project may be unpublished or the link is incorrect." />
        <div className="mt-4">
          <Button as={Link} to="/portfolio" variant="secondary">Back to portfolio</Button>
        </div>
      </div>
    );
  }

  const image = project.image || project.coverImage || '/portfolio/placeholder-web.svg';
  const categoryLabel = project.categoryLabel || project.category;

  return (
    <>
      <PageMeta
        title={project.title}
        description={project.description?.slice(0, 160) || 'Portfolio sample from Vignak Solutions.'}
        path={`/portfolio/${project.slug || slug}`}
      />
      <section className="page-hero">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          {illustrative && (
            <p className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-hover">
              Illustrative sample
            </p>
          )}
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{categoryLabel}</p>
          <h1 className="mt-3 max-w-3xl">{project.title}</h1>
          <p className="lead mt-4">{project.description}</p>
          {project.client && <p className="mt-2 text-sm text-muted">Client: {project.client}</p>}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <img src={image} alt="" className="w-full rounded-2xl border border-line-soft object-cover shadow-soft" />
          <div>
            <h2 className="!font-sans !text-xl">Technologies</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(project.technologies || []).map((tech) => (
                <span key={tech} className="rounded-full border border-line px-3 py-1 text-xs font-medium">{tech}</span>
              ))}
            </div>
            {(project.problem || project.challenge) && (
              <>
                <h2 className="mt-8 !font-sans !text-xl">{project.problem ? 'Problem' : 'Challenge'}</h2>
                <p className="mt-2 text-sm">{project.problem || project.challenge}</p>
              </>
            )}
            {project.solution && (
              <>
                <h2 className="mt-8 !font-sans !text-xl">Solution</h2>
                <p className="mt-2 text-sm">{project.solution}</p>
              </>
            )}
            {project.results && (
              <>
                <h2 className="mt-8 !font-sans !text-xl">Results</h2>
                <p className="mt-2 text-sm">{project.results}</p>
              </>
            )}
            {illustrative && (
              <p className="mt-8 text-sm text-muted">
                This is a concept sample for portfolio browsing — not a claim of completed client delivery.
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/register">Start Your Project</Button>
              <Button as={Link} to="/portfolio" variant="secondary">Back to portfolio</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
