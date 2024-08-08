import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Restaurant from "../models/restaurantModel";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const rest = await Restaurant.find();

  res.status(200).json({
    status: "succefully",
    data: rest,
  });
});
