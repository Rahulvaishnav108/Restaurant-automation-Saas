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
import { UserModel } from '../users/users.model';

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
  }

  clearRefreshCookie(res);

  sendSuccess(res, { message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);

  sendSuccess(res, {
    message: 'If an account with that email exists, a password reset link has been sent.',
    ...(result.resetToken ? { resetToken: result.resetToken } : {}),
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);

  sendSuccess(res, {
    message: 'Password reset successful. Please log in with your new password.',
  });
});

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, mobile } = req.body;
  const identifier = email || mobile;
  const type = email ? 'email' : 'mobile';

  const otp = await otpService.createOTP(identifier, type as 'email' | 'mobile');

  if (type === 'email') {
    await sendOTPEmail(identifier, otp);
  }

  sendSuccess(res, {
    message: `OTP sent to your ${type}`,
    ...(!env.isProduction && { otp }),
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, mobile, otp } = req.body;
  const identifier = email || mobile;
  const type = email ? 'email' : 'mobile';

  await otpService.verifyOTP(identifier, type as 'email' | 'mobile', otp);

  
  const updateField = type === 'email' ? { isEmailVerified: true } : { isMobileVerified: true };

  await UserModel.findOneAndUpdate(type === 'email' ? { email: identifier } : { mobile: identifier }, updateField);

  sendSuccess(res, { message: `${type} verified successfully`, verified: true });
});

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await authService.getSessions(req.user!._id);
  sendSuccess(res, { sessions });
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  await authService.revokeSession(req.user!._id, req.params.sessionId);
  sendSuccess(res, { message: 'Session revoked' });
});
