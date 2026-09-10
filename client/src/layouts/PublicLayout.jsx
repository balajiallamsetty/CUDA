import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
