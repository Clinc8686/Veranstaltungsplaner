const { databaseAll, databaseDeleteID, handle } = require('./global');
const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Select all Events
router.get('/events/select', urlencodedParser, function (req, res, next) {
  const statement = 'SELECT ID, Name, Category, Datetime FROM Events';
  databaseAll(statement, res);
});

// Insert event into database
router.post('/events/insert', urlencodedParser, function (req, res, next) {
  const requestBody = req.body;
  const statement = 'INSERT INTO Events (Name, Category, Datetime) VALUES (?,?,?)';
  database.prepare(statement).run([requestBody.name, requestBody.category, requestBody.datetime], function (err, result) {
    handle(err, res);
  });
});

// Delete Events with specific id from database
router.delete('/events/:id', urlencodedParser, function (req, res, next) {
  const id = req.params.id;
  const statement = 'DELETE FROM Events WHERE (ID = ?)';
  databaseDeleteID(statement, res, id);
});

module.exports = router;
