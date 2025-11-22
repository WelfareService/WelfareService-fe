import axios from 'axios';
import type { RegisterUserPayload, User } from '../types/user';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const registerUser = async (payload: RegisterUserPayload): Promise<User> => {
  const { data } = await api.post<User>('/users', payload);
  return data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};
