import type { Request, Response } from 'express';
import { ok } from '../../utils/responses';
import {
  createForgotPasswordResponse,
  getAuthMe,
  listUserSessions,
  loginAuthUser,
  logoutAuthSession,
  refreshAuthSession,
  registerAuthUser,
  requestOtp,
  resetPassword,
  revokeSession,
  verifyOtpAndLogin,
} from './auth.service';
import { getDeviceLabel } from './auth.utils';

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
}

export function registerController(req: Request, res: Response): void {
  const result = registerAuthUser(req.body);
  setRefreshCookie(res, result.refreshToken);
  ok(res, result, 201);
}

export function loginController(req: Request, res: Response): void {
  const result = loginAuthUser({
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    deviceLabel: getDeviceLabel(req),
  });
  setRefreshCookie(res, result.refreshToken);
  ok(res, result);
}

export function requestOtpController(req: Request, res: Response): void {
  const target = req.body.email ?? req.body.mobile;
  ok(res, requestOtp(target));
}

export function verifyOtpController(req: Request, res: Response): void {
  const result = verifyOtpAndLogin({
    email: req.body.email,
    mobile: req.body.mobile,
    otp: req.body.otp,
    deviceLabel: getDeviceLabel(req),
  });
  setRefreshCookie(res, result.refreshToken);
  ok(res, result);
}

export function refreshController(req: Request, res: Response): void {
  const refreshToken =
    req.body.refreshToken || req.header('x-refresh-token') || req.header('authorization')?.replace('Bearer ', '');
  const result = refreshAuthSession(refreshToken ?? '');
  setRefreshCookie(res, result.refreshToken);
  ok(res, result);
}

export function logoutController(req: Request, res: Response): void {
  const refreshToken =
    req.body?.refreshToken || req.header('x-refresh-token') || req.header('authorization')?.replace('Bearer ', '');
  res.clearCookie('refreshToken');
  ok(res, logoutAuthSession(refreshToken));
}

export function meController(req: Request, res: Response): void {
  ok(res, getAuthMe(req.user!.id));
}

export function forgotPasswordController(req: Request, res: Response): void {
  ok(res, createForgotPasswordResponse(req.body.email));
}

export function resetPasswordController(req: Request, res: Response): void {
  ok(res, resetPassword(req.body.email, req.body.newPassword));
}

export function listSessionsController(req: Request, res: Response): void {
  ok(res, listUserSessions(req.user!.id));
}

export function revokeSessionController(req: Request, res: Response): void {
  ok(res, revokeSession(req.user!.id, req.params.sessionId));
}
