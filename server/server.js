const PORT = 3000;
const mongoose = require ('mongoose')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server, { cors: { origin: "*" } });
const multer = require('multer');
const path = require('path');
const { PeerServer } = require('peer');
const { ExpressPeerServer } = require('peer');


app.use(cors());
app.use(bodyParser.json());



mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const User = require('./models/user');
const Group = require('./models/group');
const Channel = require('./models/channel');
const Message = require('./models/message');

// Import routes
const userRoutes = require('./router/userRoutes');
const groupRoutes = require('./router/groupRoutes');
const channelRoutes = require('./router/channelRoutes');
const messageRoutes = require('./router/messageRoutes');
const accountRoutes = require('./router/accountRoutes');

// Routes
app.use(userRoutes);
app.use(groupRoutes);
app.use(channelRoutes);
app.use(messageRoutes);
app.use(accountRoutes);

//Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');  // Directory where images and videos will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));  // File will be saved with a timestamp to prevent overwriting
//   }
// });

// // Initialize multer middleware for image and video file types
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images and Videos Only!');
//     }
//   }
// }).single('media');  // 'media' is the form field name for file upload

// // Define the upload route
// app.post('/upload', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ message: err });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     res.status(200).json({
//       message: 'File uploaded successfully',
//       filePath: `/uploads/${req.file.filename}`
//     });
//   });
// });

// // Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the chat system API');
  });
  
  // Registration route
  app.post('/admin/create-user', async (req, res) => {
    const { username, password, email, role, group } = req.body;
  
    try {
      const newUser = new User({
        username,
        password,
        email,
        role,
        group
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  // delete route
  app.delete('/admin/remove-user/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOneAndDelete({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User removed successfully' });
    } catch (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ message: 'Error removing user' });
    }
  });
  
  
  // Login route
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Compare the entered password with the hashed password stored in the database
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // If successful, send a success message
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });

  
 // Get all groups
 app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups.map(group => group.name));  // Return only the group names
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve groups' });
  }
});

// Add a new group
app.post('/groups', async (req, res) => {
  const { groupName } = req.body;
  try {
    const newGroup = new Group({ name: groupName });
    await newGroup.save();
    res.status(201).json(newGroup.name);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add group', error });
  }
});

// Remove a group
app.delete('/groups/:groupName', async (req, res) => {
  const { groupName } = req.params;

  try {
    await Group.findOneAndDelete({ name: groupName });
    res.status(204).end();  // No content to return
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove group' });
  }
});

app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your_jwt_secret');  // Decode the token

    const user = await User.findById(decoded.id);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      group: user.group,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.put('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract the token

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details based on the request body
    user.email = req.body.email || user.email;
    user.group = req.body.group || user.group;
    user.role = req.body.role || user.role;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Set up WebSocket connection
// io.on('connection', (socket) => {
//   const token = socket.handshake.query.token;

//   if (token) {
//     try {
//       const user = jwt.verify(token, 'your_jwt_secret');  // Verify the token
//       socket.user = user;  // Attach the user to the socket
//       console.log(`User ${user.username} connected`);

//       // Handle messages and other socket events here, using `socket.user`
//       socket.on('sendMessage', (data) => {
//         const { message } = data;
//         console.log(`${socket.user.username} sent a message: ${message}`);
        
//         // Broadcast the message to all clients except the sender
//         socket.broadcast.emit('receiveMessage', { username: socket.user.username, message });
//       });
//     } catch (error) {
//       console.error('Invalid token');
//       socket.disconnect();  // Disconnect the socket if the token is invalid
//     }
//   } else {
//     console.error('No token provided');
//     socket.disconnect();  // Disconnect the socket if no token is provided
//   }
// });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listening for incoming messages with useername
  socket.on('sendMessage', (messageData) => {
    console.log(`${messageData.username} sent a message: ${messageData.message}`);

    // Broadcast the message to all clients except the sender
    socket.broadcast.emit('receiveMessage', messageData);
  });

  // Listening for a user joining the chat
  socket.on('userJoined', (username) => {
    console.log(`${username} joined the chat`);
    socket.broadcast.emit('userJoinedNotification', `${username} has joined the chat`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Initialize PeerJS Server
const peerServer = ExpressPeerServer(server, {
  debug: true, // Enable debug for easier troubleshooting
  path: '/peerjs', // The path for peerjs
});

// Use PeerJS Server
app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log('New peer connected: ', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('Peer disconnected: ', client.id);
});

app.post('/send-message', (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) return res.status(500).send('User not found');
    
    const message = {
      username: user.username,
      message: userMessage,
      profileImage: user.profileImage // Include profile image in the message object
    };
    
    // Emit the message to all clients through the socket
    io.emit('newMessage', message);

    res.status(200).send('Message sent');
  });
});

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
  
//     // Event listener for joining a chat channel
//     socket.on('joinChannel', (channelId) => {
//       socket.join(channelId);
//       console.log(`User ${socket.id} joined channel ${channelId}`);
//       io.to(channelId).emit('userJoined', `User ${socket.id} has joined the channel`);
//     });
  
//     // Event listener for sending a message
//     socket.on('sendMessage', ({ channelId, message }) => {
//       // Broadcast message to everyone in the channel
//       io.to(channelId).emit('receiveMessage', message);
//     });
  
//     // Event listener for disconnecting from the chat
//     socket.on('disconnect', () => {
//       console.log('A user disconnected:', socket.id);
//     });
//   });

// app.post('/login', require('./router/postLogin'));
// app.post('/loginafter', require('./router/postLoginAfter'));
// app.post('/createUser', require('./router/postCreateUser'));
// app.delete('/removeUser/:username', require('./router/postRemoveUser'));

server.listen(PORT, () => {
    console.log('Server listening on: ' + PORT);
});

// module.exports = app;