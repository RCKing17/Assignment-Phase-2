const express = require('express');
const Group = require('../models/group');
const User = require('../models/user');
const router = express.Router();

 // Get all groups
 router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups.map(group => group.name));  // Return only the group names
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve groups' });
  }
});

// Add a new group
router.post('/groups', async (req, res) => {
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
router.delete('/groups/:groupName', async (req, res) => {
  const { groupName } = req.params;

  try {
    await Group.findOneAndDelete({ name: groupName });
    res.status(204).end();  // No content to return
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove group' });
  }
});



module.exports = router;
