import styles from './States.module.css';
import Button from './Button';

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className={styles.state}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className={`${styles.state} ${styles.error}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
