import { SITE } from '../../constants/site';

/**
 * Brand logo — official PNG crops from the CUDA branding sheet (public/brand/).
 */
const BRAND_IMAGES_READY = true;

const BRAND = {
  dark: '/brand/logo-horizontal.png',
  light: '/brand/logo-horizontal-on-dark.png',
  mark: '/brand/mark.png',
};

export default function Logo({
  variant = 'wordmark',
  tone = 'dark',
  className = '',
}) {
  const ink = tone === 'light' ? '#ffffff' : '#0B0F19';

  if (BRAND_IMAGES_READY) {
    const src = variant === 'mark'
      ? BRAND.mark
      : (tone === 'light' ? BRAND.light : BRAND.dark);
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src={src}
          alt={SITE.legalName}
          width={variant === 'mark' ? 32 : undefined}
          height={variant === 'mark' ? 32 : undefined}
          className={
            variant === 'mark'
              ? 'h-8 w-8 object-contain'
              : 'h-8 w-auto max-w-[180px] object-contain object-left'
          }
        />
      </span>
    );
  }

  if (variant === 'mark') {
    return (
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${className}`}
        style={{ background: ink === '#ffffff' ? 'rgba(255,255,255,0.15)' : '#0B0F19', color: tone === 'light' ? '#67E8F9' : '#4F46E5' }}
        aria-hidden="true"
      >
        {SITE.name.charAt(0)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-tight text-[1.15rem] ${className}`}
      style={{ color: ink }}
      aria-label={SITE.legalName}
    >
      {SITE.name}
    </span>
  );
}
