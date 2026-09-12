import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';
import { useToast } from '../../components/ui/Toast';

export default function NotificationsPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api.getMyNotifications()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function markAll() {
    try {
      await api.readAllMyNotifications();
      push('All marked as read.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <div>
      <PageMeta title="Notifications" path="/dashboard/notifications" />
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="!text-3xl">Notifications</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={markAll}>Mark all read</Button>
      </div>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState title="No notifications" description="Updates about requests and projects will appear here." />
      )}
      <div className="grid gap-3">
        {items.map((n) => (
          <button
            key={n._id}
            type="button"
            className={`rounded-xl border p-4 text-left ${n.readAt ? 'border-line-soft bg-white' : 'border-accent/30 bg-accent-soft/40'}`}
            onClick={async () => {
              if (!n.readAt) await api.readMyNotification(n._id);
              if (n.link) window.location.assign(n.link);
              else load();
            }}
          >
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-muted">{n.body}</p>
            <p className="mt-1 text-xs text-muted">{new Date(n.createdAt).toLocaleString()}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <Link className="text-accent font-semibold" to="/dashboard">Back to overview</Link>
      </p>
    </div>
  );
}
