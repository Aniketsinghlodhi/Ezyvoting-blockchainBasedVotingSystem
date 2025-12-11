const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let provider, signer, contract;

function init() {
  const rpc = process.env.RPC_URL || 'http://127.0.0.1:8545';
  provider = new ethers.JsonRpcProvider(rpc);
  if (process.env.PRIVATE_KEY) {
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }
  const contractAddress = process.env.CONTRACT_ADDRESS || '';
  const abiPath = path.join(__dirname, '..', '..', 'artifacts', 'contracts', 'EzyVoting.sol', 'EzyVoting.json');
  if (contractAddress && fs.existsSync(abiPath)) {
    const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    contract = new ethers.Contract(contractAddress, artifact.abi, signer || provider);
  }
}

function getContract() {
  if (!contract) init();
  return contract;
}

module.exports = { init, getContract };
