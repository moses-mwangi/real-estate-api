"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.route("/verifyOtp").post(authController_1.sendingOtpToEmail);
router.route("/deleteOtp").delete(authController_1.deleteOtp);
router.route("/register").post(authController_1.registerUser);
router.route("/login").post(authController_1.loginUser);
router.route("/forgotPassword").post(authController_1.forgotPassword);
router.route("/resetPassword/:token").patch(authController_1.resetPassword);
router.route("/updateMyPassword").patch(authController_1.updatePassword);
router.get("/me", authController_1.protect, authController_1.getMe);
router.route("/updatePassword").patch(authController_1.protect, authController_1.updatePassword);
// router.route("/updatePassword").patch(updatePassword);
exports.default = router;
