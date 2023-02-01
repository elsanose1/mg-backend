const Factory = require('./handlerFactory')
const Area = require('../models/areaModle')




exports.createArea = Factory.createOne(Area);
exports.updateArea = Factory.updateOne(Area);
exports.deleteArea = Factory.deleteOne(Area);
exports.getOne = Factory.getOne(Area);
exports.getAll = Factory.getAll(Area);