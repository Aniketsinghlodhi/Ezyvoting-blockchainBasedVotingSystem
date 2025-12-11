#!/usr/bin/env bash
# deploy-sepolia.sh — helper to deploy, verify, and seed on Sepolia
# Usage: ./scripts/deploy-sepolia.sh
# Make executable: chmod +x scripts/deploy-sepolia.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Ensure env vars
if [ -z "${RPC_URL:-}" ] || [ -z "${PRIVATE_KEY:-}" ]; then
  echo "ERROR: RPC_URL and PRIVATE_KEY must be set in your environment or in backend/.env"
  echo "Example (macOS/zsh): export RPC_URL='https://sepolia.infura.io/v3/YOUR_KEY'"
  echo "                 export PRIVATE_KEY='0xYOUR_PRIVATE_KEY'"
  exit 1
fi

echo "Deploying EzyVoting to Sepolia..."
npm run deploy:sepolia

ADDR_FILE="deployed-address.txt"
if [ -f "$ADDR_FILE" ]; then
  CONTRACT_ADDRESS=$(cat "$ADDR_FILE" | tr -d '\n')
  echo "Deployed contract address: $CONTRACT_ADDRESS"
else
  echo "Warning: $ADDR_FILE not found. Set CONTRACT_ADDRESS env or check deploy output."
fi

if [ -n "${ETHERSCAN_API_KEY:-}" ]; then
  echo "Verifying contract on Etherscan..."
  npm run verify:sepolia || echo "Verification step failed — see errors above."
else
  echo "ETHERSCAN_API_KEY not set; skipping verification. To verify, export ETHERSCAN_API_KEY or add to backend/.env"
fi

if [ -n "${CONTRACT_ADDRESS:-}" ]; then
  echo "Seeding Sepolia (optional)..."
  CONTRACT_ADDRESS=$CONTRACT_ADDRESS npm run seed:sepolia || echo "Seed failed — check network and gas limits."
else
  echo "CONTRACT_ADDRESS not set; skipping seeding. You can run: CONTRACT_ADDRESS=0x... npm run seed:sepolia"
fi

echo "Done. If everything succeeded, update frontend/.env.local and backend/.env with CONTRACT_ADDRESS and RPC_URL."
