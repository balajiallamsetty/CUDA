import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WORK_PROJECT_STATUS_LABELS, PA_DOMAIN_LABELS } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import DataTable from '../../components/ui/DataTable';
import styles from './AdminPages.module.css';

export default function AdminWorkProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api.getAdminWorkProjects()
      .then((res) => setItems(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'title', label: 'Title', render: (row) => row.title },
    { key: 'client', label: 'Client', render: (row) => row.client?.name || '—' },
    { key: 'domain', label: 'Domain', render: (row) => PA_DOMAIN_LABELS[row.domain] || row.domain },
    { key: 'status', label: 'Status', render: (row) => WORK_PROJECT_STATUS_LABELS[row.status] || row.status },
    { key: 'progress', label: 'Progress', render: (row) => `${row.progress || 0}%` },
    {
      key: 'actions',
      label: '',
      render: (row) => <Button as={Link} to={`/admin/work-projects/${row._id}`} size="sm" variant="secondary">Open</Button>,
    },
  ];

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <div>
          <h1>Work projects</h1>
          <p className={styles.sub}>Active Project Assistance delivery work orders.</p>
        </div>
      </header>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && <DataTable columns={columns} rows={items} />}
    </div>
  );
}
