const express = require('express');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "uploads") });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const USERS_FILE = path.join(__dirname, 'users.json');
const RATINGS_FILE = path.join(__dirname, 'ratings.json');
const RECORDINGS_FILE = path.join(__dirname, "recordings.json");

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
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const users = readJson(USERS_FILE);
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashed, role });
  writeJson(USERS_FILE, users);
  res.json({ message: 'Registration successful' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readJson(USERS_FILE);
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token, role: user.role });
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

if (!fs.existsSync(RATINGS_FILE)) writeJson(RATINGS_FILE, []);
if (!fs.existsSync(RECORDINGS_FILE)) writeJson(RECORDINGS_FILE, []);

app.post('/api/ratings', authenticateToken, (req, res) => {
  const { recording, rating } = req.body;
  if (!recording || !rating) return res.status(400).json({ message: 'Missing data' });
  const ratings = readJson(RATINGS_FILE);
  ratings.push({ recording, rating, userId: req.user.id, date: new Date().toISOString() });
  writeJson(RATINGS_FILE, ratings);
  res.json({ message: 'Rating saved' });
});

app.post('/api/upload', authenticateToken, upload.single('audio'), (req, res) => {
  const { parentId, childId, volunteerId } = req.body;
  const recordings = readJson(RECORDINGS_FILE);
  const newRecord = {
    id: Date.now(),
    parentId,
    childId,
    volunteerId,
    filePath: req.file.path,
    uploadedAt: new Date().toISOString(),
  };
  recordings.push(newRecord);
  writeJson(RECORDINGS_FILE, recordings);
  res.json({ message: 'Upload successful', id: newRecord.id });
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});