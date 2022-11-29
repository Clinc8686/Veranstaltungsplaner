const http = require('http');

const host = '127.0.0.1';
const port = process.argv[2] || '8080';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello W!');
});

server.listen(port, host, () => {
    console.log(`Server laeuft http://${host}:${port}/`);
});