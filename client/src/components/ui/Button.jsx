const variants = {
  primary: 'bg-accent text-white shadow-card hover:bg-accent-hover',
  secondary: 'bg-transparent border border-line text-ink hover:border-ink',
  outline: 'bg-transparent border border-accent text-accent hover:bg-accent-soft',
  ghost: 'bg-transparent text-ink hover:bg-line-soft',
  inverse: 'bg-white text-ink shadow-lift hover:bg-white/90',
  outlineInverse: 'bg-transparent border border-white/45 text-white hover:border-white hover:bg-white/10',
  danger: 'bg-danger text-white hover:bg-danger/90',
  success: 'bg-success text-white hover:bg-success/90',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-4.5 py-2.5 text-sm',
  lg: 'px-5.5 py-3.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  as: Component = 'button',
  disabled,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-150',
    'disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60 disabled:bg-line-soft disabled:text-muted disabled:border disabled:border-line disabled:shadow-none',
    'hover:enabled:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
