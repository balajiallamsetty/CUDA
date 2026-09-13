import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { isStaffRole } from '@vignak/shared';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/brand/Logo';
import { dashboardNavForUser } from '../constants/site';
import * as api from '../services/api';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (!user || isStaffRole(user.role)) return undefined;
    let cancelled = false;
    api.getMyOverview()
      .then((res) => {
        if (!cancelled) setOverview(res.data);
      })
      .catch(() => {
        if (!cancelled) setOverview(null);
      });
    return () => { cancelled = true; };
  }, [user]);

  if (user && isStaffRole(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const links = dashboardNavForUser(user, overview);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line-soft bg-white">
        <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
            <Button as={Link} to="/" size="sm" variant="ghost">Site</Button>
            <Button size="sm" variant="secondary" onClick={() => logout()}>Log out</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-container gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-line-soft bg-white p-3 shadow-soft">
          <nav className="flex flex-col gap-1" aria-label="Dashboard">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                title={link.hint}
                aria-description={link.hint}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-accent-soft text-accent-hover' : 'text-slate-vignak hover:bg-line-soft'
                  }`
                }
              >
                <span className="block">{link.label}</span>
                {link.hint && (
                  <span className="mt-0.5 block text-[11px] font-medium leading-snug text-muted">{link.hint}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
