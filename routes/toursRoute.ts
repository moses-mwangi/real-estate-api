import { Router } from "express";
import {
  getBookings,
  createBooking,
  getSingleBooking,
} from "../controllers/tourController";

const router = Router();

router.route("/").get(getBookings).post(createBooking);
router.route("/:id").get(getSingleBooking);

export default router;
