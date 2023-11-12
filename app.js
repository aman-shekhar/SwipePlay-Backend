// app.js
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const http1 = require('http');
const server = http1.createServer(app);
const puppeteer = require('puppeteer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const session = require('express-session');
const io = require('socket.io')(http);
global.io = io;

const url = 'https://artemis.dview.io/artemis/v1/flush/1/sync/batch/mlympix.app';
const headers = {
    'cookie': 'auth_token=c6a8669e-ee95-4c42-9ef6-4a9b61380162;auth_user=1',
    'X-MASTER-KEY': 'e25c6e78-5a81-4e55-b068-e498e620fb24',
    'tenantId': '1',
    'Content-Type': 'application/json'
};

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());



passport.use(new GoogleStrategy({
  clientID: "550929696487-nrvl5r7li22qtlte9erujmmpor79ubpt.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Add logic to handle user profile and store in the database
  return done(null, profile);
}));


// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Set up routes for Google authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
      res.redirect('/devPortal');
  }
);

// Example route to check if the user is authenticated
app.get('/devPortal', (req, res) => {
  if (req.isAuthenticated()) {
      res.sendFile(__dirname + '/devPortal/index.html');
  } else {
      res.redirect('/auth/google');
  }
});



app.get('/measure-metrics/', async (req, res) => {
  const url = req.query.URL;
  // const url = "https://play.famobi.com/wrapper/archery-world-tour/A1000-10";
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Measure Metrics
    const fps = await measureFPS(page);
    const memoryUsage = await measureMemoryUsage(page);
    const networkLatency = await measureNetworkLatency(page);
    const domContentLoadedTime = await measureDomContentLoadedTime(page);
    const gameLoadingTime = await measureGameLoadingTime(page);
    const resourceWaterfall = await analyzeResourceWaterfall(page);
    const gpuUtilization = await assessGPUUtilization(page);

    // Format Metrics for Display
    const metrics = {
      fps,
      memoryUsage,
      networkLatency,
      domContentLoadedTime,
      gameLoadingTime,
      resourceWaterfall,
      gpuUtilization,
    };

    await browser.close();

    // Respond with Formatted JSON
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(metrics, null, 2)); // Indentation of 2 spaces for better readability
  } catch (error) {
    console.error(error);
    res.status(500).send('Error measuring metrics.');
  }
});

// Measure FPS (Frames Per Second)
async function measureFPS(page) {
  return await page.evaluate(() => {
    // Example: Implement logic to measure FPS here
    return 60; // Placeholder value, replace with actual measurement
  });
}

// Measure Memory Usage
async function measureMemoryUsage(page) {
  return await page.evaluate(() => {
    // Example: Implement logic to measure memory usage here
    return performance.memory.usedJSHeapSize; // Placeholder value, replace with actual measurement
  });
}

// Measure Network Latency
async function measureNetworkLatency(page) {
  const startTime = Date.now();
  await page.goto('about:blank');
  const endTime = Date.now();
  return endTime - startTime;
}

// Measure DOM Content Loaded Time
async function measureDomContentLoadedTime(page) {
  return await page.evaluate(() => {
    return window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  });
}

// Measure Game Loading Time (Example: Assuming a specific event)
async function measureGameLoadingTime(page) {
  return await page.evaluate(() => {
    // Example: Implement logic to measure game loading time here
    return 5000; // Placeholder value, replace with actual measurement
  });
}

// Analyze Resource Waterfall
async function analyzeResourceWaterfall(page) {
  return await page.evaluate(() => {
    // Example: Implement logic to analyze resource waterfall here
    const resources = window.performance.getEntriesByType('resource');
    console.log("===wefewfewf",window.performance)
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
    }));
  });
}

// Assess GPU Utilization
async function assessGPUUtilization(page) {
  return await page.evaluate(() => {
    // Example: Implement logic to assess GPU utilization here
    return 70; // Placeholder value, replace with actual measurement
  });
}

// Measure FPS (Frames Per Second)
// async function measureFPS(page) {
//   return await page.evaluate(() => {
//     const frameTimes = [];
//     let lastFrameTime = performance.now();

//     function measureFrame() {
//       const currentTime = performance.now();
//       const frameTime = currentTime - lastFrameTime;
//       frameTimes.push(frameTime);
//       lastFrameTime = currentTime;

//       if (frameTimes.length > 60) {
//         frameTimes.shift();
//       }

//       const fps = 1000 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length);
//       return Math.round(fps);
//     }

//     // Listen for RAF (Request Animation Frame) events to measure FPS
//     const observer = new PerformanceObserver((list) => {
//       for (const entry of list.getEntries()) {
//         measureFrame();
//       }
//     });

//     observer.observe({ entryTypes: ['resource', 'paint', 'frame'] });

//     // Return the current FPS
//     return measureFrame();
//   });
// }

// Measure Game Loading Time
// async function measureGameLoadingTime(page) {
//   const startTime = Date.now();
//   await page.waitForNavigation({ waitUntil: 'load' });
//   const endTime = Date.now();
//   return endTime - startTime;
// }

// const authMiddleware = require('./middleware/authMiddleware');

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`Welcome to Mlympix!! App Running on port ${PORT}`);
});
const likeCounts = {"data":[{"challengeID":"cricket34","likes":3},{"challengeID":"web1","likes":2},{"challengeID":"web2","likes":2},{"challengeID":"web3","likes":1},{"challengeID":"web4","likes":2},{"challengeID":"web5","likes":1},{"challengeID":"penalty1","likes":1},{"challengeID":"moksha1","likes":1},{"challengeID":"cricket35","likes":1},{"challengeID":"shatranj1","likes":1},{"challengeID":"hurdling1","likes":1},{"challengeID":"penalty4","likes":3},{"challengeID":"chaupar1","likes":3},{"challengeID":"archery4","likes":3},{"challengeID":"archery1","likes":3},{"challengeID":"cricket27","likes":3},{"challengeID":"cricket1","likes":3},{"challengeID":"penalty2","likes":3},{"challengeID":"hurdling2","likes":3},{"challengeID":"cricket19","likes":3},{"challengeID":"archery2","likes":2},{"challengeID":"penalty3","likes":2},{"challengeID":"archery3","likes":2},{"challengeID":"cricket21","likes":2},{"challengeID":"hurdling3","likes":2},{"challengeID":"cricket25","likes":1},{"challengeID":"penalty5","likes":1},{"challengeID":"archery11","likes":1},{"challengeID":"archery5","likes":1},{"challengeID":"archery6","likes":1},{"challengeID":"cricket2","likes":2},{"challengeID":"hurdling4","likes":2},{"challengeID":"cricket24","likes":3},{"challengeID":"cricket29","likes":3},{"challengeID":"archery7","likes":3},{"challengeID":"archery12","likes":2},{"challengeID":"cricket40","likes":2},{"challengeID":"cricket28","likes":2},{"challengeID":"cricket16","likes":2},{"challengeID":"cricket39","likes":2},{"challengeID":"archery8","likes":2},{"challengeID":"cricket9","likes":1},{"challengeID":"cricket12","likes":1},{"challengeID":"cricket6","likes":1},{"challengeID":"archery0","likes":1},{"challengeID":"cricket38","likes":2},{"challengeID":"cricket17","likes":2},{"challengeID":"cricket14","likes":2},{"challengeID":"archery9","likes":2},{"challengeID":"cricket5","likes":2},{"challengeID":"cricket30","likes":2},{"challengeID":"cricket3","likes":2},{"challengeID":"cricket13","likes":2}]}
const challengesData = require('./assets/ChallengesData.json')
const challengesOrderData = require('./assets/ChallengesOrderData.json')
const shuffleArray = require('./helper/helper')

app.get('/challenges/:userId', (req, res) => {
  const { userId } = req.params;
  console.log("===userId",userId)
  let curr_data, data;
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  //add user in db when curr_data is not true  
  if(req?.query?.curr_data == 'true') { 
    // shuffleArray(challengesOrderData?.record?.challengeIDs); 
    res.json(challengesOrderData) 
    curr_data = true;
    data = {
      messages: [
        {
          stream: "content_engagement",
          event_type: "feed_loaded",
          ts: currentTimestamp,
          props: {
            curr_data:curr_data,
            userId:userId,
            endpoint:"/challenges"
          }
        }
      ]
    };
  }
  else {
    // shuffleArray(challengesData?.record?.challengeIDs); 
    res.json(challengesData);
    curr_data = false;
    data = {
      messages: [
        {
          stream: "user_onboarding",
          event_type: "new_account_created",
          ts: currentTimestamp,
          props: {
            curr_data:curr_data,
            userId:userId,
            endpoint:"/challenges"
          }
        }
      ]
    };
  }
  
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
  const likesObj = {}
  likeCounts.data.forEach(item => {
    const { challengeID, likes } = item;
    likesObj[challengeID] = likes;
  })
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  const data = {
    messages: [
        {
            stream: "social_interaction",
            event_type: "likes_data_loaded",
            ts: currentTimestamp,
            props: {
              likes:likesObj,
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
  const likesObj = {}
  likes.forEach(item => {
    const { challengeID, action } = item;
    likesObj[challengeID] = action;
  })
  const currentTimestamp = Date.now(); // Returns the current timestamp in milliseconds since January 1, 1970 (Unix epoch)
  const data = {
    messages: [
        {
            stream: "social_interaction",
            event_type: "like_unlike",
            ts: currentTimestamp,
            props: {
              userId:userId,
              endpoint:"/postLikes",
              action:likesObj
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

// // API endpoint for sending a message
// app.post('/messages', (req, res) => {
//   const { sender, receiver, content } = req.body;
//   console.log("==== sender: "+sender+", receiver: "+receiver+", content: "+ content)
//   // Implement logic to save the message to the database
//   // You may use PostgreSQL queries or an ORM like Sequelize to interact with the database
//   // Emit the message to the receiver using socket.io
//   io.to(receiver).emit('newMessage', { sender, content });
//   res.status(201).json({ message: 'Message sent successfully' });
// });

// // API endpoint for retrieving messages for a specific conversation
// app.get('/messages/:conversationId', (req, res) => {
//   const conversationId = req.params.conversationId;
//   // Implement logic to fetch messages from the database for the given conversationId
//   // Return the messages as the response
//   res.json(messages);
// });

// io.on('connection', (socket) => {
//   const userId = socket.handshake.query.userId;

//   // Join the user to a room based on their userId
//   socket.join(userId);

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     // Perform any necessary clean-up on disconnection
//   });
// });

// const usersRoutes = require('./routes/users');
// app.use('/users', usersRoutes);
// app.use('/users', authMiddleware, usersRoutes);

app.use(express.static(path.join(__dirname, 'devPortal')));
app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/devPortal', (req, res) => {
	res.sendFile(__dirname + '/devPortal/index.html');
});
app.use(express.static("devPortal"));
app.use(express.static('public'))
const activeUsers = new Set();
io.on('connection', (socket) => {
  console.log('User connected');

	socket.on('send name', (username) => {
    console.log("====here",username,activeUsers)
    if (activeUsers.size <= 2 && (username === 'user1' || username === 'user2')) {
      socket.username = username;
      activeUsers.add(username);
      console.log(`${username} joined the chat.`);
      // io.emit('message', `${username} joined the chat.`);
      io.emit('send name', (username));
    } else {
      socket.emit('invalid');
      socket.disconnect(true);
    }
  });

	socket.on('send message', (chat) => {
		io.emit('send message', (chat));
	});

  socket.on('disconnect', () => {
    if (socket.username) {
      activeUsers.delete(socket.username);
      console.log(`${socket.username} left the chat.`);
      io.emit('message', `${socket.username} left the chat.`);
    }
    console.log('User disconnected', socket.username);
  });
});
// Start server
const PORT = process.env.port || 3000;
http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;