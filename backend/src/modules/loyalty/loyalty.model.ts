import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILoyaltyRule extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  pointsPerVisit: number;
  silverThreshold: number;
  goldThreshold: number;
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const loyaltyRuleSchema = new Schema<ILoyaltyRule>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    pointsPerVisit: { type: Number, required: true, min: 1 },
    silverThreshold: { type: Number, required: true, min: 1 },
    goldThreshold: { type: Number, required: true, min: 1 },
    notes: { type: String, trim: true, default: '' },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'loyaltyRules',
  },
);

loyaltyRuleSchema.index({ restaurantId: 1, active: 1, updatedAt: -1 });

export const LoyaltyRuleModel = mongoose.model<ILoyaltyRule>('LoyaltyRule', loyaltyRuleSchema);
