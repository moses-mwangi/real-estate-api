"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = exports.getSingleBooking = exports.getBookings = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getBookings = (0, catchAsync_1.default)(async (req, res) => {
    const tours = await tourModel_1.default.find().populate("property");
    res.status(200).json({
        status: "succefully",
        results: tours.length,
        data: tours,
    });
});
exports.getSingleBooking = (0, catchAsync_1.default)(async (req, res) => {
    const tours = await tourModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: "succefully",
        tours,
    });
});
exports.createBooking = (0, catchAsync_1.default)(async (req, res, next) => {
    const { date, time, name, email, phone, message } = req.body;
    if (!date || !name || !email || !phone || !message)
        return res.status(404).json({
            status: "failed",
        });
    const tour = await tourModel_1.default.create(req.body);
    res.status(201).json({
        status: "succefully",
        data: tour,
    });
});
