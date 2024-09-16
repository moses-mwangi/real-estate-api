import { Router } from "express";
import {
  loginUser,
  registerUser,
  getMe,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  sendingOtpToEmail,
  deleteOtp,
} from "../controllers/authController";

const router = Router();

router.route("/verifyOtp").post(sendingOtpToEmail);
router.route("/deleteOtp").delete(deleteOtp);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMyPassword").patch(updatePassword);

router.get("/me", protect, getMe);

router.route("/updatePassword").patch(protect, updatePassword);
// router.route("/updatePassword").patch(updatePassword);

export default router;
