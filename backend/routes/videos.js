import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET /api/videos - Get all videos (with optional search & category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;

    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/videos/:id - Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('channelId', 'channelName description subscribers')
      .populate('uploader', 'username avatar')
      .populate('comments.userId', 'username avatar');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/videos - Upload a video (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, category } = req.body;
    if (!title || !videoUrl || !channelId)
      return res.status(400).json({ message: 'Title, videoUrl, and channelId are required' });

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const video = await Video.create({
      title, description, videoUrl, thumbnailUrl,
      channelId, category: category || 'All',
      uploader: req.user._id,
    });

    channel.videos.push(video._id);
    await channel.save();

    const populated = await video.populate('channelId', 'channelName');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/videos/:id - Update a video (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, thumbnailUrl, category } = req.body;
    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
    video.category = category || video.category;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/videos/:id - Delete a video (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: video._id } });
    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





export default router;