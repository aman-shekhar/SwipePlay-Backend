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
const challengesLikesData = require('./assets/ChallengesLikesData.json')

app.get('/challenges/:userId', (req, res) => {
  const { userId } = req.params;
  console.log("===userId",userId)
  //add user in db when curr_data is not true
  req?.query?.curr_data == 'true' ? res.json(challengesOrderData) : res.json(challengesData);
});

app.get('/likes', (req, res) => {
  res.json(challengesLikesData);
});

app.post('/postLikes/:userId', (req, res) => {
  const likes = req.body;
  const { userId } = req.params;
  //add likes in db
  console.log("===batch like data ",likes)
  console.log("====user ",userId)
  res.sendStatus(200);
  // let testData = [{ "challengeID": "cricket34", "action": "like" },{"challengeID": "cricket35", "action": "unlike" }]
});

// const usersRoutes = require('./routes/users');
// app.use('/users', usersRoutes);
// app.use('/users', authMiddleware, usersRoutes);

// Start server
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


module.exports = app;