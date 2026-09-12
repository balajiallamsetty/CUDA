import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LEAD_STATUS_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Textarea, Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminLeadDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([
      api.getAdminLead(id),
      api.getAdminUsers({ limit: 100 }).catch(() => ({ data: [] })),
    ])
      .then(([leadRes, usersRes]) => {
        setLead(leadRes.data);
        setStatus(leadRes.data.status);
        setAssignedTo(leadRes.data.assignedTo?._id || leadRes.data.assignedTo || '');
        setUsers(usersRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function saveStatus() {
    try {
      const res = await api.updateAdminLead(id, { status, assignedTo: assignedTo || null });
      setLead(res.data);
      push('Lead updated.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function archive(archived) {
    try {
      const res = await api.updateAdminLead(id, { archived });
      setLead(res.data);
      push(archived ? 'Lead archived.' : 'Lead restored.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function addNote() {
    try {
      const res = await api.addAdminLeadNote(id, note);
      setLead(res.data);
      setNote('');
      push('Note added.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!lead) return null;

  return (
    <div className={styles.stack}>
      <Link to="/admin/leads">← Back to leads</Link>
      <header className={styles.header}>
        <div>
          <h1>{lead.name}</h1>
          <p className={styles.sub}>{lead.email} · {lead.service}</p>
        </div>
        <Badge tone="accent">{lead.status}</Badge>
      </header>

      <section className={styles.panel}>
        <h2>Details</h2>
        <p><strong>Organization:</strong> {lead.organization || '—'}</p>
        <p><strong>Phone:</strong> {lead.phone || '—'}</p>
        <p><strong>Budget:</strong> {lead.budget || '—'}</p>
        <p><strong>Timeline:</strong> {lead.timeline || '—'}</p>
        <p>{lead.description}</p>
      </section>

      <section className={styles.panel}>
        <h2>Update status & assignment</h2>
        <div className={styles.actions}>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {LEAD_STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select label="Assign to" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.role})</option>
            ))}
          </Select>
          <Button onClick={saveStatus}>Save</Button>
          <Button variant="secondary" onClick={() => archive(!lead.archived)}>
            {lead.archived ? 'Unarchive' : 'Archive'}
          </Button>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Notes</h2>
        <Textarea label="Add note" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button onClick={addNote} disabled={!note.trim()}>Add note</Button>
        <ul>
          {(lead.notes || []).slice().reverse().map((n) => (
            <li key={n._id || n.createdAt}>
              <strong>{n.author?.name || 'Team'}</strong>: {n.body}
              <span className={styles.sub}> · {new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel}>
        <h2>Status history</h2>
        <ul>
          {(lead.statusHistory || []).slice().reverse().map((h, idx) => (
            <li key={`${h.at}-${idx}`}>
              {h.from || '—'} → {h.to}
              <span className={styles.sub}> · {h.by?.name || 'System'} · {new Date(h.at).toLocaleString()}</span>
            </li>
          ))}
          {!lead.statusHistory?.length && <li className={styles.sub}>No status changes yet.</li>}
        </ul>
      </section>
    </div>
  );
}
