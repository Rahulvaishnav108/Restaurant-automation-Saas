import mongoose, { Document, Schema, Types } from 'mongoose';
import { ReservationStatus } from '../../constants/statuses';

export interface IReservation extends Document {
  restaurantId: Types.ObjectId;
  customerProfileId?: Types.ObjectId | null;
  customerName: string;
  mobile: string;
  guests: number;
  date: string;
  slot: string;
  status: ReservationStatus;
  tableId?: Types.ObjectId | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customerProfileId: { type: Schema.Types.ObjectId, ref: 'CustomerProfile', default: null, index: true },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    date: { type: String, required: true, trim: true },
    slot: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
    },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table', default: null },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'reservations',
  },
);

reservationSchema.index({ restaurantId: 1, date: 1, slot: 1 });
reservationSchema.index({ restaurantId: 1, status: 1 });
reservationSchema.index({ restaurantId: 1, mobile: 1 });

export const ReservationModel = mongoose.model<IReservation>('Reservation', reservationSchema);
