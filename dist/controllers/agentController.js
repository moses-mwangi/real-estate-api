"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgents = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const agentModel_1 = __importDefault(require("../models/agentModel"));
exports.getAgents = (0, catchAsync_1.default)(async (req, res) => {
    const agents = await agentModel_1.default.find();
    res.status(200).json({
        status: "succefully",
        results: agents.length,
        data: agents,
    });
});
