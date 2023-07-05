const passport = require('passport');

// Middleware function to check authentication
const authenticate = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticate;


const jwt = require('jsonwebtoken');

// Middleware function to verify access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Verify the access token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    // Access token is valid, store the user object in the request
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;


// Middleware function to check user roles and permissions
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  // User has the required role, proceed to the next middleware or route handler
  next();
};

module.exports = authorize;
