const dbConfig = require("../config/db.config");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        }
    }
  });


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.CONNECTIONMODEL = require("./connection.model.js")(sequelize, Sequelize);
db.GROUPSMODEL = require("./groups.model.js")(sequelize, Sequelize);
db.GROUPMEMBERSSMODEL = require("./groupmembers.model.js")(sequelize, Sequelize);




module.exports = db;
