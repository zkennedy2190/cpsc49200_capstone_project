// listUsers.js
// Lists all users in the SQLite database.
// Run with `node listUsers.js` from your project root or backend folder.

const path = require('path');
let dbModule;

// Try to load db.js from the project root’s backend directory
try {
  dbModule = require('./backend/db');
} catch (e) {
  // Fallback to loading it from the current directory (when run from backend)
  dbModule = require('./db');
}

const { db, init } = dbModule;
if (typeof init === 'function') {
  init(); // ensure tables exist
}

try {
  const users = db.prepare('SELECT id, username, role FROM users').all();
  console.log('Users in the database:');
  users.forEach((user) => {
    console.log(`${user.id}: ${user.username} (${user.role})`);
  });
  if (users.length === 0) {
    console.log('No users found.');
  }
} catch (error) {
  console.error('Error querying users table:', error.message);
}
