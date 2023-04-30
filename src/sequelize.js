const log = require("debug")("imagesbot:sequelize");
const { Sequelize } = require("sequelize");
module.exports = new Sequelize(process.env.DATABASE_URI);
