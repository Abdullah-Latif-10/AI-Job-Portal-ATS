const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Role = require('../models/Role');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
      callbackURL: process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/google/callback`
        : '/api/auth/google/callback', // Mount path under /api/auth
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by googleId or email
        let user = await User.findOne({ 
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
        }).populate('roleId');

        if (user) {
          if (user.isActive === false) {
            return done(null, false, { message: 'Account suspended' });
          }
          // Link Google ID if it isn't linked yet
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Find default Candidate Role
        const candidateRole = await Role.findOne({ name: 'Candidate' });

        // Parse name from Google display name
        const nameParts = profile.displayName ? profile.displayName.split(' ') : ['Google', 'User'];
        const firstName = nameParts[0] || 'Google';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        // Create new user using valid User schema properties
        user = await User.create({
          googleId: profile.id,
          firstName,
          lastName,
          email: profile.emails[0].value,
          roleId: candidateRole ? candidateRole._id : null
        });

        // Set populated roleId to match expected login format
        if (candidateRole) {
          user.roleId = candidateRole;
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Required if not using sessions (JWT architecture)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, null));