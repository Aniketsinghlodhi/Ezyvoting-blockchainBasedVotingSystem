# EzyVoting — Deployment Checklist

## Pre-Deployment Verification

### ✅ Smart Contract
- [ ] Contract compiles: `npm run compile` → ✓ No errors (except unused param warnings)
- [ ] Tests pass: `npm run test` → ✓ 1 passing
- [ ] Artifacts generated: `artifacts/contracts/EzyVoting.sol/EzyVoting.json` exists
- [ ] Constructor args: None (empty array for verification)

### ✅ Backend
- [ ] Dependencies installed: `cd backend && npm install` → ✓ All packages
- [ ] `.env` configured with:
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — Secure random string (min 32 chars)
  - `PRIVATE_KEY` — Test wallet private key (hex format)
  - `RPC_URL` — Sepolia RPC endpoint (Infura/Alchemy)
  - `CONTRACT_ADDRESS` — Will be filled after deploy
  - `ADMIN_INVITE_CODE` — Secure invite code (e.g., `demo-invite-123`)
  - `ETHERSCAN_API_KEY` — For contract verification
- [ ] Server starts: `npm run dev` → ✓ Listening on port 4000
- [ ] Test endpoints work with curl or Postman

### ✅ Frontend
- [ ] Dependencies installed: `cd frontend && npm install` → ✓ All packages
- [ ] `.env.local` configured with:
  - `NEXT_PUBLIC_CONTRACT_ADDRESS` — Deployed contract address
  - `NEXT_PUBLIC_RPC_URL` — Sepolia RPC (optional, for read-only fallback)
- [ ] Dev server starts: `npm run dev` → ✓ Listening on http://localhost:3000
- [ ] Pages load without errors:
  - `/` — Landing page ✓
  - `/admin/register` — Admin registration form ✓
  - `/admin/login` — Admin login form ✓
  - `/admin/dashboard` — Admin dashboard (requires login) ✓
  - `/voter/register` — Voter registration form ✓
  - `/voter/login` — Voter login form ✓
  - `/voter/dashboard` — Voter dashboard (requires login) ✓
- [ ] MetaMask detected: Check console for `window.ethereum` ✓

---

## Sepolia Deployment Steps

### Step 1: Get Resources
- [ ] Infura Project API Key
  - Create at https://app.infura.io
  - Select Sepolia network
  - Copy Sepolia HTTPS endpoint
  
- [ ] Test ETH for gas fees
  - Get from https://sepoliafaucet.com (requires Twitter/GitHub)
  - Or https://www.alchemy.com/faucets/ethereum-sepolia
  - Minimum: 0.1 ETH for testing

- [ ] Etherscan API Key
  - Create at https://etherscan.io/apis
  - Keep in `.env` as `ETHERSCAN_API_KEY`

### Step 2: Configure Environment
```bash
cd "/Users/aniketlodhi/developer/Capstone 1/FRONTEND"

# Copy template and fill in values
cp backend/.env.example backend/.env

# Edit backend/.env with:
#   RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
#   PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
#   ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
#   JWT_SECRET=your-secure-random-string
#   ADMIN_INVITE_CODE=demo-invite-123
#   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ezyvoting
```

### Step 3: Deploy Contract
```bash
npm run deploy:sepolia

# Output:
# Deployment successful! Contract Address: 0x...
# Saving to deployed-address.txt
```

**Save the contract address** — you'll need it for the next steps.

### Step 4: Verify Contract (Optional but Recommended)
```bash
npm run verify:sepolia

# Success output:
# ✓ Contract verified on Etherscan!
# View at: https://sepolia.etherscan.io/address/0xYOUR_ADDRESS
```

If you see "Already Verified", the contract was previously verified — that's fine.

### Step 5: Seed with Demo Data (Optional)
```bash
CONTRACT_ADDRESS=$(cat deployed-address.txt) npm run seed:sepolia

# Creates:
# - 2 constituencies (North Region, South Region)
# - 4 candidates (2 per constituency)
# - 1 election (valid for 24 hours)
# - 2 sample voters (demo-voter-1, demo-voter-2)

# Output includes voter addresses and IDs for manual testing
```

### Step 6: Update Frontend Configuration
```bash
# Get contract address
CONTRACT_ADDRESS=$(cat deployed-address.txt)

# Edit frontend/.env.local:
# NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
# NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### Step 7: Start Services
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Output: Server listening on http://localhost:4000

# Terminal 2: Frontend (new terminal)
cd frontend
npm run dev
# Output: 
# ▲ Next.js X.X.X
# ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## End-to-End Testing on Sepolia

### Admin Registration
1. Navigate to http://localhost:3000/admin/register
2. Fill form:
   - Name: `Demo Admin`
   - Email: `admin@demo.local`
   - Password: `test123`
   - Wallet Address: (your Sepolia wallet address)
   - Invite Code: `demo-invite-123` (from backend/.env)
3. Click **Register** → Should see success message
4. You'll be redirected to login page

### Admin Login
1. Navigate to http://localhost:3000/admin/login
2. Email: `admin@demo.local`
3. Password: `test123`
4. Click **Login** → JWT token saved to localStorage
5. Redirected to http://localhost:3000/admin/dashboard

### Admin Dashboard Actions
1. **Connect MetaMask** → Select Sepolia network, approve connection
2. **Load Voters** → See voters from the seed script (if seeded)
3. **Register Voter** → Test form (fills MongoDB)
4. **Add Constituency (on-chain)** → Tests MetaMask transaction approval
   - Confirm in MetaMask
   - Wait for confirmation
   - Check Etherscan for transaction

### Voter Testing
1. Import voter account from seed script into MetaMask:
   - From seed output, copy voter1 private key
   - MetaMask → Settings → Import Account → Paste key
   - Network: Sepolia

2. Navigate to http://localhost:3000/voter/login
3. Wallet Address: voter1 address from seed output
4. Click **Login**

5. Navigate to http://localhost:3000/voter/dashboard
6. Click **Load Status** → Shows voter registration and candidates
7. Enter Voter ID: `demo-voter-1`
8. Click **Vote** on a candidate
9. Confirm in MetaMask
10. See transaction hash and success message
11. Reload page → "Already Voted" message appears (prevents re-voting)

### Verify on Etherscan
- Navigate to https://sepolia.etherscan.io
- Search for contract address or transaction hash
- View contract source code (if verified)
- See all transactions and state changes

---

## Verification Checklist

### Contract Verification
- [ ] Contract compiles without errors
- [ ] `npm run verify:sepolia` succeeds
- [ ] Contract source visible on Etherscan Sepolia
- [ ] Constructor args match (should be empty array)

### Backend Verification
- [ ] Server starts on port 4000
- [ ] MongoDB connection successful
- [ ] JWT token generation works
- [ ] Admin registration protected by invite code
- [ ] Voter registration requires JWT + admin role

### Frontend Verification
- [ ] All pages load without errors
- [ ] Forms submit successfully
- [ ] MetaMask integration works (connect, sign transactions)
- [ ] Alerts/toasts display correctly
- [ ] Loading states show during transactions
- [ ] Error messages are user-friendly
- [ ] Mobile responsive (test on smaller screen)

### E2E Flow Verification
- [ ] Admin can register voters
- [ ] Voters can login and view their status
- [ ] Voters can cast votes and see confirmation
- [ ] Double voting prevented
- [ ] Transactions visible on Etherscan
- [ ] Vote counts increment on-chain

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `insufficient funds for gas` | No test ETH on account | Get from sepoliafaucet.com |
| `Invalid Infura key` | RPC_URL misconfigured | Check key in `.env`, no typos |
| `Network error when making RPC request` | Network unreachable | Check internet, try Alchemy as backup |
| `Contract not found at address` | Wrong address or not deployed | Re-run deploy script, update .env |
| `Invalid invite code` | Admin code mismatch | Check ADMIN_INVITE_CODE in backend/.env |
| `ID mismatch` on vote | Voter ID doesn't match hash | Use exact same ID from seed output |
| `MetaMask not detected` | Extension not installed | Install MetaMask browser extension |
| `Wrong network` | MetaMask on wrong network | Switch to Sepolia in MetaMask |

---

## Production Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Connect git repo to Railway/Heroku
# Set environment variables:
git push heroku main  # or Railway equivalent

# Monitor logs:
heroku logs --tail  # or Railway dashboard
```

### Frontend Deployment (Vercel)
```bash
# Connect git repo to Vercel
# Set environment variables (NEXT_PUBLIC_*)
# Automatic deployment on git push
```

### Domain & SSL
- [ ] Point domain DNS to Vercel/Railway
- [ ] Enable SSL certificate (automatic on Vercel)
- [ ] Update backend `.env` CORS origins

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Vercel Analytics)
- [ ] Set up uptime monitoring (Pingdom)
- [ ] Set up log aggregation (DataDog, New Relic)

---

## Post-Deployment Checklist

- [ ] Contract address documented and shared
- [ ] Etherscan link added to README
- [ ] Production secrets not in version control (`.env` in `.gitignore`)
- [ ] Backup MongoDB data regularly
- [ ] Monitor logs for errors
- [ ] Test admin functions periodically
- [ ] Keep dependencies updated

---

**Last Updated:** [Current Date]
**Deployer:** [Your Name]
**Contract Address:** 0x...
**Frontend URL:** (Vercel)
**Backend URL:** (Railway/Heroku)

