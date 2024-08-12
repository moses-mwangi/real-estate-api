"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const router = (0, express_1.Router)();
router.route("/").get(propertyController_1.getProperties);
exports.default = router;
