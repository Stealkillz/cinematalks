const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDirectory(UPLOADS_DIR);
ensureDirectory(DATA_DIR);

if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify([]));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30 MB limit for short clips
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WEBP images and MP4/WEBM videos are allowed.'));
    }
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

function readPosts() {
  const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/posts', upload.single('media'), (req, res) => {
  const { title, description, actorCategory, cinemaRegion } = req.body;

  if (!title || !description || !actorCategory || !cinemaRegion) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'A media file is required.' });
  }

  const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

  const newPost = {
    id: Date.now(),
    title,
    description,
    actorCategory,
    cinemaRegion,
    mediaPath: `/uploads/${req.file.filename}`,
    mediaType,
    originalFileName: req.file.originalname,
    createdAt: new Date().toISOString()
  };

  const posts = readPosts();
  posts.push(newPost);
  writePosts(posts);

  res.status(201).json(newPost);
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'Upload failed.' });
  }
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CinemaTalks portal server running on http://localhost:${PORT}`);
});
