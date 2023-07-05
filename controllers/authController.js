const passport = require('passport');

// Authenticate user using Google Strategy
exports.authenticateUser = passport.authenticate('google', { session: false });

// Callback function for Google authentication
exports.handleAuthenticationCallback = (req, res) => {
  // User is authenticated, generate and send access token
  const accessToken = generateAccessToken(req.user);

  // Send the access token to the client
  res.json({ accessToken });
};


const jwt = require('jsonwebtoken');

// Generate an access token
function generateAccessToken(user) {
  // Define payload for the access token
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      // ... any other user data
    },
  };

  // Sign the token with your secret key
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return accessToken;
}

