const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// Receive Post-Requests from index.html
router.post('/tables/insert', urlencodedParser, function (req, res, next) {
  // Insert Tables from Form into database
  const requestBody = req.body;

  const statement = 'INSERT INTO Seatingplan (Tables, Seats, Onesided) VALUES (?,?,?)';
  database.run(statement, [requestBody.numberOfTables, requestBody.seatsPerTable, requestBody.twoSides], function (err, result) {
    if (err) {
      console.log('handle wrong insert! \n' + err.message);
      res.json({ success: false });
    } else {
      console.log('Table was inserted successfully');
      // Redirect to index.html
      res.redirect('/');
    }
  });
});

module.exports = router;
