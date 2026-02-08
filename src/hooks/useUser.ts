import { useState, useEffect } from 'react';
import { User } from '@/types';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = AuthService.getUser();
    setUser(storedUser);
    
    const theme = AuthService.getTheme();
    AuthService.setTheme(theme);
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      setUser(user);
      
      if (user.role === 'manager') {
        router.push('/dashboard');
      } else {
        router.push('/products');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  };

  const toggleTheme = () => {
    const current = AuthService.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    AuthService.setTheme(next);
  };

  return { user, loading, login, logout, toggleTheme };
}
