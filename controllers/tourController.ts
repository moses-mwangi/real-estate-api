import { Request, Response, NextFunction } from "express";
import Tour from "../models/tourModel";
import catchAsync from "../utils/catchAsync";

export const getBookings = catchAsync(async (req: Request, res: Response) => {
  const tours = await Tour.find().populate("property");

  res.status(200).json({
    status: "succefully",
    results: tours.length,
    data: tours,
  });
});

export const getSingleBooking = catchAsync(
  async (req: Request, res: Response) => {
    const tours = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "succefully",
      tours,
    });
  }
);

export const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date, time, name, email, phone, message } = req.body;
    if (!date || !name || !email || !phone || !message)
      return res.status(404).json({
        status: "failed",
      });

    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: "succefully",
      data: tour,
    });
  }
);
