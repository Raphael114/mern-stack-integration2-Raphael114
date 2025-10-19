const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../utils/authMiddleware');

// GET /api/categories?page=&limit=&q=
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const q = req.query.q || '';
    const filter = {};
    if (q) filter.name = new RegExp(q, 'i');
    const total = await Category.countDocuments(filter);
    const categories = await Category.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data: categories, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories
router.post(
  '/',
  auth.requireAuth,
  body('name').isString().isLength({ min: 2 }).withMessage('Name too short'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const existing = await Category.findOne({ name: req.body.name });
      if (existing) return res.status(400).json({ success: false, error: 'Category already exists' });
      const category = new Category(req.body);
      await category.save();
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
