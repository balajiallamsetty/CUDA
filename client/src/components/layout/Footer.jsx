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
          <Logo tone="dark" className="mb-4" />
          <p className="m-0 max-w-md text-black/70">{SITE.tagline}</p>
          <p className="mt-3 m-0 max-w-md text-sm text-black/55">{siteFullAddress()}</p>
          <ul className="mt-4 m-0 grid list-none gap-2 p-0 text-sm text-black/80">
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
          <p className="mb-3 font-semibold text-black">Explore</p>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-white/80">
            <li><Link className="hover:text-accent-mist" to="/project-assistance" style={{ color: 'black' }}>Project Assistance</Link></li>
            <li><Link className="hover:text-accent-mist" to="/portfolio" style={{ color: 'black' }}>Portfolio</Link></li>
            <li><Link className="hover:text-accent-mist" to="/talks" style={{ color: 'black' }}>Talks</Link></li>
            <li><Link className="hover:text-accent-mist" to="/services" style={{ color: 'black' }}>Services</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-black">Account</p>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-white/80">
            <li><Link className="hover:text-accent-mist" to="/register" style={{ color: 'black' }}>Create Account</Link></li>
            <li><Link className="hover:text-accent-mist" to="/login" style={{ color: 'black' }}>Log in</Link></li>
            <li><Link className="hover:text-accent-mist" to="/dashboard" style={{ color: 'black' }}>Dashboard</Link></li>
            <li><Link className="hover:text-accent-mist" to="/about" style={{ color: 'black' }}>About</Link></li>
            <li><Link className="hover:text-accent-mist" to="/contact" style={{ color: 'black' }}>Contact</Link></li>
            <li><Link className="hover:text-accent-mist" to="/privacy" style={{ color: 'black' }}>Privacy</Link></li>
            <li><Link className="hover:text-accent-mist" to="/terms" style={{ color: 'black' }}>Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-container flex-wrap justify-between gap-3 border-t border-black/10 px-4 pt-6 text-sm text-black/55 sm:px-6">
        <p className="m-0">© {year} {SITE.legalName}. All rights reserved.</p>
        <p className="m-0">{SITE.email}</p>
      </div>
    </footer>
  );
}
