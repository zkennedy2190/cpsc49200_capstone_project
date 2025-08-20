// listData.js
// This script prints all rows from the schedules, recordings, and ratings tables.
// It helps verify that seeding has inserted test data into the correct database.
// Run with `node listData.js` from the project root or backend folder.

let dbModule;
try {
  dbModule = require('./backend/db');
} catch (e) {
  dbModule = require('./db');
}
const { db, init } = dbModule;

// Ensure tables exist
if (typeof init === 'function') {
  init();
}

try {
  const schedules = db.prepare('SELECT * FROM schedules').all();
  const recordings = db.prepare('SELECT * FROM recordings').all();
  const ratings = db.prepare('SELECT * FROM ratings').all();
  console.log('Schedules:');
  console.table(schedules);
  console.log('Recordings:');
  console.table(recordings);
  console.log('Ratings:');
  console.table(ratings);
} catch (err) {
  console.error('Error querying tables:', err.message);
}