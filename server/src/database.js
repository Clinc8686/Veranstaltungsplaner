const sqlite3 = require('sqlite3');
const path = './server/src/Veranstaltungsplaner.db';

// Create database file
const db = new sqlite3.Database(path, (err) => {
  if (err) return console.error('Connection Database: ' + err.message);
  console.log('Connected to the in-memory SQlite database.');
});

// Initialise database
db.serialize(function () {
  // Enable support for foreign keys
  db.run('PRAGMA foreign_keys=ON');

  // Create table Events
  db.run('CREATE TABLE IF NOT EXISTS `Events` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Name` TEXT NOT NULL CHECK(length(Name) > 0),' +
    '`Category` TEXT NOT NULL CHECK(length(Name) > 0),' +
    '`Datetime` DATETIME NOT NULL CHECK(length(Datetime) > 0),' +
    ')', (err) => {
    if (err) return console.log('Events: ' + err.message);
    console.log('Table Events created or exists');
  });

  // Create table Guestlist
  db.run('CREATE TABLE IF NOT EXISTS `Guestlist` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Guests` INTEGER NOT NULL CHECK(length(Guests) > 0),' +
    '`Invitationstatus` VARCHAR(10) NOT NULL CHECK(length(Invitationstatus) > 0),' +
    '`Events` INTEGER NOT NULL CHECK(length(Events) > 0),' +
    '`Seat`   INTEGER,' +
    '`Bench`  INTEGER,' +
    'FOREIGN KEY (`Events`) REFERENCES `Events` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,' +
    'FOREIGN KEY (`Guests`) REFERENCES `Guests` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,' +
    'CONSTRAINT `Guestlist` UNIQUE(Guests, Invitationstatus, Events)' +
    ')', (err) => {
    if (err) return console.log('Guestlist: ' + err.message);
    console.log('Table Guestlist created or exists');
  });

  // Create table Guests
  db.run('CREATE TABLE IF NOT EXISTS `Guests` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Name` TEXT NOT NULL CHECK(length(Name) > 0),' +
    '`Children` INTEGER NOT NULL CHECK(Children > -1 AND Children < 2),' +
    'CONSTRAINT `Guests` UNIQUE(Name, Children)' +
    ')', (err) => {
    if (err) return console.log('Guests: ' + err.message);
    console.log('Table Guests created or exists');
  });

  // Create table Seatingplan
  db.run('CREATE TABLE IF NOT EXISTS `Seatingplan` (' +
    '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE CHECK(length(ID) > 0),' +
    '`Tables` INTEGER NOT NULL CHECK(length(Tables) > 0),' +
    '`Seats` INTEGER NOT NULL CHECK(length(Seats) > 0),' +
    '`Onesided` BOOLEAN NOT NULL CHECK(length(Onesided) > 0),' +
    'FOREIGN KEY (`ID`) REFERENCES `Events` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE' +
    ')', (err) => {
    if (err) return console.log('Seatingplan: ' + err.message);
    console.log('Table Seatingplan created or exists');
  });

  // Create trigger Guestlist_Delete
  db.run('CREATE TRIGGER IF NOT EXISTS Guestlist_Delete ' +
    'AFTER DELETE ON Guestlist ' +
    'BEGIN ' +
    'DELETE FROM Guests' +
    '  WHERE ID IN (' +
    '    SELECT ID' +
    '    FROM Guests' +
    '    WHERE NOT EXISTS (' +
    '      SELECT *' +
    '      FROM Guestlist' +
    '      WHERE Guests = Guests.ID )' +
    '    AND ID = OLD.Guests' +
    '  );' +
    'END;', (err) => {
    if (err) return console.log('Trigger Guestlist_Delete: ' + err.message);
    console.log('Trigger Guestlist_Delete created or exists');
  });

  // Create trigger Delete_Old_Events
  db.run('CREATE TRIGGER IF NOT EXISTS Delete_Old_Events ' +
    'BEFORE INSERT ON Events ' +
    'BEGIN ' +
    'DELETE FROM Events ' +
    'WHERE Datetime < datetime(\'now\');' +
    'END;', (err) => {
    if (err) return console.log('Trigger Delete_Old_Events: ' + err.message);
    console.log('Trigger Delete_Old_Events created or exists');
  });
});

module.exports = db;
