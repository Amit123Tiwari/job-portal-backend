// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Step 1: Allowed frontend origins (for CORS)
const allowedOrigins = [
  'http://localhost:3000', // for local development
  'https://job-portal-frontend-bice.vercel.app' // ✅ your Vercel domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Step 2: Body parser
app.use(express.json());

// ✅ Step 3: Import and use your routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', adminRoutes);

// ✅ Step 4: Test route
app.get('/', (req, res) => {
  res.send('✅ Hello from Job Portal Backend!');
});

// ✅ Step 5: MongoDB Connection
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
