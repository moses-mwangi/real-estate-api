import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { getBookings, createBooking } from "../controllers/tourController";

const router = Router();

router.route("/").get(getBookings).post(createBooking);

export default router;
