import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: ".env" });

process.on("uncaughtException", (err) => {
  console.error("UNHANDLED EXCEPTION ---- Shutting down 💥");
  console.error(err.name, err.message);
  process.exit(1);
});

const db =
  "mongodb+srv://mosesmwangime:9SPqAj4JOaXBxDrI@cluster0.sqjq7km.mongodb.net/real-estate?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(db)
  .then((con) => {
    console.log("Database has succesfully connected");
  })
  .catch((err: Error) => console.error(db, err.name, err.message, "moess"));

const port = Number(process.env.PORT) || 8007;
app.listen(port, "127.0.01", () => {
  console.log(`Listening to port ${port}`);
});
