import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: string;
  photo: string;
  date: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password are not the same",
    },
  },
  photo: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin", "agent"],
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// generateResetPasswordToken();
UserSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
