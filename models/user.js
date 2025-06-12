// models/User.js

const mongoose = require('mongoose');

// 1. Define the structure of a user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // name must be provided
  },
  email: {
    type: String,
    required: true,
    unique: true // no two users can have same email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'], // only these 3 values allowed
    default: 'worker'
  },
  createdAt: {
    type: Date,
    default: Date.now // automatically adds current date
  }
});

// 2. Create a model based on the schema
const User = mongoose.model('User', userSchema);

// 3. Export the model so we can use it in other files
module.exports = User;
