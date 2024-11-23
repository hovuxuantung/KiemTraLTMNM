const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookings.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT DEFAULT 'Pending'
    )`);
});

module.exports = db;
