"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: { type: Number, required: true },
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
    phone: {
        type: Number,
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
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
// generateResetPasswordToken();
UserSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
