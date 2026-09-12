import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Loading } from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import * as api from '../../services/api';
import { useToast } from '../../components/ui/Toast';

export default function QuotationsPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api.getMyQuotations()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function approve(id) {
    try {
      await api.approveMyQuotation(id);
      push('Quotation approved.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function reject(id) {
    try {
      await api.rejectMyQuotation(id);
      push('Quotation rejected.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <div>
      <PageMeta title="Quotations" path="/dashboard/quotations" />
      <p className="eyebrow">Commercial</p>
      <h1 className="!text-3xl">Quotations</h1>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && !items.length && (
        <EmptyState title="No quotations" description="Quotations for services that require approval will appear here." />
      )}
      <ul className="mt-4 grid gap-4">
        {items.map((q) => (
          <li key={q._id} className="rounded-xl border border-line-soft bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{q.serviceRequest?.title || 'Quotation'}</p>
                <p className="text-sm text-muted">
                  {q.currency} {Number(q.total).toLocaleString()} · {q.status}
                </p>
              </div>
              <Badge>{q.status}</Badge>
            </div>
            {q.status === 'SENT' && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => approve(q._id)}>Approve</Button>
                <Button size="sm" variant="secondary" onClick={() => reject(q._id)}>Reject</Button>
              </div>
            )}
            {q.serviceRequest?.workProject && (
              <Link className="mt-3 inline-block text-sm text-accent" to={`/dashboard/projects/${q.serviceRequest.workProject}`}>
                View project
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
