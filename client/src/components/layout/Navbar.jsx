import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../../constants/site';
import Button from '../ui/Button';
import Container from './Container';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.brandText}>{SITE.name}</span>
        </Link>

        <nav className={styles.desktop} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button as={Link} to="/start-project" size="sm">
            Start a Project
          </Button>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className={`${styles.burger} ${open ? styles.burgerOpen : ''}`} />
          </button>
        </div>
      </Container>

      <div id="mobile-nav" className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
              onClick={() => setOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <Button as={Link} to="/start-project" onClick={() => setOpen(false)}>
            Start a Project
          </Button>
        </nav>
      </div>
    </header>
  );
}
