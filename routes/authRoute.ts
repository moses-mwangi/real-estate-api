import { Router } from "express";
import passport from "passport";
import { getUsers } from "../controllers/userController";
import {
  loginUser,
  registerUser,
  getMe,
  protect,
} from "../controllers/authController";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.get("/me", protect, getMe);

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback route

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Successful authentication, redirect home.

    res.redirect("/");
  }
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: true, msg: "Login Failed" });
});

router.get("/logout", (req, res, done) => {
  req.logout(done);
  res.redirect("http://localhost:3000");
});

export default router;
