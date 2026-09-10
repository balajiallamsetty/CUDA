import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component type={Component === 'button' ? type : undefined} className={classes} {...props}>
      {children}
    </Component>
  );
}
