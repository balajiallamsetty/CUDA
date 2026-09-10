import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** UX guard — API remains source of truth for authorization */
export default function RequirePermission({ permission, children }) {
  const { can, loading } = useAuth();
  if (loading) return null;
  if (!can(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
