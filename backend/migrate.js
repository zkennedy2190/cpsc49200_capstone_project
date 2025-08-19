const fs = require('fs');
const { db, init } = require('./db');
init();

const migrateJsonToDb = (jsonFile, insertSql, transformFn = (row) => row) => {
  const rows = JSON.parse(fs.readFileSync(jsonFile));
  const stmt = db.prepare(insertSql);
  db.transaction(() => {
    rows.forEach((row) => stmt.run(...transformFn(row)));
  })();
};

migrateJsonToDb(
  'users.json',
  'INSERT INTO users (username, passwordHash, role, facilityId) VALUES (?, ?, ?, ?)',
  (u) => [u.username, u.passwordHash, u.role, u.facilityId]
);

console.log('Migration complete');
