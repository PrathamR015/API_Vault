require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/apis');
const curateRoutes = require('./routes/curate');
const projectRoutes = require('./routes/projects');
const startHealthCheckJob = require('./jobs/healthCheck');
const User = require('./models/User');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'https://api-vault-ochre.vercel.app' || 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,          // 👈 Required for cross-site cookies over HTTPS
    sameSite: 'none',      // 👈 Allows cookie to transfer from Render to Vercel
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'mock_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_secret',
    callbackURL: process.env.CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
    customHeaders: {
      "User-Agent": "api-vault-production"
    }
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
app.use('/api/curate', curateRoutes);
app.use('/api/projects', projectRoutes);

// Start Background Jobs
startHealthCheckJob();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
