/**
 * Vignak wordmark + mark (SVG). Centralized for light/dark use.
 */
export default function Logo({
  variant = 'wordmark',
  tone = 'dark',
  className = '',
}) {
  const ink = tone === 'light' ? '#ffffff' : '#0B0F19';
  const accent = tone === 'light' ? '#67E8F9' : '#4F46E5';

  if (variant === 'mark') {
    return (
      <svg
        className={className}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill={ink} />
        <path
          d="M8 22V10h3.2l4.3 8.4L19.8 10H23v12h-2.6v-7.2L16.1 22h-1.7l-4.3-7.2V22H8z"
          fill={accent}
        />
        <circle cx="24.5" cy="8.5" r="2" fill={accent} />
      </svg>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill={ink} />
        <path
          d="M8 22V10h3.2l4.3 8.4L19.8 10H23v12h-2.6v-7.2L16.1 22h-1.7l-4.3-7.2V22H8z"
          fill={accent}
        />
        <circle cx="24.5" cy="8.5" r="2" fill={accent} />
      </svg>
      <span
        className="font-semibold tracking-tight text-[1.15rem]"
        style={{ color: ink }}
      >
        Vignak
      </span>
    </span>
  );
}
