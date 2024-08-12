import express from "express";
import cors from "cors";
import mimeTypes from "mime-types";
import usersRoute from "./routes/usersRoute";
import agentRoute from "./routes/agentRoute";
import propertyRoute from "./routes/propertyRoute";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import path from "path";

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:3000"];

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
  next();
});

app.use("/api/users", usersRoute);
app.use("/api/agents", agentRoute);
app.use("/api/property", propertyRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 500));
});

app.use(globalErrorHandler);

export default app;
