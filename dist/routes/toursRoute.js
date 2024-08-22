"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourController_1 = require("../controllers/tourController");
const router = (0, express_1.Router)();
router.route("/").get(tourController_1.getBookings).post(tourController_1.createBooking);
router.route("/:id").get(tourController_1.getSingleBooking);
exports.default = router;
