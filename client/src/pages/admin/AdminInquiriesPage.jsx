import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import { Select } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import styles from './AdminPages.module.css';

export default function AdminInquiriesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load(nextPage = page) {
    setLoading(true);
    const params = { page: String(nextPage), limit: '20' };
    if (status) params.status = status;
    api.getAdminInquiries(params)
      .then((res) => { setRows(res.data); setMeta(res.meta); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(1); setPage(1); }, [status]);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Inquiries</h1>
          <p className={styles.sub}>Contact form submissions.</p>
        </div>
      </header>
      <FilterBar>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </FilterBar>
      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={() => load(page)} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="No inquiries" />}
      {!loading && !error && rows.length > 0 && (
        <>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'subject', label: 'Subject' },
              { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
              { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
            ]}
            rows={rows}
            onRowClick={(row) => navigate(`/admin/inquiries/${row._id}`)}
          />
          <Pagination meta={meta} onPageChange={(p) => { setPage(p); load(p); }} />
        </>
      )}
    </div>
  );
}
