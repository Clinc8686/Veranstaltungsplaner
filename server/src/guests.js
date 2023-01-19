const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Receive Post-Requests from index.html
router.post('/guests/insert', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  const requestBody = req.body;
  if (requestBody.children === 'on' || requestBody.children === 1) {
    requestBody.children = 1;
  } else {
    requestBody.children = 0;
  }

  const statement = 'INSERT INTO Guests (Name, Children, Invitationstatus) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.children, requestBody.invitationStatus], function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed';
      if (err.message.includes(check)) {
        res.json({ success: false, errorMessage: 'notNull' });
      } else {
        res.json({ success: false });
      }
    } else {
      console.log('User was inserted successfully');
      // Redirect to index.html
      res.redirect('/');
    }
  });
});

router.post('/guests/delete/:id', urlencodedParser, function (req, res, next) {
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

// Select all persons and send to client
router.get('/guests/select/:id', urlencodedParser, function (req, res, next) {
  // Select Guest from Form into database
  const statement = 'SELECT * FROM Guests';
  database.all(statement, function (err, rows) {
    if (err) {
      res.status(200).json({ error: 'true' });
    } else {
      console.log('User was selected successfully');
      /* rows.forEach((row) => {
        console.log(row.Name);
      }); */

      // send persons as json data to client
      res.status(200).json({ persons: rows });
    }
  });
});

module.exports = router;
