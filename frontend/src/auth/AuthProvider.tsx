import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { apiClient } from '../shared/services/apiClient';
import {
  getAccessToken,
  getStoredRole,
  getStoredUser,
  setAccessToken,
  setStoredRole,
  setStoredUser,
  type StoredAuthUser,
} from './tokenStore';

export type AppRole = 'customer' | 'staff' | 'kitchen' | 'cleaning' | 'admin' | 'super-admin';

export type AuthUser = {
  id: string;
  name: string;
  role: AppRole;
  restaurantName: string;
  restaurantId?: string;
  email?: string;
  mobile?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  signIn: (input: { email?: string; mobile?: string; password: string; deviceLabel?: string }) => Promise<AuthUser>;
  signInAs: (role: AppRole) => void;
  signOut: () => void;
};

type LoginResponse = {
  success: true;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      restaurantId?: string;
      restaurantName?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
};

const roleProfiles: Record<AppRole, AuthUser> = {
  customer: { id: 'demo-customer', name: 'Guest Diner', role: 'customer', restaurantName: 'Amber Table' },
  staff: { id: 'demo-staff', name: 'Service Captain', role: 'staff', restaurantName: 'Amber Table' },
  kitchen: { id: 'demo-kitchen', name: 'Kitchen Lead', role: 'kitchen', restaurantName: 'Amber Table' },
  cleaning: { id: 'demo-cleaning', name: 'Cleaning Lead', role: 'cleaning', restaurantName: 'Amber Table' },
  admin: { id: 'demo-admin', name: 'Restaurant Admin', role: 'admin', restaurantName: 'Amber Table' },
  'super-admin': { id: 'demo-super-admin', name: 'Platform Operator', role: 'super-admin', restaurantName: 'Graphura Cloud' },
};

function mapBackendRoleToAppRole(role: string): AppRole {
  switch (role) {
    case 'service-staff':
      return 'staff';
    case 'kitchen-staff':
      return 'kitchen';
    case 'cleaning-staff':
      return 'cleaning';
    case 'restaurant-admin':
      return 'admin';
    case 'super-admin':
      return 'super-admin';
    default:
      return 'customer';
  }
}

function toAuthUser(user: StoredAuthUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    role: mapBackendRoleToAppRole(user.role),
    restaurantId: user.restaurantId,
    restaurantName: user.restaurantName ?? 'Restaurant',
    email: user.email,
    mobile: user.mobile,
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessToken());
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      return toAuthUser(storedUser);
    }

    const storedRole = getStoredRole() as AppRole | null;
    return storedRole ? roleProfiles[storedRole] ?? null : null;
  });

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    async signIn(input) {
      const response = await apiClient.post<LoginResponse>('/auth/login', input);
      const payload = response.data.data;
      const nextUser = toAuthUser(payload.user);

      setStoredRole(nextUser.role);
      setStoredUser(payload.user);
      setAccessToken(payload.accessToken);
      setUser(nextUser);
      setAccessTokenState(payload.accessToken);

      return nextUser;
    },
    signInAs(role) {
      const nextToken = `demo-token-${role}`;

      setStoredRole(role);
      setStoredUser({
        id: roleProfiles[role].id,
        name: roleProfiles[role].name,
        role,
        restaurantId: roleProfiles[role].restaurantId,
        restaurantName: roleProfiles[role].restaurantName,
      });
      setAccessToken(nextToken);
      setUser(roleProfiles[role]);
      setAccessTokenState(nextToken);
    },
    signOut() {
      setStoredRole(null);
      setStoredUser(null);
      setAccessToken(null);
      setUser(null);
      setAccessTokenState(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
