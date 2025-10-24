# 🗳️ EzyVoting – Blockchain-Based Online Voting System

> A decentralized, transparent, and tamper-proof voting platform built using **Ethereum, Solidity, and React.js**.

---

## 🚀 Project Overview

EzyVoting is a blockchain-powered voting system that ensures secure and transparent elections. It eliminates traditional voting risks like tampering, duplicate votes, and centralized control by leveraging Ethereum’s smart contracts.

---

## 🧠 Key Features

- 🔐 **Secure & Transparent** – Votes stored immutably on the blockchain.
- 🧩 **Decentralized Architecture** – Eliminates need for intermediaries.
- 👥 **User Roles** – Admins (election creators) and Voters.
- ⚡ **Real-Time Results** – Automatic counting and instant updates.
- 🌐 **Web3 Integrated** – MetaMask-based authentication and transaction signing.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, HTML, CSS |
| **Blockchain** | Solidity, Ethereum, Web3.js |
| **Backend (optional)** | Node.js, Express.js |
| **Testing** | Truffle / Hardhat |
| **Network** | Ganache / Sepolia / Ethereum Testnet |

---

## 🧱 Smart Contract Structure

```solidity
contract EzyVoting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    function vote(uint candidateId) public { ... }
}
