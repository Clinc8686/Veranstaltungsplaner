const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
});

const host = '127.0.0.1';
const port = process.argv[2] || '8080';
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});
