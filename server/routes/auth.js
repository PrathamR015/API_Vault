const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with GitHub
// @route   GET /api/auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @desc    GitHub auth callback
// @route   GET /api/auth/github/callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:5173/');
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('http://localhost:5173/');
  });
});

module.exports = router;
