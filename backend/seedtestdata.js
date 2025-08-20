const fs = require('fs');
// This script seeds the SQLite database with example data for testing the role-based dashboards.
// It inserts schedules, recordings, and ratings for the sample users you mentioned.

const { db } = require('./backend/db');

/**
 * Helper to get a user's ID by username. Returns null if not found.
 * @param {string} username
 */
function getUserId(username) {
  const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  return row ? row.id : null;
}

/**
 * Insert a schedule row with the given parameters.
 * @param {number} volunteerId
 * @param {number} parentId
 * @param {string} start
 * @param {string} end
 * @param {string} status
 */
function createSchedule(volunteerId, parentId, start, end, status = 'pending') {
  db.prepare(
    'INSERT INTO schedules (volunteerId, parentId, startTime, endTime, status) VALUES (?, ?, ?, ?, ?)'
  ).run(volunteerId, parentId, start, end, status);
}

/**
 * Insert a recording row and return the new recording ID.
 * @param {number} parentId
 * @param {number} childId
 * @param {number} volunteerId
 */
function createRecording(parentId, childId, volunteerId) {
  // Use a placeholder file path for the recording; in a real system this would point to an actual audio file.
  const filePath = 'placeholder_light_gray_block.png';
  const timestamp = new Date().toISOString();
  db.prepare(
    'INSERT INTO recordings (filePath, parentId, childId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?)'
  ).run(filePath, parentId, childId, volunteerId, timestamp);
  // Return the ID of the newly inserted row
  return db.prepare('SELECT last_insert_rowid() as id').get().id;
}

/**
 * Insert a rating for a given recording.
 * @param {number} recordingId
 * @param {number} rating
 * @param {number} userId
 * @param {number} volunteerId
 * @param {string} comment
 */
function createRating(recordingId, rating, userId, volunteerId, comment = '') {
  db.prepare(
    'INSERT INTO ratings (recordingId, rating, comment, userId, volunteerId, date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(recordingId, rating, comment, userId, volunteerId, new Date().toISOString());
}

/**
 * Main seeding function. Looks up user IDs by username and inserts example data.
 */
function seed() {
  // Look up user IDs for the sample users
  const users = {
    testparent1: getUserId('testparent1'),
    testparent2: getUserId('testparent2'),
    testguardian1: getUserId('testguardian1'),
    testguardian2: getUserId('testguardian2'),
    testvolunteer1: getUserId('testvolunteer1'),
    testvolunteer2: getUserId('testvolunteer2'),
  };

  // Ensure all required users exist
  for (const [name, id] of Object.entries(users)) {
    if (!id) {
      console.error(`User ${name} not found in the database. Seed aborted.`);
      return;
    }
  }

  // Insert schedules (some approved, some pending)
  const now = new Date();
  const oneHour = 60 * 60 * 1000;
  // Approved session: volunteer1 with parent1
  createSchedule(
    users.testvolunteer1,
    users.testparent1,
    now.toISOString(),
    new Date(now.getTime() + oneHour).toISOString(),
    'approved'
  );
  // Pending session: volunteer2 with parent2
  createSchedule(
    users.testvolunteer2,
    users.testparent2,
    new Date(now.getTime() + 2 * oneHour).toISOString(),
    new Date(now.getTime() + 3 * oneHour).toISOString(),
    'pending'
  );
  // Approved session: volunteer1 with parent2
  createSchedule(
    users.testvolunteer1,
    users.testparent2,
    new Date(now.getTime() + 4 * oneHour).toISOString(),
    new Date(now.getTime() + 5 * oneHour).toISOString(),
    'approved'
  );
  // Pending session: volunteer2 with parent1
  createSchedule(
    users.testvolunteer2,
    users.testparent1,
    new Date(now.getTime() + 6 * oneHour).toISOString(),
    new Date(now.getTime() + 7 * oneHour).toISOString(),
    'pending'
  );

  // Insert recordings and ratings
  // Recording for parent1 read by volunteer1
  const recording1 = createRecording(users.testparent1, 1, users.testvolunteer1);
  createRating(recording1, 5, users.testparent1, users.testvolunteer1, 'Great reading!');
  // Recording for parent2 read by volunteer2
  const recording2 = createRecording(users.testparent2, 2, users.testvolunteer2);
  createRating(recording2, 4, users.testparent2, users.testvolunteer2, 'Nice job.');

  console.log('Seeding complete. Test data has been inserted.');
}

seed();