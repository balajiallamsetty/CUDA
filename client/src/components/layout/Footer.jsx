import { Link } from 'react-router-dom';
import { SITE } from '../../constants/site';
import Container from './Container';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>{SITE.name}</p>
            <p className={styles.copy}>
              Building technology, experiences and connections for businesses, institutions and communities.
            </p>
          </div>
          <div>
            <p className={styles.heading}>Explore</p>
            <ul className={styles.list}>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/customized">Customized</Link></li>
              <li><Link to="/talks">Vignak Talks</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
            </ul>
          </div>
          <div>
            <p className={styles.heading}>Company</p>
            <ul className={styles.list}>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/start-project">Start a Project</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {year} {SITE.legalName}. All rights reserved.</p>
          <p>{SITE.email}</p>
        </div>
      </Container>
    </footer>
  );
}
