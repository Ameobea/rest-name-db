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
console.log('Successfuly connected to MySQL Database.');

// initialze the express webserver
let app = express();

// return existing users from the database
app.get('/:firstName', function(req, res) {
  if(!req.params.firstName) {
    res.status(400).send('Unable to perform your query; You must supply the first name of the user you want to search for!');  
  } else {
    const query = `SELECT * FROM names WHERE firstName = \'${req.params.firstName}\'`;
    // console.log(query);
    connection.query(query, function(err, results, fields) {
      // console.log(results);
      if(err) {
        return res.status(500).send(`The application encountered an error while performing your request: ${err}`);
      }

      if(results.length === 0){
        return res.status(404).send('No user with that name was found!');
      }

      const result = results[0];
      return res.status(200).send(`User found: \nFirst Name: ${result.firstName}, Last Name: ${result.lastName}, Age: ${result.age}, Zip Code: ${result.zipCode}`);
    });
  }
});

// allow new users to be added to the database
app.put('/', function(req, res) {
  console.log(req);
  if(!req.params.firstName || !req.params.lastName || !req.params.age || !req.params.zipCode) {
    return res.status(400).send('The necessary information was not supplied.  You must include `firstName`, `lastName`, `age`, and `zipCode`.');
  }

  // update or insert new one if none exist with that first name
  const query = `REPLACE INTO names (firstName, lastName, age, zipCode) VALUES('{req.params.lastName}', ${req.params.age}, ${req.params.zipCode});`;
  connection.query(query, function(err, results, fields) {
    if(err) {
      return res.status(500).send(`Error while processing your request: ${err}`);
    }

    return res.status(200).send('Successfuly inserted data into database');
  });
});

// listen on port 4949 on the server's public ip
app.listen(4949, '0.0.0.0');
