"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const toursRoute_1 = __importDefault(require("./routes/toursRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "https://real-estate-mu-peach.vercel.app",
    "https://real-estate-dashboard-kappa.vercel.app",
    "https://real-estate-dashboard-kappa.vercel.app/",
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
app.use((req, res, next) => {
    console.log("Testing middleware");
    next();
});
app.use("/api/users", usersRoute_1.default);
app.use("/api/auth", authRoute_1.default);
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
