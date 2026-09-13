import { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Loading } from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Field';
import * as api from '../../services/api';
import { useToast } from '../../components/ui/Toast';

export default function DeliverablesPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});

  function load() {
    setLoading(true);
    api.getMyDeliverables()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function approve(id) {
    try {
      await api.approveMyDeliverable(id);
      push('Deliverable approved.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function requestChanges(id) {
    try {
      await api.requestMyDeliverableChanges(id, notes[id] || '');
      push('Change request sent.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <div>
      <PageMeta title="Deliverables" path="/dashboard/deliverables" />
      <p className="eyebrow">Delivery</p>
      <h1 className="!text-3xl">Deliverables</h1>
      <p className="lead mb-4 max-w-2xl text-sm">
        Files or outputs submitted for your approval. Project documents still live on each project&apos;s Documents tab after work starts.
      </p>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && !items.length && (
        <EmptyState title="No deliverables yet" description="When your team submits work for approval, it will show here." />
      )}
      <ul className="mt-4 grid gap-4">
        {items.map((d) => (
          <li key={d._id} className="rounded-xl border border-line-soft bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{d.title}</p>
                <p className="text-sm text-muted">
                  {d.workProject?.title || 'Project'} · v{d.version} · {d.type}
                </p>
              </div>
              <Badge>{d.status}</Badge>
            </div>
            {d.status === 'SUBMITTED' && (
              <div className="mt-3 grid gap-2">
                <Textarea
                  label="Change request notes"
                  value={notes[d._id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [d._id]: e.target.value }))}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => approve(d._id)}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => requestChanges(d._id)}>Request changes</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
