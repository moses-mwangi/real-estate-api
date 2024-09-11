import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Property from "../models/propertyModel";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import AppError from "../utils/appError";

cloudinary.config({
  cloud_name: "dijocmuzg",
  api_key: "125136887318797",
  api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extension = file.mimetype.split("/")[1];
    const allowedFormats = ["jpg", "png", "jpeg"];

    if (allowedFormats.includes(extension)) {
      return {
        folder: "real-estate-images",
        format: extension,
        public_id: `image_${Date.now()}`,
        resource_type: "image",
      };
    } else {
      throw new Error("Invalid file format");
    }
  },
});

const upload = multer({ storage: storage });

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await Property.find().populate("userId");
  // const properties = await Property.find().populate("agent");

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

export const postProperty = [
  upload.array("images"),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    try {
      const imageUrls = (req.files as Express.Multer.File[]).map(
        (file) => file.path
      );

      const newProperty = await Property.create({
        ...req.body,
        image: imageUrls,
      });

      res.status(201).json({
        status: "success",
        property: newProperty,
      });
    } catch (error) {
      console.error("Error saving property:", error);
      res.status(500).json({ message: "Error saving property" });
    }
  }),
];

export const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updates = req.body;

    const property = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return next(new AppError("No user found with that ID", 401));
    }

    res.status(200).json({
      status: "successful",
      property,
    });
  }
);

export const deleteProperty = catchAsync(
  async (req: Request, res: Response) => {
    const deleted = await Property.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "No property found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Successfully deleted the property",
      property: deleted,
    });
  }
);
