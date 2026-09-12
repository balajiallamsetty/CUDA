import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WORK_PROJECT_STATUS_LABELS, PA_DOMAIN_LABELS } from '@vignak/shared';
import * as api from '../../services/api';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/Button';

export default function MyProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api.getMyWorkProjects()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageMeta title="My projects" path="/dashboard/projects" />
      <p className="eyebrow">Delivery</p>
      <h1 className="!text-3xl">My projects</h1>
      <p className="mb-6 text-sm text-muted">Progress is calculated from real milestones — not lead CRM labels.</p>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <div>
          <EmptyState title="No projects yet" description="Once a request is accepted, your work order appears here." />
          <Button as={Link} to="/dashboard/requests/new" className="mt-4">Submit a request</Button>
        </div>
      )}
      <div className="grid gap-4">
        {items.map((p) => (
          <Link key={p._id} to={`/dashboard/projects/${p._id}`} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="!m-0 !font-sans !text-lg !font-semibold">{p.title}</h2>
              <span className="text-xs font-semibold text-accent">{WORK_PROJECT_STATUS_LABELS[p.status] || p.status}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{PA_DOMAIN_LABELS[p.domain] || p.domain}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-line-soft">
              <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress || 0}%` }} />
            </div>
            <p className="mt-2 text-sm font-semibold">{p.progress || 0}% complete</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
