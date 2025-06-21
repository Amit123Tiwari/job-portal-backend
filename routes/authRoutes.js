// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // import our User model
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router(); // create express router

// ✅ POST /api/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // ✅ POST /api/login - Login user
router.post('/login', async (req, res) => {
  try {
    // 1. Get email and password from the request body
    const { email, password } = req.body;

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 3. Compare the entered password with the saved hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 4. If email and password are correct
    res.status(200).json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // 3. Create and save the new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // 4. Respond with success
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
  {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
     phone: user.phone 
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);


    // 4. Send token + user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Protected Route Example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user  // this contains userId and role from the token
  });
});



module.exports = router;
