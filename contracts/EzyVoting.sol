// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EzyVoting {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin");
        _;
    }

    // Roles
    mapping(address => bool) public admins;

    function addAdmin(address _a) external onlyOwner {
        admins[_a] = true;
    }

    // Data structures
    struct Voter {
        address voterAddress;
        bytes32 hashedVoterId;
        string name;
        uint256 constituencyId;
        bool hasVoted;
        uint256 votedCandidateId;
    }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 constituencyId;
        uint256 voteCount;
    }

    struct Constituency {
        uint256 id;
        string name;
    }

    struct Election {
        uint256 id;
        string name;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256[] candidateIds;
        mapping(uint256 => bool) candidateExists;
    }

    // Storage
    mapping(address => Voter) private voters;
    mapping(uint256 => Candidate) private candidates;
    mapping(uint256 => Constituency) public constituencies;
    mapping(uint256 => Election) private elections;

    uint256 public nextCandidateId = 1;
    uint256 public nextConstituencyId = 1;
    uint256 public nextElectionId = 1;

    // Events
    event VoterRegistered(address indexed voter, uint256 constituencyId);
    event CandidateRegistered(uint256 indexed candidateId, string name, uint256 constituencyId);
    event ConstituencyAdded(uint256 indexed constituencyId, string name);
    event ElectionStarted(uint256 indexed electionId, uint256 startTime, uint256 endTime);
    event ElectionEnded(uint256 indexed electionId);
    event VoteCast(address indexed voter, uint256 indexed electionId, uint256 indexed candidateId);

    // Admin functions
    function addConstituency(string calldata name) external onlyAdmin returns (uint256) {
        uint256 id = nextConstituencyId++;
        constituencies[id] = Constituency({id: id, name: name});
        emit ConstituencyAdded(id, name);
        return id;
    }

    function registerCandidate(string calldata name, string calldata party, uint256 constituencyId) external onlyAdmin returns (uint256) {
        require(bytes(constituencies[constituencyId].name).length != 0, "Invalid constituency");
        uint256 id = nextCandidateId++;
        candidates[id] = Candidate({id: id, name: name, party: party, constituencyId: constituencyId, voteCount: 0});
        emit CandidateRegistered(id, name, constituencyId);
        return id;
    }

    function createElection(string calldata name, uint256 startTime, uint256 endTime) external onlyAdmin returns (uint256) {
        require(startTime < endTime, "start < end");
        uint256 id = nextElectionId++;
        Election storage e = elections[id];
        e.id = id;
        e.name = name;
        e.startTime = startTime;
        e.endTime = endTime;
        e.isActive = false;
        emit ElectionStarted(id, startTime, endTime);
        return id;
    }

    function startElection(uint256 electionId) external onlyAdmin {
        Election storage e = elections[electionId];
        require(e.id != 0, "Election not exist");
        e.isActive = true;
        emit ElectionStarted(electionId, e.startTime, e.endTime);
    }

    function endElection(uint256 electionId) external onlyAdmin {
        Election storage e = elections[electionId];
        require(e.id != 0, "Election not exist");
        e.isActive = false;
        emit ElectionEnded(electionId);
    }

    // Admin registers voters on-chain, storing only hashed ID
    function registerVoter(address _voterAddress, bytes32 _hashedVoterId, uint256 _constituencyId, string calldata _name) external onlyAdmin {
        require(_voterAddress != address(0), "zero addr");
        require(bytes(constituencies[_constituencyId].name).length != 0, "Invalid constituency");
        Voter storage v = voters[_voterAddress];
        v.voterAddress = _voterAddress;
        v.hashedVoterId = _hashedVoterId;
        v.name = _name;
        v.constituencyId = _constituencyId;
        v.hasVoted = false;
        emit VoterRegistered(_voterAddress, _constituencyId);
    }

    // Voting
    function vote(uint256 electionId, uint256 candidateId, bytes32 providedHashedVoterId) external {
        Voter storage v = voters[msg.sender];
        require(v.voterAddress == msg.sender, "Not registered");
        require(v.hashedVoterId == providedHashedVoterId, "ID mismatch");
        Election storage e = elections[electionId];
        require(e.id != 0, "Election not found");
        require(block.timestamp >= e.startTime && block.timestamp <= e.endTime && e.isActive, "Not in voting period");
        require(!v.hasVoted, "Already voted");
        Candidate storage c = candidates[candidateId];
        require(c.id != 0, "Candidate not found");
        require(c.constituencyId == v.constituencyId, "Wrong constituency");
        v.hasVoted = true;
        v.votedCandidateId = candidateId;
        c.voteCount += 1;
        emit VoteCast(msg.sender, electionId, candidateId);
    }

    // Views
    function getCandidate(uint256 candidateId) external view returns (Candidate memory) {
        return candidates[candidateId];
    }

    function getCandidatesByConstituency(uint256 constituencyId) public view returns (Candidate[] memory) {
        // Count candidates in constituency
        uint256 count = 0;
        for (uint256 i = 1; i < nextCandidateId; i++) {
            if (candidates[i].constituencyId == constituencyId) count++;
        }
        Candidate[] memory list = new Candidate[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextCandidateId; i++) {
            if (candidates[i].constituencyId == constituencyId) {
                list[idx] = candidates[i];
                idx++;
            }
        }
        return list;
    }

    function getResults(uint256 electionId, uint256 constituencyId) external view returns (Candidate[] memory) {
        // For demo purposes, return candidates of the constituency with vote counts
        return getCandidatesByConstituency(constituencyId);
    }

    function getVoterStatus(address _voter) external view returns (bool registered, bool hasVoted, uint256 votedCandidateId, uint256 constituencyId) {
        Voter storage v = voters[_voter];
        if (v.voterAddress == address(0)) return (false, false, 0, 0);
        return (true, v.hasVoted, v.votedCandidateId, v.constituencyId);
    }
}
