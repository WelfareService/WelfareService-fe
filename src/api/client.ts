import axios from 'axios';
import type { RegisterUserPayload, User } from '../types/user';
import type { ChatResponse } from '../types/chat';
import type { MarkerResponse } from '../types/marker';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const registerUser = async (payload: RegisterUserPayload): Promise<User> => {
  const { data } = await api.post<User>('/users/register', payload);
  return data;
};

export const loginUser = async (name: string): Promise<User> => {
  const { data } = await api.post<User>('/users/login', { name });
  return data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

export const sendChatMessage = async (userId: number, message: string): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/recommendations/chat', { userId, message });
  return data;
};

export const fetchBenefitLocations = async (): Promise<MarkerResponse> => {
  const { data } = await api.get<MarkerResponse>('/benefits/locations');
  return data;
};
