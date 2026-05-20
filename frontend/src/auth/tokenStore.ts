const ACCESS_TOKEN_KEY = 'restaurant-automation/access-token';
const ROLE_KEY = 'restaurant-automation/demo-role';
const USER_KEY = 'restaurant-automation/user';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (!token) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getStoredRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setStoredRole(role: string | null): void {
  if (!role) {
    localStorage.removeItem(ROLE_KEY);
    return;
  }

  localStorage.setItem(ROLE_KEY, role);
}

export type StoredAuthUser = {
  id: string;
  name: string;
  role: string;
  restaurantId?: string;
  restaurantName?: string;
  email?: string;
  mobile?: string;
};

export function getStoredUser(): StoredAuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user: StoredAuthUser | null): void {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
