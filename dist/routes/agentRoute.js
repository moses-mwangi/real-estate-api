"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentController_1 = require("../controllers/agentController");
const router = (0, express_1.Router)();
router.route("/").get(agentController_1.getAgents);
router.route("/:id").get(agentController_1.getAgent);
exports.default = router;
