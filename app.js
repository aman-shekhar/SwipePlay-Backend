// app.js
const express = require('express');
const axios = require('axios');

const url = 'http://artemis.dview.io/artemis/v1/flush/1/sync/batch/mlympix.app';
const headers = {
    'cookie': 'auth_token=c6a8669e-ee95-4c42-9ef6-4a9b61380162;auth_user=1',
    'X-MASTER-KEY': 'e25c6e78-5a81-4e55-b068-e498e620fb24',
    'tenantId': '1',
    'Content-Type': 'application/json'
};
const app = express();
// const authMiddleware = require('./middleware/authMiddleware');

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`Welcome to Mlympix!! App Running on port ${PORT}`);
});
const likeCounts = {"data":[{"challengeID":"cricket34","likes":2},{"challengeID":"web1","likes":2},{"challengeID":"web2","likes":1},{"challengeID":"web3","likes":1},{"challengeID":"web4","likes":2},{"challengeID":"web5","likes":1},{"challengeID":"penalty1","likes":1},{"challengeID":"moksha1","likes":1},{"challengeID":"cricket35","likes":1},{"challengeID":"shatranj1","likes":1},{"challengeID":"hurdling1","likes":1},{"challengeID":"penalty4","likes":3},{"challengeID":"chaupar1","likes":3},{"challengeID":"archery4","likes":3},{"challengeID":"archery1","likes":3},{"challengeID":"cricket27","likes":3},{"challengeID":"cricket1","likes":3},{"challengeID":"penalty2","likes":3},{"challengeID":"hurdling2","likes":3},{"challengeID":"cricket19","likes":3},{"challengeID":"archery2","likes":2},{"challengeID":"penalty3","likes":2},{"challengeID":"archery3","likes":2},{"challengeID":"cricket21","likes":2},{"challengeID":"hurdling3","likes":2},{"challengeID":"cricket25","likes":1},{"challengeID":"penalty5","likes":1},{"challengeID":"archery11","likes":1},{"challengeID":"archery5","likes":1},{"challengeID":"archery6","likes":1},{"challengeID":"cricket2","likes":2},{"challengeID":"hurdling4","likes":2},{"challengeID":"cricket24","likes":3},{"challengeID":"cricket29","likes":3},{"challengeID":"archery7","likes":3},{"challengeID":"archery12","likes":2},{"challengeID":"cricket40","likes":2},{"challengeID":"cricket28","likes":2},{"challengeID":"cricket16","likes":2},{"challengeID":"cricket39","likes":2},{"challengeID":"archery8","likes":2},{"challengeID":"cricket9","likes":1},{"challengeID":"cricket12","likes":1},{"challengeID":"cricket6","likes":1},{"challengeID":"archery0","likes":1},{"challengeID":"cricket38","likes":2},{"challengeID":"cricket17","likes":2},{"challengeID":"cricket14","likes":2},{"challengeID":"archery9","likes":2},{"challengeID":"cricket5","likes":2},{"challengeID":"cricket30","likes":2},{"challengeID":"cricket3","likes":2},{"challengeID":"cricket13","likes":2}]}
const challengesData = require('./assets/ChallengesData.json')
const challengesOrderData = require('./assets/ChallengesOrderData.json')
const shuffleArray = require('./helper/helper')

app.get('/challenges/:userId', (req, res) => {
  const { userId } = req.params;
  console.log("===userId",userId)
  let curr_data;
  //add user in db when curr_data is not true  
  if(req?.query?.curr_data == 'true') { 
    shuffleArray(challengesOrderData?.record?.challengeIDs); 
    res.json(challengesOrderData) 
    curr_data = true;
  }
  else {
    shuffleArray(challengesData?.record?.challengeIDs); 
    res.json(challengesData);
    curr_data = false;
  }
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  const data = {
    messages: [
        {
            stream: 'login',
            event_type: "login_play_store",
            ts: currentTimestamp,
            props: {
              curr_data:curr_data,
              userId:userId,
              endpoint:"/challenges"
            }
        }
    ]
  };
  axios.post(url, data, { headers })
  .then(response => {
      console.log('Response:', response.data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

app.get('/likes', (req, res) => {
  res.json(likeCounts);
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  const data = {
    messages: [
        {
            stream: 'login',
            event_type: "login_play_store",
            ts: currentTimestamp,
            props: {
              data:likeCounts,
              endpoint:"/likes",
            }
        }
    ]
  };
  axios.post(url, data, { headers })
  .then(response => {
      console.log('Response:', response.data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

app.post('/postLikes/:userId', (req, res) => {
  const likes = req.body;
  const { userId } = req.params;
  
  //add likes in db
  // let likes = [{ "challengeID": "cricket34", "action": "like" },{"challengeID": "cricket35", "action": "unlike" }]
  console.log("===likes body ",likes)
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
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  const data = {
    messages: [
        {
            stream: 'login',
            event_type: "login_play_store",
            ts: currentTimestamp,
            props: {
              userId:userId,
              endpoint:"/postLikes",
              data:likes
            }
        }
    ]
  };
  axios.post(url, data, { headers })
  .then(response => {
      console.log('Response:', response.data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
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