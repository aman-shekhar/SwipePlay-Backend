// app.js
const express = require('express');
const app = express();
// const authMiddleware = require('./middleware/authMiddleware');

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`Welcome to Mlympix!! App Running on port ${PORT}`);
});

const challengesData = require('./assets/ChallengesData.json')
const challengesOrderData = require('./assets/ChallengesOrderData.json')
app.get('/challenges', (req, res) => {
  req?.query?.curr_data == 'true' ? res.json(challengesOrderData) : res.json(challengesData);
});

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);
// app.use('/users', authMiddleware, usersRoutes);

// Start server
const PORT = process.env.port || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


module.exports = app;