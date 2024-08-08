"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: "/.env" });
const db = process.env.DATABASE ||
    "mongodb+srv://mosesmwangime:9SPqAj4JOaXBxDrI@cluster0.sqjq7km.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default.connect(db).then((con) => {
    console.log("Database has succesfully connected");
});
app_1.default.listen(3008, "127.0.01", () => {
    console.log("Listening to port 3008");
});
