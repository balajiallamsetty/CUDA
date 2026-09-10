import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import { getAdminMe } from '../services/api';

export default function AdminHomePage() {
  const { user, logout } = useAuth();
  const [adminPayload, setAdminPayload] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMe()
      .then((res) => setAdminPayload(res.data))
      .catch((err) => setError(err.message || 'Unauthorized'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <div style={{ padding: '3rem 0' }}>
        <p className="eyebrow">Admin foundation</p>
        <h1>Protected area</h1>
        <p className="lead">
          Authenticated as {user?.name} ({user?.role}). This is an architectural shell — not a full dashboard.
        </p>
        <div className="row" style={{ marginBottom: '1.5rem' }}>
          <Button as={Link} to="/" variant="secondary">View public site</Button>
          <Button variant="ghost" onClick={() => logout()}>Log out</Button>
        </div>
        {loading && <Loading label="Verifying admin API access…" />}
        {error && <ErrorState title="Admin API blocked" description={error} />}
        {adminPayload && (
          <Card>
            <h3>API authorization confirmed</h3>
            <p>{adminPayload.message}</p>
            <p className="muted">Allowed roles: {adminPayload.allowedRoles?.join(', ')}</p>
          </Card>
        )}
      </div>
    </Container>
  );
}
