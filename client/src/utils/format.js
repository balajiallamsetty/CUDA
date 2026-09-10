export function formatTalkDate(iso) {
  if (!iso) return 'Date TBA';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function talkStatusLabel(status) {
  const map = {
    UPCOMING: 'Upcoming',
    REGISTRATION_OPEN: 'Registration open',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return map[status] || status;
}
