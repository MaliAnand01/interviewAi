import api from './api';

export const register = async ({ username, email, password }) => {
  const res = await api.post('/api/auth/register', { username, email, password });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await api.get('/api/auth/logout');
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/api/auth/get-me');
  return res.data;
};
