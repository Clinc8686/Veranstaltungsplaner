const sqlite3 = require('sqlite3');

module.exports = {
  CreateDatabase: function CreateDatabase () {
    const db = new sqlite3.Database('./server/src/Veranstaltungsplaner.db', (err) => {
      if (err) return console.error(err.message);
      console.log('Connected to the in-memory SQlite database.');
    });
    db.serialize(function () {
      // Create table
      db.run('CREATE TABLE IF NOT EXISTS `Events` (' +
        '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
        '`Name` TEXT NOT NULL,' +
        '`Datetime` DATETIME NOT NULL,' +
        '`Guestlist` INTEGER NOT NULL,' +
        '`Seatingplan` INTEGER NOT NULL' +
        ')', (err) => {
        if (err) return console.log('Events: ' + err.message);
        console.log('Table Events created or exists');
      });

      db.run('CREATE TABLE IF NOT EXISTS `Guestlist` (' +
        '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
        '`Guests` INTEGER NOT NULL,' +
        'CONSTRAINT `Guestlist` FOREIGN KEY (`ID`) REFERENCES `Events` (`Guestlist`) ON DELETE CASCADE ON UPDATE CASCADE' +
        ')', (err) => {
        if (err) return console.log('Guestlist: ' + err.message);
        console.log('Table Guestlist created or exists');
      });

      db.run('CREATE TABLE IF NOT EXISTS `Guests` (' +
        '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
        '`Name` TEXT NOT NULL UNIQUE,' +
        '`Children` INTEGER NOT NULL,' +
        '`Invitationstatus` VARCHAR(10) NOT NULL,' +
        'CONSTRAINT `Guests` FOREIGN KEY (`ID`) REFERENCES `Guestlist` (`Guests`) ON DELETE CASCADE ON UPDATE CASCADE' +
        ')', (err) => {
        if (err) return console.log('Guests: ' + err.message);
        console.log('Table Guests created or exists');
      });

      db.run('CREATE TABLE IF NOT EXISTS `Seatingplan` (' +
        '`ID` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,' +
        '`Tables` INTEGER NOT NULL,' +
        '`Seats` INTEGER NOT NULL,' +
        '`Onesided` BOOLEAN NOT NULL,' +
        'CONSTRAINT `Seatingplan` FOREIGN KEY (`ID`) REFERENCES `Events` (`Seatingplan`) ON DELETE CASCADE ON UPDATE CASCADE' +
        ')', (err) => {
        if (err) return console.log('Seatingplan: ' + err.message);
        console.log('Table Seatingplan created or exists');
      });
    });
  }
};
