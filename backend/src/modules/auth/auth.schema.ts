import { z } from 'zod';
import { roles } from '../../constants/roles';

export const registerRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    mobile: z.string().trim().min(10),
    password: z.string().min(8),
    role: z
      .enum([
        roles.customer,
        roles.serviceStaff,
        roles.kitchenStaff,
        roles.cleaningStaff,
        roles.restaurantAdmin,
        roles.superAdmin,
      ])
      .default(roles.customer),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginRequestSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      mobile: z.string().trim().min(10).optional(),
      password: z.string().min(8),
      deviceLabel: z.string().trim().min(2).optional(),
    })
    .refine((value) => Boolean(value.email || value.mobile), {
      message: 'Email or mobile is required',
      path: ['email'],
    }),
  params: z.object({}),
  query: z.object({}),
});

export const requestOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      mobile: z.string().trim().min(10).optional(),
    })
    .refine((value) => Boolean(value.email || value.mobile), {
      message: 'Email or mobile is required',
      path: ['email'],
    }),
  params: z.object({}),
  query: z.object({}),
});

export const verifyOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      mobile: z.string().trim().min(10).optional(),
      otp: z.string().length(6),
      deviceLabel: z.string().trim().min(2).optional(),
    })
    .refine((value) => Boolean(value.email || value.mobile), {
      message: 'Email or mobile is required',
      path: ['email'],
    }),
  params: z.object({}),
  query: z.object({}),
});

export const refreshRequestSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    newPassword: z.string().min(8),
  }),
  params: z.object({}),
  query: z.object({}),
});
