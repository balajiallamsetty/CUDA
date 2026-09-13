import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isStaffRole } from '@vignak/shared';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import Logo from '../components/brand/Logo';
import PageMeta from '../components/common/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { buildPostAuthPath, sanitizeInternalPath } from '../utils/safeRedirect';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
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
        const fromQuery = buildPostAuthPath({
          next: searchParams.get('next'),
          service: searchParams.get('service'),
        });
        const fromState = sanitizeInternalPath(location.state?.from);
        navigate(fromQuery !== '/dashboard' ? fromQuery : (fromState || '/dashboard'), { replace: true });
      }
    } catch (err) {
      push(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const registerLink = `/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return (
    <div className="min-h-screen bg-accent-panel px-4 py-16">
      <PageMeta title="Log in" description="Log in to your CUDA Solutions account." path="/login" />
      <div className="mx-auto max-w-md rounded-2xl border border-line-soft bg-white p-8 shadow-card">
        <Logo className="mb-6" />
        <p className="eyebrow">Account</p>
        <h1 className="!text-3xl">Log in</h1>
        <p className="lead mb-6">Access your requests, projects, and messages.</p>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <Input label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Log in'}</Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          New here? <Link className="font-semibold text-accent" to={registerLink}>Create an account</Link>
        </p>
        <p className="mt-2 text-sm text-muted">
          Staff? <Link className="font-semibold text-accent" to="/admin/login">Admin sign in</Link>
        </p>
      </div>
    </div>
  );
}
