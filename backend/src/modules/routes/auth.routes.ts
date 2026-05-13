import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  forgotPasswordController,
  listSessionsController,
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  requestOtpController,
  resetPasswordController,
  revokeSessionController,
  verifyOtpController,
} from '../auth/auth.controller';
import {
  forgotPasswordSchema,
  loginRequestSchema,
  refreshRequestSchema,
  registerRequestSchema,
  requestOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '../auth/auth.schema';

export const authRouter = Router();

authRouter.post('/register', validate(registerRequestSchema), registerController);
authRouter.post('/login', validate(loginRequestSchema), loginController);
authRouter.post('/request-otp', validate(requestOtpSchema), requestOtpController);
authRouter.post('/verify-otp', validate(verifyOtpSchema), verifyOtpController);
authRouter.post('/refresh', validate(refreshRequestSchema), refreshController);
authRouter.post('/logout', logoutController);
authRouter.get('/me', requireAuth, meController);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);
authRouter.get('/sessions', requireAuth, listSessionsController);
authRouter.delete('/sessions/:sessionId', requireAuth, revokeSessionController);
