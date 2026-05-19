import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventoryItem extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  stock: number;
  unit: string;
  threshold: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema = new Schema<IInventoryItem>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, required: true, trim: true },
    threshold: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'inventoryItems',
  },
);

inventoryItemSchema.index({ restaurantId: 1, active: 1 });
inventoryItemSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export const InventoryItemModel = mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);
