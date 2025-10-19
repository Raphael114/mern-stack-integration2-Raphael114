const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Simple disk storage to /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/uploads - single file upload under field 'file'
router.post('/', upload.single('file'), (req, res, next) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { url } });
});

module.exports = router;
