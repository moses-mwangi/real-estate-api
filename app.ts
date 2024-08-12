import express from "express";
import cors from "cors";
import usersRoute from "./routes/usersRoute";
import agentRoute from "./routes/agentRoute";
import propertyRoute from "./routes/propertyRoute";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

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

app.use("/api/users", usersRoute);
app.use("/api/agents", agentRoute);
app.use("/api/property", propertyRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 500));
});

app.use(globalErrorHandler);

export default app;
