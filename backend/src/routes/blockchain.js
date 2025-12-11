const express = require('express');
const router = express.Router();
const ethersService = require('../services/ethersService');

// Example: call registerVoter on-chain using backend signer
router.post('/register-voter', async (req, res) => {
  try {
    const { voterAddress, hashedVoterId, constituencyId, name } = req.body;
    const contract = ethersService.getContract();
    if (!contract) return res.status(500).json({ error: 'Contract not configured' });
    const tx = await contract.registerVoter(voterAddress, hashedVoterId, constituencyId, name);
    const receipt = await tx.wait();
    return res.json({ ok: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
