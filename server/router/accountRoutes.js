// routes/accountRoutes.js

const express = require('express');
const User = require('../models/user');  // Adjust this path based on where your User model is located
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Route to get account details
router.get('/account', verifyToken, async (req, res) => {
  try {
    // Now req.user contains the user data (from the decoded token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userid: user._id,
      username: user.username,
      useremail: user.email,
      usergroup: user.groups,
      userrole: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user data' });
  }
});


// router.get('/account', (req, res) => {
//   // Simplify or replace the route to return account data without session validation
//   res.status(200).json({ message: 'Account route' });
// });

  
  
// router.get('/account', (req, res) => {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     // Respond with the logged-in user's data
//     res.json({
//       userid: req.session.user.id,
//       username: req.session.user.username,
//       role: req.session.user.role
//     });
//   });
  

module.exports = router;
