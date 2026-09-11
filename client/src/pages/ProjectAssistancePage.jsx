import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageMeta from '../components/common/PageMeta';
import { PROJECT_ASSISTANCE } from '../data/projectAssistance';
import { PROJECT_CATEGORIES } from '../data/projectCategories';
import { PORTFOLIO_PLACEHOLDERS } from '../data/portfolioPlaceholders';
import { useAuth } from '../context/AuthContext';

const pa = PROJECT_ASSISTANCE;

export default function ProjectAssistancePage() {
  const { user } = useAuth();
  const cta = user ? '/dashboard/requests/new' : '/register';

  return (
    <>
      <PageMeta
        title="Project Assistance for B.Tech & M.Tech Students"
        description="Final-year B.Tech, B.E., and M.Tech project assistance — guidance, development support, documentation, and demo preparation from Vignak Solutions."
        path="/project-assistance"
      />

      <section className="page-hero">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Project Assistance</p>
          <h1 className="max-w-3xl">Technical help for academic projects that need to ship.</h1>
          <p className="lead mt-4">
            {pa.hero.support}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to={cta} size="lg">Start Your Project</Button>
            <Button as={Link} to="/portfolio" variant="secondary" size="lg">See sample directions</Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>Who it’s for</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {pa.audiences.map((item) => (
              <li key={item} className="rounded-xl border border-line-soft bg-white px-4 py-3 shadow-soft">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-accent-panel py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>Categories we actively support</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_CATEGORIES.map((cat) => (
              <article key={cat.id} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <h3 className="!font-sans !text-lg">{cat.title}</h3>
                <p className="mt-2 text-sm">{cat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>How it works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pa.process.map((step) => (
              <li key={step.step} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <span className="text-sm font-semibold text-accent">Step {step.step}</span>
                <h3 className="mt-2 !font-sans !text-lg">{step.title}</h3>
                <p className="mt-2 text-sm">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line-soft bg-white py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>What students receive</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {pa.deliverables.map((item) => (
              <li key={item} className="rounded-lg bg-accent-soft/60 px-4 py-3 text-sm font-medium text-ink">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>Sample project directions</h2>
          <p className="lead mt-2">Illustrative placeholders — not claimed as live client case studies.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_PLACEHOLDERS.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.slug}`}
                className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-soft"
              >
                <img src={item.image} alt="" className="h-36 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-accent">{item.categoryLabel}</p>
                  <h3 className="mt-1 !font-sans !text-base">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent-panel py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h2>FAQs</h2>
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

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6">
          <h2 className="!text-white">Submit your project requirement</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Create an account to track status, or use the public form if you prefer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as={Link} to={cta} variant="inverse">Create Account / Submit</Button>
            <Button as={Link} to="/start-project" variant="outlineInverse">Public inquiry form</Button>
          </div>
        </div>
      </section>
    </>
  );
}
