import mongoose, { Document, Schema, Types } from 'mongoose';
import { ReservationStatus } from '../../constants/statuses';

export interface IReservation extends Document {
  restaurantId: Types.ObjectId;
  customerName: string;
  guests: number;
  date: string;
  slot: string;
  status: ReservationStatus;
  tableId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    date: { type: String, required: true, trim: true },
    slot: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
    },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table', default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'reservations',
  },
);

reservationSchema.index({ restaurantId: 1, date: 1, slot: 1 });

export const ReservationModel = mongoose.model<IReservation>('Reservation', reservationSchema);
