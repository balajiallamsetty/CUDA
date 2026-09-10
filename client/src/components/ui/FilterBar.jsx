import styles from './FilterBar.module.css';

export default function FilterBar({ children }) {
  return <div className={styles.bar}>{children}</div>;
}
