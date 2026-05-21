import axios from 'axios';
import { env } from '../../lib/env';
import { getAccessToken } from '../../auth/tokenStore';

export function getSessionToken(): string | null {
  return localStorage.getItem('x-session-token');
}

export function setSessionToken(token: string): void {
  localStorage.setItem('x-session-token', token);
}

export function removeSessionToken(): void {
  localStorage.removeItem('x-session-token');
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionToken = getSessionToken();
  if (sessionToken) {
    config.headers['x-session-token'] = sessionToken;
  }

  return config;
});
