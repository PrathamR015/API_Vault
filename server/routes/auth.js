const express = require('express');
const passport = require('passport');
const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173/';

// @desc    Auth with GitHub
// @route   GET /api/auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @desc    GitHub auth callback
// @route   GET /api/auth/github/callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: CLIENT_URL }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(CLIENT_URL);
  }
);
// @desc    Mock login for development
// @route   GET /api/auth/mock-login
router.get('/mock-login', async (req, res) => {
  try {
    const User = require('../models/User');
    let user = await User.findOne({ username: 'dev-guest' });
    if (!user) {
      user = await User.create({
        githubId: 'mock-dev-id',
        username: 'dev-guest',
        profileUrl: 'https://github.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
        isGuest: true
      });
    } else if (!user.isGuest) {
      user.isGuest = true;
      await user.save();
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in mock user', error: err.message });
      }
      res.redirect(CLIENT_URL);
    });
  } catch (error) {
    res.status(500).json({ message: 'Mock login error', error: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.user) {
    const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
    userObj.isGuest = Boolean(userObj.isGuest || userObj.username === 'dev-guest' || userObj.username === 'guest');
    res.json(userObj);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect(CLIENT_URL);
  });
});

module.exports = router;
