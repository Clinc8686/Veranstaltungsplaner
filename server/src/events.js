const { databaseAll, databaseDeleteID } = require('./global');
const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Select all Events and send to client
router.get('/events/select', urlencodedParser, function (req, res, next) {
  // Select Events from database
  const statement = 'SELECT ID, Name, Category, Datetime FROM Events';
  databaseAll(statement, res);
});

// Receive Post-Requests from index.html
router.post('/events/insert', urlencodedParser, function (req, res, next) {
  // Insert Events from Form into database
  const requestBody = req.body;
  const statement = 'INSERT INTO Events (Name, Category, Datetime) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.category, requestBody.datetime], function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed';
      if (err.message.includes(check)) {
        res.json({ success: false, errorMessage: 'notNull' });
      } else {
        res.json({ success: false });
      }
    } else {
      console.log('Event was inserted successfully');
      // Redirect to index.html
      res.redirect('/');
    }
  });
});

// Receive Delete-Requests from index.html
router.delete('/events/:id', urlencodedParser, function (req, res, next) {
  // Delete Events from Form in database
  const id = req.params.id;
  const statement = 'DELETE FROM Events WHERE (ID = ?)';
  databaseDeleteID(statement, res, id);
});

module.exports = router;
