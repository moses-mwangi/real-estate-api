"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.postProperty = exports.getProperty = exports.getProperties = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const appError_1 = __importDefault(require("../utils/appError"));
cloudinary_1.v2.config({
    cloud_name: "dijocmuzg",
    api_key: "125136887318797",
    api_secret: "ufXEHFFg2otzUB8AlTFptyjp9Gg",
});
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
exports.getProperties = (0, catchAsync_1.default)(async (req, res) => {
    const properties = await propertyModel_1.default.find().populate("userId");
    // const properties = await Property.find().populate("agent");
    res.status(200).json({
        status: "succefully",
        results: properties.length,
        data: properties,
    });
});
exports.getProperty = (0, catchAsync_1.default)(async (req, res) => {
    const property = await propertyModel_1.default.findById(req.params.id);
    res.status(200).json({
        status: "succefully",
        data: property,
    });
});
exports.postProperty = [
    upload.array("images", 5),
    (0, catchAsync_1.default)(async (req, res) => {
        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        try {
            const imageUrls = req.files.map((file) => file.path);
            const newProperty = await propertyModel_1.default.create({
                ...req.body,
                image: imageUrls,
            });
            res.status(201).json({
                status: "success",
                property: newProperty,
            });
        }
        catch (error) {
            console.error("Error saving property:", error);
            res.status(500).json({ message: "Error saving property" });
        }
    }),
];
exports.updateProperty = (0, catchAsync_1.default)(async (req, res, next) => {
    const updates = req.body;
    const property = await propertyModel_1.default.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!property) {
        return next(new appError_1.default("No user found with that ID", 401));
    }
    res.status(200).json({
        status: "successful",
        property,
    });
});
exports.deleteProperty = (0, catchAsync_1.default)(async (req, res) => {
    const deleted = await propertyModel_1.default.findByIdAndDelete();
    res.status(4001).json({
        status: "succesfull deleted",
        property: deleted,
    });
});
