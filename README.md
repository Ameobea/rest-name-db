# REST Name Database Application
**By Casey Primozic**

## Overview
This application can be used to interact with a MySQL database holding information about the names of people.  The schema of the table that it is designed to work with is shown below:

```
+-----------+-------------+------+-----+---------+-------+
| Field     | Type        | Null | Key | Default | Extra |
+-----------+-------------+------+-----+---------+-------+
| username  | varchar(30) | NO   |     | NULL    |       |
| firstName | varchar(30) | YES  |     | NULL    |       |
| lastName  | varchar(30) | YES  |     | NULL    |       |
| age       | int(11)     | YES  |     | NULL    |       |
| zipCode   | int(11)     | YES  |     | NULL    |       |
| email     | varchar(30) | NO   |     | NULL    |       |
+-----------+-------------+------+-----+---------+-------+
6 rows in set (0.01 sec)
```

The application must be supplied with a file named `private.js` located in the directory root.  The file must contain content with the following format:

```js
module.exports = {
  dbHost: 'website.com',
  dbUser: 'user',
  dbPassword: 'password',
  dbDatabase: 'names',
};
```

## Installation
To begin, make sure that you have the `private.js` file set up as detailed in the overview section of this document.  Create the database on the MySQL server to match the supplied schema.  Then, run `npm install` or `yarn` to install the required dependencies.

After that completes, you can start the application by running `node index.js` which will start the server on port 4949.

## Usage
The application exposes its functionality through a RESTful API.  

### GET
Returns the data for a user given their username.  Returns a 404 error if the user isn't found in the database.

**Example**:
`curl localhost:4949/awolde -X GET`

### POST
Inserts a new user into the database.  Requires that the user's data be supplied including username, first name, last name, age, email, and zip code.

**Example**:
`curl localhost:4949/awolde/Aman/Wolde/30/awolde@valpo.edu/46383 -X POST`

### PUT
Updates data for a user.  Fields have the same order as those for POST.  If one desires to keep some of the user's data the same, insert an `x` for that value.

**Example**:
`curl localhost:4949/awolde/x/Wold/x/awold@valpo.edu/x -X PUT`

### DELETE
Deletes all stored data for a user from the database.

**Example**:
`curl localhost:4949/awolde -X DELETE`
