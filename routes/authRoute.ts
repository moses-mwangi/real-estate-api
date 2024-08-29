import { Router } from "express";
import {
  loginUser,
  registerUser,
  getMe,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMyPassword").patch();

router.get("/me", protect, getMe);

router.route("/updatePassword").patch(protect, updatePassword);

export default router;
