// Updated backend/db.js
const Database = require('better-sqlite3');
const path = require('path');

// Always open the DB relative to this file’s directory
const dbPath = path.join(__dirname, 'database.db');
const db     = new Database(dbPath);

// Create tables if they don't exist
const init = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL,
      facilityId INTEGER
    );

    CREATE TABLE IF NOT EXISTS recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filePath TEXT NOT NULL,
      parentId INTEGER NOT NULL,
      childId INTEGER NOT NULL,
      volunteerId INTEGER,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recordingId INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      userId INTEGER NOT NULL,
      volunteerId INTEGER,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      volunteerId INTEGER NOT NULL,
      parentId INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      date TEXT NOT NULL
    );
  `);
};

module.exports = { db, init };
