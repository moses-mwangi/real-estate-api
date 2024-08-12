import mongoose, { Schema, model } from "mongoose";

const propertyShema: Schema = new Schema({
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

const Property = model("Property", propertyShema);

export default Property;

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
