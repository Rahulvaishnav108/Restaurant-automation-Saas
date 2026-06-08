import mongoose, { Document, Schema } from 'mongoose';
import logger from '../config/logger';
import { ErrorCode } from '../constants/errors';
import { AppError } from '../utils/AppError';
import { comparePassword, generateOTP, hashPassword } from '../utils/crypto';

interface IOtp extends Document {
  identifier: string;
  type: 'email' | 'mobile';
  otpHash: string;
  attempts: number;
  blockedUntil?: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  identifier: { type: String, required: true },
  type: { type: String, enum: ['email', 'mobile'], required: true },
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  createdAt: { type: Date, default: Date.now },
});

otpSchema.index({ identifier: 1, type: 1 });

const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const OTP_COOLDOWN_SECONDS = 60;
const OTP_BLOCK_MINUTES = 15;

export async function createOTP(identifier: string, type: 'email' | 'mobile'): Promise<string> {
  const now = new Date();
  const existing = await OtpModel.findOne({ identifier, type }).sort({ createdAt: -1 });

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    throw new AppError(
      'OTP requests are temporarily blocked. Please try again later.',
      403,
      ErrorCode.FORBIDDEN,
    );
  }

  if (existing && existing.createdAt >= new Date(Date.now() - OTP_COOLDOWN_SECONDS * 1000)) {
    throw new AppError('Please wait before requesting another OTP', 429, ErrorCode.RATE_LIMIT_EXCEEDED);
  }

  await OtpModel.deleteMany({ identifier, type });

  const plainOtp = generateOTP(6);
  const otpHash = await hashPassword(plainOtp);

  await OtpModel.create({
    identifier,
    type,
    otpHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  logger.info(`OTP generated for ${type}: ${identifier}`);

  return plainOtp;
}

export async function verifyOTP(identifier: string, type: 'email' | 'mobile', otp: string): Promise<boolean> {
  const record = await OtpModel.findOne({ identifier, type }).sort({ createdAt: -1 });

  if (!record) {
    throw new AppError('OTP not found or expired', 400, ErrorCode.OTP_EXPIRED);
  }

  if (record.blockedUntil && record.blockedUntil > new Date()) {
    throw new AppError('Too many OTP attempts. Please try again later.', 403, ErrorCode.FORBIDDEN);
  }

  if (record.expiresAt <= new Date()) {
    await OtpModel.deleteOne({ _id: record._id });
    throw new AppError('OTP expired. Please request a new OTP', 400, ErrorCode.OTP_EXPIRED);
  }

  const isValid = await comparePassword(otp, record.otpHash);

  if (!isValid) {
    record.attempts += 1;

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      record.blockedUntil = new Date(Date.now() + OTP_BLOCK_MINUTES * 60 * 1000);
      await record.save();
      throw new AppError(
        'Too many invalid OTP attempts. Please try again later.',
        429,
        ErrorCode.OTP_ATTEMPTS_EXCEEDED,
      );
    }

    await record.save();
    throw new AppError(`Invalid OTP. ${MAX_OTP_ATTEMPTS - record.attempts} attempts remaining`, 400, ErrorCode.INVALID_OTP);
  }

  await OtpModel.deleteOne({ _id: record._id });

  return true;
}
