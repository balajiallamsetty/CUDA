import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_REQUEST_STATUS_LABELS, PA_DOMAIN_LABELS } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';

export default function MyRequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    api.getMyServiceRequests()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message || 'Unable to load requests'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageMeta title="My requests" path="/dashboard/requests" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Service requests</p>
          <h1 className="!text-3xl">My requests</h1>
          <div className="mt-3 max-w-2xl rounded-xl border border-accent/20 bg-accent-soft/50 p-4 text-sm text-ink">
            <p className="m-0 font-semibold">Request status is intake status — not development progress.</p>
            <p className="mt-2 mb-0 text-slate-vignak">
              A project workspace appears under Projects only after CUDA Solutions accepts a request. Until then, track review status here.
            </p>
          </div>
        </div>
        <Button as={Link} to="/dashboard/requests/new">New request</Button>
      </div>
      {loading && <Loading />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <div className="mb-6">
          <EmptyState title="No requests yet" description="Submit your first Project Assistance requirement." />
          <div className="mt-4">
            <Button as={Link} to="/dashboard/requests/new">Start a request</Button>
          </div>
        </div>
      )}
      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/dashboard/requests/${item._id}`}
            className="rounded-xl border border-line-soft bg-white p-5 shadow-soft transition hover:border-accent/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="!m-0 !font-sans !text-lg !font-semibold">{item.title}</h2>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-hover">
                {SERVICE_REQUEST_STATUS_LABELS[item.status] || item.status}
              </span>
            </div>
            <p className="mt-2 mb-0 line-clamp-2 text-sm">{item.description}</p>
            <p className="mt-2 mb-0 text-xs text-muted">
              {PA_DOMAIN_LABELS[item.domain] || item.domain} · {new Date(item.createdAt).toLocaleDateString()}
              {item.workProject ? ' · Project created' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
