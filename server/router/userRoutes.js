const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Group = require('../models/group');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/admin/create-user', async (req, res) => {
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


// Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     // Just send a success response
//     res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with user ID and role as payload
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Payload (can include more user info if needed)
      'your_jwt_secret',  // Secret key (replace with a more secure key in production)
      { expiresIn: '1h' }  // Token expires in 1 hour
    );

    // Send the token as part of the response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


router.delete('/admin/remove-user/:username', async (req, res) => {
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

  router.get('/profile', async (req, res) => {
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
  
  router.put('/profile', async (req, res) => {
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

  // Add user to a group
  router.post('/admin/add-user-to-group', async (req, res) => {
    const { username, group } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's group
      user.group = group;
      await user.save();
  
      res.status(200).json({ message: `User ${username} added to group ${group}` });
    } catch (error) {
      console.error('Error adding user to group:', error);
      res.status(500).json({ message: 'Error adding user to group' });
    }
  });

  // User joins group by himself
  router.post('/user/join-group', async (req, res) => {
    const { username, group } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user's group
      user.group = group;
      await user.save();
  
      res.status(200).json({ message: `User ${username} joined group ${group}` });
    } catch (error) {
      console.error('Error joining group:', error);
      res.status(500).json({ message: 'Error joining group' });
    }
  });
  

module.exports = router;
