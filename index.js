//! Application that accepts REST commands and uses them to store, modify, and retrieve data from a Google Cloud database
"use strict";

const express = require('express')
const mysql = require('mysql');
const priv = require('./private');

// connnect to the database
let connection = mysql.createConnection({
  host     : priv.dbHost,
  user     : priv.dbUser,
  password : priv.dbPassword,
  database : priv.dbDatabase,
});
connection.connect();

// initialze the express webserver
let app = express();

// listen on port 4949 on the server's public ip
app.listen(4949, '0.0.0.0');
