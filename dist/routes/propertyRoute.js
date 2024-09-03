"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const router = (0, express_1.Router)();
router.route("/").get(propertyController_1.getProperties).post(propertyController_1.postProperty);
router.route("/:id").get(propertyController_1.getProperty).patch(propertyController_1.updateProperty);
exports.default = router;
