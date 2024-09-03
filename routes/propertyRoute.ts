import { Router } from "express";
import {
  getProperties,
  getProperty,
  postProperty,
  updateProperty,
} from "../controllers/propertyController";

const router = Router();

router.route("/").get(getProperties).post(postProperty);
router.route("/:id").get(getProperty).patch(updateProperty);

export default router;
