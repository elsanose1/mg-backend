const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide your Name"],
    },
    type: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    NOC: {
      type: Number,
      min: 1,
      max: 6,
      required: true,
    },
    email: {
      type: String,
      required: [true, "You must provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please provide vaild email"],
    },
    phone: {
      type: String,
      required: [true, "You must provide phone number"],
      unique: true,
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: "School",
      required: [true, "You must provide your school"],
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
