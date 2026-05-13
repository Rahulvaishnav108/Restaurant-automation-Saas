import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { AppError } from '../../middleware/errorHandler';
import {
  createEntityId,
  getUserByEmailOrMobile,
  getUserById,
  phase1Store,
  type AuthSessionRecord,
  type UserRecord,
} from '../../services/phase1Store';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../services/jwt.service';
import { toAuthenticatedUserDto } from './auth.utils';
import type { AppRole } from '../../constants/roles';

type LoginInput = {
  email?: string;
  mobile?: string;
  password: string;
  deviceLabel: string;
};

type RegisterInput = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: AppRole;
};

function buildSessionExpiry(): string {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

function issueAuthArtifacts(user: UserRecord, deviceLabel: string) {
  const sessionId = createEntityId('sess');
  const refresh = signRefreshToken({
    sub: user.id,
    role: user.role,
    restaurantId: user.restaurantId,
    email: user.email,
    sessionId,
  });
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    restaurantId: user.restaurantId,
    email: user.email,
    sessionId,
  });

  const session: AuthSessionRecord = {
    id: sessionId,
    userId: user.id,
    refreshTokenId: refresh.refreshTokenId,
    deviceLabel,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    expiresAt: buildSessionExpiry(),
    revokedAt: null,
  };

  phase1Store.authSessions.push(session);

  return {
    user: toAuthenticatedUserDto(user),
    session,
    accessToken,
    refreshToken: refresh.token,
  };
}

export function registerAuthUser(input: RegisterInput, defaultRestaurantId = 'rest_1') {
  const existingByEmail = getUserByEmailOrMobile({ email: input.email });
  if (existingByEmail) {
    throw new AppError(409, 'VALIDATION_ERROR', 'Email is already registered');
  }

  const existingByMobile = getUserByEmailOrMobile({ mobile: input.mobile });
  if (existingByMobile) {
    throw new AppError(409, 'VALIDATION_ERROR', 'Mobile number is already registered');
  }

  const user: UserRecord = {
    id: createEntityId('usr'),
    name: input.name,
    email: input.email.toLowerCase(),
    mobile: input.mobile,
    role: input.role,
    restaurantId: input.role === 'super-admin' ? undefined : defaultRestaurantId,
    passwordHash: bcrypt.hashSync(input.password, 10),
    isActive: true,
  };

  phase1Store.users.push(user);

  return issueAuthArtifacts(user, 'Registration flow');
}

export function loginAuthUser(input: LoginInput) {
  const user = getUserByEmailOrMobile({ email: input.email, mobile: input.mobile });
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials');
  }

  if (!user.isActive) {
    throw new AppError(403, 'FORBIDDEN', 'User account is inactive');
  }

  const matches = bcrypt.compareSync(input.password, user.passwordHash);
  if (!matches) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials');
  }

  return issueAuthArtifacts(user, input.deviceLabel);
}

export function requestOtp(target: string) {
  const otp = String(randomInt(100000, 999999));
  const record = {
    id: createEntityId('otp'),
    target,
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    verifiedAt: null,
  };

  phase1Store.otps = phase1Store.otps.filter((entry) => entry.target !== target);
  phase1Store.otps.push(record);

  return {
    message: 'OTP issued successfully',
    otp,
    expiresAt: record.expiresAt,
  };
}

export function verifyOtpAndLogin(input: { email?: string; mobile?: string; otp: string; deviceLabel: string }) {
  const target = input.email ?? input.mobile ?? '';
  const record = phase1Store.otps.find((entry) => entry.target === target);

  if (!record) {
    throw new AppError(404, 'NOT_FOUND', 'OTP request not found');
  }

  if (record.code !== input.otp || new Date(record.expiresAt).getTime() <= Date.now()) {
    throw new AppError(401, 'UNAUTHORIZED', 'OTP is invalid or expired');
  }

  record.verifiedAt = new Date().toISOString();

  const user = getUserByEmailOrMobile({ email: input.email, mobile: input.mobile });
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found for OTP login');
  }

  return issueAuthArtifacts(user, input.deviceLabel);
}

export function refreshAuthSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const session = phase1Store.authSessions.find(
    (entry) => entry.id === payload.sessionId && entry.refreshTokenId === payload.jti,
  );

  if (!session || session.revokedAt) {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh token session is invalid');
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh token session expired');
  }

  const user = getUserById(payload.sub);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  session.revokedAt = new Date().toISOString();

  return issueAuthArtifacts(user, session.deviceLabel);
}

export function logoutAuthSession(refreshToken?: string) {
  if (!refreshToken) {
    return { loggedOut: true };
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const session = phase1Store.authSessions.find(
      (entry) => entry.id === payload.sessionId && entry.refreshTokenId === payload.jti,
    );
    if (session) {
      session.revokedAt = new Date().toISOString();
    }
  } catch {
    return { loggedOut: true };
  }

  return { loggedOut: true };
}

export function getAuthMe(userId: string) {
  const user = getUserById(userId);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  return { user: toAuthenticatedUserDto(user) };
}

export function listUserSessions(userId: string) {
  return {
    sessions: phase1Store.authSessions.filter((session) => session.userId === userId),
  };
}

export function revokeSession(userId: string, sessionId: string) {
  const session = phase1Store.authSessions.find((entry) => entry.id === sessionId && entry.userId === userId);
  if (!session) {
    throw new AppError(404, 'NOT_FOUND', 'Session not found');
  }

  session.revokedAt = new Date().toISOString();
  return { revokedSessionId: sessionId };
}

export function createForgotPasswordResponse(email: string) {
  const user = getUserByEmailOrMobile({ email });
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  return {
    message: `Password reset instructions generated for ${email}.`,
  };
}

export function resetPassword(email: string, newPassword: string) {
  const user = getUserByEmailOrMobile({ email });
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  return { reset: true, email };
}
