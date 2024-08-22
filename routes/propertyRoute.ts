import { Router } from "express";
import {
  getProperties,
  getProperty,
  postProperty,
} from "../controllers/propertyController";

const router = Router();

router.route("/").get(getProperties).post(postProperty);
router.route("/:id").get(getProperty);

export default router;
