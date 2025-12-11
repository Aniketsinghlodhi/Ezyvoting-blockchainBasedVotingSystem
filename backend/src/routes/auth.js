const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

const User = require('../models/User');
const Voter = require('../models/Voter');
const ethersService = require('../services/ethersService');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Admin register (protected by invite code)
router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password, walletAddress, inviteCode } = req.body;
    // Check invite code
    const validCode = process.env.ADMIN_INVITE_CODE || 'demo-invite-123';
    if (inviteCode !== validCode) return res.status(403).json({ error: 'Invalid invite code' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const u = new User({ name, email, passwordHash: hash, role: 'admin', walletAddress });
    await u.save();
    const token = jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET || 'change_this_secret');
    res.json({ ok: true, token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email, role: 'admin' });
    if (!u) return res.status(400).json({ error: 'Not found' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid' });
    const token = jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET || 'change_this_secret');
    res.json({ ok: true, token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Voter register (admin-only - protected by auth)
router.post('/voter/register', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, rawVoterId, constituencyId, walletAddress } = req.body;
    // hash voter id
    const hashedVoterId = ethers.keccak256(ethers.toUtf8Bytes(rawVoterId));
    // save to DB
    const v = new Voter({ name, hashedVoterId, constituencyId, walletAddress });
    await v.save();

    // Attempt on-chain registration using backend signer if available
    try {
      const contract = ethersService.getContract();
      if (contract) {
        const tx = await contract.registerVoter(walletAddress, hashedVoterId, constituencyId, name);
        const receipt = await tx.wait();
        return res.json({ ok: true, txHash: receipt.transactionHash });
      }
    } catch (chainErr) {
      console.warn('On-chain register failed', chainErr.message);
    }

    res.json({ ok: true, msg: 'Registered off-chain' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Voter login (simple password or wallet-based)
router.post('/voter/login', async (req, res) => {
  try {
    const { walletAddress, password } = req.body;
    const v = await Voter.findOne({ walletAddress });
    if (!v) return res.status(400).json({ error: 'Voter not found' });
    // For demo we do not store password for voters; return token
    const token = jwt.sign({ id: v._id, role: 'voter', name: v.name, walletAddress: v.walletAddress }, process.env.JWT_SECRET || 'change_this_secret');
    res.json({ ok: true, token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Protected example: get my profile
router.get('/me', authMiddleware, async (req, res) => {
  if (req.user.role === 'voter') {
    const v = await Voter.findById(req.user.id);
    return res.json({ ok: true, profile: v });
  }
  if (req.user.role === 'admin') {
    const u = await User.findById(req.user.id);
    return res.json({ ok: true, profile: u });
  }
  res.status(400).json({ error: 'Unknown role' });
});

// Admin list voters
router.get('/admin/voters', authMiddleware, adminOnly, async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json({ ok: true, voters });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
