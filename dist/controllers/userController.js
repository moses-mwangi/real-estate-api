"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
exports.getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const rest = await restaurantModel_1.default.find();
    res.status(200).json({
        status: "succefully",
        data: rest,
    });
});
