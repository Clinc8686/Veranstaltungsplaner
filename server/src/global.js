const database = require('./database');

// handle errors from database changes
const handle = (err, res, rows) => {
  const check = 'CHECK constraint failed';
  const uniquetwo = 'UNIQUE constraint failed: Guestlist.Guests, Guestlist.Events';

  if (err) {
    if (err.message.includes(check)) {
      res.json({ success: false, errorMessage: 'notNull' });
    } else if (err.message.includes(uniquetwo)) {
      res.status(200).json({ success: false, errorMessage: 'exists' });
    } else {
      res.status(200).json({ success: false });
    }
  } else {
    if (rows) {
      if (rows.length < 1) {
        res.status(200).json({ success: true });
      } else if (rows) {
        res.status(200).json({ success: true, data: rows });
      }
    } else {
      res.status(200).json({ success: true });
    }
  }
};

// run given statement on database
const databaseAll = (statement, res, params) => {
  if (params) {
    database.prepare(statement).all([params], function (err, rows) {
      handle(err, res, rows);
    });
  } else {
    database.prepare(statement).all(function (err, rows) {
      handle(err, res, rows);
    });
  }
};

// delete given id from database
const databaseDeleteID = (statement, res, id) => {
  database.prepare(statement).run([id], function (err, result) {
    handle(err, res);
  });
};

module.exports = { databaseAll, databaseDeleteID, handle };
