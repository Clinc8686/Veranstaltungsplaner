const http = require('http');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('build'));

const host = '127.0.0.1';
const port = process.argv[2] || '8080';
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});
