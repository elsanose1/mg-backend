const School = require("../models/schoolModle");
const ApiFeatuers = require("../utils/apiFeatuers");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const Factory = require("./handlerFactory");

exports.createSchool = Factory.createOne(School);
exports.updateSchool = Factory.updateOne(School);
exports.deleteSchool = Factory.deleteOne(School);

exports.getOne = catchAsync(async (req, res, next) => {
  let query = School.findById(req.params.id).populate("creator", "name");
  const item = await query;

  if (!item) {
    return next(new AppError("No document Found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  // this filter for reviews filter
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };

  const featuers = new ApiFeatuers(
    School.find(filter).populate("creator", "name"),
    req.query
  )
    .filter()
    .sort()
    .limitField()
    .paginate();

  const docs = await featuers.query;

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  });
});

exports.getNames = catchAsync(async (rea, res, next) => {
  const schools = await School.find().select("title -updatedBy city");

  if (!schools) {
    return next(new AppError("No Documents found", 404));
  }
  res.status(200).json({
    status: "success",
    results: schools.length,
    data: {
      schools,
    },
  });
});
