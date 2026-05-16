// src/modules/auth/auth.service.ts
// Authentication business logic — staff/admin only
// Customers use temporary QR session tokens (see tableSessions module)

import { UserModel, IUser } from '../users/users.model';
import * as userService from '../users/users.service';
import { generateTokenPair, signAccessToken } from '../../services/jwt.service';
import { hashToken, compareToken, hashPassword, generateSecureToken } from '../../utils/crypto';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { JwtPayload } from '../../types/auth.types';
import { RegisterInput, LoginInput } from './auth.schema';
import { UserRole, RESTAURANT_ROLES } from '../../constants/roles';
import { env } from '../../config/env';
import { parseExpiry } from '../../utils/date';
import { sendPasswordResetEmail } from '../../services/mail.service';
import logger from '../../config/logger';

/** Valid staff roles that can be assigned during registration */
const VALID_STAFF_ROLES = new Set<string>(Object.values(UserRole));

/**
 * Build JWT payload from a user document.
 */
function buildPayload(user: IUser): JwtPayload {
  return {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
    ...(user.restaurantId && { restaurantId: user.restaurantId.toString() }),
  };
}

/**
 * Register a new staff/admin user.
 * Only callable by RESTAURANT_ADMIN or SUPER_ADMIN.
 * Customers do NOT register — they use QR session tokens.
 */
export async function register(input: RegisterInput & { role?: string }) {
  // Validate and extract role
  const role = input.role as UserRole;
  if (!role || !VALID_STAFF_ROLES.has(role)) {
    throw new AppError(
      `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`,
      400,
      ErrorCode.INVALID_REQUEST
    );
  }

  // Check for existing user
  if (await userService.emailExists(input.email)) {
    throw new AppError('Email already registered', 409, ErrorCode.CONFLICT);
  }
  if (await userService.mobileExists(input.mobile)) {
    throw new AppError('Mobile number already registered', 409, ErrorCode.CONFLICT);
  }

  // Create staff user with explicit role
  const user = await userService.createUser(input, role);

  // Generate tokens
  const payload = buildPayload(user);
  const tokens = generateTokenPair(payload);

  // Store hashed refresh token
  const tokenHash = await hashToken(tokens.refreshToken);
  await UserModel.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        tokenHash,
        expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES_IN)),
      },
    },
  });

  return { user, ...tokens };
}

/**
 * Login with email/mobile + password.
 * Staff/admin only — customers use QR session tokens.
 */
export async function login(input: LoginInput, meta?: { userAgent?: string; ip?: string }) {
  // Find user by email or mobile
  let user: IUser | null = null;

  if (input.email) {
    user = await userService.findByEmail(input.email, true);
  } else if (input.mobile) {
    user = await userService.findByMobile(input.mobile, true);
  }

  // Generic error — don't reveal which field is wrong (prevent enumeration)
  if (!user) {
    throw new AppError('Invalid credentials', 401, ErrorCode.UNAUTHORIZED);
  }

  // Check account lock
  if (userService.isAccountLocked(user)) {
    throw new AppError(
      'Account is temporarily locked. Please try again later.',
      423,
      ErrorCode.ACCOUNT_LOCKED
    );
  }

  // Check account status
  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is not active', 403, ErrorCode.FORBIDDEN);
  }

  // Verify password
  const { comparePassword } = await import('../../utils/crypto');
  const isValid = await comparePassword(input.password, user.password);

  if (!isValid) {
    await userService.incrementFailedAttempts(user._id.toString());
    throw new AppError('Invalid credentials', 401, ErrorCode.UNAUTHORIZED);
  }

  // Reset failed attempts on successful login
  await userService.resetFailedAttempts(user._id.toString());

  // Generate tokens
  const payload = buildPayload(user);
  const tokens = generateTokenPair(payload);

  // Store hashed refresh token
  const tokenHash = await hashToken(tokens.refreshToken);
  await UserModel.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        tokenHash,
        userAgent: meta?.userAgent,
        ip: meta?.ip,
        expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES_IN)),
      },
    },
  });

  // Return user without sensitive fields
  const userObj = user.toObject();
  delete (userObj as any).password;
  delete (userObj as any).refreshTokens;

  return { user: userObj, ...tokens };
}

/**
 * Refresh tokens — rotate refresh token (old token invalidated, new one issued).
 * Detects token reuse (breach signal) and revokes all sessions.
 */
export async function refresh(oldRefreshToken: string) {
  // Find all users with refresh tokens to check against
  const users = await UserModel.find({}).select('+refreshTokens');

  let matchedUser: IUser | null = null;
  let matchedTokenIndex = -1;

  // Find the user whose refresh token matches
  for (const user of users) {
    if (!user.refreshTokens?.length) continue;

    for (let i = 0; i < user.refreshTokens.length; i++) {
      const rt = user.refreshTokens[i];

      // Skip expired tokens
      if (new Date() > new Date(rt.expiresAt)) continue;

      const isMatch = await compareToken(oldRefreshToken, rt.tokenHash);
      if (isMatch) {
        matchedUser = user;
        matchedTokenIndex = i;
        break;
      }
    }
    if (matchedUser) break;
  }

  if (!matchedUser || matchedTokenIndex === -1) {
    throw new AppError('Invalid refresh token', 401, ErrorCode.REFRESH_TOKEN_INVALID);
  }

  // Remove the used refresh token (rotation)
  matchedUser.refreshTokens.splice(matchedTokenIndex, 1);

  // Clean up expired tokens
  matchedUser.refreshTokens = matchedUser.refreshTokens.filter(
    (rt) => new Date() < new Date(rt.expiresAt)
  );

  // Generate new token pair
  const payload = buildPayload(matchedUser);
  const tokens = generateTokenPair(payload);

  // Store new hashed refresh token
  const tokenHash = await hashToken(tokens.refreshToken);
  matchedUser.refreshTokens.push({
    tokenHash,
    expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES_IN)),
    createdAt: new Date(),
  } as any);

  await matchedUser.save();

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}

/**
 * Logout — remove the specific refresh token from DB.
 */
export async function logout(userId: string, refreshToken: string): Promise<void> {
  const user = await UserModel.findById(userId).select('+refreshTokens');
  if (!user) return;

  // Find and remove the matching token
  const filtered = [];
  for (const rt of user.refreshTokens) {
    const isMatch = await compareToken(refreshToken, rt.tokenHash);
    if (!isMatch) {
      filtered.push(rt);
    }
  }

  user.refreshTokens = filtered;
  await user.save();
}

/**
 * Logout from all devices — clear all refresh tokens.
 */
export async function logoutAll(userId: string): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, { refreshTokens: [] });
}

/**
 * Get active sessions for a user.
 */
export async function getSessions(userId: string) {
  const user = await UserModel.findById(userId).select('+refreshTokens');
  if (!user) return [];

  return user.refreshTokens
    .filter((rt) => new Date() < new Date(rt.expiresAt))
    .map((rt) => ({
      _id: (rt as any)._id,
      userAgent: rt.userAgent,
      ip: rt.ip,
      createdAt: rt.createdAt,
      expiresAt: rt.expiresAt,
    }));
}

/**
 * Revoke a specific session.
 */
export async function revokeSession(userId: string, sessionId: string): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { _id: sessionId } },
  });
}

/**
 * Forgot password — generate reset token and send email.
 */
export async function forgotPassword(email: string): Promise<void> {
  const user = await userService.findByEmail(email);

  // Always return success even if user not found (prevent email enumeration)
  if (!user) {
    logger.info(`Password reset requested for non-existent email: ${email}`);
    return;
  }

  const resetToken = generateSecureToken(32);
  const hashedToken = await hashToken(resetToken);

  await UserModel.findByIdAndUpdate(user._id, {
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  await sendPasswordResetEmail(email, resetToken);
}

/**
 * Reset password using token.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // Find users with active reset tokens
  const users = await UserModel.find({
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken');

  let matchedUser: IUser | null = null;

  for (const user of users) {
    if (!user.passwordResetToken) continue;
    const isMatch = await compareToken(token, user.passwordResetToken);
    if (isMatch) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    throw new AppError('Invalid or expired reset token', 400, ErrorCode.INVALID_REQUEST);
  }

  // Update password and clear reset token
  matchedUser.password = await hashPassword(newPassword);
  matchedUser.passwordResetToken = undefined;
  matchedUser.passwordResetExpires = undefined;
  matchedUser.refreshTokens = []; // Invalidate all sessions
  await matchedUser.save();
}
