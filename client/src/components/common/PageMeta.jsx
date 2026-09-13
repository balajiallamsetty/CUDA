import { useEffect } from 'react';
import { SITE } from '../../constants/site';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function PageMeta({
  title,
  description,
  path = '/',
  image = '/favicon.png',
}) {
  useEffect(() => {
    const brand = SITE.legalName;
    const fullTitle = title.includes(SITE.name) || title.includes(brand)
      ? title
      : `${title} | ${brand}`;
    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', `${window.location.origin}${path}`);
    upsertMeta('property', 'og:image', `${window.location.origin}${image}`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${path}`);
  }, [title, description, path, image]);

  return null;
}
