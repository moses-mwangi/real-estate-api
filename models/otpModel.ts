import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  expiresAt: Date;
  otp: number;
}

const OtpSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
});

const OtpModel: Model<IUser> = model<IUser>("OtpModel", OtpSchema);
export default OtpModel;
