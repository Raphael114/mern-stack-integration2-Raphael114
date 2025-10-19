const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const existing = await User.findOne({ email: req.body.email });
      if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email }, token } });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email }, token } });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
