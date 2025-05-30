import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function LogoutButton() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
      navigate('/login', {
        replace: true,
        state: { message: 'You have been successfully logged out.' }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="glass-button p-2 text-gray-600 hover:text-red-600"
      aria-label="Log out"
    >
      <LogOut className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  );
}