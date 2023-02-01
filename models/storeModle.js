const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "You must provide Store Title"],
    },
    name: {
      type: String,
      required: [true, "You must provide Store Name"],
    },
    address: {
      type: String,
      required: [true, "Store must has an address"],
    },
    map: {
      type: String,
      required: [true, "Store must have A google map link"],
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
      },
    ],
    city: {
      type: Object,
      required: [true, "Store must has an City"],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Store must has an Creator"],
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

storeSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  this.populate("creator", "name");
  next();
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
