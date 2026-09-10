import styles from './Loading.module.css';

export function Loading({ label = 'Loading…' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function Skeleton({ height = 16, width = '100%', className = '' }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}
