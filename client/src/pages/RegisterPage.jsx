import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CUSTOMER_TYPE_VALUES, CUSTOMER_TYPE_LABELS, CUSTOMER_TYPES, SERVICE_SLUGS } from '@vignak/shared';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import Logo from '../components/brand/Logo';
import PageMeta from '../components/common/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { buildPostAuthPath } from '../utils/safeRedirect';

const initial = {
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  institution: '',
  course: '',
  year: '',
  customerType: CUSTOMER_TYPES.STUDENT,
};

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number (0–9)', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function passwordMeetsPolicy(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');
  const service = searchParams.get('service');
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, ok: rule.test(form.password) })),
    [form.password],
  );
  const strengthScore = passwordChecks.filter((c) => c.ok).length;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      push('Passwords do not match.', 'error');
      return;
    }
    if (!passwordMeetsPolicy(form.password)) {
      push('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      push('Account created. Welcome to CUDA Solutions.', 'success');
      const dest = buildPostAuthPath({
        next,
        service: service || SERVICE_SLUGS.PROJECT_ASSISTANCE,
      });
      navigate(dest, { replace: true });
    } catch (err) {
      push(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const serviceHint = service
    ? 'After you create an account, we will take you to your selected service request form.'
    : 'Submit a tracked service request and follow progress in your dashboard.';

  return (
    <div className="min-h-screen bg-accent-panel px-4 py-16">
      <PageMeta
        title="Create Account"
        description="Create a CUDA Solutions account to submit project assistance requests and track status."
        path="/register"
      />
      <div className="mx-auto max-w-xl rounded-2xl border border-line-soft bg-white p-8 shadow-card">
        <Logo className="mb-6" />
        <p className="eyebrow">Get started</p>
        <h1 className="!text-3xl">Create your account</h1>
        <p className="lead mb-6">{serviceHint}</p>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
          <Input className="sm:col-span-2" label="Full name" name="name" value={form.name} onChange={onChange} required />
          <Input className="sm:col-span-2" label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
          <Select className="sm:col-span-2" label="I am a" name="customerType" value={form.customerType} onChange={onChange}>
            {CUSTOMER_TYPE_VALUES.map((t) => (
              <option key={t} value={t}>{CUSTOMER_TYPE_LABELS[t]}</option>
            ))}
          </Select>
          <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
          <Input label="Institution / organization" name="institution" value={form.institution} onChange={onChange} />
          <Input label="Course" name="course" value={form.course} onChange={onChange} placeholder="B.Tech CSE" />
          <Select label="Year" name="year" value={form.year} onChange={onChange}>
            <option value="">Select year</option>
            <option value="4th Year">4th Year</option>
            <option value="M.Tech">M.Tech</option>
            <option value="Other">Other</option>
          </Select>
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            hint="8+ characters with upper, lower, number, and special character"
          />
          <Input label="Confirm password" type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={onChange} required />
          <div className="sm:col-span-2 space-y-2" aria-live="polite">
            <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
              <div
                className={`h-full transition-all ${
                  strengthScore <= 2 ? 'bg-red-500' : strengthScore <= 4 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${(strengthScore / PASSWORD_RULES.length) * 100}%` }}
              />
            </div>
            <ul className="grid gap-1 text-xs text-muted sm:grid-cols-2">
              {passwordChecks.map((check) => (
                <li key={check.id} className={check.ok ? 'text-emerald-700' : undefined}>
                  {check.ok ? '✓' : '○'} {check.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already have an account?{' '}
          <Link
            className="font-semibold text-accent"
            to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
