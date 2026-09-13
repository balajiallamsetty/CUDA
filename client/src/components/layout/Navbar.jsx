import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SERVICE_SLUGS } from '@vignak/shared';
import { NAV_LINKS, SITE } from '../../constants/site';
import { useAuth } from '../../context/AuthContext';
import Logo from '../brand/Logo';
import Button from '../ui/Button';

const startGuestTo = `/register?next=${encodeURIComponent('/dashboard/requests/new')}&service=${SERVICE_SLUGS.PROJECT_ASSISTANCE}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isStaff, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const startTo = user ? '/dashboard/requests/new' : startGuestTo;

  return (
    <header className="sticky top-0 z-[100] h-[72px] border-b border-line-soft/90 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-container items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)} aria-label={SITE.legalName}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-2.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent-soft text-accent-hover'
                    : 'text-slate-vignak hover:bg-accent/5 hover:text-ink'
                } ${link.to === '/project-assistance' ? 'font-semibold' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button as={Link} to={isStaff ? '/admin/dashboard' : '/dashboard'} size="sm" variant="secondary" className="hidden sm:inline-flex">
                {isStaff ? 'Admin' : 'Dashboard'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => logout()} className="hidden sm:inline-flex">
                Log out
              </Button>
            </>
          ) : (
            <Button as={Link} to="/login" size="sm" variant="secondary" className="hidden sm:inline-flex">
              Log in
            </Button>
          )}
          <Button as={Link} to={startTo} size="sm">
            Start Your Project
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-md border border-line bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-4 bg-ink" aria-hidden="true" />
            <span className="block h-0.5 w-4 bg-ink" aria-hidden="true" />
            <span className="block h-0.5 w-4 bg-ink" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[72px] z-50 border-t border-line-soft bg-surface/98 p-5 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 font-semibold ${isActive ? 'bg-accent-soft text-accent-hover' : 'text-ink-soft'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <>
                <Button as={Link} to="/login" onClick={() => setOpen(false)} variant="secondary">Log in</Button>
                <Button as={Link} to={startGuestTo} onClick={() => setOpen(false)}>Start Your Project</Button>
                <Button as={Link} to="/register" onClick={() => setOpen(false)} variant="ghost">Create Account</Button>
              </>
            )}
            {user && (
              <>
                <Button as={Link} to={startTo} onClick={() => setOpen(false)}>Start Your Project</Button>
                <Button as={Link} to={isStaff ? '/admin/dashboard' : '/dashboard'} onClick={() => setOpen(false)} variant="secondary">
                  {isStaff ? 'Admin' : 'Dashboard'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  Log out
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
