import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import session from 'express-session';
import passport from '../server/config/passport.js';
import connectDB from '../server/config/database.js';
import authRoutes from '../server/routes/auth.js';
import searchRoutes from '../server/routes/search.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes - Remove /api prefix for Vercel serverless
app.use('/auth', authRoutes);
app.use('/', searchRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image Search API Server',
    version: '1.0.0',
    madeBy: 'Made with ❤️ by Manya Shukla',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      search: '/api/search'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Export for Vercel serverless
export default app;
