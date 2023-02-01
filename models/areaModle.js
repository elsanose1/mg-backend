const mongoose = require("mongoose");

const governorates = [
  "cairo",
  "alexandria",
  "giza",
  "qalyubia",
  "port said",
  "suez",
  "luxor",
  "dakahlia",
  "gharbia",
  "gharbia",
  "asyut",
  "ismailia",
  "faiyum",
  "sharqia",
  "aswan",
  "damietta",
  "beheira",
  "minya",
  "beni suef",
  "qena",
  "sohag",
  "red sea",
  "giza",
  "monufia",
  "qalyubia",
  "kafr el-sheikh",
  "north sinai",
  "minya",
  "sharqia",
  "sharqia",
  "matrouh",
  "qena",
  "dakahlia",
  "giza",
  "kafr el-sheikh",
  "qalyubia",
  "sharqia",
  "beheira",
  "sohag",
  "sohag",
  "dakahlia",
];

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide Area Name"],
      unique: true,
    },
    gov: {
      type: String,
      enum: governorates,
      required: [true, "area must has a governorate"],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Area must has an Creator"],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Area must has an Creator"],
    },
  },
  { timestamps: true }
);

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
