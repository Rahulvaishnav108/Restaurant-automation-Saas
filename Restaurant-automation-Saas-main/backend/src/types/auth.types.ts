// src/types/auth.types.ts
// Authentication-related type definitions

export interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  restaurantId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface RefreshTokenDoc {
  token: string;        // bcrypt-hashed refresh token
  userId: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  createdAt: Date;
}
