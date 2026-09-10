import styles from './Field.module.css';

export function Input({ label, id, error, hint, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`${styles.field} ${className}`} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <input id={inputId} className={`${styles.control} ${error ? styles.invalid : ''}`} {...props} />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export function Textarea({ label, id, error, hint, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`${styles.field} ${className}`} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea id={inputId} className={`${styles.control} ${styles.textarea} ${error ? styles.invalid : ''}`} {...props} />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export function Select({ label, id, error, hint, children, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`${styles.field} ${className}`} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <select id={inputId} className={`${styles.control} ${error ? styles.invalid : ''}`} {...props}>
        {children}
      </select>
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
