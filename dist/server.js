"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
    console.error("UNHANDLED EXCEPTION ---- Shutting down 💥");
    console.error(err.name, err.message);
    process.exit(1);
});
const db = "mongodb+srv://mosesmwangime:9SPqAj4JOaXBxDrI@cluster0.sqjq7km.mongodb.net/real-estate?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default
    .connect(db)
    .then((con) => {
    console.log("Database has succesfully connected");
})
    .catch((err) => console.error(db, err.name, err.message, "moess"));
const port = Number(process.env.PORT) || 8007;
app_1.default.listen(port, "127.0.01", () => {
    console.log(`Listening to port ${port}`);
});
