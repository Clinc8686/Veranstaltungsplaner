const database = require('./database');
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(express.json());
app.use(express.static('build'));

database.serialize();
const host = '127.0.0.1';
const port = process.argv[2] || '8080';

// Start Webserver
app.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});

// Receive Post-Requests from index.html
app.post('/', urlencodedParser, function (req, res, next) {
  // Insert Guest from Form into database
  const requestBody = req.body;
  const statement = 'INSERT INTO Guests (Name, Children, Invitationstatus) VALUES (?,?,?)';
  database.run(statement, [requestBody.name, requestBody.children, requestBody.invitationstatus], function (err, result) {
    if (err) throw err;
    console.log('User dat is inserted successfully');
  });

  res.redirect('/');
});
