// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const Application = require('../models/Application');



// ✅ GET /api/admin/users - Only for admin
router.get('/admin/users', authMiddleware, async (req, res) => {
  // 🛡️ Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const users = await User.find().select('-password'); // remove passwords from result
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ GET /api/admin/jobs - Only for admin
router.get('/admin/jobs', authMiddleware, async (req, res) => {
  // 🛡️ Check admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email') // show employer info
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/admin/applications - Only for admin
router.get('/admin/applications', authMiddleware, async (req, res) => {
  // 🛡️ Check role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  try {
    const applications = await Application.find()
      .populate('job', 'title')             // show job title
      .populate('applicant', 'name email')  // show applicant info
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ DELETE /api/admin/user/:id - Admin deletes a user
router.delete('/admin/user/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete users' });
  }

  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ DELETE /api/admin/job/:id - Admin deletes a job
router.delete('/admin/job/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete jobs' });
  }

  try {
    const jobId = req.params.id;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
