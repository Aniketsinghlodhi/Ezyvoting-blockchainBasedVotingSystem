const hre = require('hardhat');
require('dotenv').config();

/**
 * verify.js — Verify EzyVoting contract on Etherscan
 * 
 * Usage:
 *   npx hardhat run scripts/verify.js --network sepolia
 * 
 * Prerequisites:
 * - Contract deployed on Sepolia (address in deployed-address.txt or env)
 * - ETHERSCAN_API_KEY set in .env
 */

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || require('fs').readFileSync('deployed-address.txt', 'utf8').trim();
  
  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS not set. Deploy contract first or set env var.');
  }

  console.log(`\n=== Verifying EzyVoting at ${contractAddress} ===\n`);

  if (!process.env.ETHERSCAN_API_KEY) {
    console.warn('⚠️  ETHERSCAN_API_KEY not set. Verification will fail.');
    console.log('Get one at https://etherscan.io/apis (or https://sepolia.etherscan.io/apis for testnet)\n');
  }

  try {
    console.log('Verifying contract...');
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [], // EzyVoting has no constructor args
    });
    console.log('✓ Contract verified on Etherscan!\n');
    console.log(`View at: https://sepolia.etherscan.io/address/${contractAddress}`);
  } catch (err) {
    if (err.message.includes('Already Verified')) {
      console.log('✓ Contract already verified on Etherscan\n');
      console.log(`View at: https://sepolia.etherscan.io/address/${contractAddress}`);
    } else {
      console.error('Verification failed:', err.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
