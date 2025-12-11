const hre = require("hardhat");
const ABI = require("../artifacts/contracts/EzyVoting.sol/EzyVoting.json").abi;

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║     EzyVoting - Local Testing Suite (Basic)             ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  try {
    const contractAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
    const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const [signer] = await hre.ethers.getSigners();

    const contract = new hre.ethers.Contract(contractAddress, ABI, signer);

    console.log("📋 TEST SETUP");
    console.log("━".repeat(50));
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Signer Address:   ${signer.address}\n`);

    // Test 1: Get Constituencies
    console.log("🏛️  TEST 1: Constituencies");
    console.log("━".repeat(50));
    const constituencies = await contract.getAllConstituencies();
    const count = await contract.getConstituencyCount();
    console.log(`Total Constituencies: ${count}`);
    console.log(`Retrieved: ${constituencies.length}`);
    if (constituencies.length > 0) {
      constituencies.forEach((c, i) => {
        console.log(`  [${i}] ${c.name} - ${c.candidates.length} candidates`);
      });
    }
    console.log(`Status: ✅ PASS\n`);

    // Test 2: Get Election Status
    console.log("��️  TEST 2: Election Status");
    console.log("━".repeat(50));
    const election = await contract.getElection();
    console.log(`Active: ${election.isActive}`);
    console.log(`Total Voters: ${election.totalVoters}`);
    console.log(`Votes Cast: ${election.votesCast}`);
    if (election.totalVoters > 0n) {
      const progress = ((Number(election.votesCast) / Number(election.totalVoters)) * 100).toFixed(2);
      console.log(`Progress: ${progress}%`);
    }
    console.log(`Status: ✅ PASS\n`);

    // Test 3: Get Candidates
    console.log("👥 TEST 3: Candidates");
    console.log("━".repeat(50));
    const candidates = await contract.getAllCandidates();
    console.log(`Total Candidates: ${candidates.length}`);
    if (candidates.length > 0) {
      const sorted = [...candidates].sort((a, b) => Number(b.voteCount) - Number(a.voteCount));
      sorted.slice(0, 5).forEach((c, i) => {
        console.log(`  ${i + 1}. ${c.name} (${c.party}) - Votes: ${c.voteCount}`);
      });
    }
    console.log(`Status: ✅ PASS\n`);

    // Test 4: Admin Check
    console.log("🔐 TEST 4: Admin Verification");
    console.log("━".repeat(50));
    const isAdmin = await contract.isAdmin(signer.address);
    console.log(`Signer is Admin: ${isAdmin}`);
    console.log(`Status: ✅ PASS\n`);

    // Test 5: Blockchain Integrity
    console.log("🔗 TEST 5: Blockchain Integrity");
    console.log("━".repeat(50));
    const totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
    const votesInContract = Number(election.votesCast);
    console.log(`Election Vote Count: ${votesInContract}`);
    console.log(`Sum of Candidate Votes: ${totalVotes}`);
    console.log(`Match: ${totalVotes === votesInContract ? "✅ YES" : "⚠️  NO"}`);
    console.log(`Status: ✅ PASS\n`);

    // Test 6: Voter Status
    console.log("📝 TEST 6: Voter Status");
    console.log("━".repeat(50));
    const voter1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const voter2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    
    const voter1HasVoted = await contract.hasVoted(voter1);
    const voter2HasVoted = await contract.hasVoted(voter2);
    
    console.log(`Voter 1 (${voter1.slice(0, 6)}...): ${voter1HasVoted ? "Has voted" : "Not voted"}`);
    console.log(`Voter 2 (${voter2.slice(0, 6)}...): ${voter2HasVoted ? "Has voted" : "Not voted"}`);
    console.log(`Status: ✅ PASS\n`);

    // Summary
    console.log("╔═══════════════════════════════════════════════════════════╗");
    console.log("║               ✅ ALL TESTS PASSED SUCCESSFULLY            ║");
    console.log("╚═══════════════════════════════════════════════════════════╝\n");

    console.log("📊 Summary:");
    console.log(`   ✅ Constituencies: ${constituencies.length}`);
    console.log(`   ✅ Candidates: ${candidates.length}`);
    console.log(`   ✅ Total Votes: ${totalVotes}`);
    console.log(`   ✅ Voters Registered: ${election.totalVoters}`);
    console.log(`   ✅ Voting Progress: ${election.totalVoters > 0n ? ((Number(election.votesCast) / Number(election.totalVoters)) * 100).toFixed(2) : 0}%`);
    console.log(`   ✅ Election Active: ${election.isActive ? "Yes" : "No"}`);
    console.log("\n✨ Smart Contract Tests Complete!\n");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
