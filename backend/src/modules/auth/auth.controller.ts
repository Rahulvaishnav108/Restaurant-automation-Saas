import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { COOKIE_OPTIONS } from '../../utils/constants';
import { parseExpiry } from '../../utils/date';
import { sendSuccess } from '../../utils/response';
import { ErrorCode } from '../../constants/errors';
import { sendOTPEmail } from '../../services/mail.service';
import * as otpService from '../../services/otp.service';
import * as authService from './auth.service';
import { getMe } from '../users/users.controller';
import { logAuditAction } from '../auditLogs/auditLogs.service';
import { logger } from '../../config/logger';


function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    domain: env.COOKIE_DOMAIN,
    maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN),
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    ...COOKIE_OPTIONS,
    domain: env.COOKIE_DOMAIN,
  });
}

export { getMe };

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body, req.user);

  setRefreshCookie(res, result.refreshToken);

  logAuditAction({
    req,
    actorId: result.user._id,
    actorRole: result.user.role,
    restaurantId: result.user.restaurantId,
    entityType: 'auth',
    entityId: result.user._id.toString(),
    action: 'REGISTER',
    metadata: { email: result.user.email },
  });

  sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
    201,
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body, {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  setRefreshCookie(res, result.refreshToken);

  logAuditAction({
    req,
    actorId: result.user._id,
    actorRole: result.user.role,
    restaurantId: result.user.restaurantId,
    entityType: 'auth',
    entityId: result.user._id.toString(),
    action: 'LOGIN',
    metadata: { email: result.user.email },
  });

  sendSuccess(res, {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const oldToken = req.cookies?.[env.REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (!oldToken) {
    throw new AppError('Refresh token not found', 401, ErrorCode.REFRESH_TOKEN_INVALID);
  }

  const result = await authService.refresh(oldToken);

  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (req.user && refreshToken) {
    await authService.logout(req.user._id, refreshToken);
    logAuditAction({
      req,
      actorId: req.user._id,
      actorRole: req.user.role,
      restaurantId: req.user.restaurantId,
      entityType: 'auth',
      entityId: req.user._id.toString(),
      action: 'LOGOUT',
    });
  }

  clearRefreshCookie(res);

  sendSuccess(res, { message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const { UserModel } = await import('../users/users.model');
  const { UserRole } = await import('../../constants/roles');
  const user = await UserModel.findOne({ email });

  if (!user || user.role === UserRole.CUSTOMER) {
    // Audit log the attempt on non-existent account
    logAuditAction({
      req,
      entityType: 'auth',
      entityId: 'unknown',
      action: 'PASSWORD_RESET_REQUEST_FAILED',
      metadata: { identifier: email, type: 'email', reason: 'User not found or not eligible for password reset' },
    });

    sendSuccess(res, {
      otpSent: true,
    });
    return;
  }

  // Generate 5-minute OTP
  const otp = await otpService.createOTP(email, 'email');
  await sendOTPEmail(email, otp);

  logAuditAction({
    req,
    actorId: user._id,
    actorRole: user.role,
    restaurantId: user.restaurantId,
    entityType: 'auth',
    entityId: user._id.toString(),
    action: 'PASSWORD_RESET_OTP_REQUESTED',
    metadata: { identifier: email, type: 'email' },
  });

  sendSuccess(res, {
    otpSent: true,
  });
});

export const verifyResetOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // 1. Verify OTP
  await otpService.verifyOTP(email, 'email', otp);

  const { UserModel } = await import('../users/users.model');
  const { generateSecureToken, hashToken } = await import('../../utils/crypto');

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError('User not found', 404, ErrorCode.NOT_FOUND);
  }

  // Generate a short-lived password reset token (10 minutes)
  const resetToken = generateSecureToken(32);
  const hashedToken = await hashToken(resetToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  logAuditAction({
    req,
    actorId: user._id,
    actorRole: user.role,
    restaurantId: user.restaurantId,
    entityType: 'auth',
    entityId: user._id.toString(),
    action: 'PASSWORD_RESET_OTP_VERIFIED',
    metadata: { identifier: email, type: 'email' },
  });

  sendSuccess(res, {
    resetToken,
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  const { UserModel } = await import('../users/users.model');
  const { compareToken, hashPassword } = await import('../../utils/crypto');

  const users = await UserModel.find({
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken');

  let matchedUser = null;

  for (const user of users) {
    if (user.passwordResetToken && (await compareToken(resetToken, user.passwordResetToken))) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    throw new AppError('Invalid or expired reset token', 400, ErrorCode.INVALID_REQUEST);
  }

  matchedUser.password = await hashPassword(newPassword);
  matchedUser.passwordResetToken = undefined;
  matchedUser.passwordResetExpires = undefined;
  matchedUser.refreshTokens = []; // Invalidate all active sessions/tokens
  await matchedUser.save();

  logAuditAction({
    req,
    actorId: matchedUser._id,
    actorRole: matchedUser.role,
    restaurantId: matchedUser.restaurantId,
    entityType: 'auth',
    entityId: matchedUser._id.toString(),
    action: 'PASSWORD_RESET_SUCCESSFUL',
    metadata: { email: matchedUser.email },
  });

  sendSuccess(res, {
  });
});

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile } = req.body;

  await otpService.createOTP(mobile, 'mobile');

  sendSuccess(res, { otpSent: true });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { mobile, otp, name } = req.body;

  // 1. Verify the OTP
  await otpService.verifyOTP(mobile, 'mobile', otp);

  const { UserModel } = await import('../users/users.model');
  const { generateTokenPair } = await import('../../services/jwt.service');
  const { hashToken } = await import('../../utils/crypto');
  const { parseExpiry } = await import('../../utils/date');
  const { UserRole } = await import('../../constants/roles');

  let user = await UserModel.findOne({ mobile });

  if (!user) {
    const customerName = name || 'Guest Customer';
    user = await UserModel.create({
      name: customerName,
      mobile,
      role: UserRole.CUSTOMER,
      isMobileVerified: true,
    });

    logger.info(`Customer registered dynamically via OTP: ${mobile}`);
  } else {
    if (user.role !== UserRole.CUSTOMER) {
      throw new AppError('OTP login is only available for customer accounts', 403, ErrorCode.FORBIDDEN);
    }

    user.isMobileVerified = true;
    if (name) {
      user.name = name;
    }
    await user.save();
  }

  // Log in the user and issue tokens
  const payload = {
    _id: user._id.toString(),
    email: user.email ?? '',
    role: user.role,
    ...(user.restaurantId && { restaurantId: user.restaurantId.toString() }),
  };

  const tokens = generateTokenPair(payload);
  const tokenHash = await hashToken(tokens.refreshToken);

  await UserModel.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        tokenHash,
        expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRES_IN)),
      },
    },
  });

  setRefreshCookie(res, tokens.refreshToken);

  logAuditAction({
    req,
    actorId: user._id,
    actorRole: user.role,
    restaurantId: user.restaurantId,
    entityType: 'auth',
    entityId: user._id.toString(),
    action: 'OTP_LOGIN',
    metadata: { identifier: mobile, type: 'mobile' },
  });

  sendSuccess(res, {
    customerId: user._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await authService.getSessions(req.user!._id);
  sendSuccess(res, { sessions });
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  await authService.revokeSession(req.user!._id, req.params.sessionId);
  sendSuccess(res, { message: 'Session revoked' });
});
