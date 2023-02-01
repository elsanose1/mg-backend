const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "You must provide School Title"],
    },
    name: {
      type: String,
      required: [true, "You must provide School Name"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "School must has an address"],
    },
    map: {
      type: String,
      required: [true, "School must have A google map link"],
    },

    employees: [
      {
        name: {
          type: String,
          required: [true, "Employee must has name"],
        },
        role: String,
        phone: {
          type: String,
          required: [true, "Employee must has phone number"],
        },
        email: {
          type: String,
        },
      },
    ],
    city: {
      type: Object,
      required: [true, "School must has an City"],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "School must has an Creator"],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

schoolSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
