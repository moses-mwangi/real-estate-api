"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const agentShema = new mongoose_1.Schema({
    name: { type: String },
    role: { type: String },
    image: { type: String },
    information: { type: String },
});
const Agent = (0, mongoose_1.model)("Agent", agentShema);
exports.default = Agent;
