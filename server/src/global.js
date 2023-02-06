const database = require('./database');

const databaseAll = (statement, res, params) => {
  function handle (err, rows) {
    if (err) {
      res.status(200).json({ error: 'true' });
    } else {
      console.log('Selected successfully');
      // send data as json data to client
      res.status(200).json({ data: rows });
    }
  }

  if (params) {
    database.all(statement, params, function (err, rows) {
      handle(err);
    });
  } else {
    database.all(statement, function (err, rows) {
      handle(err, rows);
    });
  }
};

const databaseDeleteID = (statement, res, id) => {
  function handle (err) {
    if (err) {
      res.json({ success: false });
    } else {
      res.status(200).json({ success: true });
      console.log('Element with id ' + id + ' was deleted successfully');
    }
  }
  database.run(statement, [id], function (err, result) {
    handle(err);
  });
};

module.exports = { databaseAll, databaseDeleteID };
