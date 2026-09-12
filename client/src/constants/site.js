import { CUSTOMER_TYPES, isStaffRole } from '@vignak/shared';

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Project Assistance', to: '/project-assistance' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Talks', to: '/talks' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const SITE = {
  name: 'Vignak',
  legalName: 'Vignak Solutions',
  tagline: 'Project assistance for B.Tech and M.Tech students.',
  email: 'hello@vignak.solutions',
};

const STUDENT_TYPES = new Set([CUSTOMER_TYPES.STUDENT]);

export function dashboardNavForUser(user) {
  if (!user) return [];
  if (isStaffRole(user.role)) {
    return [
      { to: '/admin/dashboard', label: 'Admin dashboard', end: false },
      { to: '/admin/assigned-overview', label: 'Assigned work', end: false },
    ];
  }
  const base = [
    { to: '/dashboard', label: 'Overview', end: true },
    { to: '/dashboard/requests', label: 'Requests', end: false },
    { to: '/dashboard/projects', label: 'Projects', end: false },
    { to: '/dashboard/deliverables', label: 'Deliverables', end: false },
    { to: '/dashboard/quotations', label: 'Quotations', end: false },
    { to: '/dashboard/payments', label: 'Payments', end: false },
    { to: '/dashboard/notifications', label: 'Notifications', end: false },
    { to: '/dashboard/profile', label: 'Profile', end: false },
    { to: '/dashboard/support', label: 'Support', end: false },
  ];
  if (!STUDENT_TYPES.has(user.customerType || CUSTOMER_TYPES.STUDENT)) {
    base.splice(1, 0, { to: '/services', label: 'Browse services', end: false });
  }
  return base;
}
