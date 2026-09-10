import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import styles from './AdminPages.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    setError('');
    api.getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <Loading label="Loading dashboard…" />;
  if (error) return <ErrorState description={error} onRetry={load} />;

  const max = Math.max(1, ...(stats.leadStatusBreakdown || []).map((s) => s.count));

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.sub}>Operational snapshot for the Vignak team.</p>
        </div>
        <Link to="/admin/leads" className={styles.quickLink}>Review leads</Link>
      </header>

      <div className={styles.stats}>
        <StatCard label="Total leads" value={stats.totalLeads} />
        <StatCard label="New leads" value={stats.newLeads} />
        <StatCard label="Qualified leads" value={stats.qualifiedLeads} />
        <StatCard label="Published projects" value={stats.projects} />
        <StatCard label="Upcoming talks" value={stats.upcomingTalks} />
        <StatCard label="New inquiries" value={stats.inquiries} />
      </div>

      <section className={styles.panel}>
        <h2>Lead status breakdown</h2>
        <div className={styles.bars}>
          {(stats.leadStatusBreakdown || []).map((row) => (
            <div key={row.status} className={styles.barRow}>
              <span>{row.status}</span>
              <div className={styles.barTrack} aria-hidden="true">
                <div className={styles.barFill} style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
              <strong>{row.count}</strong>
            </div>
          ))}
          {!stats.leadStatusBreakdown?.length && <p className={styles.sub}>No leads yet.</p>}
        </div>
      </section>
    </div>
  );
}
