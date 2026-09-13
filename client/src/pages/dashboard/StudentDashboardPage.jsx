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

  const pending = data?.pendingRequests ?? 0;
  const active = data?.activeProjects ?? 0;

  let nowTitle = 'You are all set to begin';
  let nowBody = 'Submit a tracked service request when you are ready. A project workspace appears only after Vignak accepts a request.';
  if (pending > 0 && active === 0) {
    nowTitle = 'Your request is under review';
    nowBody = 'Vignak is reviewing your request. Your project has not started yet — it will appear under Projects after acceptance.';
  } else if (active > 0) {
    nowTitle = 'You have an active project';
    nowBody = 'Open Projects to see progress, documents, and messages with the Vignak team.';
  }

  return (
    <div>
      <PageMeta title="Dashboard" description="Your Vignak Project Assistance workspace." path="/dashboard" />
      <p className="eyebrow">Welcome</p>
      <h1 className="!text-3xl">Hi {user?.name?.split(' ')[0] || 'there'}</h1>
      <p className="lead mb-6">Here is what is happening with your work at Vignak.</p>

      {loading && <Loading />}
      {error && <ErrorState description={error} />}
      {data && (
        <>
          <section className="mb-8 rounded-2xl border border-accent/20 bg-accent-soft/50 p-5">
            <h2 className="!font-sans !text-lg !font-semibold">{nowTitle}</h2>
            <p className="mt-2 mb-0 text-sm text-slate-vignak">{nowBody}</p>
            <p className="mt-3 mb-0 text-sm text-muted">
              Documents appear on your project after it starts. Until then, track intake under Requests.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button as={Link} to="/dashboard/requests/new" size="sm">Submit a request</Button>
              <Button as={Link} to="/dashboard/requests" size="sm" variant="secondary">View requests</Button>
              <Button as={Link} to="/dashboard/support" size="sm" variant="ghost">Support</Button>
            </div>
          </section>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
              <h2 className="!font-sans !text-base !font-semibold">Requests</h2>
              <p className="mt-1 text-sm text-muted">
                Service requests you sent to Vignak. Status here is intake status — not development progress.
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink">{pending} pending</p>
              <Link className="mt-2 inline-block text-sm font-semibold text-accent" to="/dashboard/requests">
                Open requests →
              </Link>
            </article>
            <article className="rounded-2xl border border-line-soft bg-white p-5 shadow-soft">
              <h2 className="!font-sans !text-base !font-semibold">Projects</h2>
              <p className="mt-1 text-sm text-muted">
                Requests Vignak has accepted and started. Documents and messages live here after a project begins.
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink">{active} active</p>
              <Link className="mt-2 inline-block text-sm font-semibold text-accent" to="/dashboard/projects">
                Open projects →
              </Link>
            </article>
          </div>

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
              <p className="mb-4 text-sm">Submit a Project Assistance or other service requirement with domain and timeline.</p>
              <Button as={Link} to="/dashboard/requests/new">New request</Button>
            </div>
            <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
              <h2 className="!font-sans !text-xl !font-semibold">Recent projects</h2>
              {(data.recentProjects || []).length === 0 ? (
                <p className="text-sm text-muted">
                  No projects yet. A project appears here after Vignak accepts one of your service requests.
                </p>
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
              <p className="text-sm text-muted">Steps in an accepted project — not the same as request intake status.</p>
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
