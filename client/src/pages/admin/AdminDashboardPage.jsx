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
          <p className={styles.sub}>Operational snapshot for the CUDA Solutions team.</p>
        </div>
        <Link to="/admin/leads" className={styles.quickLink}>Review leads</Link>
      </header>

      <div className={styles.stats}>
        <StatCard label="Total leads" value={stats.totalLeads} />
        <StatCard label="New leads" value={stats.newLeads} />
        <StatCard label="Qualified leads" value={stats.qualifiedLeads} />
        <StatCard label="Users" value={stats.totalUsers ?? 0} />
        <StatCard label="Service requests" value={stats.totalRequests ?? 0} />
        <StatCard label="Active projects" value={stats.activeProjects ?? 0} />
        <StatCard label="Completed projects" value={stats.completedProjects ?? 0} />
        <StatCard label="Overdue milestones" value={stats.overdueMilestones ?? 0} />
        <StatCard label="Overdue tasks" value={stats.overdueTasks ?? 0} />
        <StatCard label="Published portfolio" value={stats.projects} />
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

      <section className={styles.panel}>
        <h2>Requests by service</h2>
        <ul>
          {(stats.requestsByService || []).map((row) => (
            <li key={row.serviceSlug}>{row.serviceSlug}: <strong>{row.count}</strong></li>
          ))}
          {!stats.requestsByService?.length && <p className={styles.sub}>No service requests yet.</p>}
        </ul>
      </section>

      <section className={styles.panel}>
        <h2>Workload by assignee</h2>
        <ul>
          {(stats.workloadByAssignee || []).map((row) => (
            <li key={row.user?._id || row.user?.id || row.count}>
              {row.user?.name || 'Unknown'}: <strong>{row.count}</strong> projects
            </li>
          ))}
          {!stats.workloadByAssignee?.length && <p className={styles.sub}>No assigned projects yet.</p>}
        </ul>
      </section>

      {stats.paymentsTotals && (
        <section className={styles.panel}>
          <h2>Payments</h2>
          <ul>
            {stats.paymentsTotals.map((row) => (
              <li key={row.status}>{row.status}: {row.count} · ₹{Number(row.amount).toLocaleString()}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
