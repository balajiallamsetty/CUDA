import { Link } from 'react-router-dom';
import { SITE } from '../../constants/site';
import Logo from '../brand/Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-[radial-gradient(circle_at_top_left,rgba(15,110,86,0.22),transparent_40%),#0b1220] py-16 text-white/80">
      <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="mb-4" />
          <p className="m-0 max-w-md text-white/70">
            Project assistance for B.Tech, B.E., and M.Tech students — guidance, development support,
            documentation, and demo preparation.
          </p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li><Link className="hover:text-accent-mist" to="/project-assistance">Project Assistance</Link></li>
            <li><Link className="hover:text-accent-mist" to="/portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-accent-mist" to="/talks">Vignak Talks</Link></li>
            <li><Link className="hover:text-accent-mist" to="/solutions">Other services</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Account</p>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li><Link className="hover:text-accent-mist" to="/register">Create Account</Link></li>
            <li><Link className="hover:text-accent-mist" to="/login">Log in</Link></li>
            <li><Link className="hover:text-accent-mist" to="/dashboard">Dashboard</Link></li>
            <li><Link className="hover:text-accent-mist" to="/about">About</Link></li>
            <li><Link className="hover:text-accent-mist" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-accent-mist" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-accent-mist" to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-container flex-wrap justify-between gap-3 border-t border-white/10 px-4 pt-6 text-sm text-white/55 sm:px-6">
        <p className="m-0">© {year} {SITE.legalName}. All rights reserved.</p>
        <p className="m-0">{SITE.email}</p>
      </div>
    </footer>
  );
}
