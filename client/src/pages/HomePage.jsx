import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import PageMeta from '../components/common/PageMeta';
import { PROJECT_ASSISTANCE } from '../data/projectAssistance';
import { PROJECT_CATEGORIES } from '../data/projectCategories';
import { PORTFOLIO_PLACEHOLDERS } from '../data/portfolioPlaceholders';
import { listProjects } from '../services/portfolioService';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const pa = PROJECT_ASSISTANCE;

export default function HomePage() {
  const { user } = useAuth();
  const [cmsProjects, setCmsProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    listProjects({ featuredOnly: true })
      .then(setCmsProjects)
      .catch(() => setCmsProjects([]));
  }, []);

  const portfolioItems = useMemo(() => {
    if (cmsProjects.length > 0) {
      return cmsProjects.slice(0, 6).map((p) => ({
        id: p._id || p.id,
        slug: p.slug,
        title: p.title,
        categoryLabel: p.category,
        description: p.description,
        technologies: p.technologies || [],
        image: p.coverImage || '/portfolio/placeholder-web.svg',
        source: 'cms',
      }));
    }
    return PORTFOLIO_PLACEHOLDERS;
  }, [cmsProjects]);

  const filtered = filter === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === filter || item.categoryLabel === filter);

  const startTo = user ? '/dashboard/requests/new' : '/register';

  return (
    <>
      <PageMeta
        title="Project Assistance for B.Tech & M.Tech"
        description="Vignak Solutions helps B.Tech, B.E., and M.Tech students with project guidance, development assistance, documentation, and demo preparation."
        path="/"
      />

      <section className="relative isolate min-h-[min(92vh,880px)] overflow-hidden bg-ink text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroImage} alt="" className="h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-accent/40" />
        </div>
        <div className="relative mx-auto flex min-h-[min(92vh,880px)] max-w-container flex-col justify-center px-4 pb-20 pt-[calc(72px+3rem)] sm:px-6">
          <p className="mb-4 font-display text-4xl text-accent-mist md:text-5xl">{pa.hero.brand}</p>
          <h1 className="max-w-3xl !text-white md:!text-5xl lg:!text-6xl">{pa.hero.headline}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{pa.hero.support}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to={startTo} variant="inverse" size="lg">
              {pa.hero.primaryCta.label}
            </Button>
            <Button as={Link} to={pa.hero.secondaryCta.to} variant="outlineInverse" size="lg">
              {pa.hero.secondaryCta.label}
            </Button>
            {!user && (
              <Button as={Link} to="/register" variant="outlineInverse" size="lg">
                Create Account
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-line-soft bg-white py-14">
        <div className="mx-auto grid max-w-container gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          {pa.values.map((item) => (
            <article key={item.title}>
              <h2 className="!font-sans !text-base !font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-accent-panel py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Project Assistance</p>
          <h2 className="max-w-2xl">A clear path from idea to demo-ready project.</h2>
          <p className="lead mt-3">
            Structured help for final-year and postgraduate technical projects — without inventing outcomes or guaranteed marks.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pa.process.map((step) => (
              <li key={step.step} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <span className="text-sm font-semibold text-accent">Step {step.step}</span>
                <h3 className="mt-2 !font-sans !text-lg">{step.title}</h3>
                <p className="mt-2 text-sm">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button as={Link} to="/project-assistance">Explore Project Assistance</Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Who we help</p>
          <h2>Built for students who need technical project support.</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {pa.audiences.map((item) => (
              <li key={item} className="rounded-xl border border-line-soft bg-white px-4 py-3 text-sm font-medium shadow-soft">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/project-assistance/domains/${cat.id}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${cat.color}`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line-soft bg-white py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2>Sample project directions</h2>
              <p className="lead mt-2">
                {cmsProjects.length > 0
                  ? 'Published work from Vignak.'
                  : 'Illustrative placeholders until published case studies are available.'}
              </p>
            </div>
            <Button as={Link} to="/portfolio" variant="secondary">View portfolio</Button>
          </div>
          {cmsProjects.length === 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === 'all' ? 'bg-accent text-white' : 'bg-line-soft text-ink'}`}
              >
                All
              </button>
              {PROJECT_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === cat.id ? 'bg-accent text-white' : 'bg-line-soft text-ink'}`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.slug}`}
                className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <img src={item.image} alt="" className="h-40 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{item.categoryLabel}</p>
                  <h3 className="mt-1 !font-sans !text-lg">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">All services</p>
          <h2>Beyond Project Assistance.</h2>
          <p className="lead mt-2 max-w-2xl">
            Explore the catalog for web, AI, campus, events, and business delivery — same account, same platform.
          </p>
          <div className="mt-8">
            <Button as={Link} to="/services" size="lg">Browse all services</Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Web & digital', text: 'Sites and applications for teams beyond academic projects.', to: '/services/web-development' },
              { title: 'AI solutions', text: 'Custom AI systems with measured results — no invented accuracy claims.', to: '/services/ai-solutions' },
              { title: 'Vignak Talks', text: 'Sessions on technology, careers, and practical building.', to: '/talks' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="border-b border-line-soft pb-4 hover:border-accent/40">
                <h3 className="!font-sans !text-lg">{item.title}</h3>
                <p className="mt-2 text-sm">{item.text}</p>
              </Link>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-muted">{pa.ecosystemNote}</p>
        </div>
      </section>

      <section className="bg-accent-panel py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Why Vignak</p>
          <h2>Structured help without over-promising outcomes.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Clear intake', 'Submit requirements once, track request status, then move into a real work project.'],
              ['Transparent progress', 'Milestones and progress come from delivery state — not marketing CRM labels.'],
              ['Broader ecosystem', 'Project Assistance is flagship today; web, talks, and future services share one platform.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <h3 className="!font-sans !text-lg">{title}</h3>
                <p className="mt-2 text-sm">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">FAQ</p>
          <h2>Common questions</h2>
          <div className="mt-8 grid gap-4">
            {pa.faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-line-soft bg-white p-5 shadow-soft">
                <summary className="cursor-pointer font-semibold text-ink">{faq.q}</summary>
                <p className="mt-3 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6">
          <h2 className="!text-white">Ready to start your project?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Create an account, submit your requirement, and track updates in your dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as={Link} to={startTo} variant="inverse" size="lg">Start Your Project</Button>
            <Button as={Link} to="/project-assistance" variant="outlineInverse" size="lg">Learn more</Button>
          </div>
        </div>
      </section>
    </>
  );
}
