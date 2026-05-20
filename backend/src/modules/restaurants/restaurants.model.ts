import mongoose, { Document, Schema } from 'mongoose';
import { RestaurantStatus } from '../../constants/statuses';

type RestaurantSettings = {
  currency: string;
  taxRate: number;
  serviceChargeEnabled: boolean;
  sessionDurationMinutes: number;
};

export interface IRestaurant extends Document {
  slug: string;
  name: string;
  status: RestaurantStatus;
  plan: string;
  cuisine: string;
  city: string;
  rating: number;
  settings: RestaurantSettings;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSettingsSchema = new Schema<RestaurantSettings>(
  {
    currency: { type: String, default: 'INR' },
    taxRate: { type: Number, default: 0.05, min: 0 },
    serviceChargeEnabled: { type: Boolean, default: true },
    sessionDurationMinutes: { type: Number, default: 90, min: 15 },
  },
  { _id: false },
);

const restaurantSchema = new Schema<IRestaurant>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(RestaurantStatus),
      default: RestaurantStatus.ACTIVE,
    },
    plan: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    settings: {
      type: restaurantSettingsSchema,
      default: () => ({
        currency: 'INR',
        taxRate: 0.05,
        serviceChargeEnabled: true,
        sessionDurationMinutes: 90,
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'restaurants',
  },
);

restaurantSchema.index({ status: 1 });
restaurantSchema.index({ plan: 1 });

export const RestaurantModel = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
