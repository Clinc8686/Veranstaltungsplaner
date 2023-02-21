const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const { databaseAll, databaseDeleteID, handle } = require('./global');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Insert guest in guestlist with event linking
function addGuestlist (lastID, eventID, invitationStatus, res) {
  const statement = 'INSERT INTO Guestlist (Guests, Invitationstatus, Events) VALUES (?, ?, ?)';
  database.prepare(statement).run([lastID, invitationStatus, eventID], function (err, result) {
    handle(err, res);
  });
}

// Receives data from form and checks conditions before inserting new guest
router.post('/guests/insert/:id', urlencodedParser, function (req, res, next) {
  const requestBody = req.body;
  const eventID = req.params.id;
  if (requestBody.children === 'on' || requestBody.children === 1) {
    requestBody.children = 1;
  } else {
    requestBody.children = 0;
  }

  // Checks if all seats were taken
  let statement = 'SELECT Tables * Seats AS Result FROM Seatingplan WHERE ID = ?;';
  database.prepare(statement).get([eventID], function (err, result) {
    if (err) throw err;
    const seats = result.Result;
    statement = 'SELECT COUNT(Guestlist.Guests) AS TotalGuests FROM Guestlist WHERE Guestlist.Events = ? AND Guestlist.Invitationstatus IS NOT \'abgesagt\';';
    database.prepare(statement).get([eventID], function (err, result) {
      if (err) throw err;
      if (seats > result.TotalGuests) {
        insertGuests(requestBody, eventID, res);
      } else {
        res.status(200).json({ success: false, errorMessage: 'allSeatsTaken' });
      }
    });
  });
});

// Insert new guest into database from form
function insertGuests (requestBody, eventID, res) {
  const statement = 'INSERT INTO Guests (Name, Children) VALUES (?,?)';
  database.prepare(statement).run([requestBody.name, requestBody.children], function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed';
      const unique = 'UNIQUE constraint failed: Guests.Name, Guests.Children';
      if (err.message.includes(check)) {
        res.status(200).json({ success: false, errorMessage: 'notNull' });
      } else if (err.message.includes(unique)) {
        try {
          const statement = 'SELECT ID FROM Guests WHERE Name = ? AND Children = ?';
          database.prepare(statement).get([requestBody.name, requestBody.children], function (err, result) {
            if (err) {
              throw err;
            }
            addGuestlist(result.ID, eventID, requestBody.invitationStatus, res);
          });
        } catch (e) {
          res.status(200).json({ success: false });
        }
      } else {
        res.status(200).json({ success: false });
      }
    } else {
      try {
        addGuestlist(this.lastID, eventID, requestBody.invitationStatus, res);
      } catch (e) {
        res.status(200).json({ success: false });
      }
    }
  });
}

// Delete Guest from Form into database
router.delete('/guests/:id', urlencodedParser, function (req, res, next) {
  const id = req.params.id;
  const statement = 'DELETE FROM Guests WHERE (ID = ?)';
  databaseDeleteID(statement, res, id);
});

// Change invitationstatus from guest
function updateGuestlist (guestID, eventID, invitationStatus, res) {
  const statement = 'UPDATE Guestlist SET Invitationstatus = ? WHERE Guestlist.Guests = ? AND Guestlist.Events = ?';
  database.prepare(statement).run([invitationStatus, guestID, eventID], function (err, result) {
    handle(err, res);
  });
}

// Update Guest from Form
router.post('/guests/update/:id', urlencodedParser, function (req, res, next) {
  const requestBody = req.body;
  const userID = req.params.id;
  const statement = 'UPDATE Guests SET Name = ?, Children = ? WHERE ID = ?';
  database.prepare(statement).run([requestBody.name, requestBody.children, userID], function (err, result) {
    if (err) {
      if (err.message.includes('CHECK constraint failed: length(Name) > 0')) {
        res.status(200).json({ success: false, errorMessage: 'notNull' });
      } else {
        res.status(200).json({ success: false });
      }
    } else {
      updateGuestlist(userID, requestBody.eventID, requestBody.invitationStatus, res);
    }
  });
});

// Get Guests from specific EventID
router.get('/guests/select/:id', urlencodedParser, function (req, res, next) {
  const eventID = req.params.id;
  const statement = 'SELECT Guests.ID, Guests.Name, Guests.Children, Guestlist.Invitationstatus FROM `Guests` INNER JOIN Guestlist ON (Guestlist.Guests = Guests.ID) WHERE Guestlist.Events = ?;';
  databaseAll(statement, res, eventID);
});

module.exports = router;
