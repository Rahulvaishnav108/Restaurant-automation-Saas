import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformPlan extends Document {
  name: string;
  priceMonthly: number;
  tenantLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const platformPlanSchema = new Schema<IPlatformPlan>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    priceMonthly: { type: Number, required: true, min: 0 },
    tenantLimit: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'plans',
  },
);

export interface IFeatureFlag extends Document {
  key: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const featureFlagSchema = new Schema<IFeatureFlag>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    enabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'featureFlags',
  },
);

export const PlatformPlanModel = mongoose.model<IPlatformPlan>('PlatformPlan', platformPlanSchema);
export const FeatureFlagModel = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
