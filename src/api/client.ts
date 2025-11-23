import axios from 'axios';
import type { RegisterUserPayload, User } from '../types/user';
import type { ChatResponse, ConversationTurn } from '../types/chat';
import type { MarkerResponse } from '../types/marker';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
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

export const sendChatMessage = async (
  userId: number,
  message: string,
  history: ConversationTurn[],
): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/recommendations/chat', { userId, message, history });
  return data;
};

export const fetchBenefitLocations = async (): Promise<MarkerResponse> => {
  const { data } = await api.get<MarkerResponse>('/benefits/locations');
  return data;
};
