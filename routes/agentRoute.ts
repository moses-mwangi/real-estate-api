import { Router } from "express";
import { getAgents, getAgent } from "../controllers/agentController";

const router = Router();

router.route("/").get(getAgents);
router.route("/:id").get(getAgent);

export default router;
