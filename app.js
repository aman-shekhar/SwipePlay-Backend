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
const likeCounts = {"data":[{"challengeID":"cricket34","likes":0},{"challengeID":"web1","likes":0},{"challengeID":"penalty1","likes":0},{"challengeID":"moksha1","likes":0},{"challengeID":"cricket35","likes":0},{"challengeID":"shatranj1","likes":0},{"challengeID":"hurdling1","likes":0},{"challengeID":"penalty4","likes":0},{"challengeID":"chaupar1","likes":0},{"challengeID":"archery4","likes":0},{"challengeID":"archery1","likes":0},{"challengeID":"cricket27","likes":0},{"challengeID":"cricket1","likes":0},{"challengeID":"penalty2","likes":0},{"challengeID":"hurdling2","likes":0},{"challengeID":"cricket19","likes":0},{"challengeID":"archery2","likes":0},{"challengeID":"penalty3","likes":0},{"challengeID":"archery3","likes":0},{"challengeID":"cricket21","likes":0},{"challengeID":"hurdling3","likes":0},{"challengeID":"cricket25","likes":0},{"challengeID":"penalty5","likes":0},{"challengeID":"archery11","likes":0},{"challengeID":"archery5","likes":0},{"challengeID":"archery6","likes":0},{"challengeID":"cricket2","likes":0},{"challengeID":"hurdling4","likes":0},{"challengeID":"cricket24","likes":0},{"challengeID":"cricket29","likes":0},{"challengeID":"archery7","likes":0},{"challengeID":"archery12","likes":0},{"challengeID":"cricket40","likes":0},{"challengeID":"cricket28","likes":0},{"challengeID":"cricket16","likes":0},{"challengeID":"cricket39","likes":0},{"challengeID":"archery8","likes":0},{"challengeID":"cricket9","likes":0},{"challengeID":"cricket12","likes":0},{"challengeID":"cricket6","likes":0},{"challengeID":"archery0","likes":0},{"challengeID":"cricket38","likes":0},{"challengeID":"cricket17","likes":0},{"challengeID":"cricket14","likes":0},{"challengeID":"archery9","likes":0},{"challengeID":"cricket5","likes":0},{"challengeID":"cricket30","likes":0},{"challengeID":"cricket3","likes":0},{"challengeID":"cricket13","likes":0}]}
const challengesData = require('./assets/ChallengesData.json')
const challengesOrderData = require('./assets/ChallengesOrderData.json')
const shuffleArray = require('./helper/helper')

app.get('/challenges/:userId', (req, res) => {
  const { userId } = req.params;
  console.log("===userId",userId)
  //add user in db when curr_data is not true
  if(req?.query?.curr_data == 'true') { 
    shuffleArray(challengesOrderData?.record?.challengeIDs); 
    res.json(challengesOrderData) 
  }
  else {
    shuffleArray(challengesData?.record?.challengeIDs); 
    res.json(challengesData);
  }
});

app.get('/likes', (req, res) => {
  res.json(likeCounts);
});

app.post('/postLikes/:userId', (req, res) => {
  const likes = req.body;
  const { userId } = req.params;
  
  //add likes in db
  // let likes = [{ "challengeID": "cricket34", "action": "like" },{"challengeID": "cricket35", "action": "unlike" }]
  likes.forEach(item => {
    const { challengeID, action } = item;
    const challengeIndex = likeCounts.data.findIndex(data => data.challengeID === challengeID);

    if (challengeIndex !== -1) {
      if (action === "like") {
        likeCounts.data[challengeIndex].likes++;
      } else if (action === "unlike") {
        if (likeCounts.data[challengeIndex].likes > 0) {
          likeCounts.data[challengeIndex].likes--;
        }
      }
    }
  });
  console.log("===batch like data ",likes)
  console.log("====user ",userId)
  res.sendStatus(200);
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