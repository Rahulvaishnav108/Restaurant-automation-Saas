// src/services/mail.service.ts
// Nodemailer wrapper for sending emails

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create the email transporter.
 * Only initializes if SMTP config is present.
 */
function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn('SMTP not configured — email sending disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email. Silently logs and returns false if SMTP is not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transport = getTransporter();

  if (!transport) {
    logger.info(`📧 Email not sent (SMTP not configured): ${options.subject} → ${options.to}`);
    // In development, log the email content for debugging
    if (env.NODE_ENV === 'development') {
      logger.debug('Email content:', { to: options.to, subject: options.subject });
    }
    return false;
  }

  try {
    await transport.sendMail({
      from: env.SMTP_FROM || 'noreply@restaurant-saas.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info(`📧 Email sent: ${options.subject} → ${options.to}`);
    return true;
  } catch (error) {
    logger.error('Failed to send email:', { error, to: options.to, subject: options.subject });
    return false;
  }
}

/**
 * Send OTP email.
 */
export async function sendOTPEmail(to: string, otp: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'Your verification code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verification Code</h2>
        <p>Your OTP is:</p>
        <h1 style="font-size: 36px; letter-spacing: 8px; color: #333;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

/**
 * Send password reset email.
 */
export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
  return sendEmail({
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p style="margin-top: 16px;">This link expires in 1 hour.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}
