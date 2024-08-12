import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Property from "../models/propertyModel";

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await Property.find();

  res.status(200).json({
    status: "succefully",
    results: properties.length,
    data: properties,
  });
});
