// routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const Application = require('../models/Application');


// ✅ POST /api/post-job - Only for logged-in employers
router.post('/post-job', authMiddleware, async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

    // Only employers can post jobs
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const job = new Job({
      title,
      description,
      location,
      salary,
      postedBy: req.user.userId
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/jobs - Show all job listings
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email') // include employer name/email
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/my-jobs - Employers can view their posted jobs
router.get('/my-jobs', authMiddleware, async (req, res) => {
  try {
    // Only allow employers to access this route
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view their jobs' });
    }

    // Find jobs where "postedBy" is the logged-in employer
    const myJobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });

    res.status(200).json(myJobs);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/apply-job - Only workers can apply to jobs
router.post('/apply-job', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Only workers can apply
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can apply to jobs' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.userId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user.userId
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Error in /apply-job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ GET /api/job-applicants/:jobId - Only employer who posted can view
router.get('/job-applicants/:jobId', authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // 1. Only employers can use this route
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applicants' });
    }

    // 2. Check if the job belongs to the logged-in employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not allowed to view applicants for this job' });
    }

    // 3. Find all applications for the job
    const applications = await Application.find({ job: jobId }).populate('applicant', 'name email');

    res.status(200).json({
      jobTitle: job.title,
      totalApplicants: applications.length,
      applicants: applications.map(app => app.applicant)
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
