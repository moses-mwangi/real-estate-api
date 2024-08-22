import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Agent from "../models/agentModel";

export const getAgents = catchAsync(async (req: Request, res: Response) => {
  const agents = await Agent.find();

  res.status(200).json({
    status: "succefully",
    results: agents.length,
    data: agents,
  });
});

export const getAgent = catchAsync(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id);

  res.status(200).json({
    status: "succefully",
    agent,
  });
});
