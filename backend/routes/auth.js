import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('OAuth error:', err);
        return res.redirect(process.env.CLIENT_URL + '/?error=oauth_error');
      }
      if (!user) {
        console.error('OAuth authentication failed:', info);
        return res.redirect(process.env.CLIENT_URL + '/?error=auth_failed');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect(process.env.CLIENT_URL + '/?error=login_error');
        }
        return res.redirect(process.env.CLIENT_URL);
      });
    })(req, res, next);
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      provider: req.user.provider,
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;

