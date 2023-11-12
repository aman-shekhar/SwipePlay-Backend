const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "550929696487-nrvl5r7li22qtlte9erujmmpor79ubpt.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Add logic to handle user profile and store in the database
    return done(null, profile);
}));
