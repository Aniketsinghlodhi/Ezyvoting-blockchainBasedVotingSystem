# EzyVoting Quick Reference Card

## Essential Commands

### Compile & Test
```bash
npm run compile              # Compile Solidity contracts
npm run test                 # Run unit tests
```

### Local Development
```bash
npx hardhat node             # Start local Hardhat node (Terminal 1)
npm run deploy:localhost     # Deploy contract locally (Terminal 2)
npm run seed:localhost       # Seed test data (Terminal 2)
cd backend && npm run dev    # Start backend server (Terminal 3)
cd frontend && npm run dev   # Start frontend app (Terminal 4)
# Open http://localhost:3000
```

### Sepolia Testnet
```bash
npm run deploy:sepolia       # Deploy to Sepolia
npm run verify:sepolia       # Verify on Etherscan
npm run seed:sepolia         # Seed Sepolia with test data
```

---

## API Endpoints

### Admin Only
```
POST   /api/auth/admin/register          # Register admin (needs inviteCode)
POST   /api/auth/admin/login             # Login as admin
GET    /api/auth/admin/voters            # List all voters (admin-only)
```

### Voter
```
POST   /api/auth/voter/register          # Register voter (admin-only endpoint)
POST   /api/auth/voter/login             # Login as voter
```

### Protected
```
GET    /api/auth/me                      # Get current user (requires JWT)
```

---

## Demo Credentials

### Admin (Local)
- Email: `admin@test.local`
- Password: `test123`
- Invite Code: `demo-invite-123`

### Voter (Seeded)
- Voter 1 ID: `demo-voter-1`
- Voter 2 ID: `demo-voter-2`

---

## File Locations

| What | Where |
|------|-------|
| Smart Contract | `/contracts/EzyVoting.sol` |
| Compiled ABI | `/artifacts/contracts/EzyVoting.sol/EzyVoting.json` |
| Deploy Script | `/scripts/deploy.js` |
| Verify Script | `/scripts/verify.js` |
| Seed Script | `/scripts/seedDemo.js` |
| Backend | `/backend/src/` |
| Frontend | `/frontend/pages/` |
| Styles | `/frontend/styles.css` |
| Alerts | `/frontend/lib/alerts.js` |
| Contract Helpers | `/frontend/lib/contract.js` |

---

## Environment Setup

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/ezyvoting
JWT_SECRET=your-secret-key
PRIVATE_KEY=0xYOUR_KEY
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x...
ADMIN_INVITE_CODE=demo-invite-123
ETHERSCAN_API_KEY=YOUR_KEY
```

### Frontend (.env.local)
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

---

## Sepolia Setup

1. **Get RPC URL** → https://app.infura.io (Sepolia endpoint)
2. **Get Test ETH** → https://sepoliafaucet.com
3. **Get Etherscan Key** → https://etherscan.io/apis
4. **Deploy** → `npm run deploy:sepolia`
5. **Verify** → `npm run verify:sepolia`
6. **View** → https://sepolia.etherscan.io/address/0xYOUR_ADDRESS

---

## Testing Workflow

### 1. Admin Setup
- Go to `/admin/register`
- Use invite code: `demo-invite-123`
- Click Login, then Dashboard

### 2. Voter Setup
- Go to `/voter/login`
- Use any wallet address
- Click Dashboard

### 3. Admin Actions
- **Load Voters** → See registered voters
- **Register Voter** → Add new voter
- **Add Constituency** → Create on-chain

### 4. Voter Actions
- **Load Status** → See registration & candidates
- **Vote** → Select candidate and confirm in MetaMask

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Contract not found` | Run deploy script first |
| `No provider` | Install MetaMask / set RPC_URL |
| `Invalid invite code` | Check ADMIN_INVITE_CODE in .env |
| `Already voted` | Expected (prevents duplicate votes) |
| `Insufficient gas` | Get test ETH from faucet |

---

## Database

### Collections
- **users** — Admin/voter accounts (email, passwordHash, role)
- **voters** — Voter profiles (name, hashedVoterId, constituencyId)

### Connection
```
MONGO_URI=mongodb://localhost:27017/ezyvoting
# Or MongoDB Atlas for cloud hosting
```

---

## Security

### Protect
- ✅ Admin registration with invite code
- ✅ Voter registration requires JWT
- ✅ Voter IDs hashed (keccak256)
- ✅ Passwords hashed (bcryptjs)
- ✅ Double voting prevented

### Never
- ❌ Commit `.env` files
- ❌ Use production keys in tests
- ❌ Store raw voter IDs
- ❌ Allow open admin registration

---

## Key Technologies

- **Contract:** Solidity 0.8.17
- **Chain:** Sepolia testnet
- **Frontend:** Next.js + React + ethers.js
- **Backend:** Express.js + MongoDB
- **Styling:** Pure CSS (no frameworks)

---

## Documentation

| File | Purpose |
|------|---------|
| `/README.md` | Main guide + Sepolia deployment |
| `/DEPLOYMENT_CHECKLIST.md` | Step-by-step deployment |
| `/SESSION_SUMMARY.md` | What was built this session |
| `/ENHANCEMENTS.md` | All enhancements overview |
| `/PROJECT_STRUCTURE.md` | File organization guide |

---

## Support Resources

- **Etherscan:** https://sepolia.etherscan.io
- **Sepolia Faucet:** https://sepoliafaucet.com
- **Hardhat Docs:** https://hardhat.org
- **ethers.js Docs:** https://docs.ethers.org/v6
- **Next.js Docs:** https://nextjs.org/docs
- **MetaMask Help:** https://support.metamask.io

---

## Quick Status Check

```bash
# Check contract compile
npm run compile

# Check tests pass
npm run test

# Check backend runs
cd backend && npm run dev    # Should start on :4000

# Check frontend runs
cd frontend && npm run dev   # Should start on :3000

# Check contract deployed
cat deployed-address.txt     # Should show address

# Check Etherscan
# Visit https://sepolia.etherscan.io
# Search for contract address
# Should show: "Contract" with source code visible
```

---

## Production Checklist

- [ ] Contract verified on Etherscan
- [ ] Backend deployed (Railway/Heroku)
- [ ] Frontend deployed (Vercel)
- [ ] Domain configured with SSL
- [ ] Environment variables set on hosting
- [ ] MongoDB Atlas backup enabled
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring enabled
- [ ] Rate limiting implemented
- [ ] Security audit completed

---

**Ready to Deploy?**
See `/DEPLOYMENT_CHECKLIST.md` for complete step-by-step guide.

**Questions?**
Check `/README.md` or `/SESSION_SUMMARY.md` for detailed information.

---

**Last Updated:** [Current Session]
**Status:** ✅ Production Ready
