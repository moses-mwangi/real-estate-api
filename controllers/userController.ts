import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import AppError from "../utils/appError";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dijocmuzg",
  api_key: "125136887318797",
  api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extension = file.mimetype.split("/")[1];
    const allowedFormats = ["jpg", "JPG", "png", "jpeg"];

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

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: "succefully",
    users,
  });
});

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that Id", 401));
    }

    res.status(200).json({
      status: "succesful",
      user,
    });
  }
);

// Utility function to filter out unwanted fields from req.body
const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Update any user's information
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    const updates = { role };
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError("No user found with that ID", 401));
    }

    res.status(200).json({
      status: "successful",
      user,
    });
  }
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("moses mwangi");
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    const { name, role, photo, phone } = req.body;
    // const updatedFields: any = { name, role, photo, phone };
    const updatedFields: any = { name, role, phone };

    const updatedUser = await User.findByIdAndUpdate(
      (req as any).user.id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const updateImage = [
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrls = req.file.path;
      const updatedFields = { photo: imageUrls };
      const userId = (req as any).user.id;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        status: "success",
        data: { user: updatedUser },
      });
    } catch (err) {
      next(err);
    }
  },
];
