//! Application that accepts REST commands and uses them to store, modify, and retrieve data from a Google Cloud database
"use strict";

const express = require('express');
const mysql = require('mysql');
const priv = require('./private');

// connnect to the database
const connection = mysql.createConnection({
  host     : priv.dbHost,
  user     : priv.dbUser,
  password : priv.dbPassword,
  database : priv.dbDatabase,
});
connection.connect();
console.log('Successfuly connected to MySQL Database.');

// initialze the express webserver
const app = express();

// return existing users from the database
app.get('/:username', function(req, res) {
  if(!req.params.username) {
    res.status(400).send('Unable to perform your query; You must supply the first name of the user you want to search for!');
  } else {
    const query = `SELECT * FROM names WHERE username = \'${req.params.username}\'`;
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
      return res.status(200).send(
        `User found: \nFirst Name: ${result.firstName}, Last Name: ${result.lastName}, Age: ${result.age}, ` +
          `email: ${result.email}, Zip Code: ${result.zipCode}`
      );
    });
  }
});

// allow new users to be added to the database
app.post('/:username/:firstName/:lastName/:age/:email/:zipCode', function(req, res) {
  const query = `INSERT INTO names (username, firstName, lastName, age, email, zipCode) VALUES(` +
    `'${req.params.username}', '${req.params.firstName}', '${req.params.lastName}', ${req.params.age}, '${req.params.email}', ` +
    `${req.params.zipCode});`;
  console.log(query);

  connection.query(query, function(err, results, fields) {
    if(err) {
      return res.status(500).send(`Error while processing your request: ${err}`);
    }
  });

  return res.status(200).send('Successfully added user to database.');
});

// allow the data of existing users to be updated
app.put('/:username/:firstName/:lastName/:age/:email/:zipCode', function(req, res) {
  const queries = [];
  if(req.params.firstName != 'x') {
    queries.push(`UPDATE names SET firstName = '${req.params.firstName}' WHERE username = '${req.params.username}';`);
  }
  if(req.params.lastName != 'x') {
    queries.push(`UPDATE names SET lastName = '${req.params.lastName}' WHERE username = '${req.params.username}';`);
  }
  if(req.params.age != 'x') {
    queries.push(`UPDATE names SET age = ${req.params.age} WHERE username = '${req.params.username}';`);
  }
  if(req.params.email != 'x') {
    queries.push(`UPDATE names SET email = '${req.params.email}' WHERE username = '${req.params.username}';`);
  }
  if(req.params.zipCode != 'x') {
    queries.push(`UPDATE names SET zipCode = ${req.params.zipCode} WHERE username = '${req.params.username}';`);
  }

  for(var i=0; i<queries.length; i++) {
    connection.query(queries[i], function(err, results, fields) {
      if(err) {
        console.log(err);
        return res.status(500).send(`Error while processing your request: ${err}`);
      }
    });
  }

  return res.status(200).send(`Successfuly updated data for ${req.params.username}`);
});

app.delete('/:username', function(req, res) {
  const query = `DELETE FROM names WHERE username = '${req.params.username}';`;
  connection.query(query, function(err, results, fields) {
    if(err) {
      console.log(err);
      return res.status(500).send(`Error while processing your request: ${err}`);
    }
  });

  return res.status(200).send(`Successfuly deleted data for ${req.params.username}`);
});

// listen on port 4949 on the server's public ip
app.listen(4949, '0.0.0.0');
console.log('Listening on port 4949');
