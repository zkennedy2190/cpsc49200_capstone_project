// backend/importbooks.js
const fs = require('fs');
const path = require('path');
const { db } = require('./db');  // note: './db', not './backend/db'

// Create the table if it doesn’t exist
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL
  );
`);

const csvPath = path.join(__dirname, 'childrensbooks.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/);
lines.shift(); // drop the header

for (const line of lines) {
  if (!line.trim()) continue;
  // Split on commas that are not inside quotes
  const fields = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const id = parseInt(fields[0], 10);
  const title = fields[1].replace(/^"|"$/g, '');
  const author = fields[2].replace(/^"|"$/g, '');
  db.prepare('INSERT OR IGNORE INTO books (id, title, author) VALUES (?, ?, ?)').run(id, title, author);
}

console.log('Book import complete.');
