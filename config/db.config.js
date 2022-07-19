const fs = require('fs');
const { Pool } = require('pg');
var path = require('path');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,    
    // ssl: {
    //   rejectUnauthorized: false,
    //   key: fs.readFileSync(path.resolve('dist/ssl/keys/server.key')),
    //   cert: fs.readFileSync(path.resolve('dist/ssl/keys/server.crt'))
    // }
    ssl: {
        require: 'false',
        rejectUnauthorized: false
      },
  });

  module.exports = pool;
  exports.dbconfig = {
    
        user: process.env.USER,//  "postgres",
        host: process.env.HOST,//"localhost",
        database: process.env.DB_NAME,//"Triage",
        password:"Admin@123",//process.env.PASS,// "Admin#123",
        port: 5432,
     
  }

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASS,
    DB: process.env.DB_NAME,
    dialect: "postgres",   
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };