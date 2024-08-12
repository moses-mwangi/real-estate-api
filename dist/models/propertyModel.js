"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const propertyShema = new mongoose_1.Schema({
    image: { type: [String] },
    descrption: { type: String },
    about: { type: String },
    type: { type: String },
    bathrooms: { type: Number },
    bedrooms: { type: Number },
    Garages: { type: Number },
    area: { type: Number },
    createdAt: { type: Date },
    price: { type: Number },
    city: { type: String },
    zip: { type: Number },
    Address: { type: String },
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
