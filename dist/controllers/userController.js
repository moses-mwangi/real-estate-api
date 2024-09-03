"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImage = exports.updateMe = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: "dijocmuzg",
    api_key: "125136887318797",
    api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const extension = file.mimetype.split("/")[1];
        const allowedFormats = ["jpg", "JPG", "png", "jpeg"];
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
exports.getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await userModel_1.default.find();
    res.status(200).json({
        status: "succefully",
        users,
    });
});
exports.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findById(req.params.id);
    if (!user) {
        return next(new appError_1.default("No user found with that Id", 401));
    }
    res.status(200).json({
        status: "succesful",
        user,
    });
});
// Utility function to filter out unwanted fields from req.body
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
// Update any user's information
exports.updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { role } = req.body;
    const updates = { role };
    const user = await userModel_1.default.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new appError_1.default("No user found with that ID", 401));
    }
    res.status(200).json({
        status: "successful",
        user,
    });
});
exports.updateMe = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log("moses mwangi");
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default("This route is not for password updates. Please use /updateMyPassword", 400));
    }
    const { name, role, photo, phone } = req.body;
    // const updatedFields: any = { name, role, photo, phone };
    const updatedFields = { name, role, phone };
    const updatedUser = await userModel_1.default.findByIdAndUpdate(req.user.id, updatedFields, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        return next(new appError_1.default("User not found.", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});
exports.updateImage = [
    upload.single("image"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const imageUrls = req.file.path;
            const updatedFields = { photo: imageUrls };
            const userId = req.user.id;
            const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, updatedFields, {
                new: true,
                runValidators: true,
            });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                status: "success",
                data: { user: updatedUser },
            });
        }
        catch (err) {
            next(err);
        }
    },
];
