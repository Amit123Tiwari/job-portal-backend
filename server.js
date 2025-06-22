const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Setup CORS for Vercel frontend
app.use(cors({
  origin: 'https://job-portal-frontend-bice.vercel.app',
  credentials: true
}));

app.use(express.json());

// Your route connections
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ Hello from Job Portal Backend!');
});

// Connect to MongoDB and start the server
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
