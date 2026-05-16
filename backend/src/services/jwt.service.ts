import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { JwtPayload, TokenPair } from '../types/auth.types';
import { generateSecureToken } from '../utils/crypto';

type DecodedAccessToken = JwtPayload & {
  sub?: string;
};

function normalizePayload(payload: DecodedAccessToken): JwtPayload {
  const id = payload._id ?? payload.sub;

  if (!id) {
    throw new Error('Invalid access token payload');
  }

  return {
    _id: id,
    email: payload.email,
    role: payload.role,
    restaurantId: payload.restaurantId,
  };
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(): string {
  return generateSecureToken(64);
}

export function verifyAccessToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as DecodedAccessToken;
  return normalizePayload(payload);
}

export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: generateRefreshToken(),
  };
}
