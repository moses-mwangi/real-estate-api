import { Router } from "express";
import {
  getProperties,
  getProperty,
  postProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";

const router = Router();

router.route("/").get(getProperties).post(postProperty);
router
  .route("/:id")
  .get(getProperty)
  .patch(updateProperty)
  .delete(deleteProperty);

export default router;
