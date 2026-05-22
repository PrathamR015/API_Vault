const express = require('express');
const API = require('../models/API');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all APIs (with filtering and pagination)
// @route   GET /api/apis
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const { category, authType, search, ids, page = 1, limit = 24 } = req.query;
    
    // Build query object
    let query = {};
    if (category) query.category = category;
    if (authType) query.authType = authType;
    if (search) {
      query.$text = { $search: search };
    }
    if (ids) {
      const mongoose = require('mongoose');
      const objectIdArray = ids.split(',')
        .map(id => id.trim())
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));
      query._id = { $in: objectIdArray };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await API.countDocuments(query);
    const apis = await API.find(query)
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      apis,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Add a new API
// @route   POST /api/apis
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    // In a real app, verify req.user exists (auth middleware)
    const newAPI = new API({
      ...req.body,
      addedBy: req.user ? req.user._id : null
    });
    
    const savedAPI = await newAPI.save();
    res.status(201).json(savedAPI);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
});

// @desc    Upvote an API
// @route   PUT /api/apis/:id/upvote
router.put('/:id/upvote', ensureAuthenticated, async (req, res) => {
  try {
    const api = await API.findById(req.params.id);
    if (!api) return res.status(404).json({ message: 'API not found' });
    
    api.upvotes += 1;
    await api.save();
    res.json(api);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
