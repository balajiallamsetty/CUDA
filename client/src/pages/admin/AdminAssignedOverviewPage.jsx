import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import Badge from '../../components/ui/Badge';
import styles from './AdminPages.module.css';

export default function AdminAssignedOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    api.getAdminAssignedOverview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <div>
          <h1>Assigned work</h1>
          <p className={styles.sub}>Requests and projects in your scope.</p>
        </div>
      </header>
      <section className={styles.panel}>
        <h2>Service requests</h2>
        <ul className={styles.list}>
          {(data?.requests || []).map((r) => (
            <li key={r._id}>
              <Link to={`/admin/service-requests/${r._id}`}>{r.title}</Link>
              {' '}
              <Badge>{r.status}</Badge>
              <span className={styles.sub}> · {r.user?.name} · {r.serviceSlug}</span>
            </li>
          ))}
          {!data?.requests?.length && <p className={styles.sub}>No assigned requests.</p>}
        </ul>
      </section>
      <section className={styles.panel}>
        <h2>Work projects</h2>
        <ul className={styles.list}>
          {(data?.projects || []).map((p) => (
            <li key={p._id}>
              <Link to={`/admin/work-projects/${p._id}`}>{p.title}</Link>
              {' '}
              <Badge>{p.status}</Badge>
              <span className={styles.sub}> · {p.client?.name} · {p.progress}%</span>
            </li>
          ))}
          {!data?.projects?.length && <p className={styles.sub}>No assigned projects.</p>}
        </ul>
      </section>
    </div>
  );
}
