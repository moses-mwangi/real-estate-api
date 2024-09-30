import express from "express";
import cors from "cors";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import usersRoute from "./routes/usersRoute";
import authRoute from "./routes/authRoute";
import propertyRoute from "./routes/propertyRoute";
import tourRoute from "./routes/toursRoute";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://real-estate-mu-peach.vercel.app",
  "https://real-estate-dashboard-kappa.vercel.app",
  "https://real-estate-dashboard-kappa.vercel.app/",
  "https://real-estate-mu-peach.vercel.app/",

  "http://localhost:3000",
  "http://localhost:3001",

  "https://house.bomac.io",
  "https://house.bomac.io/",
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

app.use((req, res, next) => {
  console.log("Testing middleware");
  next();
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
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
