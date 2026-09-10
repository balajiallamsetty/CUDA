import Button from './Button';
import styles from './Pagination.module.css';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages, total } = meta;
  return (
    <div className={styles.bar}>
      <span className={styles.meta}>{total} total · Page {page} of {totalPages}</span>
      <div className={styles.actions}>
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
