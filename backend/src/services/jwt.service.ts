// src/services/jwt.service.ts
// JWT token signing and verification

import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, TokenPair } from '../types/auth.types';
import { generateSecureToken } from '../utils/crypto';

/**
 * Sign an access token (short-lived, 15m default).
 */
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

/**
 * Sign a refresh token (long-lived, 7d default).
 * Returns a random secure token string (NOT a JWT).
 * This token gets bcrypt-hashed before storage in DB.
 */
export function generateRefreshToken(): string {
  return generateSecureToken(64);
}

/**
 * Verify an access token and return the decoded payload.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

/**
 * Generate a token pair: JWT access token + random refresh token.
 */
export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: generateRefreshToken(),
  };
}
