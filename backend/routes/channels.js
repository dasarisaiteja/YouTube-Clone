import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET /api/channels/:id
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate({ path: 'videos', populate: { path: 'channelId', select: 'channelName' } });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/channels - Create channel (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    if (!channelName)
      return res.status(400).json({ message: 'Channel name is required' });

    const exists = await Channel.findOne({ channelName });
    if (exists)
      return res.status(400).json({ message: 'Channel name already taken' });

    const channel = await Channel.create({
      channelName, description, channelBanner,
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;