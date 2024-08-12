import { Router } from "express";
import { getAgents } from "../controllers/agentController";

const router = Router();

router.route("/").get(getAgents);

export default router;
