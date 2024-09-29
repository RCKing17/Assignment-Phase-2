const express = require('express');
const Group = require('../models/group');
const Channel = require('../models/channel');
const router = express.Router();

// Create a new channel within a group
router.post('/groups/:groupId/channels', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const newChannel = new Channel({ name: req.body.name, group: group._id });
    await newChannel.save();

    group.channels.push(newChannel._id);
    await group.save();

    res.status(201).json({ message: 'Channel created', channel: newChannel });
  } catch (error) {
    res.status(500).json({ message: 'Error creating channel', error });
  }
});

// Get all channels in a group
router.get('/groups/:groupId/channels', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('channels');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(group.channels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channels', error });
  }
});

module.exports = router;
