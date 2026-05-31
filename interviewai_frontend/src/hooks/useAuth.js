import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login, register, logout } from '../services/auth.api';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  const { user, loading, saveAuth, clearAuth } = ctx;

  const handleLogin = async ({ email, password }) => {
    const data = await login({ email, password });
    saveAuth(data.token, data.user);
    return data;
  };

  const handleRegister = async ({ username, email, password }) => {
    const data = await register({ username, email, password });
    saveAuth(data.token, data.user);
    return data;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Even if the API fails (e.g. expired token), clear local state
    } finally {
      clearAuth();
    }
  };

  return { user, loading, handleLogin, handleRegister, handleLogout };
}
