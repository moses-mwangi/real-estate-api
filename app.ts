import express, { Request } from "express";
import cors from "cors";
import mimeTypes from "mime-types";
import path from "path";

import passport from "passport";
import session from "express-session";
import cookieSession from "cookie-session";

import { protect } from "./controllers/authController";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import usersRoute from "./routes/usersRoute";
import authRoute from "./routes/authRoute";
import agentRoute from "./routes/agentRoute";
import propertyRoute from "./routes/propertyRoute";
import tourRoute from "./routes/toursRoute";
import cookieParser from "cookie-parser";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import User from "./models/userModel";
// import User from "../models/userModel"; // Adjust the path as necessary
// import AppError from "../utils/appError"; // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use(cookieParser());

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dijocmuzg",
  api_key: "125136887318797",
  api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});

// Cloudinary storage configuration
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

const allowedOrigins = [
  "https://real-estate-mu-peach.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://real-estate-mu-peach.vercel.app/",
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  "/agents",
  express.static(path.join(__dirname, "public/agents"), {
    setHeaders: (res, filePath) => {
      const mimeType = mimeTypes.lookup(filePath);
      if (mimeType) {
        res.setHeader("Content-Type", mimeType);
      } else {
        console.warn(`Cannot determine MIME type for file: ${filePath}`);
      }
    },
  })
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "public/assets"), {
    setHeaders: (res, filePath) => {
      const mimeType = mimeTypes.lookup(filePath);
      if (mimeType) {
        res.setHeader("Content-Type", mimeType);
      } else {
        console.warn(`Cannot determine MIME type for file: ${filePath}`);
      }
    },
  })
);

app.use((req, res, next) => {
  console.log("Testing middleware");
  // console.log(req.cookies);
  console.log(req.user);
  next();
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/agents", agentRoute);
app.use("/api/property", propertyRoute);
app.use("/api/tours", tourRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
