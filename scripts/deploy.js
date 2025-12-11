const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const EzyVoting = await hre.ethers.getContractFactory('EzyVoting');
  const ezy = await EzyVoting.deploy();
  await ezy.waitForDeployment();
  const contractAddress = await ezy.getAddress();
  console.log('EzyVoting deployed to:', contractAddress);

  // Optionally write address to file
  const fs = require('fs');
  fs.writeFileSync('deployed-address.txt', contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
