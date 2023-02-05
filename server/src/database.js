const sqlite3 = require('sqlite3');
const path = './server/src/Veranstaltungsplaner.db';

const db = new sqlite3.Database(path, (err) => {
  if (err) return console.error('Connection Database: ' + err.message);
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(function () {
  // Create table
  db.run('CREATE TABLE IF NOT EXISTS `Events` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Name` TEXT NOT NULL CHECK(length(Name) > 0),' +
    '`Category` TEXT NOT NULL CHECK(length(Name) > 0),' +
    '`Datetime` DATETIME NOT NULL CHECK(length(Datetime) > 0),' +
    '`Seatingplan` INTEGER CHECK(length(Seatingplan) > 0),' +
    '`Place` TEXT CHECK(length(Place) > 0)' +
    ')', (err) => {
    if (err) return console.log('Events: ' + err.message);
    console.log('Table Events created or exists');
  });

  db.run('CREATE TABLE IF NOT EXISTS `Guestlist` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Guests` INTEGER NOT NULL CHECK(length(Guests) > 0),' +
    '`Events` INTEGER NOT NULL CHECK(length(Events) > 0),' +
    '`Seat`   INTEGER,' +
    '`Bench`  INTEGER,' +
    'CONSTRAINT `Guestlist` FOREIGN KEY (`Events`) REFERENCES `Events` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,' +
    'CONSTRAINT `Guestlist` FOREIGN KEY (`Guests`) REFERENCES `Guests` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,' +
    'CONSTRAINT `Guestlist` UNIQUE(Guests, Events)' +
    ')', (err) => {
    if (err) return console.log('Guestlist: ' + err.message);
    console.log('Table Guestlist created or exists');
  });

  db.run('CREATE TABLE IF NOT EXISTS `Guests` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Name` TEXT NOT NULL UNIQUE CHECK(length(Name) > 0),' +
    '`Children` INTEGER NOT NULL CHECK(Children > -1 AND Children < 2),' +
    '`Invitationstatus` VARCHAR(10) NOT NULL CHECK(length(Invitationstatus) > 0)' +
    ')', (err) => {
    if (err) return console.log('Guests: ' + err.message);
    console.log('Table Guests created or exists');
  });

  db.run('CREATE TABLE IF NOT EXISTS `Seatingplan` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Tables` INTEGER NOT NULL CHECK(length(Tables) > 0),' +
    '`Seats` INTEGER NOT NULL CHECK(length(Seats) > 0),' +
    '`Onesided` BOOLEAN NOT NULL CHECK(length(Onesided) > 0),' +
    'CONSTRAINT `Seatingplan` FOREIGN KEY (`ID`) REFERENCES `Events` (`Seatingplan`) ON DELETE CASCADE ON UPDATE CASCADE' +
    ')', (err) => {
    if (err) return console.log('Seatingplan: ' + err.message);
    console.log('Table Seatingplan created or exists');
  });
});

module.exports = db;
