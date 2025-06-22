// server.js ✅ FINAL VERSION

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ Mount Routes
app.use('/api', authRoutes);               // e.g. /api/register, /api/login
app.use('/api', jobRoutes);                // e.g. /api/post-job, /api/my-jobs
app.use('/api/admin', adminRoutes);        // e.g. /api/admin/users, /api/admin/jobs

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Job Portal Backend is live!');
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
