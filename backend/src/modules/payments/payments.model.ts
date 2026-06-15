import mongoose, { Document, Schema, Types } from 'mongoose';
import { PaymentStatus } from '../../constants/statuses';

export interface IPayment extends Document {
  restaurantId: Types.ObjectId;
  billId?: Types.ObjectId | null;
  orderId: Types.ObjectId;
  sessionId?: Types.ObjectId | null;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  providerPaymentId?: string | null;
  status: PaymentStatus;
  verifiedAt?: Date | null;
  failureReason?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    billId: { type: Schema.Types.ObjectId, ref: 'Bill', default: null, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'TableSession', default: null },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true, uppercase: true },
    method: { type: String, required: true, trim: true },
    provider: { type: String, default: 'mock', trim: true },
    providerPaymentId: { type: String, default: null, trim: true, index: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    verifiedAt: { type: Date, default: null },
    failureReason: { type: String, default: null, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'payments',
  },
);

paymentSchema.index({ restaurantId: 1, sessionId: 1, createdAt: -1 });
paymentSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ restaurantId: 1, method: 1, createdAt: -1 });

export const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);
