import express from "express";
import cors from "cors";

import usersRoute from "./routes/users";

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

export default app;
