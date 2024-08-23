import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Property from "../models/propertyModel";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

// export const postProperty = catchAsync(async (req: Request, res: Response) => {
//   const property = await Property.create(req.body);

//   res.status(200).json({
//     status: "succefully created",
//     property,
//   });
// });

export const postProperty = [
  upload.array("images", 5),
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
