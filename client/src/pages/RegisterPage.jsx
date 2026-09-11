import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import Logo from '../components/brand/Logo';
import PageMeta from '../components/common/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

const initial = {
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  institution: '',
  course: '',
  year: '',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    try {
      await register(form);
      push('Account created. Welcome to Vignak.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      push(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-accent-panel px-4 py-16">
      <PageMeta
        title="Create Account"
        description="Create a Vignak account to submit project assistance requests and track status."
        path="/register"
      />
      <div className="mx-auto max-w-xl rounded-2xl border border-line-soft bg-white p-8 shadow-card">
        <Logo className="mb-6" />
        <p className="eyebrow">Get started</p>
        <h1 className="!text-3xl">Create your student account</h1>
        <p className="lead mb-6">Submit project requirements and track progress in one place.</p>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
          <Input className="sm:col-span-2" label="Full name" name="name" value={form.name} onChange={onChange} required />
          <Input className="sm:col-span-2" label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
          <Input label="Institution" name="institution" value={form.institution} onChange={onChange} />
          <Input label="Course" name="course" value={form.course} onChange={onChange} placeholder="B.Tech CSE" />
          <Select label="Year" name="year" value={form.year} onChange={onChange}>
            <option value="">Select year</option>
            <option value="4th Year">4th Year</option>
            <option value="M.Tech">M.Tech</option>
            <option value="Other">Other</option>
          </Select>
          <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} required hint="At least 12 characters" />
          <Input label="Confirm password" type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={onChange} required />
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already have an account? <Link className="font-semibold text-accent" to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
