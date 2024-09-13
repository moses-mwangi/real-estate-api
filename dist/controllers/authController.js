"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPasswordForNormalUser = exports.forgotPassword = exports.getMe = exports.protect = exports.loginUser = exports.deleteOtp = exports.registerUser = exports.sendingOtpToEmail = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const sendingOtp_1 = require("../utils/sendingOtp");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, "this-is-my-jwt-secret-moses-muni", {
        expiresIn: "90d",
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(200).json({
        status: "success",
        token,
        user,
    });
};
//// USER REGISTRATION AND EMAIL VERIFICATION BY SENDING OTP TO POSTED EMAIL
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};
const sendingOtpToEmail = async (req, res) => {
    const { email, password } = req.body;
    const otp = generateOTP();
    await otpModel_1.default.create({
        email,
        password,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const message = `Your Email Verification OTP: ${otp}.\n:Please Put Otp in the Otp field for complete Registration`;
    const subject = "Email Verifation OTP";
    await (0, sendingOtp_1.sendOtpEmail)({ email, subject, message });
    res.send({ msg: "OTP sent to email" });
};
exports.sendingOtpToEmail = sendingOtpToEmail;
exports.registerUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, otp } = req.body;
    const otpNumber = parseInt(otp);
    // const record = await OtpModel.findOne({ email, otp: otpNumber });
    const record = await otpModel_1.default.findOne({
        email,
        otp: otpNumber,
        expiresAt: { $gt: Date.now() },
    });
    console.log(record);
    if (!record) {
        return res.status(400).send("Invalid or expired OTP");
    }
    const newOne = { email: record?.email, password: record.password };
    const newUser = await userModel_1.default.create(req.body);
    createSendToken(newUser, 200, res);
    req.user = newUser;
});
exports.deleteOtp = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email } = req.query;
    console.log(email);
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const record = await otpModel_1.default.findOneAndDelete({ email });
    if (!record) {
        return res.status(400).send("Invalid Credentials");
    }
    res.json({ status: "Succesfully deleted", user: record });
});
/////////////////////////END OF USER REGISTRATION AND EMAIL VERIFICATION
exports.loginUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default("Please provide an email and password to log in", 400));
    }
    const user = await userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return next(new appError_1.default("Invalid email or password", 401));
    }
    createSendToken(user, 200, res);
    req.user = user;
});
///////////
const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
};
exports.protect = (0, catchAsync_1.default)(async function (req, res, next) {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default("You are not logged in! Please log in to get access.", 401));
    }
    const decoded = await jwtVerify(token, "this-is-my-jwt-secret-moses-muni");
    const currentUser = await userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default("The user belonging to this token no longer exists.", 401));
    }
    req.user = currentUser;
    next();
});
const getMe = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new appError_1.default("User not found", 404));
        }
        res.status(200).json({ status: "success", user });
    }
    catch (err) {
        res.status(400).json({ status: "Fail", err });
        console.log(err);
    }
};
exports.getMe = getMe;
exports.forgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default("There is no user with that email address.", 404));
    }
    // 2) Generate a random reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    console.log(resetToken);
    user.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });
    const resetURL = `https://real-estate-dashboard-kappa.vercel.app/resetPassword?token=${resetToken}`;
    console.log("ResetUrl:", resetURL);
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await (0, email_1.sendEmail)({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
            resetToken,
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default("There was an error sending the email. Try again later!", 500));
    }
});
exports.forgotPasswordForNormalUser = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default("There is no user with that email address.", 404));
    }
    // 2) Generate a random reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    console.log(resetToken);
    user.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });
    const resetURL = `http://127.0.0.1:3000?token=${resetToken}`;
    console.log("ResetUrl:", resetURL);
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await (0, email_1.sendEmail)({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
            resetToken,
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default("There was an error sending the email. Try again later!", 500));
    }
});
exports.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: Date.now() },
    });
    // 2) If token has not expired and there is a user, set the new password
    if (!user) {
        return next(new appError_1.default("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    await user.save();
    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
});
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findById(req.user._id).select("+password");
    if (!user) {
        return next(new appError_1.default("No user with that ID found", 401));
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(req.body.passwordCurrent, user.password);
    if (!isPasswordCorrect) {
        return next(new appError_1.default("Your current password is incorrect.", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
});
