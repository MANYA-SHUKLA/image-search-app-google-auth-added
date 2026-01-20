import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        // First, try to find user by provider and providerId (primary lookup)
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        
        if (!user && email) {
          // If not found, check if user exists with this email
          user = await User.findOne({ email });
        }
        
        if (user) {
          // Update existing user info
          user.name = profile.displayName || user.name;
          if (email) user.email = email;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          // Only update provider/providerId if they're not set
          if (!user.provider || !user.providerId) {
            user.provider = 'google';
            user.providerId = profile.id;
          }
          await user.save();
        } else {
          // Create new user (handle case where email might already exist)
          try {
            user = await User.create({
              provider: 'google',
              providerId: profile.id,
              name: profile.displayName,
              email: email,
              avatar: profile.photos?.[0]?.value,
            });
          } catch (createError) {
            // If creation fails due to duplicate email, find and use existing user
            if (createError.code === 11000 && email) {
              user = await User.findOne({ email });
              if (user) {
                user.name = profile.displayName || user.name;
                user.avatar = profile.photos?.[0]?.value || user.avatar;
                await user.save();
              } else {
                throw createError;
              }
            } else {
              throw createError;
            }
          }
        }
        
        return done(null, user);
      } catch (error) {
        console.error('Passport authentication error:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;

