import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  updateMe,
  updateImage,
  sendEmailToAgent,
} from "../controllers/userController";
import { protect } from "../controllers/authController";

const router = Router();

router.route("/updateMe").patch(protect, updateMe);
router.route("/updateImage").post(protect, updateImage);

router.route("/sendEmail").post(sendEmailToAgent);

router.route("/").get(getUsers);
router.route("/:id").get(getUser).patch(updateUser);

export default router;
