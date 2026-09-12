import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getCatalogService(slug)
      .then((res) => setSvc(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-12"><Loading /></div>;
  if (error) return <div className="p-12"><ErrorState description={error} /></div>;
  if (!svc) return null;

  const requestTo = user
    ? `/dashboard/requests/new?service=${svc.slug}`
    : `/register?next=/dashboard/requests/new&service=${svc.slug}`;

  return (
    <>
      <PageMeta title={svc.title} description={svc.summary} path={`/services/${svc.slug}`} />
      <section className="border-b border-line-soft bg-gradient-to-br from-ink via-ink to-accent/30 py-16 text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-mist">{svc.category}</p>
          <h1 className="mt-2 max-w-3xl !text-white">{svc.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{svc.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to={requestTo} variant="inverse" size="lg">
              {svc.ctaLabel || 'Request this service'}
            </Button>
            <Button as={Link} to="/services" variant="outlineInverse" size="lg">All services</Button>
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="!text-2xl">Who it’s for</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {(svc.audience || []).map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="!text-2xl">Process</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
              {(svc.process || []).map((p) => <li key={p}>{p}</li>)}
            </ol>
          </div>
        </div>
      </section>
      {(svc.faq || []).length > 0 && (
        <section className="bg-accent-panel py-14">
          <div className="mx-auto max-w-container px-4 sm:px-6">
            <h2 className="!text-2xl">FAQ</h2>
            <div className="mt-6 grid gap-3">
              {svc.faq.map((f) => (
                <details key={f.q} className="rounded-xl border border-line-soft bg-white p-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2 text-sm">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
