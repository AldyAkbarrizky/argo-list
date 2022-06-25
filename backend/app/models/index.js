const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};

db.mongoose = mongoose;
db.url = process.env.DATABASE || dbConfig.url;
db.lists = require("./list.model.js")(mongoose);
db.users = require("./user.model.js");
module.exports = db;