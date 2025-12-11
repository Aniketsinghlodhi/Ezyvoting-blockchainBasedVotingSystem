const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EzyVoting', function () {
  let EzyVoting, ezy, owner, admin, voter1, voter2;

  beforeEach(async function () {
    [owner, admin, voter1, voter2] = await ethers.getSigners();
    EzyVoting = await ethers.getContractFactory('EzyVoting');
    ezy = await EzyVoting.deploy();
    await ezy.waitForDeployment();
  });

  it('allows owner to add admin and register constituency/candidate/voter and cast vote', async function () {
    // owner adds admin
    await ezy.connect(owner).addAdmin(admin.address);

    // admin adds constituency
    await ezy.connect(admin).addConstituency('Constituency A');
    const cid = 1;

    // admin registers candidate
    await ezy.connect(admin).registerCandidate('Alice', 'PartyX', cid);
    const candidateId = 1;

    // admin registers voter (on-chain)
    const hashedId = ethers.keccak256(ethers.toUtf8Bytes('voter1-id'));
    await ezy.connect(admin).registerVoter(voter1.address, hashedId, cid, 'Voter One');

    // create election and start it
    const start = Math.floor(Date.now() / 1000) - 10;
    const end = Math.floor(Date.now() / 1000) + 3600;
    await ezy.connect(admin).createElection('General', start, end);
    await ezy.connect(admin).startElection(1);

    // voter casts vote
    await ezy.connect(voter1).vote(1, candidateId, hashedId);

    // check candidate vote count
    const candidate = await ezy.getCandidate(candidateId);
    expect(candidate.voteCount).to.equal(1);

    // check voter status
    const status = await ezy.getVoterStatus(voter1.address);
    expect(status.registered).to.equal(true);
    expect(status.hasVoted).to.equal(true);
    expect(status.votedCandidateId).to.equal(candidateId);
  });
});
