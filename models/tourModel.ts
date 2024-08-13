import mongoose, { Schema, model } from "mongoose";

type FormValues = {
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const toursShema: Schema = new Schema({
  date: { type: Date, default: new Date() },
  time: { type: String, require: [true] },
  name: { type: String, require: [true] },
  email: { type: String, require: [true] },
  phone: { type: String, require: [true] },
  message: { type: String, require: [true] },

  property: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
    },
  ],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

const Tour = model("Tour", toursShema);

export default Tour;
