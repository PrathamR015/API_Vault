require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/apis');
const startHealthCheckJob = require('./jobs/healthCheck');
const User = require('./models/User');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'mock_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_secret',
    callbackURL: "http://localhost:5000/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username || profile.displayName || 'Unknown',
          profileUrl: profile.profileUrl || '',
          avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);

// Start Background Jobs
startHealthCheckJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
