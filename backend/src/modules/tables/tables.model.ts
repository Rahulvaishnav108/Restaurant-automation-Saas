// src/modules/tables/tables.model.ts
// Table entity — physical dining table with full lifecycle management

import mongoose, { Schema, Document, Types } from 'mongoose';
import { TableStatus } from '../../constants/statuses';

export interface ITable extends Document {
  restaurantId: Types.ObjectId;
  tableNumber: string;
  capacity: number;
  floor: number;
  section: string;
  assignedStaffId?: Types.ObjectId | null;
  status: TableStatus;
  qrCode: string;
  isActive: boolean;
  currentSessionId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/** Valid state transitions for the table lifecycle */
export const TABLE_TRANSITIONS: Record<TableStatus, TableStatus[]> = {
  [TableStatus.AVAILABLE]: [TableStatus.RESERVED, TableStatus.OCCUPIED],
  [TableStatus.RESERVED]: [TableStatus.AVAILABLE, TableStatus.OCCUPIED],
  [TableStatus.OCCUPIED]: [TableStatus.PAYMENT_PENDING],
  [TableStatus.PAYMENT_PENDING]: [TableStatus.NEEDS_CLEANING],
  [TableStatus.NEEDS_CLEANING]: [TableStatus.CLEANING_IN_PROGRESS],
  [TableStatus.CLEANING_IN_PROGRESS]: [TableStatus.AVAILABLE],
};

const tableSchema = new Schema<ITable>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Table capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [50, 'Capacity cannot exceed 50'],
    },
    floor: {
      type: Number,
      default: 1,
      min: 0,
    },
    section: {
      type: String,
      default: 'Main',
      trim: true,
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(TableStatus),
      default: TableStatus.AVAILABLE,
    },
    qrCode: {
      type: String,
      required: [true, 'QR code identifier is required'],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    currentSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'TableSession',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'tables',
  }
);

// Compound unique index: one table number per restaurant
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ status: 1 });
tableSchema.index({ restaurantId: 1, floor: 1, section: 1 });

/**
 * Check if a status transition is valid.
 */
tableSchema.methods.canTransitionTo = function (newStatus: TableStatus): boolean {
  const allowed = TABLE_TRANSITIONS[this.status as TableStatus];
  return allowed ? allowed.includes(newStatus) : false;
};

export const TableModel = mongoose.model<ITable>('Table', tableSchema);
