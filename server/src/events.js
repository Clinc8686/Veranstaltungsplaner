const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Select all Events and send to client
router.get('/events/select/:id', urlencodedParser, function (req, res, next) {
  // Select Events from database
  const statement = 'SELECT Name, Category, Datetime FROM Events';
  database.all(statement, function (err, rows) {
    if (err) {
      res.status(200).json({ error: 'true' });
    } else {
      console.log('Events was selected successfully');
      // send events as json data to client
      res.status(200).json({ events: rows });
    }
  });
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

module.exports = router;
