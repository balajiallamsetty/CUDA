export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function validateRequired(value, label = 'This field') {
  if (!String(value || '').trim()) return `${label} is required`;
  return '';
}
