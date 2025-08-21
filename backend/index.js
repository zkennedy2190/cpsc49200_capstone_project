// backend/index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { db, init } = require('./db');
const { BlobServiceClient } = require('@azure/storage-blob'); // NEW

init(); // create tables if they don't exist

// --- light, safe migrations (no-op if already present) ---
try { db.prepare('ALTER TABLE recordings ADD COLUMN url TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE recordings ADD COLUMN guardianId INTEGER').run(); } catch {}

const app = express();
app.use(cors());
app.use(express.json());

// Serve local uploads (dev & local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT secret
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV !== 'production' ? 'dev_secret' : undefined);

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not defined. Set this environment variable in production.'
  );
}

// Ensure local uploads dir (used for dev fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer: use memory storage so we can push the buffer to Azure or disk
const upload = multer({ storage: multer.memoryStorage() }); // CHANGED

// Azure Blob setup (container default "recordings")
let blobContainerClient = null;
(async () => {
  try {
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      const blobService = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      );
      const container = process.env.AZURE_BLOB_CONTAINER || 'recordings';
      blobContainerClient = blobService.getContainerClient(container);
      await blobContainerClient.createIfNotExists({ access: 'blob' });
      console.log('Azure Blob container ready:', container);
    }
  } catch (e) {
    console.error('Azure Blob init failed; using local uploads.', e);
    blobContainerClient = null;
  }
})();

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

// Build a public URL for a file stored on local disk
function buildFileUrl(req, filePath) {
  const filename = path.basename(filePath);
  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
}

// Auth middleware
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

// --------------------------------------------------------------------------
// User registration and login
// --------------------------------------------------------------------------

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

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, id: user.id });
});

// --------------------------------------------------------------------------
// Books
// --------------------------------------------------------------------------

app.get('/api/books', (req, res) => {
  try {
    let rows;
    try {
      rows = db
        .prepare('SELECT id, title, author, synopsis, coverUrl FROM books ORDER BY title')
        .all();
    } catch (err) {
      rows = db.prepare('SELECT id, title, author FROM books ORDER BY title').all();
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
});

// --------------------------------------------------------------------------
// Recordings
// --------------------------------------------------------------------------

// Upload a recording (volunteers only) -> Azure Blob (prod) or local (dev)
app.post('/api/upload', authenticateToken, upload.single('audio'), async (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can upload' });
  }
  const { parentId, childId, guardianId } = req.body;
  if (!req.file || !parentId || !childId) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  const timestamp = new Date().toISOString();
  const blobName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
  const mime = req.file.mimetype || 'audio/webm';

  let publicUrl = null;
  let storedPath = null;

  try {
    if (blobContainerClient) {
      const blockBlob = blobContainerClient.getBlockBlobClient(blobName);
      await blockBlob.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: mime },
      });
      publicUrl = blockBlob.url;
      storedPath = `blob:${blobName}`;
    } else {
      fs.writeFileSync(path.join(uploadsDir, blobName), req.file.buffer);
      publicUrl = buildFileUrl(req, path.join(uploadsDir, blobName));
      storedPath = path.join(uploadsDir, blobName);
    }

    const result = db.prepare(
      'INSERT INTO recordings (filePath, url, parentId, childId, guardianId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(storedPath, publicUrl, parentId, childId, guardianId || null, req.user.id, timestamp);

    return res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Recording uploaded',
      url: publicUrl,
      createdAt: timestamp,
      parentId,
      childId,
      guardianId: guardianId || null,
      volunteerId: req.user.id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

// Role-filtered list with playable URL
app.get('/api/recordings', authenticateToken, (req, res) => {
  const uid = parseInt(req.user.id, 10);
  let rows = [];
  if (req.user.role === 'admin') {
    rows = db.prepare('SELECT * FROM recordings').all();
  } else if (req.user.role === 'volunteer') {
    rows = db.prepare('SELECT * FROM recordings WHERE volunteerId = ?').all(uid);
  } else if (req.user.role === 'parent') {
    rows = db.prepare('SELECT * FROM recordings WHERE parentId = ?').all(uid);
  } else if (req.user.role === 'guardian') {
    rows = db.prepare('SELECT * FROM recordings WHERE guardianId = ?').all(uid);
  }

  const list = rows.map((r) => ({
    ...r,
    createdAt: r.timestamp,
    url: r.url || (r.filePath && !String(r.filePath).startsWith('blob:')
      ? buildFileUrl(req, r.filePath)
      : r.url || null),
  }));
  res.json(list);
});

// Optional: child-scoped list with same visibility rules
app.get('/api/recordings/:childId', authenticateToken, (req, res) => {
  const childId = parseInt(req.params.childId, 10);
  const uid = parseInt(req.user.id, 10);
  let rows = [];
  if (req.user.role === 'admin') {
    rows = db.prepare('SELECT * FROM recordings WHERE childId = ?').all(childId);
  } else if (req.user.role === 'volunteer') {
    rows = db.prepare('SELECT * FROM recordings WHERE childId = ? AND volunteerId = ?').all(childId, uid);
  } else if (req.user.role === 'parent') {
    rows = db.prepare('SELECT * FROM recordings WHERE childId = ? AND parentId = ?').all(childId, uid);
  } else if (req.user.role === 'guardian') {
    rows = db.prepare('SELECT * FROM recordings WHERE childId = ? AND guardianId = ?').all(childId, uid);
  }
  const list = rows.map((r) => ({
    ...r,
    createdAt: r.timestamp,
    url: r.url || (r.filePath ? buildFileUrl(req, r.filePath) : null),
  }));
  res.json(list);
});

// --------------------------------------------------------------------------
// Ratings (optionally allow guardians too)
// --------------------------------------------------------------------------

app.post('/api/ratings', authenticateToken, (req, res) => {
  if (req.user.role !== 'parent' && req.user.role !== 'guardian') {
    return res.status(403).json({ message: 'Only parents/guardians can submit ratings' });
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

app.get('/api/ratings', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM ratings').all();
  res.json(rows);
});

// --------------------------------------------------------------------------
// Scheduling (unchanged)
// --------------------------------------------------------------------------

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

app.put('/api/schedules/:id/reject', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can reject schedules' });
  }
  const result = db.prepare('UPDATE schedules SET status = ? WHERE id = ?').run(
    'rejected',
    req.params.id
  );
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  res.json({ message: 'Schedule rejected' });
});

app.get('/api/schedules', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access all schedules' });
  }
  const rows = db.prepare('SELECT * FROM schedules').all();
  res.json(rows);
});

app.get('/api/schedules/volunteer/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const rows = db.prepare('SELECT * FROM schedules WHERE volunteerId = ?').all(req.params.id);
  res.json(rows);
});

app.get('/api/schedules/parent/:id', authenticateToken, (req, res) => {
  if (parseInt(req.user.id, 10) !== parseInt(req.params.id, 10) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const rows = db.prepare('SELECT * FROM schedules WHERE parentId = ?').all(req.params.id);
  res.json(rows);
});

// --------------------------------------------------------------------------
// Notifications / Users / Children (unchanged from your file)
// --------------------------------------------------------------------------

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

app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access users' });
  }
  const users = db
    .prepare('SELECT id, username, role, facilityId FROM users')
    .all()
    .map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      facilityId: u.facilityId
    }));
  res.json(users);
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete users' });
  }
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted' });
});

app.get('/api/children/:parentId', authenticateToken, (req, res) => {
  if (
    parseInt(req.user.id, 10) !== parseInt(req.params.parentId, 10) &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const scheduleChildren = db
    .prepare('SELECT DISTINCT childId FROM schedules WHERE parentId = ?')
    .all(req.params.parentId);
  const recordingChildren = db
    .prepare('SELECT DISTINCT childId FROM recordings WHERE parentId = ?')
    .all(req.params.parentId);
  const combined = new Set([
    ...scheduleChildren.map((r) => r.childId),
    ...recordingChildren.map((r) => r.childId)
  ]);
  res.json(Array.from(combined));
});

// --------------------------------------------------------------------------
// Start the server
// --------------------------------------------------------------------------

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
