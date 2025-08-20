const fs   = require('fs');
const path = require('path');
const { db } = require('./db');

// Create or update the books table with id, title, author, and synopsis columns.
function prepareBooksTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id     INTEGER PRIMARY KEY,
      title  TEXT NOT NULL,
      author TEXT NOT NULL,
      synopsis TEXT
    );
  `);
  // Add synopsis column if it wasn't present
  const cols = db.prepare('PRAGMA table_info(books)').all().map(col => col.name);
  if (!cols.includes('synopsis')) {
    db.exec('ALTER TABLE books ADD COLUMN synopsis TEXT');
  }
}

// Import books from a CSV with columns: id,title,author,synopsis
function importFromCsv(fileName) {
  const filePath = path.join(__dirname, fileName);
  const content  = fs.readFileSync(filePath, 'utf8');
  // Split lines on Windows or Unix line endings
  const lines    = content.split(/\r?\n/);
  // Remove header
  lines.shift();

  const stmt = db.prepare(
    'INSERT OR REPLACE INTO books (id, title, author, synopsis) VALUES (?, ?, ?, ?)'
  );

  for (const line of lines) {
    if (!line.trim()) continue;
    // Split on commas not within quotes
    const parts = line
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((s) => s.replace(/^"|"$/g, ''));
    const [id, title, author, synopsis = ''] = parts;
    stmt.run(Number(id), title, author, synopsis);
  }
  console.log('Book import completed successfully.');
}

// Run import when called directly
if (require.main === module) {
  prepareBooksTable();
  importFromCsv('childrensbooks.csv');
}

module.exports = { prepareBooksTable, importFromCsv };
