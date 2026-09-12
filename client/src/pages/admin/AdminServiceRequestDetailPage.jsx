import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  SERVICE_REQUEST_STATUS_VALUES,
  SERVICE_REQUEST_STATUS_LABELS,
  PA_DOMAIN_LABELS,
} from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminServiceRequestDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const [item, setItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([
      api.getAdminServiceRequest(id),
      api.getAdminUsers({ limit: 100 }).catch(() => ({ data: [] })),
    ])
      .then(([reqRes, usersRes]) => {
        setItem(reqRes.data);
        setStatus(reqRes.data.status);
        setAssignedTo(reqRes.data.assignedTo?._id || reqRes.data.assignedTo || '');
        setUsers(usersRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function save() {
    try {
      const res = await api.updateAdminServiceRequest(id, {
        status,
        assignedTo: assignedTo || null,
      });
      setItem(res.data);
      push('Request updated.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function convert() {
    try {
      const res = await api.convertAdminServiceRequest(id);
      push('Converted to work project.', 'success');
      window.location.assign(`/admin/work-projects/${res.data._id}`);
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!item) return null;

  return (
    <div className={styles.stack}>
      <Link to="/admin/service-requests">← Back</Link>
      <header className={styles.header}>
        <div>
          <h1>{item.title}</h1>
          <p className={styles.sub}>
            {item.user?.name} · {item.user?.email} · {PA_DOMAIN_LABELS[item.domain] || item.domain}
          </p>
        </div>
        <Badge tone="accent">{SERVICE_REQUEST_STATUS_LABELS[item.status]}</Badge>
      </header>
      <section className={styles.panel}>
        <p>{item.description}</p>
        {item.requirements && <p><strong>Requirements:</strong> {item.requirements}</p>}
      </section>
      <section className={styles.panel}>
        <h2>Manage</h2>
        <div className={styles.actions}>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {SERVICE_REQUEST_STATUS_VALUES.map((s) => (
              <option key={s} value={s}>{SERVICE_REQUEST_STATUS_LABELS[s]}</option>
            ))}
          </Select>
          <Select label="Assign to" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.role})</option>
            ))}
          </Select>
          <Button onClick={save}>Save</Button>
          {!item.workProject && (
            <Button variant="secondary" onClick={convert}>Convert to project</Button>
          )}
          {item.workProject && (
            <Button as={Link} to={`/admin/work-projects/${item.workProject._id || item.workProject}`} variant="secondary">
              Open work project
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
