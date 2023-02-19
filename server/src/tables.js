const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const { databaseAll } = require('./global');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Receive Post-Requests from index.html
router.post('/tables/insert', urlencodedParser, function (req, res, next) {
  // Insert Tables from Form into database
  const requestBody = req.body;
  let statement;
  let params;
  if (requestBody.eventID) {
    statement = database.prepare('INSERT INTO Seatingplan (ID, Tables, Seats, Onesided) VALUES (?,?,?,?);');
    params = [requestBody.eventID, requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides];
  } else {
    statement = database.prepare('INSERT INTO Seatingplan (Tables, Seats, Onesided) VALUES (?,?,?)');
    params = [requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides];
  }

  database.run(statement, params, function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed: length(Tables) > 0';
      if (err.message.includes(check)) {
        res.json({ success: false, errorMessage: 'notNull' });
      } else {
        res.json({ success: false });
      }
      console.log('handle wrong insert: ' + err.message);
    } else {
      try {
        console.log('Table was inserted successfully');
      } catch (e) {
        res.json({ success: false });
      }

      // Redirect to index.html
      res.redirect('/');
    }
  });
});

router.get('/tables/select/:id', urlencodedParser, function (req, res, next) {
  // Get Tables from specific EventID
  const eventID = req.params.id;
  const statement = database.prepare('SELECT Seatingplan.ID, Seatingplan.Tables, Seatingplan.Seats, Seatingplan.Onesided FROM `Seatingplan` INNER JOIN Events ON (Seatingplan.ID = Events.ID) WHERE Events.ID = ?;');
  databaseAll(statement, res, eventID);
});

router.post('/tables/update/:id', urlencodedParser, function (req, res, next) {
  // Update Seatingplan with specific ID
  const tableID = req.params.id;
  const requestBody = req.body;
  const statement = database.prepare('UPDATE Seatingplan SET Tables = ?, Seats = ?, Onesided = ? WHERE ID = ?;');
  database.run(statement, [requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides, tableID], function (err, result) {
    if (err) {
      throw err;
    }
    console.log('Seatingplan was updated successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

router.get('/seats/select/:id', urlencodedParser, function (req, res, next) {
  const statement = database.prepare('SELECT G.Name, GL.Seat, GL.Bench, GL.Guests FROM Events E INNER JOIN Guestlist GL ON GL.Events = E.ID INNER JOIN Guests G ON G.ID = GL.Guests WHERE Events = ?;');
  const eventID = req.params.id;
  databaseAll(statement, res, eventID);
});

router.post('/seats/update', urlencodedParser, function (req, res, next) {
  const statement = database.prepare('UPDATE `Guestlist` AS g1 SET `Seat` = g2.`Seat`, `Bench` = g2.`Bench` FROM `Guestlist` AS g2 WHERE g1.`Guests` = ? AND g2.`Guests` = ? AND g1.`Events` = g2.`Events` OR g1.`Guests` = ? AND g2.`Guests` = ? AND g1.`Events` = g2.`Events`;');
  const requestBody = req.body;
  database.run(statement, [requestBody.guestID1, requestBody.guestID2, requestBody.guestID2, requestBody.guestID1], function (err, result) {
    if (err) {
      res.json({ success: false });
    } else {
      res.redirect('/');
      console.log('Seat succesfully updated');
    }
  });
});

router.post('/seats/update/:id', urlencodedParser, function (req, res, next) {
  const statement = database.prepare('UPDATE Guestlist SET Seat = ?, Bench = ? WHERE Guests = ? AND Events = ?;');
  const requestBody = req.body;
  const userID = req.params.id;
  database.run(statement, [requestBody.seat, requestBody.bench, userID, requestBody.eventID], function (err, result) {
    if (err) {
      res.json({ success: false });
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
