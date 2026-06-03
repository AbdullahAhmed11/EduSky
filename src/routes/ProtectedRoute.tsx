import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/api';

export function ProtectedRoute({ role }: { role?: UserRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role === 'parent' ? '/parent/dashboard' : '/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
}
