import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { PERMISSIONS } from '@vignak/shared';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/ui/Loading';
import Button from '../components/ui/Button';
import styles from './AdminShell.module.css';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', permission: PERMISSIONS.DASHBOARD_READ },
  { to: '/admin/leads', label: 'Leads', permission: PERMISSIONS.LEADS_READ },
  { to: '/admin/inquiries', label: 'Inquiries', permission: PERMISSIONS.INQUIRIES_READ },
  { to: '/admin/projects', label: 'Projects', permission: PERMISSIONS.PROJECTS_READ },
  { to: '/admin/talks', label: 'Talks', permission: PERMISSIONS.TALKS_READ },
  { to: '/admin/users', label: 'Users', permission: PERMISSIONS.USERS_READ },
  { to: '/admin/settings', label: 'Settings', permission: PERMISSIONS.SETTINGS_READ },
];

export default function AdminShell() {
  const { user, loading, logout, can, isStaff } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading label="Checking session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  const links = NAV.filter((item) => can(item.permission));

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Link to="/admin/dashboard" onClick={() => setOpen(false)}>Vignak Admin</Link>
        </div>
        <nav className={styles.nav} aria-label="Admin">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sideFoot}>
          <p className={styles.userMeta}>{user.name}</p>
          <p className={styles.userRole}>{user.role}</p>
          <Button size="sm" variant="secondary" onClick={() => logout()}>Log out</Button>
          <Link className={styles.siteLink} to="/">View site</Link>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            Menu
          </button>
          <p className={styles.topTitle}>Operations</p>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      {open && <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)} />}
    </div>
  );
}
