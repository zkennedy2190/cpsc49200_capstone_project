// backend/importUpdatedBooks.js
const fs = require('fs');
const path = require('path');
const { db } = require('./db');

// Make sure the 'books' table has synopsis and coverUrl columns
function ensureColumns() {
  const cols = db.prepare('PRAGMA table_info(books)').all().map(col => col.name);
  if (!cols.includes('synopsis')) {
    db.exec('ALTER TABLE books ADD COLUMN synopsis TEXT');
  }
  if (!cols.includes('coverUrl')) {
    db.exec('ALTER TABLE books ADD COLUMN coverUrl TEXT');
  }
}

// Import the CSV, inserting or updating rows
function importCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.shift(); // remove header row

  const stmt = db.prepare(
    'INSERT OR REPLACE INTO books (id, title, author, synopsis, coverUrl) VALUES (?, ?, ?, ?, ?)'
  );

  for (const line of lines) {
    if (!line.trim()) continue;
    // split on commas not inside quotes
    const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.replace(/^"|"$/g, ''));
    const [id, title, author, synopsis = '', coverUrl = ''] = parts;
    stmt.run(Number(id), title, author, synopsis, coverUrl);
  }
  console.log('Import complete.');
}

ensureColumns();
importCSV(path.join(__dirname, 'childrensbooks.csv'));
