// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ These must come BEFORE routes
app.use(cors());
app.use(express.json()); // ✅ this line is the most important!

// ✅ Connect your routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const jobRoutes = require('./routes/jobRoutes');
app.use('/api', jobRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);



// Test route
app.get('/', (req, res) => {
  res.send('✅ Hello from Job Portal Backend!');
});

// ✅ MongoDB connection
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
