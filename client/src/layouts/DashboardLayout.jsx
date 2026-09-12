import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/brand/Logo';

const LINKS = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/requests', label: 'My requests' },
  { to: '/dashboard/projects', label: 'My projects' },
  { to: '/dashboard/notifications', label: 'Notifications' },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/payments', label: 'Payments' },
  { to: '/dashboard/support', label: 'Support' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

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
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-accent-soft text-accent-hover' : 'text-slate-vignak hover:bg-line-soft'
                  }`
                }
              >
                {link.label}
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
