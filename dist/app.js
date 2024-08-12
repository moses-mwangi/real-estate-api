"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const agentRoute_1 = __importDefault(require("./routes/agentRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = ["http://localhost:3000"];
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
app.use("/api/users", usersRoute_1.default);
app.use("/api/agents", agentRoute_1.default);
app.use("/api/property", propertyRoute_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Cant find ${req.originalUrl} on this server`, 500));
});
app.use(errorController_1.default);
exports.default = app;
