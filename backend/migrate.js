// backend/migrate.js
const fs = require('fs');
const { db, init } = require('./db');

// initialize tables before inserting
init();

/**
 * Helper to migrate an array of JSON objects into a table.
 * @param {string} jsonFile – path to JSON file (relative to backend folder)
 * @param {string} insertSql – SQL INSERT statement with placeholders
 * @param {(row) => any[]} transformFn – transform function returning an array of values
 */
const migrateJsonToDb = (jsonFile, insertSql, transformFn = row => row) => {
  const data = JSON.parse(fs.readFileSync(jsonFile));
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`No records to migrate from ${jsonFile}`);
    return;
  }
  const stmt = db.prepare(insertSql);
  db.transaction(() => {
    data.forEach(row => stmt.run(...transformFn(row)));
  })();
  console.log(`Migrated ${data.length} records from ${jsonFile}`);
};

// Migrate users.json
migrateJsonToDb(
  'users.json',
  'INSERT INTO users (username, passwordHash, role, facilityId) VALUES (?, ?, ?, ?)',
  (u) => [u.username, u.passwordHash, u.role, u.facilityId]
);

// Migrate recordings.json
migrateJsonToDb(
  'recordings.json',
  'INSERT INTO recordings (filePath, parentId, childId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?)',
  (r) => [r.filePath, r.parentId, r.childId, r.volunteerId, r.timestamp]
);

// Migrate ratings.json
migrateJsonToDb(
  'ratings.json',
  'INSERT INTO ratings (recordingId, rating, comment, userId, volunteerId, date) VALUES (?, ?, ?, ?, ?, ?)',
  (r) => [r.recording, r.rating, r.comment, r.userId, r.volunteerId, r.date]
);

// Migrate schedules.json
migrateJsonToDb(
  'schedules.json',
  'INSERT INTO schedules (volunteerId, parentId, startTime, endTime, status) VALUES (?, ?, ?, ?, ?)',
  (s) => [s.volunteerId, s.parentId, s.startTime, s.endTime, s.status]
);

console.log('Migration complete');