const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  passwordHash: { type: String },
  role: { type: String, enum: ['admin','voter'], required: true },
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
