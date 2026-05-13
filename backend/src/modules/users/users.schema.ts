// src/modules/users/users.schema.ts

import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  SERVICE_STAFF = "SERVICE_STAFF",
  KITCHEN_STAFF = "KITCHEN_STAFF",
  CLEANING_STAFF = "CLEANING_STAFF",
  RESTAURANT_ADMIN = "RESTAURANT_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  BLOCKED = "BLOCKED",
}

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;

  role: UserRole;
  status: UserStatus;

  restaurantId?: mongoose.Types.ObjectId;

  isEmailVerified: boolean;
  isMobileVerified: boolean;

  refreshToken?: string | null;

  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ role: 1 });
userSchema.index({ restaurantId: 1 });

export const UserModel = mongoose.model<IUser>("User", userSchema);