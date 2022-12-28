const database = require('./database');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('build'));

// link of server scripts
app.use(require('./guests'));
app.use(require('./events'));
app.use(require('./tables'));

// create database if not exists
database.serialize();

// set port of server
const host = '127.0.0.1';
const port = process.argv[2] || '8080';

// Start Webserver
app.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});
