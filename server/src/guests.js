const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const { databaseAll, databaseDeleteID } = require('./global');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

function addGuestlist (lastID, eventID, res) {
  const statement = 'INSERT INTO Guestlist (Guests, Events) VALUES (?,?)';
  database.run(statement, [lastID, eventID], function (err, result) {
    const uniquetwo = 'UNIQUE constraint failed: Guestlist.Guests, Guestlist.Events';
    if (err && err.message.includes(uniquetwo)) {
      res.status(200).json({ success: false, errorMessage: 'exists' });
    } else if (err) {
      res.status(200).json({ success: false });
    } else {
      console.log('Guestlist was inserted successfully');
    }
  });
}

// Receive Post-Requests from index.html
router.post('/guests/insert/:id', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  const requestBody = req.body;
  const eventID = req.params.id;
  if (requestBody.children === 'on' || requestBody.children === 1) {
    requestBody.children = 1;
  } else {
    requestBody.children = 0;
  }

  const statement = 'INSERT INTO Guests (Name, Children, Invitationstatus) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.children, requestBody.invitationStatus], function (err, result) {
    if (err) {
      const check = 'CHECK constraint failed';
      const unique = 'UNIQUE constraint failed: Guests.Name';
      if (err.message.includes(check)) {
        res.status(200).json({ success: false, errorMessage: 'notNull' });
      } else if (err.message.includes(unique)) {
        try {
          const statement = 'SELECT ID FROM Guests WHERE Name = ?';
          database.get(statement, [requestBody.name], function (err, result) {
            if (err) {
              throw err;
            }
            addGuestlist(result.ID, eventID, res);
          });
        } catch (e) {
          res.status(200).json({ success: false });
        }
      } else {
        res.status(200).json({ success: false });
        console.log('check error ' + err.message);
      }
    } else {
      try {
        addGuestlist(this.lastID, eventID, res);
        console.log('User was inserted successfully');
      } catch (e) {
        res.status(200).json({ success: false });
        console.log('addguest error');
      }

      // Redirect to index.html
      res.redirect('/');
    }
  });
});

router.delete('/guests/:id', urlencodedParser, function (req, res, next) {
  // Delete Guest from Form into database
  console.log('guests!');
  const id = req.params.id;
  const statement = 'DELETE FROM Guests WHERE (ID = ?)';
  databaseDeleteID(statement, res, id);
});

router.post('/guests/update/:id', urlencodedParser, function (req, res, next) {
  // Update Guest from Form
  const requestBody = req.body;
  const statement = 'UPDATE Guests SET (Invitationstatus = ?) WHERE (ID = ?)';
  database.run(statement, [requestBody.invitationstatus, requestBody.id], function (err, result) {
    if (err) throw err;
    console.log('User was updated successfully');
  });

  // Redirect to index.html
  res.redirect('/');
});

router.get('/guests/select/:id', urlencodedParser, function (req, res, next) {
  // Get Guests with specific EventID
  const eventID = req.params.id;
  const statement = 'SELECT Guests.Name FROM `Guests` INNER JOIN Guestlist ON (Guestlist.Guests = Guests.ID) WHERE Guestlist.Events = ?;';
  databaseAll(statement, res, eventID);
});

// Select all persons and send to client
router.get('/guests/select', urlencodedParser, function (req, res, next) {
  // Select Guest from Form into database
  const statement = 'SELECT * FROM Guests';
  databaseAll(statement, res);
});

module.exports = router;
