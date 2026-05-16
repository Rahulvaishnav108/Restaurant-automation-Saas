import mongoose, { Document, Schema, Types } from 'mongoose';
import { PaymentStatus } from '../../constants/statuses';

export interface IPayment extends Document {
  restaurantId: Types.ObjectId;
  orderId: Types.ObjectId;
  sessionId?: Types.ObjectId | null;
  amount: number;
  method: string;
  status: PaymentStatus;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'TableSession', default: null },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    verifiedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'payments',
  },
);

export const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);
