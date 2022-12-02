const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Receive Post-Requests from index.html
router.post('/guests', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  console.log('guests!');
  const requestBody = req.body;
  const statement = 'INSERT INTO Guests (Name, Children, Invitationstatus) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.children, requestBody.invitationstatus], function (err, result) {
    if (err) throw err;
    console.log('User dat is inserted successfully');
  });

  res.redirect('/');
});

module.exports = router;
