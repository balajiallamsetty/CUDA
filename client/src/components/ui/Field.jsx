export function Input({ label, id, error, hint, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`flex flex-col gap-1.5 ${className}`} htmlFor={inputId}>
      {label && <span className="text-sm font-semibold text-ink">{label}</span>}
      <input
        id={inputId}
        className={`rounded-md border bg-white px-3 py-2.5 text-ink shadow-soft ${
          error ? 'border-danger' : 'border-line'
        }`}
        {...props}
      />
      {hint && !error && <span className="text-sm text-muted">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

export function Textarea({ label, id, error, hint, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`flex flex-col gap-1.5 ${className}`} htmlFor={inputId}>
      {label && <span className="text-sm font-semibold text-ink">{label}</span>}
      <textarea
        id={inputId}
        className={`min-h-[120px] rounded-md border bg-white px-3 py-2.5 text-ink shadow-soft ${
          error ? 'border-danger' : 'border-line'
        }`}
        {...props}
      />
      {hint && !error && <span className="text-sm text-muted">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

export function Select({ label, id, error, hint, children, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <label className={`flex flex-col gap-1.5 ${className}`} htmlFor={inputId}>
      {label && <span className="text-sm font-semibold text-ink">{label}</span>}
      <select
        id={inputId}
        className={`rounded-md border bg-white px-3 py-2.5 text-ink shadow-soft ${
          error ? 'border-danger' : 'border-line'
        }`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <span className="text-sm text-muted">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
