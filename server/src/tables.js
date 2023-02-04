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

module.exports = router;
