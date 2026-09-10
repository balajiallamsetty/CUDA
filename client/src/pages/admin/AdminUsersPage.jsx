import { useEffect, useState } from 'react';
import { ROLE_VALUES, ROLES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import { Input, Select } from '../../components/ui/Field';
import Badge from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminUsersPage() {
  const { push } = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.STAFF,
  });

  function load(page = 1) {
    setLoading(true);
    api.getAdminUsers({ page: String(page), limit: '20' })
      .then((res) => { setRows(res.data); setMeta(res.meta); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function createUser(e) {
    e.preventDefault();
    try {
      await api.createAdminUser(form);
      push('User created.', 'success');
      setForm({ name: '', email: '', password: '', role: ROLES.STAFF });
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function toggleActive(user) {
    try {
      await api.updateAdminUser(user.id || user._id, { isActive: !user.isActive });
      push('User updated.', 'success');
      load(meta?.page || 1);
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <div>
          <h1>Users</h1>
          <p className={styles.sub}>Staff accounts and roles.</p>
        </div>
      </header>

      <section className={styles.panel}>
        <h2>Create user</h2>
        <form className={styles.stack} onSubmit={createUser}>
          <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input label="Temporary password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <Select label="Role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
            {ROLE_VALUES.filter((r) => r !== ROLES.USER).map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Button type="submit">Create</Button>
        </form>
      </section>

      {loading && <Loading />}
      {error && <ErrorState description={error} onRetry={() => load()} />}
      {!loading && !error && (
        <>
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', render: (r) => <Badge>{r.role}</Badge> },
              {
                key: 'isActive',
                label: 'Status',
                render: (r) => (
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); toggleActive(r); }}>
                    {r.isActive ? 'Active' : 'Disabled'}
                  </Button>
                ),
              },
            ]}
            rows={rows}
            rowKey="id"
          />
          <Pagination meta={meta} onPageChange={load} />
        </>
      )}
    </div>
  );
}
