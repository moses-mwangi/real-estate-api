import mongoose, { Schema, model } from "mongoose";

const toursShema: Schema = new Schema({});

const Tour = model("Tour", toursShema);

export default Tour;
