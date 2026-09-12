import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_REQUEST_STATUS_VALUES, SERVICE_REQUEST_STATUS_LABELS, PA_DOMAIN_LABELS, SERVICE_SLUG_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import DataTable from '../../components/ui/DataTable';
import styles from './AdminPages.module.css';

export default function AdminServiceRequestsPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (serviceSlug) params.serviceSlug = serviceSlug;
    api.getAdminServiceRequests(params)
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [status, serviceSlug]);

  const columns = [
    { key: 'title', label: 'Title', render: (row) => row.title },
    { key: 'user', label: 'Client', render: (row) => row.user?.name || '—' },
    { key: 'serviceSlug', label: 'Service', render: (row) => row.serviceSlug },
    { key: 'domain', label: 'Domain', render: (row) => PA_DOMAIN_LABELS[row.domain] || row.domain || '—' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone="accent">{SERVICE_REQUEST_STATUS_LABELS[row.status] || row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => <Button as={Link} to={`/admin/service-requests/${row._id}`} size="sm" variant="secondary">Open</Button>,
    },
  ];

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <div>
          <h1>Service requests</h1>
          <p className={styles.sub}>Multi-service intake (separate from marketing leads).</p>
        </div>
      </header>
      <div className={styles.actions}>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {SERVICE_REQUEST_STATUS_VALUES.map((s) => (
            <option key={s} value={s}>{SERVICE_REQUEST_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <Select label="Service" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>
          <option value="">All services</option>
          {SERVICE_SLUG_VALUES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && <DataTable columns={columns} rows={items} />}
    </div>
  );
}
