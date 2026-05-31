import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-lg" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Restoring your session…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
