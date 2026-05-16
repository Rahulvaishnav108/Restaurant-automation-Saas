// src/services/otp.service.ts
// OTP generation, storage, and verification

import mongoose, { Schema, Document } from 'mongoose';
import { generateOTP } from '../utils/crypto';
import { hashPassword, comparePassword } from '../utils/crypto';
import { AppError } from '../utils/AppError';
import { ErrorCode } from '../constants/errors';
import logger from '../config/logger';

// ── OTP Model ─────────────────────────────────────────────────────────

interface IOtp extends Document {
  identifier: string;  // email or mobile
  type: 'email' | 'mobile';
  otpHash: string;     // bcrypt-hashed OTP
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  identifier: { type: String, required: true },
  type: { type: String, enum: ['email', 'mobile'], required: true },
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL auto-delete
  createdAt: { type: Date, default: Date.now },
});

// Compound index for lookup
otpSchema.index({ identifier: 1, type: 1 });

const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);

// ── OTP Service ───────────────────────────────────────────────────────

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const OTP_COOLDOWN_SECONDS = 60;

/**
 * Generate and store a new OTP for a given identifier (email/mobile).
 * Returns the plain OTP for delivery (email/SMS).
 */
export async function createOTP(identifier: string, type: 'email' | 'mobile'): Promise<string> {
  // Check cooldown — prevent OTP spam
  const recent = await OtpModel.findOne({
    identifier,
    type,
    createdAt: { $gte: new Date(Date.now() - OTP_COOLDOWN_SECONDS * 1000) },
  });

  if (recent) {
    throw new AppError(
      'Please wait before requesting another OTP',
      429,
      ErrorCode.RATE_LIMIT_EXCEEDED
    );
  }

  // Delete any existing OTPs for this identifier
  await OtpModel.deleteMany({ identifier, type });

  // Generate and hash OTP
  const plainOtp = generateOTP(6);
  const otpHash = await hashPassword(plainOtp);

  // Store hashed OTP with TTL
  await OtpModel.create({
    identifier,
    type,
    otpHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  logger.info(`OTP generated for ${type}: ${identifier}`);

  return plainOtp;
}

/**
 * Verify an OTP. Returns true if valid, throws on failure.
 * Rate-limits verification attempts.
 */
export async function verifyOTP(
  identifier: string,
  type: 'email' | 'mobile',
  otp: string
): Promise<boolean> {
  const record = await OtpModel.findOne({ identifier, type });

  if (!record) {
    throw new AppError('OTP not found or expired', 400, ErrorCode.INVALID_REQUEST);
  }

  // Check attempts
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await OtpModel.deleteOne({ _id: record._id });
    throw new AppError('Too many attempts. Please request a new OTP', 429, ErrorCode.RATE_LIMIT_EXCEEDED);
  }

  // Increment attempts
  record.attempts += 1;
  await record.save();

  // Compare OTP
  const isValid = await comparePassword(otp, record.otpHash);

  if (!isValid) {
    throw new AppError(
      `Invalid OTP. ${MAX_OTP_ATTEMPTS - record.attempts} attempts remaining`,
      400,
      ErrorCode.INVALID_REQUEST
    );
  }

  // Valid — delete OTP record (single use)
  await OtpModel.deleteOne({ _id: record._id });

  return true;
}
