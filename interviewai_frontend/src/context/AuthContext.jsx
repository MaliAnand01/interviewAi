import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage token on app load
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const saveAuth = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, saveAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
