const express = require('express');
const cors = require('cors');
const path = require('path');

const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => res.send('MERN Blog API is running'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Server Error' });
});

module.exports = app;
