const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Receive Post-Requests from index.html
router.post('/guests/insert', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  console.log('guests!');
  const requestBody = req.body;
  const statement = 'INSERT INTO Guests (Name, Children, Invitationstatus) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.children, requestBody.invitationstatus], function (err, result) {
    if (err) throw err;
    console.log('User was inserted successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

router.post('/guests/delete', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  console.log('guests!');
  const requestBody = req.body;
  const statement = 'DELETE FROM Guests WHERE (ID = ?)';
  database.run(statement, [requestBody.id], function (err, result) {
    if (err) throw err;
    console.log('User was deleted successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

router.post('/guests/update', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  const requestBody = req.body;
  const statement = 'UPDATE Guests SET (Invitationstatus = ?) WHERE (ID = ?)';
  database.run(statement, [requestBody.invitationstatus, requestBody.id], function (err, result) {
    if (err) throw err;
    console.log('User was updated successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

router.post('/guests/select', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  const statement = 'SELECT * FROM Guests';
  database.all(statement, function (err, rows) {
    if (err) throw err;
    console.log('User was selected successfully');
    rows.forEach((row) => {
      console.log(row.Name);
    });
    // console.log(`${result.ID} ${result.Name} ${result.Children}`)
    // res.json(rows);
    res.send({id: row.ID})
  });

  // Redirect to index.html
  // res.redirect('/');
});

module.exports = router;
