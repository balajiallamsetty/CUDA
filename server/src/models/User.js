import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE_VALUES, ROLES, CUSTOMER_TYPE_VALUES, CUSTOMER_TYPES } from '@vignak/shared';

const notificationPreferencesSchema = new mongoose.Schema(
  {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.USER,
      index: true,
    },
    customerType: {
      type: String,
      enum: CUSTOMER_TYPE_VALUES,
      default: CUSTOMER_TYPES.STUDENT,
      index: true,
    },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({ email: true, inApp: true }),
    },
    phone: { type: String, trim: true, maxlength: 30 },
    institution: { type: String, trim: true, maxlength: 160 },
    course: { type: String, trim: true, maxlength: 120 },
    year: { type: String, trim: true, maxlength: 40 },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
    emailVerifiedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    customerType: this.customerType || CUSTOMER_TYPES.STUDENT,
    notificationPreferences: this.notificationPreferences || { email: true, inApp: true },
    phone: this.phone || '',
    institution: this.institution || '',
    course: this.course || '',
    year: this.year || '',
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    emailVerifiedAt: this.emailVerifiedAt || null,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
