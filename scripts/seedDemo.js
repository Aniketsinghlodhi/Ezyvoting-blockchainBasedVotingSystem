const hre = require('hardhat');
require('dotenv').config();

/**
 * seedDemo.js — Seed the EzyVoting contract with demo data
 * 
 * Assumes:
 * - Contract is deployed at CONTRACT_ADDRESS (env var)
 * - Deployer account (first signer) is the contract owner and admin
 * - Network is configured (hardhat, sepolia, etc.)
 * 
 * What it does:
 * - Adds 2 constituencies
 * - Adds 4 candidates (2 per constituency)
 * - Creates and starts 1 election
 * - Registers 2 sample voters
 * 
 * Usage:
 *   npx hardhat run scripts/seedDemo.js --network hardhat
 *   or with env vars:
 *   CONTRACT_ADDRESS=0x... npx hardhat run scripts/seedDemo.js --network localhost
 */

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS env var not set. Deploy contract first.');
  }

  const [owner, voter1, voter2] = await hre.ethers.getSigners();
  console.log('Using deployer account:', owner.address);

  const EzyVoting = await hre.ethers.getContractFactory('EzyVoting');
  const contract = EzyVoting.attach(contractAddress);

  console.log('\n=== Seeding demo data ===\n');

  // 0. Grant owner admin privileges
  console.log('Granting admin privileges to owner...');
  let tx = await contract.connect(owner).addAdmin(owner.address);
  await tx.wait();
  console.log('  ✓ Owner is now admin');

  // 1. Add constituencies
  console.log('\nAdding constituencies...');
  tx = await contract.connect(owner).addConstituency('North Region');
  await tx.wait();
  console.log('  ✓ Added North Region (constituency id 1)');

  tx = await contract.connect(owner).addConstituency('South Region');
  await tx.wait();
  console.log('  ✓ Added South Region (constituency id 2)');

  // 2. Add candidates
  console.log('\nAdding candidates...');
  tx = await contract.connect(owner).registerCandidate('Alice Kumar', 'Party A', 1);
  await tx.wait();
  console.log('  ✓ Added Alice Kumar (Party A, North) - candidate id 1');

  tx = await contract.connect(owner).registerCandidate('Bob Singh', 'Party B', 1);
  await tx.wait();
  console.log('  ✓ Added Bob Singh (Party B, North) - candidate id 2');

  tx = await contract.connect(owner).registerCandidate('Carol Patel', 'Party A', 2);
  await tx.wait();
  console.log('  ✓ Added Carol Patel (Party A, South) - candidate id 3');

  tx = await contract.connect(owner).registerCandidate('David Verma', 'Party B', 2);
  await tx.wait();
  console.log('  ✓ Added David Verma (Party B, South) - candidate id 4');

  // 3. Create and start election
  console.log('\nCreating election...');
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - 10; // started 10 seconds ago
  const endTime = now + 86400; // ends in 24 hours
  tx = await contract.connect(owner).createElection('General Election 2025', startTime, endTime);
  await tx.wait();
  console.log('  ✓ Created election (election id 1)');

  console.log('Starting election...');
  tx = await contract.connect(owner).startElection(1);
  await tx.wait();
  console.log('  ✓ Election started (open for voting)');

  // 4. Register sample voters
  console.log('\nRegistering sample voters...');
  const { ethers } = hre;
  const voterId1 = 'demo-voter-1';
  const voterId2 = 'demo-voter-2';
  const hashedId1 = ethers.keccak256(ethers.toUtf8Bytes(voterId1));
  const hashedId2 = ethers.keccak256(ethers.toUtf8Bytes(voterId2));

  tx = await contract.connect(owner).registerVoter(voter1.address, hashedId1, 1, 'Sample Voter One');
  await tx.wait();
  console.log(`  ✓ Registered voter1 (${voter1.address.substring(0, 6)}...) in North Region`);
  console.log(`    Voter ID (for login): ${voterId1}`);

  tx = await contract.connect(owner).registerVoter(voter2.address, hashedId2, 2, 'Sample Voter Two');
  await tx.wait();
  console.log(`  ✓ Registered voter2 (${voter2.address.substring(0, 6)}...) in South Region`);
  console.log(`    Voter ID (for login): ${voterId2}`);

  console.log('\n=== Seeding complete ===\n');
  console.log('Demo credentials for testing:');
  console.log(`  Voter 1 address: ${voter1.address}`);
  console.log(`  Voter 1 ID: ${voterId1}`);
  console.log(`  Voter 2 address: ${voter2.address}`);
  console.log(`  Voter 2 ID: ${voterId2}`);
  console.log('\nNext steps:');
  console.log('  1. Use voter1/voter2 addresses in frontend to connect MetaMask');
  console.log('  2. Load voter status with their voter IDs');
  console.log('  3. Vote for a candidate (e.g., Alice for voter1, Carol for voter2)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
