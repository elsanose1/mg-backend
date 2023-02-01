const Client = require("../models/clientModle");
const Factory = require("./handlerFactory");

exports.createClient = Factory.createOne(Client);
exports.updateClient = Factory.updateOne(Client);
exports.deleteClient = Factory.deleteOne(Client);
exports.getOne = Factory.getOne(Client);
exports.getAll = Factory.getAll(Client);
