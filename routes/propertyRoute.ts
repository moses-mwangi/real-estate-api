import { Router } from "express";
import { getProperties, getProperty } from "../controllers/propertyController";

const router = Router();

router.route("/").get(getProperties);
router.route("/:id").get(getProperty);

export default router;
