import mongoose, { Schema, model } from "mongoose";

const propertyShema: Schema = new Schema({
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
  position: [Number],

  agent: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Agent",
    },
  ],
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
