const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // Your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Custom logic to handle the authenticated user
      // You can save the user to your database or perform any other operations

      // Example: Assume the user is saved to the database
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        // ... other user data
      };

      // Call the done function to indicate the authentication is successful
      return done(null, user);
    }
  )
);


// app.js
const passport = require('passport');
const app = express();

app.use(passport.initialize());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to a protected route or perform other actions
    res.redirect('/dashboard');
  }
);
