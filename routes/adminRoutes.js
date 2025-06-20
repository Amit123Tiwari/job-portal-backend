const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET /api/admin/users
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/admin/jobs
router.get('/jobs', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/admin/applications
router.get('/applications', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const applications = await Application.find()
      .populate('job', 'title')
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE /api/admin/users/:id
router.delete('/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete users' });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete jobs' });
  }

  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
