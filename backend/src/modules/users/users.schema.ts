// src/modules/users/users.schema.ts
// Zod validation schemas for user-related requests

import { z } from 'zod';
import { UserRole } from '../../constants/roles';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits').max(15).trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  role: z.nativeEnum(UserRole).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
  mobile: z.string().min(10).max(15).trim().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(
  (data) => data.email || data.mobile,
  { message: 'Either email or mobile is required', path: ['email'] }
);

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export const requestOtpSchema = z.object({
  email: z.string().email().toLowerCase().trim().optional(),
  mobile: z.string().min(10).max(15).trim().optional(),
}).refine(
  (data) => data.email || data.mobile,
  { message: 'Either email or mobile is required', path: ['email'] }
);

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase().trim().optional(),
  mobile: z.string().min(10).max(15).trim().optional(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
}).refine(
  (data) => data.email || data.mobile,
  { message: 'Either email or mobile is required', path: ['email'] }
);

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  mobile: z.string().min(10).max(15).trim().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export const deleteAccountSchema = z.object({
  confirmText: z.literal('DELETE MY ACCOUNT', {
    errorMap: () => ({ message: 'Please type "DELETE MY ACCOUNT" to confirm' }),
  }),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
