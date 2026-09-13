import { Link } from 'react-router-dom';
import { SITE, siteFullAddress, siteTelHref, siteWhatsAppHref } from '../../constants/site';
import Logo from '../brand/Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  const hasWebsite = SITE.website && !SITE.website.includes('[INSERT');

  return (
    <footer className="mt-auto bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_40%),#0b1220] py-16 text-white/80">
      <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="mb-4" />
          <p className="m-0 max-w-md text-white/70">{SITE.tagline}</p>
          <p className="mt-3 m-0 max-w-md text-sm text-white/55">{siteFullAddress()}</p>
          <ul className="mt-4 m-0 grid list-none gap-2 p-0 text-sm text-white/80">
            <li>
              <a className="hover:text-accent-mist" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <a className="hover:text-accent-mist" href={siteTelHref()}>{SITE.phone}</a>
              {' · '}
              <a className="hover:text-accent-mist" href={siteWhatsAppHref()} target="_blank" rel="noreferrer">WhatsApp</a>
            </li>
            {hasWebsite && (
              <li>
                <a className="hover:text-accent-mist" href={SITE.website} target="_blank" rel="noreferrer">{SITE.website}</a>
              </li>
            )}
          </ul>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a className="font-semibold text-white hover:text-accent-mist" href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="font-semibold text-white hover:text-accent-mist" href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-white/80">
            <li><Link className="hover:text-accent-mist" to="/project-assistance">Project Assistance</Link></li>
            <li><Link className="hover:text-accent-mist" to="/portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-accent-mist" to="/talks">Talks</Link></li>
            <li><Link className="hover:text-accent-mist" to="/services">Services</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Account</p>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-white/80">
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
