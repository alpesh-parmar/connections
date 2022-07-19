const dbConfig = require("../config/db.config");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASS, {
  host: process.env.HOST,
  dialect: 'postgres',
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.CONNECTIONMODEL = require("./connection.model.js")(sequelize, Sequelize);
db.GROUPSMODEL = require("./groups.model.js")(sequelize, Sequelize);
db.GROUPMEMBERSSMODEL = require("./groupmembers.model.js")(sequelize, Sequelize);




module.exports = db;