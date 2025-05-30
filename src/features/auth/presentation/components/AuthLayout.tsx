import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    auth.checkAuthState().then(() => {
      if (!auth.isAuthenticated) {
        navigate('/login');
      }
    });
  }, [navigate]);

  return <>{children}</>;
}