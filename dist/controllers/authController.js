"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.getMe = exports.protect = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
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
exports.registerUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const newUser = await userModel_1.default.create(req.body);
    createSendToken(newUser, 200, res);
    req.user = newUser;
});
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
    console.log("Token: ", token);
    const decoded = await jwtVerify(token, "this-is-my-jwt-secret-moses-muni");
    console.log("Decoded JWT: ", decoded);
    const currentUser = await userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default("The user belonging to this token no longer exists.", 401));
    }
    // console.log("Current User: ", currentUser);
    req.user = currentUser;
    next();
});
const getMe = (req, res, next) => {
    try {
        const user = req.user;
        // console.log("Current User: ", user);
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
exports.forgotPassword = (0, catchAsync_1.default)(async function (req, res, next) {
    res.status(200).json({
        status: "success",
        data: {
            data: "forgotpassword",
        },
    });
});
