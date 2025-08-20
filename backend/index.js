const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { db, init } = require('./db');

init(); // create tables if they don't exist

const app = express();
app.use(cors());
app.use(express.json());

// Pull the JWT secret from the environment.  If it’s not set, throw an error.
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV !== 'production' ? 'dev_secret' : undefined);

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not defined. Set this environment variable in production.'
  );
}

// Ensure uploads folder exists for audio files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const upload = multer({ dest: uploadsDir });

// Middleware to verify JWT and attach user info to req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register a new user (POST-only)
app.post('/api/register', async (req, res) => {
  const { username, password, role, facilityId } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare(
      'INSERT INTO users (username, passwordHash, role, facilityId) VALUES (?, ?, ?, ?)'
    ).run(username, passwordHash, role, facilityId || null);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// Login route: verifies password and returns a JWT plus role and id
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, id: user.id });
});

// Upload a recording (volunteers only)
app.post('/api/upload', authenticateToken, upload.single('audio'), (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can upload' });
  }
  const { parentId, childId } = req.body;
  if (!req.file || !parentId || !childId) {
    return res.status(400).json({ message: 'Missing required data' });
  }
  const timestamp = new Date().toISOString();
  const result = db.prepare(
    'INSERT INTO recordings (filePath, parentId, childId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?)'
  ).run(req.file.path, parentId, childId, req.user.id, timestamp);
  res.json({ id: result.lastInsertRowid, message: 'Recording uploaded' });
});

// -----------------------------------------------------------------
// New route: return the list of books from the database.
// Tries to include synopsis and coverUrl if those columns exist.
app.get('/api/books', (req, res) => {
  try {
    let rows;
    try {
      rows = db
        .prepare('SELECT id, title, author, synopsis, coverUrl FROM books ORDER BY title')
        .all();
    } catch (err) {
      // If the synopsis/coverUrl columns do not exist, fall back to basic fields
      rows = db.prepare('SELECT id, title, author FROM books ORDER BY title').all();
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving books', error: error.message });
  }
});
// -----------------------------------------------------------------

// …(all other routes remain unchanged)… 

// Start the server on the port Azure provides (fallback to 4000 locally)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
