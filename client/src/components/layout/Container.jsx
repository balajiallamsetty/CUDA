import styles from './Container.module.css';

export default function Container({ children, className = '', narrow = false }) {
  return (
    <div className={`${styles.container} ${narrow ? styles.narrow : ''} ${className}`}>
      {children}
    </div>
  );
}
