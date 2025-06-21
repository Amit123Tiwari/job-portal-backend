const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ POST /api/post-job - Only for logged-in employers
router.post('/post-job', authMiddleware, async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

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
      .populate('postedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/my-jobs - Employers view their posted jobs
router.get('/my-jobs', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can view their jobs' });
  }

  try {
    const jobs = await Job.find({ postedBy: req.user.userId });
    res.status(200).json(jobs);
  } catch (error) {
  console.error('❌ Error in /my-jobs route:', error.message);
  res.status(500).json({ message: 'Server error', error: error.message });
}

});

// ✅ DELETE /api/my-job/:id - Employers delete their own jobs
router.delete('/my-job/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can delete jobs' });
  }

  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Employer delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/apply-job - Workers apply to jobs
router.post('/apply-job', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can apply' });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.userId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.userId
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error in /apply-job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/job-applicants/:jobId - Employers view applicants to their jobs
router.get('/job-applicants/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applicants' });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job || job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone');

    res.status(200).json({
      jobTitle: job.title,
      totalApplicants: applications.length,
      applicants: applications.map((app) => app.applicant)
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
