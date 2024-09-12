"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
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
const OtpModel = (0, mongoose_1.model)("OtpModel", OtpSchema);
exports.default = OtpModel;
