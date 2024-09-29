const express = require('express');
const Channel = require('../models/channel');
const Message = require('../models/message');
const router = express.Router();

// Send a message in a channel
router.post('/channels/:channelId/messages', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const newMessage = new Message({
      content: req.body.content,
      sender: req.body.senderId,
      channel: channel._id,
    });
    await newMessage.save();

    channel.messages.push(newMessage._id);
    await channel.save();

    res.status(201).json({ message: 'Message sent', message: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Get all messages in a channel
router.get('/channels/:channelId/messages', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId).populate('messages');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.status(200).json(channel.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

module.exports = router;
