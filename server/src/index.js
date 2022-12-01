const http = require('http');
const express = require('express');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./server/src/Veranstaltungsplaner.db');
db.serialize(function () {
  // Create table
  db.run('CREATE TABLE IF NOT EXISTS `Events` (' +
      '  `ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
      '  `Name` TEXT NOT NULL,' +
      '  `Datetime` DATETIME NOT NULL,' +
      '  `Guestlist` INTEGER NOT NULL,' +
      '  `Seatingplan` INTEGER NOT NULL' +
      ')');

  db.run('CREATE TABLE IF NOT EXISTS `Guestlist` (' +
      '  `ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
      '  `Guests` INTEGER NOT NULL,' +
      '  CONSTRAINT `Guestlist` FOREIGN KEY (`ID`) REFERENCES `Events` (`Guestlist`) ON DELETE CASCADE ON UPDATE CASCADE' +
      ')');

  db.run('CREATE TABLE IF NOT EXISTS `Guests` (' +
      '  `ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
      '  `Name` TEXT NOT NULL UNIQUE,' +
      '  `Children` INTEGER NOT NULL,' +
      '  `Invitationstatus` VARCHAR(10) NOT NULL,' +
      'CONSTRAINT `Guests` FOREIGN KEY (`ID`) REFERENCES `Guestlist` (`Guests`) ON DELETE CASCADE ON UPDATE CASCADE' +
      ')');

  db.run('CREATE TABLE IF NOT EXISTS `Seatingplan` (' +
      '  `ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
      '  `Tables` INTEGER NOT NULL,' +
      '  `Seats` INTEGER NOT NULL,' +
      '  `Onesided` BOOLEAN NOT NULL,' +
      'CONSTRAINT `Seatingplan` FOREIGN KEY (`ID`) REFERENCES `Events` (`Seatingplan`) ON DELETE CASCADE ON UPDATE CASCADE' +
      ')');

  console.log('Table Created');
});
db.close();

const app = express();
app.use(express.json());
app.use(express.static('build'));

const host = '127.0.0.1';
const port = process.argv[2] || '8080';
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server laeuft http://${host}:${port}/`);
});
