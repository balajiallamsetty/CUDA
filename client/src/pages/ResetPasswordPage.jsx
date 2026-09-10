import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import { Input } from '../components/ui/Field';
import { useToast } from '../components/ui/Toast';
import * as api from '../services/api';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [password, setPassword] = useState('');
  const token = params.get('token') || '';

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await api.resetPassword({ token, password });
      push('Password updated. Please sign in.', 'success');
      navigate('/admin/login');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <Container narrow>
      <div style={{ padding: '4rem 0' }}>
        <h1>Reset password</h1>
        <form className="stack" onSubmit={onSubmit}>
          <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={!token}>Update password</Button>
        </form>
        {!token && <p>Missing reset token.</p>}
        <p style={{ marginTop: '1rem' }}><Link to="/admin/login">Back to login</Link></p>
      </div>
    </Container>
  );
}
