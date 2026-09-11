import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';
import { STUDENT_STATUS_LABELS } from '../../data/projectAssistance';

export default function MyRequestsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    api.getMyLeads()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message || 'Unable to load requests'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageMeta title="My requests" description="Track your Vignak project assistance requests." path="/dashboard/requests" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Requests</p>
          <h1 className="!text-3xl">My project requests</h1>
        </div>
        <Button as={Link} to="/dashboard/requests/new">New request</Button>
      </div>
      {loading && <Loading />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <div className="mb-6">
          <EmptyState
            title="No requests yet"
            description="Submit your first project requirement to get started."
          />
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
              <h2 className="!m-0 !font-sans !text-lg !font-semibold">
                {item.projectTitle || item.service || 'Project request'}
              </h2>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-hover">
                {STUDENT_STATUS_LABELS[item.status] || item.status}
              </span>
            </div>
            <p className="mt-2 mb-0 line-clamp-2 text-sm">{item.description}</p>
            <p className="mt-2 mb-0 text-xs text-muted">
              {item.projectCategory || 'General'} · {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
