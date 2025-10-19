const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../utils/authMiddleware');

// GET /api/posts
router.get('/',
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const category = req.query.category;
      const filter = {};
      if (category) filter.category = category;
      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'name email')
        .populate('category', 'name');
      res.json({ success: true, data: posts, meta: { page, limit, total } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/posts/search?q=term
router.get('/search',
  async (req, res, next) => {
    try {
      const q = req.query.q || '';
      const regex = new RegExp(q, 'i');
      const posts = await Post.find({ $or: [{ title: regex }, { content: regex }, { excerpt: regex }] })
        .sort({ createdAt: -1 })
        .populate('author', 'name email')
        .populate('category', 'name');
      res.json({ success: true, data: posts });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/posts/:id/views - increment view count
router.post('/:id/views',
  param('id').isMongoId().withMessage('Invalid post id'),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      await post.incrementViewCount();
      res.json({ success: true, data: { viewCount: post.viewCount } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/posts/:id
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid post id'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const post = await Post.findById(req.params.id)
        .populate('author', 'name email')
        .populate('category', 'name');
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      res.json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/posts
router.post('/',
  auth.requireAuth,
  body('title').isString().isLength({ min: 3 }).withMessage('Title too short'),
  body('content').isString().isLength({ min: 10 }).withMessage('Content too short'),
  body('category').isMongoId().withMessage('Invalid category'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const post = new Post({ ...req.body, author: req.user.id });
      await post.save();
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id
router.put('/:id',
  auth.requireAuth,
  param('id').isMongoId().withMessage('Invalid post id'),
  body('title').optional().isString().isLength({ min: 3 }),
  body('content').optional().isString().isLength({ min: 10 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      // Allow only author to update
      if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' });
      Object.assign(post, req.body);
      await post.save();
      res.json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/:id
router.delete('/:id',
  auth.requireAuth,
  param('id').isMongoId().withMessage('Invalid post id'),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' });
      await post.remove();
      res.json({ success: true, data: {} });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/posts/:id/comments
router.post('/:id/comments',
  auth.requireAuth,
  param('id').isMongoId().withMessage('Invalid post id'),
  body('content').isString().isLength({ min: 1 }).withMessage('Comment cannot be empty'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      await post.addComment(req.user.id, req.body.content);
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
