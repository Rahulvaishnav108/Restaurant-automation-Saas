// src/modules/auth/auth.schema.ts
// Re-export user schemas that are used in auth routes
// Auth-specific schemas live here too

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  requestOtpSchema,
  verifyOtpSchema,
} from '../users/users.schema';

export type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RequestOtpInput,
  VerifyOtpInput,
} from '../users/users.schema';
