const http = require('http');
const express = require('express');
// const path = require('path');
// const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('build'));
/* app.use('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
}); */

const host = '127.0.0.1';
const port = process.argv[2] || '8080';
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});

/* const handleRequest = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.readFile(path.join(__dirname, '/../../build/index.html'), null, function (error, data) {
    if (error) {
      response.writeHead(404);
      response.write('Whoops! File not found!');
    } else {
      response.write(data);
    }
    response.end();
  });
}; */

/* const handleRequest = (request, response) => {
  if (request.url === '/') {
    fs.readFile(path.join(__dirname, '/../../build/index.html'), null, function (error, html) {
      if (error) {
        response.writeHead(404);
        response.write('Whoops! File not found!');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(html);
      }
      response.end();
    });
  } else if (request.url === '/styles.css') {
    fs.readFile(path.join(__dirname, '/../../build/styles.css'), null, function (error, css) {
      if (error) {
        response.writeHead(404);
        response.write('Whoops! File not found!');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/css'
        });
        response.write(css);
      }
      response.end();
    });
  } else if (request.url === '/script.js') {
    fs.readFile(path.join(__dirname, '/../../build/script.js'), null, function (error, js) {
      console.log(path.join(__dirname, '/../../build/script.js'));
      if (error) {
        response.send(500, { error: error });

        // response.writeHead(404);
        // response.write('Whoops! File not found!');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/javascript'
        });
        response.write(js);
      }
      response.end();
    });
  }
}; */

// http.createServer(handleRequest).listen(8080);
