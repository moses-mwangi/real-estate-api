"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const propertyShema = new mongoose_1.Schema({
    image: { type: [String] },
    description: { type: String },
    about: { type: String },
    type: { type: String },
    bathrooms: { type: Number },
    bedrooms: { type: Number },
    garages: { type: Number },
    createdAt: { type: Date, default: new Date() },
    price: { type: Number },
    city: { type: String },
    zip: { type: Number },
    address: { type: String },
    position: { type: [Number], default: [-1.181467, 36.990274] },
    agent: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: "Agent",
            default: ["66b9d361ae8878ca77318285"],
        },
    ],
});
const Property = (0, mongoose_1.model)("Property", propertyShema);
exports.default = Property;
// interface Property {
//   image: [];
//   descrption: string;
//   about: string;
//   type: string;
//   bathrooms: number;
//   bedrooms: number;
//   Garages: number;
//   area: number;
//   createdAt: Date;
//   price: number;
//   city: string;
//   zip: number;
//   Address: string;
// }
