const Store = require('../models/storeModle');
const Factory = require('./handlerFactory')



exports.createStore = Factory.createOne(Store);
exports.updateStore = Factory.updateOne(Store);
exports.deleteStore = Factory.deleteOne(Store);
exports.getOne = Factory.getOne(Store);
exports.getAll = Factory.getAll(Store);