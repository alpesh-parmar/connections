const express = require("express");
const fileupload = require("express-fileupload");
const connectionroutes = require('./route/connection.routes');
const dotenv = require('dotenv').config();
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator/check');
const https = require('https')
const path = require('path')
const fs = require('fs')

const Port = process.env.APP_PORT || 3012;
const PORT = process.env.PORT || 3012;

const app = express();
app.use(cors());
app.use(fileupload());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || `Internal Server Error`,
    },
  });
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//app.use(dotenv.config);
app.use("/api/v1", connectionroutes.connectionRoute);
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  },
  app
)

app.listen(PORT, () => {
  console.log(`application is running on port ${PORT}`);
})

