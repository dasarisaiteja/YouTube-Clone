import express from 'express';
import Video from '../models/Video.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /api/comments/:videoId - Add comment
router.post('/:videoId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = { userId: req.user._id, username: req.user.username, text };
    video.comments.push(comment);
    await video.save();

    const newComment = video.comments[video.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/comments/:videoId/:commentId - Edit comment
router.put('/:videoId/:commentId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    comment.text = text;
    await video.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/comments/:videoId/:commentId - Delete comment
router.delete('/:videoId/:commentId', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    video.comments.pull({ _id: req.params.commentId });
    await video.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;