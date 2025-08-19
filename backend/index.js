const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, init } = require('./db');

init();

const upload = multer({ dest: path.join(__dirname, "uploads") });
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const USERS_FILE = path.join(__dirname, 'users.json');
const RECORDINGS_FILE = path.join(__dirname, 'recordings.json');
const RATINGS_FILE = path.join(__dirname, 'ratings.json');
const SCHEDULES_FILE  = path.join(__dirname, 'schedules.json');

if (!fs.existsSync(RECORDINGS_FILE)) writeJson(RECORDINGS_FILE, []);
if (!fs.existsSync(RATINGS_FILE)) writeJson(RATINGS_FILE, []);
if (!fs.existsSync(SCHEDULES_FILE)) writeJson(SCHEDULES_FILE, []);

app.use(express.json());

function readJson(filePath) {
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : [];
}
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/api/register', async (req, res) => {
  const { username, password, role, facilityId } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare(
      'INSERT INTO users (username, passwordHash, role, facilityId) VALUES (?, ?, ?, ?)'
    );
    stmt.run(username, passwordHash, role, facilityId);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: 'Registration error', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, id: user.id });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/ratings', authenticateToken, (req, res) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Only parents can submit ratings' });
  }
  const { recording, rating, comment, volunteerId } = req.body;
  if (!recording || !rating) return res.status(400).json({ message: 'Missing data' });
  const ratings = readJson(RATINGS_FILE);
  ratings.push({
    recording,
    rating,
    comment,
    userId: req.user.id,
    volunteerId,
    date: new Date().toISOString(),
  });
  writeJson(RATINGS_FILE, ratings);
  res.json({ message: 'Rating saved' });
});

app.post('/api/upload', authenticateToken, upload.single('audio'), (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can upload' });
  }
  const { parentId, childId } = req.body;
  const timestamp = new Date().toISOString();
  const stmt = db.prepare(
    'INSERT INTO recordings (filePath, parentId, childId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(req.file.path, parentId, childId, req.user.id, timestamp);
  res.json({ id: info.lastInsertRowid, message: 'Recording uploaded' });
});

app.get('/api/recordings', authenticateToken, (req, res) => {
  const recordings = readJson(RECORDINGS_FILE);
  res.json(recordings);
});

app.get('/api/recordings/:childId', authenticateToken, (req, res) => {
  const { childId } = req.params;
  const recordings = readJson(RECORDINGS_FILE).filter((r) => r.childId === childId);
  res.json(recordings);
});

app.get('/api/schedules', authenticateToken, (req, res) => {
  const schedules = readJson(SCHEDULES_FILE);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access all schedules' });
  }
  res.json(schedules);
});

app.get('/api/schedules/volunteer/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  const rows = db.prepare('SELECT * FROM schedules WHERE volunteerId = ?').all(id);
  res.json(rows);
});

app.get('/api/ratings', authenticateToken, (req, res) => {
  const ratings = readJson(RATINGS_FILE);
  res.json(ratings);
});

app.post('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can create schedules' });
  }
  const { parentId, startTime, endTime } = req.body;
  const stmt = db.prepare('INSERT INTO schedules (volunteerId, parentId, startTime, endTime) VALUES (?, ?, ?, ?)');
  const info = stmt.run(req.user.id, parentId, startTime, endTime);
  res.json({ id: info.lastInsertRowid, message: 'Schedule created' });
});

app.put('/api/schedules/:id/approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve schedules' });
  }
  const { id } = req.params;
  db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run('approved', id);
  res.json({ message: 'Schedule approved' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Create schedule (volunteer only, with start/end times)
app.post('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can create schedules' });
  }
  const { parentId, startTime, endTime } = req.body;
  const stmt = db.prepare(
    'INSERT INTO schedules (volunteerId, parentId, startTime, endTime) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(req.user.id, parentId, startTime, endTime);
  res.json({ id: info.lastInsertRowid, message: 'Schedule created' });
});

// Approve schedule (admin only)
app.put('/api/schedules/:id/approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve schedules' });
  }
  const { id } = req.params;
  db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run('approved', id);
  res.json({ message: 'Schedule approved' });
});

// Volunteer or admin can view volunteer schedules
app.get('/api/schedules/volunteer/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const rows = db.prepare('SELECT * FROM schedules WHERE volunteerId = ?').all(req.params.id);
  res.json(rows);
});

// Admin can view all schedules
app.get('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access all schedules' });
  }
  const rows = db.prepare('SELECT * FROM schedules').all();
  res.json(rows);
});

// Create notification (server can call this)
app.post('/api/notifications', authenticateToken, (req, res) => {
  const { userId, type, message } = req.body;
  const stmt = db.prepare(
    'INSERT INTO notifications (userId, type, message, isRead, date) VALUES (?, ?, ?, 0, ?)'
  );
  stmt.run(userId, type, message, new Date().toISOString());
  res.json({ message: 'Notification created' });
});

// Get unread notifications for logged-in user
app.get('/api/notifications', authenticateToken, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM notifications WHERE userId = ? AND isRead = 0')
    .all(req.user.id);
  res.json(rows);
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Notification marked as read' });
});
