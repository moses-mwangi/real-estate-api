import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Property from "../models/propertyModel";

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await Property.find().populate("agent");

  res.status(200).json({
    status: "succefully",
    results: properties.length,
    data: properties,
  });
});

export const getProperty = catchAsync(async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);

  res.status(200).json({
    status: "succefully",

    data: property,
  });
});

export const postProperty = catchAsync(async (req: Request, res: Response) => {
  const property = await Property.create(req.body);

  res.status(200).json({
    status: "succefully created",
    property,
  });
});
