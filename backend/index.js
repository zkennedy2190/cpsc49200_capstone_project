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

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_me';

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

// Register a new user
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

// Get all recordings
app.get('/api/recordings', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM recordings').all();
  res.json(rows);
});

// Get recordings for a specific child
app.get('/api/recordings/:childId', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM recordings WHERE childId = ?').all(req.params.childId);
  res.json(rows);
});

// Submit rating with comment (parents only)
app.post('/api/ratings', authenticateToken, (req, res) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Only parents can submit ratings' });
  }
  const { recording, rating, comment, volunteerId } = req.body;
  if (!recording || !rating) {
    return res.status(400).json({ message: 'Missing rating data' });
  }
  db.prepare(
    'INSERT INTO ratings (recordingId, rating, comment, userId, volunteerId, date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    recording,
    rating,
    comment || null,
    req.user.id,
    volunteerId || null,
    new Date().toISOString()
  );
  res.json({ message: 'Rating saved' });
});

// Get all ratings (for averages)
app.get('/api/ratings', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM ratings').all();
  res.json(rows);
});

// Create a schedule (volunteers only)
app.post('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can create schedules' });
  }
  const { parentId, startTime, endTime } = req.body;
  if (!parentId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing schedule data' });
  }
  const result = db.prepare(
    'INSERT INTO schedules (volunteerId, parentId, startTime, endTime, status) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, parentId, startTime, endTime, 'pending');
  res.json({ id: result.lastInsertRowid, message: 'Schedule created' });
});

// Approve a schedule (admin only)
app.put('/api/schedules/:id/approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve schedules' });
  }
  const result = db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run(
    'approved',
    req.params.id
  );
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  res.json({ message: 'Schedule approved' });
});

// Get schedules for a volunteer (volunteer or admin)
app.get('/api/schedules/volunteer/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const rows = db.prepare('SELECT * FROM schedules WHERE volunteerId = ?').all(req.params.id);
  res.json(rows);
});

// Get all schedules (admin only)
app.get('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access all schedules' });
  }
  const rows = db.prepare('SELECT * FROM schedules').all();
  res.json(rows);
});

// Notifications: create, list, and mark read
app.post('/api/notifications', authenticateToken, (req, res) => {
  const { userId, type, message } = req.body;
  if (!userId || !type || !message) {
    return res.status(400).json({ message: 'Missing notification data' });
  }
  db.prepare(
    'INSERT INTO notifications (userId, type, message, isRead, date) VALUES (?, ?, ?, 0, ?)'
  ).run(userId, type, message, new Date().toISOString());
  res.json({ message: 'Notification created' });
});

app.get('/api/notifications', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM notifications WHERE userId = ? AND isRead = 0').all(
    req.user.id
  );
  res.json(rows);
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const result = db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  res.json({ message: 'Notification marked as read' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});