import mongoose, { Schema, model } from "mongoose";

const agentShema: Schema = new Schema({
  name: { type: String },
  role: { type: String },
  image: { type: String },
  information: { type: String },
});

const Agent = model("Agent", agentShema);

export default Agent;
