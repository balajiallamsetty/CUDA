import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import { Input } from '../components/ui/Field';
import { useToast } from '../components/ui/Toast';
import * as api from '../services/api';

export default function ForgotPasswordPage() {
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.forgotPassword({ email });
      setDone(true);
      push(res.message, 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <Container narrow>
      <div style={{ padding: '4rem 0' }}>
        <h1>Forgot password</h1>
        <p>If an account exists, reset instructions will be issued.</p>
        {done ? (
          <p>Check your email (or server logs in development) for the reset link.</p>
        ) : (
          <form className="stack" onSubmit={onSubmit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit">Send reset link</Button>
          </form>
        )}
        <p style={{ marginTop: '1rem' }}><Link to="/admin/login">Back to login</Link></p>
      </div>
    </Container>
  );
}
