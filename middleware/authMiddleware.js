// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for existence and correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // extract token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // put user data in request
    next(); // move to next middleware or controller
  } catch (err) {
    console.error('JWT Error:', err.message);
    res.status(401).json({ message: 'Invalid token' }); // ❗ 401 = Unauthorized
  }
};

module.exports = authMiddleware;
