import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';

export default function NotFoundPage() {
  return (
    <Container>
      <div style={{ padding: '6rem 0', maxWidth: 520 }}>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="lead">The page you requested does not exist or has moved.</p>
        <div className="row">
          <Button as={Link} to="/">Go home</Button>
          <Button as={Link} to="/contact" variant="secondary">Contact</Button>
        </div>
      </div>
    </Container>
  );
}
