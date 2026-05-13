import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../config/env';
import type { AppRole } from '../constants/roles';

type TokenPayloadInput = {
  sub: string;
  role: AppRole;
  restaurantId?: string;
  email?: string;
  sessionId: string;
};

export type AccessTokenPayload = TokenPayloadInput & {
  type: 'access';
};

export type RefreshTokenPayload = TokenPayloadInput & {
  type: 'refresh';
  jti: string;
};

export function signAccessToken(payload: TokenPayloadInput): string {
  return jwt.sign(
    {
      ...payload,
      type: 'access',
    } satisfies AccessTokenPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] },
  );
}

export function signRefreshToken(payload: TokenPayloadInput): { token: string; refreshTokenId: string } {
  const refreshTokenId = randomUUID();
  const token = jwt.sign(
    {
      ...payload,
      type: 'refresh',
      jti: refreshTokenId,
    } satisfies RefreshTokenPayload,
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] },
  );

  return { token, refreshTokenId };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

  if (payload.type !== 'access') {
    throw new Error('Invalid access token type');
  }

  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

  if (payload.type !== 'refresh') {
    throw new Error('Invalid refresh token type');
  }

  return payload;
}
