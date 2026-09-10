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

export default function AdminProjectsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load(nextPage = 1) {
    setLoading(true);
    api.getAdminProjects({ page: String(nextPage), limit: '20', archived: 'false' })
      .then((res) => { setRows(res.data); setMeta(res.meta); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(1); }, []);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p className={styles.sub}>Portfolio CMS</p>
        </div>
        <Button as={Link} to="/admin/projects/new">New project</Button>
      </header>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={() => load(page)} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="No projects" actionLabel="Create project" onAction={() => navigate('/admin/projects/new')} />}
      {!loading && !error && rows.length > 0 && (
        <>
          <DataTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'published', label: 'Published', render: (r) => <Badge tone={r.published ? 'success' : 'neutral'}>{r.published ? 'Yes' : 'No'}</Badge> },
              { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : 'No') },
            ]}
            rows={rows}
            onRowClick={(row) => navigate(`/admin/projects/${row._id}/edit`)}
          />
          <Pagination meta={meta} onPageChange={(p) => { setPage(p); load(p); }} />
        </>
      )}
    </div>
  );
}
