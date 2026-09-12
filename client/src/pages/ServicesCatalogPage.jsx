import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { ErrorState, EmptyState } from '../components/ui/States';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ServicesCatalogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCatalogServices()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Services"
        description="Project Assistance and the full Vignak service catalog — web, AI, campus, events, and more."
        path="/services"
      />
      <section className="border-b border-line-soft bg-gradient-to-br from-accent-panel via-white to-cyan-50/40 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Services</p>
          <h1 className="max-w-3xl">One platform. Multiple service lines.</h1>
          <p className="lead mt-3 max-w-2xl">
            Project Assistance remains our flagship for students. Explore additional services when your team or campus needs digital delivery.
          </p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          {loading && <Loading label="Loading services…" />}
          {error && <ErrorState description={error} />}
          {!loading && !error && !items.length && (
            <EmptyState title="No services published" description="Check back soon." />
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((svc) => (
              <article key={svc.slug} className="flex flex-col border-b border-line-soft pb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{svc.category || 'Service'}</p>
                <h2 className="mt-1 !font-sans !text-xl">{svc.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{svc.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button as={Link} to={`/services/${svc.slug}`} size="sm" variant="secondary">
                    Learn more
                  </Button>
                  <Button
                    as={Link}
                    to={user ? `/dashboard/requests/new?service=${svc.slug}` : `/register?next=/dashboard/requests/new&service=${svc.slug}`}
                    size="sm"
                  >
                    {svc.ctaLabel || 'Request'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
