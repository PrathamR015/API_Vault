const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please login first.' });
};

const ensureNotGuest = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user.isGuest || req.user.username === 'dev-guest' || req.user.username === 'guest') {
      return res.status(403).json({ 
        message: 'Authentication required. Guests cannot view, create, or modify Projects and API Studio.' 
      });
    }
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please login first.' });
};

module.exports = { ensureAuthenticated, ensureNotGuest };
