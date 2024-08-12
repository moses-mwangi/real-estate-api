import mongoose, { Schema, model } from "mongoose";

const usersShema: Schema = new Schema({});

const User = model("User", usersShema);

export default User;
