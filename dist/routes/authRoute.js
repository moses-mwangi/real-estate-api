"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.route("/register").post(authController_1.registerUser);
router.route("/login").post(authController_1.loginUser);
router.get("/me", authController_1.protect, authController_1.getMe);
// Google OAuth route
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
// Google OAuth callback route
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login/failed" }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({ error: true, msg: "Login Failed" });
});
router.get("/logout", (req, res, done) => {
    req.logout(done);
    res.redirect("http://localhost:3000");
});
exports.default = router;
