import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import { Input } from '../components/ui/Field';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { isStaffRole } from '@vignak/shared';

export default function AdminLoginPage() {
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
      if (!isStaffRole(user.role)) {
        push('This account does not have admin access.', 'error');
        return;
      }
      push('Welcome back.', 'success');
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      push(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container narrow>
      <div style={{ padding: '4rem 0' }}>
        <p className="eyebrow">Admin</p>
        <h1>Sign in</h1>
        <p className="lead">Staff access for the CUDA Solutions operations dashboard.</p>
        <form className="stack" onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin/forgot-password">Forgot password?</Link>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link to="/">Back to site</Link>
        </p>
      </div>
    </Container>
  );
}
