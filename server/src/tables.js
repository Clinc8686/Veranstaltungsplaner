const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

function updateEvent (SeatingplanID, eventID) {
  const statement = 'UPDATE Events SET Seatingplan = ? WHERE ID = ?';
  database.run(statement, [SeatingplanID, eventID], function (err, result) {
    if (err) throw err;
    console.log('Event was updated successfully with Seatingplan');
  });
}

// Receive Post-Requests from index.html
router.post('/tables/insert', urlencodedParser, function (req, res, next) {
  // Insert Tables from Form into database
  const requestBody = req.body;

  const statement = 'INSERT INTO Seatingplan (Tables, Seats, Onesided) VALUES (?,?,?)';
  database.run(statement, [requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides], function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed';
      if (err.message.includes(check)) {
        res.json({ success: false, errorMessage: 'notNull' });
      } else {
        res.json({ success: false });
      }
      console.log('handle wrong insert! \n' + err.message);
    } else {
      try {
        updateEvent(this.lastID, requestBody.eventID);
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
  const statement = 'SELECT Seatingplan.ID, Seatingplan.Tables, Seatingplan.Seats, Seatingplan.Onesided FROM `Seatingplan` INNER JOIN Events ON (Seatingplan.ID = Events.Seatingplan) WHERE Events.ID = ?;';
  database.all(statement, [eventID], function (err, rows) {
    if (err) {
      res.status(200).json({ error: 'true' });
    } else {
      console.log('Tables with EventID selected successfully');
      // send persons as json data to client
      res.status(200).json({ data: rows });
    }
  });
});

router.post('/tables/update/:id', urlencodedParser, function (req, res, next) {
  // Update Seatingplan with specific ID
  const tableID = req.params.id;
  const requestBody = req.body;
  const statement = 'UPDATE Seatingplan SET Tables = ?, Seats = ?, Onesided = ? WHERE ID = ?';
  database.run(statement, [requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides, tableID], function (err, result) {
    if (err) {
      throw err;
    }
    console.log('Seatingplan was updated successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

module.exports = router;
