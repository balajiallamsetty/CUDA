import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import PageMeta from '../../components/common/PageMeta';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import * as api from '../../services/api';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyOverview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Unable to load overview'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageMeta title="Dashboard" description="Your Vignak Project Assistance workspace." path="/dashboard" />
      <p className="eyebrow">Welcome</p>
      <h1 className="!text-3xl">Hi {user?.name?.split(' ')[0] || 'there'}</h1>
      <p className="lead mb-8">Track requests, active projects, milestones, and messages in one place.</p>
      {loading && <Loading />}
      {error && <ErrorState description={error} />}
      {data && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Pending requests', data.pendingRequests, '/dashboard/requests'],
              ['Active projects', data.activeProjects, '/dashboard/projects'],
              ['Completed', data.completedProjects, '/dashboard/projects'],
              ['Unread notifications', data.unreadNotifications, '/dashboard/notifications'],
            ].map(([label, value, to]) => (
              <Link key={label} to={to} className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
              </Link>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
              <h2 className="!font-sans !text-xl !font-semibold">Start a new request</h2>
              <p className="mb-4 text-sm">Submit a Project Assistance requirement with domain and timeline.</p>
              <Button as={Link} to="/dashboard/requests/new">New request</Button>
            </div>
            <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
              <h2 className="!font-sans !text-xl !font-semibold">Recent projects</h2>
              {(data.recentProjects || []).length === 0 ? (
                <p className="text-sm text-muted">No active work orders yet — submit a request to get started.</p>
              ) : (
                <ul className="m-0 grid list-none gap-2 p-0">
                  {data.recentProjects.map((p) => (
                    <li key={p._id}>
                      <Link className="font-semibold text-accent" to={`/dashboard/projects/${p._id}`}>
                        {p.title} · {p.progress}%
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {(data.upcomingMilestones || []).length > 0 && (
            <div className="mt-6 rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
              <h2 className="!font-sans !text-xl !font-semibold">Upcoming milestones</h2>
              <ul className="mt-3 grid gap-2">
                {data.upcomingMilestones.map((m) => (
                  <li key={m._id} className="text-sm">
                    <span className="font-semibold">{m.title}</span>
                    <span className="text-muted"> · {m.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
