import axios from 'axios';
import type { RegisterUserPayload, User } from '../types/user';
import type { Message } from '../types/chat';

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

export const fetchChatHistory = async (): Promise<Message[]> => {
  const { data } = await api.get<Message[]>('/chat/history');
  return data;
};

export const sendChatMessage = async (message: string): Promise<Message> => {
  const { data } = await api.post<Message>('/chat/send', { message });
  return data;
};
