"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
exports.getProperties = (0, catchAsync_1.default)(async (req, res) => {
    const properties = await propertyModel_1.default.find();
    res.status(200).json({
        status: "succefully",
        results: properties.length,
        data: properties,
    });
});
