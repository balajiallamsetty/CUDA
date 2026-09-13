import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import styles from './AdminPages.module.css';

export default function AdminTalksPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load(page = 1) {
    setLoading(true);
    api.getAdminTalks({ page: String(page), limit: '20' })
      .then((res) => { setRows(res.data); setMeta(res.meta); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Talks</h1>
          <p className={styles.sub}>Manage talks, speakers, and registrations.</p>
        </div>
        <Button as={Link} to="/admin/talks/new">New talk</Button>
      </header>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={() => load()} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="No talks yet" />}
      {!loading && !error && rows.length > 0 && (
        <>
          <DataTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'status', label: 'Status', render: (r) => <Badge tone="accent">{r.status}</Badge> },
              { key: 'published', label: 'Published', render: (r) => (r.published ? 'Yes' : 'No') },
              { key: 'date', label: 'Date', render: (r) => (r.date ? new Date(r.date).toLocaleDateString() : '—') },
            ]}
            rows={rows}
            onRowClick={(row) => navigate(`/admin/talks/${row._id}/edit`)}
          />
          <Pagination meta={meta} onPageChange={load} />
        </>
      )}
    </div>
  );
}
