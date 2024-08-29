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
  position: { type: [Number], default: [-1.181467, 36.990274] },
  size: { type: Number, default: 100 },

  userId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: ["66b9d361ae8878ca77318285"],
    },
  ],

  // agent: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Agent",
  //     default: ["66b9d361ae8878ca77318285"],
  //   },
  // ],
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
