"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
// import config from "config";
/////
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const agentRoute_1 = __importDefault(require("./routes/agentRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const toursRoute_1 = __importDefault(require("./routes/toursRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import "./config/passport";
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(
//   session({
//     // secret: config.get<string>("sessionSecret"),
//     secret: "XFh//pPG4zrBeLBIWgv73NwaypFz4NJJFeOclYf3OEE=",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
app.use((0, cookie_parser_1.default)());
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolves"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
const allowedOrigins = [
    "https://real-estate-mu-peach.vercel.app",
    "http://localhost:3000",
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
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "public/assets"), {
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
    console.log(req.user);
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
