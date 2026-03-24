import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/data/mockData';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const routes: Record<UserRole, string> = {
      admin: '/admin',
      author: '/author',
      reviewer: '/reviewer',
    };
    return <Navigate to={routes[role]} replace />;
  }

  return <>{children}</>;
}
