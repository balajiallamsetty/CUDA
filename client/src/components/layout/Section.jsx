import styles from './Section.module.css';
import Container from './Container';

export default function Section({
  children,
  eyebrow,
  title,
  description,
  className = '',
  tone = 'default',
  id,
}) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]} ${className}`}>
      <Container>
        {(eyebrow || title || description) && (
          <header className={styles.header}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {description && <p className="lead">{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
