const { Pool, Client } = require("pg");
const db = require("../config/db.config");

require('dotenv').config()
const credentials = {
  user: process.env.USER,//  "postgres",
  host: process.env.HOST,//"localhost",
  database: process.env.DB_NAME,//"Triage",
  password:process.env.PASS,// "Admin#123",
  port: 5432,
};
var conString = process.env.DATABASE_URL;
const client = new Client(credentials);

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime + "Application connected with Database : "+credentials.database);
   
    client.end();
  });
});
