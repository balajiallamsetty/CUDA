import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageMeta from '../components/common/PageMeta';
import { getCategoryById, PROJECT_CATEGORIES } from '../data/projectCategories';
import { PORTFOLIO_PLACEHOLDERS } from '../data/portfolioPlaceholders';
import { useAuth } from '../context/AuthContext';

export default function DomainLandingPage() {
  const { domainId } = useParams();
  const { user } = useAuth();
  const category = getCategoryById(domainId);
  const samples = PORTFOLIO_PLACEHOLDERS.filter((p) => p.category === domainId).slice(0, 3);
  const cta = user ? '/dashboard/requests/new' : '/register';

  if (!category) {
    return (
      <div className="mx-auto max-w-container px-4 py-20 sm:px-6">
        <h1>Domain not found</h1>
        <Button as={Link} to="/project-assistance" className="mt-4">Back to Project Assistance</Button>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${category.title} Project Assistance`}
        description={`${category.description} Project help for B.Tech and M.Tech students from Vignak Solutions.`}
        path={`/project-assistance/domains/${domainId}`}
      />
      <section className="page-hero">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Project domain</p>
          <h1>{category.title}</h1>
          <p className="lead mt-4">{category.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to={cta} size="lg">Start Your Project</Button>
            <Button as={Link} to="/project-assistance" variant="secondary" size="lg">All domains</Button>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>Sample directions</h2>
          <p className="lead mt-2">Illustrative concept samples — not claimed client deliveries.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(samples.length ? samples : PORTFOLIO_PLACEHOLDERS.slice(0, 3)).map((item) => (
              <Link key={item.id} to={`/portfolio/${item.slug}`} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <p className="text-xs font-semibold text-accent">{item.categoryLabel}</p>
                <h3 className="mt-1 !font-sans !text-lg">{item.title}</h3>
                <p className="mt-2 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/project-assistance/domains/${c.id}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${c.id === domainId ? 'bg-accent text-white' : c.color}`}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
