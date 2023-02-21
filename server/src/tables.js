const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const { databaseAll, handle } = require('./global');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Insert Tables from Form into database
router.post('/tables/insert', urlencodedParser, function (req, res, next) {
  const requestBody = req.body;
  const statement = 'INSERT INTO Seatingplan (ID, Tables, Seats, Onesided) VALUES (?,?,?,?);';
  const params = [requestBody.eventID, requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides];

  database.prepare(statement).run(params, function (err, result) {
    handle(err, res);
  });
});

// Get Tables from specific EventID
router.get('/tables/select/:id', urlencodedParser, function (req, res, next) {
  const eventID = req.params.id;
  const statement = 'SELECT Seatingplan.ID, Seatingplan.Tables, Seatingplan.Seats, Seatingplan.Onesided FROM `Seatingplan` INNER JOIN Events ON (Seatingplan.ID = Events.ID) WHERE Events.ID = ?;';
  databaseAll(statement, res, eventID);
});

// Get Seats from specific ID
router.get('/seats/select/:id', urlencodedParser, function (req, res, next) {
  const statement = 'SELECT G.Name, GL.Seat, GL.Bench, GL.Guests FROM Events E INNER JOIN Guestlist GL ON GL.Events = E.ID INNER JOIN Guests G ON G.ID = GL.Guests WHERE Events = ?;';
  const eventID = req.params.id;
  databaseAll(statement, res, eventID);
});

// Swap two seats with each other
router.post('/seats/update', urlencodedParser, function (req, res, next) {
  const statement = 'UPDATE `Guestlist` AS g1 SET `Seat` = g2.`Seat`, `Bench` = g2.`Bench` FROM `Guestlist` AS g2 WHERE g1.`Guests` = ? AND g2.`Guests` = ? AND g1.`Events` = g2.`Events` OR g1.`Guests` = ? AND g2.`Guests` = ? AND g1.`Events` = g2.`Events`;';
  const requestBody = req.body;
  database.prepare(statement).run([requestBody.guestID1, requestBody.guestID2, requestBody.guestID2, requestBody.guestID1], function (err, result) {
    handle(err, res);
  });
});

// Update the seat from one guest
router.post('/seats/update/:id', urlencodedParser, function (req, res, next) {
  const statement = 'UPDATE Guestlist SET Seat = ?, Bench = ? WHERE Guests = ? AND Events = ?;';
  const requestBody = req.body;
  const userID = req.params.id;
  database.prepare(statement).run([requestBody.seat, requestBody.bench, userID, requestBody.eventID], function (err, result) {
    handle(err, res);
  });
});

module.exports = router;
