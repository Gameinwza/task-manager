import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (email: string, password: string) =>
  api.post('/auth/register', { email, password });

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.access_token);
  return res.data;
};

export const getTasks = () => api.get('/tasks');
export const createTask = (title: string) => api.post('/tasks', { title });
export const toggleTask = (id: number) => api.patch(`/tasks/${id}`);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
