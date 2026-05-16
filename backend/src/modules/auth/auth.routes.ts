// src/modules/auth/auth.routes.ts
// Auth route definitions — staff/admin only (customers use session auth)

import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiters';
import { UserRole } from '../../constants/roles';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from './auth.schema';
import * as authController from './auth.controller';

const router = Router();

// Apply strict rate limiting to all auth routes
router.use(authLimiter);

// ── Public auth routes (no auth required) ────────────────────────────
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), authController.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), authController.resetPassword);
router.post('/request-otp', validate({ body: requestOtpSchema }), authController.requestOtp);
router.post('/verify-otp', validate({ body: verifyOtpSchema }), authController.verifyOtp);

// ── Protected auth routes (require auth) ─────────────────────────────
router.get('/me', requireAuth, authController.getMe);
router.post('/logout', requireAuth, authController.logout);
router.get('/sessions', requireAuth, authController.getSessions);
router.delete('/sessions/:sessionId', requireAuth, authController.revokeSession);

// ── Admin-only: Register new staff accounts ──────────────────────────
// Customers no longer register — only admin/super-admin can create staff
router.post(
  '/register',
  requireAuth,
  roleGuard(UserRole.RESTAURANT_ADMIN, UserRole.SUPER_ADMIN),
  validate({ body: registerSchema }),
  authController.register
);

export default router;
