import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEAD_STATUS_VALUES, LEAD_SERVICE_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import { Input, Select } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { EmptyState, ErrorState } from '../../components/ui/States';
import styles from './AdminPages.module.css';

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load(nextPage = page) {
    setLoading(true);
    setError('');
    const params = { page: String(nextPage), limit: '20' };
    if (q) params.q = q;
    if (status) params.status = status;
    if (service) params.service = service;
    api.getAdminLeads(params)
      .then((res) => {
        setRows(res.data);
        setMeta(res.meta);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(1); setPage(1); }, [status, service]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'service', label: 'Service' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone="accent">{row.status}</Badge>,
    },
    {
      key: 'assignedTo',
      label: 'Owner',
      render: (row) => row.assignedTo?.name || '—',
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Leads</h1>
          <p className={styles.sub}>Search, filter, and manage project inquiries.</p>
        </div>
      </header>

      <FilterBar>
        <Input label="Search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(1)} />
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {LEAD_STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Service" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">All</option>
          {LEAD_SERVICE_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <button type="button" onClick={() => { setPage(1); load(1); }}>Apply</button>
      </FilterBar>

      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={() => load(page)} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="No leads found" />}
      {!loading && !error && rows.length > 0 && (
        <>
          <DataTable columns={columns} rows={rows} onRowClick={(row) => navigate(`/admin/leads/${row._id}`)} />
          <Pagination
            meta={meta}
            onPageChange={(p) => {
              setPage(p);
              load(p);
            }}
          />
        </>
      )}
    </div>
  );
}
