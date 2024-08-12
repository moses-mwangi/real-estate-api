import { Router } from "express";
import { getProperties } from "../controllers/propertyController";

const router = Router();

router.route("/").get(getProperties);

export default router;
