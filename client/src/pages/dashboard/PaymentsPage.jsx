import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Loading } from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import * as api from '../../services/api';

export default function PaymentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyPayments()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageMeta title="Payments" path="/dashboard/payments" />
      <p className="eyebrow">Billing</p>
      <h1 className="!text-3xl">Payments</h1>
      <p className="lead mb-6">Status of recorded payments. Card capture requires a configured payment provider.</p>
      {loading && <Loading />}
      {error && <ErrorState description={error} />}
      {!loading && !error && !items.length && (
        <EmptyState title="No payments yet" description="When a payment is recorded for your project, it will appear here." />
      )}
      <ul className="mt-4 grid gap-3">
        {items.map((p) => (
          <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft py-3">
            <div>
              <p className="font-semibold">
                {p.currency || 'INR'} {Number(p.amount).toLocaleString()}
              </p>
              <p className="text-sm text-muted">
                {p.workProject?.title || 'Payment'} · {p.method || 'recorded'}
              </p>
            </div>
            <Badge>{p.status}</Badge>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Need help? <Link className="text-accent" to="/dashboard/support">Contact support</Link>
      </p>
    </div>
  );
}
