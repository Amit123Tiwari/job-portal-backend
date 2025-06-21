// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
console.log("Incoming Auth Header:", req.headers.authorization);

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
