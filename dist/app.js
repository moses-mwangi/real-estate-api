"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const agentRoute_1 = __importDefault(require("./routes/agentRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const toursRoute_1 = __importDefault(require("./routes/toursRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
// import User from "../models/userModel"; // Adjust the path as necessary
// import AppError from "../utils/appError"; // Adjust the path as necessary
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: "dijocmuzg",
    api_key: "125136887318797",
    api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});
// Cloudinary storage configuration
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
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
        }
        else {
            throw new Error("Invalid file format");
        }
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const allowedOrigins = [
    "https://real-estate-mu-peach.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://real-estate-mu-peach.vercel.app/",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use("/agents", express_1.default.static(path_1.default.join(__dirname, "public/agents"), {
    setHeaders: (res, filePath) => {
        const mimeType = mime_types_1.default.lookup(filePath);
        if (mimeType) {
            res.setHeader("Content-Type", mimeType);
        }
        else {
            console.warn(`Cannot determine MIME type for file: ${filePath}`);
        }
    },
}));
app.use((req, res, next) => {
    console.log("Testing middleware");
    next();
});
app.use("/api/users", usersRoute_1.default);
app.use("/api/auth", authRoute_1.default);
app.use("/api/agents", agentRoute_1.default);
app.use("/api/property", propertyRoute_1.default);
app.use("/api/tours", toursRoute_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_1.default);
exports.default = app;
