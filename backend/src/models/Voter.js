const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hashedVoterId: { type: String, required: true },
  constituencyId: { type: Number, required: true },
  walletAddress: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Voter', VoterSchema);
