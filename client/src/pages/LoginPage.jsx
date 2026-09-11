import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isStaffRole } from '@vignak/shared';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import Logo from '../components/brand/Logo';
import PageMeta from '../components/common/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      push('Welcome back.', 'success');
      if (isStaffRole(user.role)) {
        navigate(location.state?.from?.startsWith('/admin') ? location.state.from : '/admin/dashboard', { replace: true });
      } else {
        navigate(location.state?.from || '/dashboard', { replace: true });
      }
    } catch (err) {
      push(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-accent-panel px-4 py-16">
      <PageMeta title="Log in" description="Log in to your Vignak student account." path="/login" />
      <div className="mx-auto max-w-md rounded-2xl border border-line-soft bg-white p-8 shadow-card">
        <Logo className="mb-6" />
        <p className="eyebrow">Account</p>
        <h1 className="!text-3xl">Log in</h1>
        <p className="lead mb-6">Access your project requests and profile.</p>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <Input label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Log in'}</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          New here? <Link className="font-semibold text-accent" to="/register">Create an account</Link>
        </p>
        <p className="mt-2 text-sm text-muted">
          Staff? <Link className="font-semibold text-accent" to="/admin/login">Admin sign in</Link>
        </p>
      </div>
    </div>
  );
}
