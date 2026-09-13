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

/** Single source of truth for company branding & contact (update here only). */
export const SITE = {
  name: 'CUDA',
  legalName: 'CUDA Solutions',
  tagline: 'Where Ideas Become Excellence.',
  email: 'cudasolutionstech@gmail.com',
  phone: '+91 78427 04429',
  whatsapp: '+91 78427 04429',
  website: '[INSERT OFFICIAL WEBSITE]',
  address: 'Vadlamudi',
  city: 'Guntur',
  state: 'Andhra Pradesh',
  country: 'India',
  pinCode: '522213',
  instagram: 'https://www.instagram.com/cudasolutions/#',
  linkedin: 'https://www.linkedin.com/in/cuda-solutions-23ba23436/',
};

/** tel: / WhatsApp helpers (digits only for wa.me). */
export function siteTelHref(phone = SITE.phone) {
  const digits = String(phone).replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

export function siteWhatsAppHref(phone = SITE.whatsapp) {
  const digits = String(phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export function siteFullAddress() {
  return [SITE.address, SITE.city, SITE.state, SITE.pinCode, SITE.country]
    .filter(Boolean)
    .join(', ');
}

const STUDENT_TYPES = new Set([CUSTOMER_TYPES.STUDENT]);

/**
 * Core student nav stays lean. Commercial sections (deliverables / quotations / payments)
 * appear for non-student customers, or when the overview indicates existing records.
 */
export function dashboardNavForUser(user, overview = null) {
  if (!user) return [];
  if (isStaffRole(user.role)) {
    return [
      { to: '/admin/dashboard', label: 'Admin dashboard', end: false },
      { to: '/admin/assigned-overview', label: 'Assigned work', end: false },
    ];
  }

  const isStudent = STUDENT_TYPES.has(user.customerType || CUSTOMER_TYPES.STUDENT);
  const showCommercial = !isStudent
    || Boolean(overview?.hasDeliverables)
    || Boolean(overview?.hasQuotations)
    || Boolean(overview?.hasPayments)
    || (overview?.deliverablesCount ?? 0) > 0
    || (overview?.quotationsCount ?? 0) > 0
    || (overview?.paymentsCount ?? 0) > 0;

  const base = [
    { to: '/dashboard', label: 'Overview', hint: 'What is happening now', end: true },
    { to: '/dashboard/requests', label: 'Requests', hint: 'Intake status before acceptance', end: false },
    { to: '/dashboard/projects', label: 'Projects', hint: 'Active work after acceptance', end: false },
  ];

  if (showCommercial) {
    base.push(
      { to: '/dashboard/deliverables', label: 'Deliverables', hint: 'Files submitted for your approval', end: false },
      { to: '/dashboard/quotations', label: 'Quotations', end: false },
      { to: '/dashboard/payments', label: 'Payments', end: false },
    );
  }

  base.push(
    { to: '/dashboard/notifications', label: 'Notifications', end: false },
    { to: '/dashboard/profile', label: 'Profile', end: false },
    { to: '/dashboard/support', label: 'Support', end: false },
  );

  if (!isStudent) {
    base.splice(1, 0, { to: '/services', label: 'Browse services', end: false });
  }

  return base;
}
