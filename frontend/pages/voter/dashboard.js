import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getProvider, getContract, hashVoterId } from '../../lib/contract';
import { showAlert } from '../../lib/alerts';

export default function VoterDashboard() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voterId, setVoterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(null); // Track which candidate is being voted for

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accs => {
        if (accs.length) setAccount(accs[0]);
      });
    }
  }, []);

  async function loadStatus() {
    if (!account) {
      showAlert('Please connect your wallet first', 'error');
      return;
    }

    setLoading(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const contract = await getContract(signer);
      
      const st = await contract.getVoterStatus(account);
      setStatus({ 
        registered: st[0], 
        hasVoted: st[1], 
        votedCandidateId: st[2], 
        constituencyId: st[3] 
      });

      if (st[0]) {
        const cid = st[3];
        const list = await contract.getCandidatesByConstituency(cid);
        setCandidates(list.map(c => ({ 
          id: c.id.toString(), 
          name: c.name, 
          party: c.party, 
          votes: c.voteCount.toString() 
        })));
        showAlert('Voter status loaded successfully', 'success');
      } else {
        showAlert('You are not registered as a voter', 'warning');
      }
    } catch (err) {
      console.error('Load status error:', err);
      const errorMsg = err?.reason || err?.message || 'Failed to load voter status';
      showAlert(`Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function castVote(candidateId) {
    if (!account) {
      showAlert('Please connect your wallet', 'error');
      return;
    }

    if (!voterId.trim()) {
      showAlert('Please enter your Voter ID', 'error');
      return;
    }

    if (status?.hasVoted) {
      showAlert('You have already voted in this election', 'warning');
      return;
    }

    setVoting(candidateId);
    try {
      showAlert('Confirm transaction in your wallet...', 'info', 0);
      const provider = getProvider();
      const signer = await provider.getSigner();
      const contract = await getContract(signer);
      const hashed = hashVoterId(voterId);
      
      // For demo we assume electionId = 1
      const tx = await contract.vote(1, candidateId, hashed);
      showAlert('Transaction submitted! Waiting for confirmation...', 'info', 0);
      
      await tx.wait();
      showAlert('✓ Your vote has been recorded on the blockchain!', 'success', 5000);
      
      // Reload status
      await loadStatus();
    } catch (err) {
      console.error('Vote error:', err);
      const errorMsg = err?.reason || err?.message || 'Failed to cast vote';
      if (errorMsg.includes('Already voted')) {
        showAlert('You have already voted in this election', 'error');
      } else if (errorMsg.includes('ID mismatch')) {
        showAlert('Voter ID does not match registered record', 'error');
      } else {
        showAlert(`Error: ${errorMsg}`, 'error');
      }
    } finally {
      setVoting(null);
    }
  }

  async function connectWallet() {
    try {
      const provider = getProvider();
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        showAlert('Wallet connected successfully', 'success');
      }
    } catch (err) {
      showAlert('Failed to connect wallet', 'error');
    }
  }

  return (
    <div>
      <Navbar account={account} />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1>Voter Dashboard</h1>
        <p className="text-muted">Connect your wallet and load your voter status to cast your vote.</p>

        {/* Connection Status */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="flex flex-between" style={{ alignItems: 'center' }}>
            <div>
              <strong>Wallet Status:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                {account ? (
                  <span style={{ color: 'var(--success)' }}>
                    ✓ {account.substring(0, 6)}...{account.substring(38)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--gray-500)' }}>Not connected</span>
                )}
              </p>
            </div>
            <button 
              onClick={!account ? connectWallet : loadStatus}
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {!account ? 'Connect Wallet' : (loading ? 'Loading...' : 'Load Status')}
            </button>
          </div>
        </div>

        {/* Voter ID Input */}
        <div className="form-group">
          <label htmlFor="voterId">Voter ID (demo-voter-1 or demo-voter-2):</label>
          <input
            id="voterId"
            type="text"
            value={voterId}
            onChange={e => setVoterId(e.target.value)}
            placeholder="e.g., demo-voter-1"
            disabled={!account}
            style={{ maxWidth: '100%' }}
          />
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            This ID is hashed and matched against your registration record.
          </p>
        </div>

        {/* Voter Profile */}
        {status && (
          <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#EFF6FF', borderColor: '#BAE6FD' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Profile</h3>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div>
                <strong>Registration Status:</strong>
                <p style={{ margin: '0.5rem 0 0 0', color: status.registered ? 'var(--success)' : 'var(--danger)' }}>
                  {status.registered ? '✓ Registered' : '✕ Not Registered'}
                </p>
              </div>
              <div>
                <strong>Voting Status:</strong>
                <p style={{ margin: '0.5rem 0 0 0', color: status.hasVoted ? 'var(--success)' : 'var(--gray-600)' }}>
                  {status.hasVoted ? '✓ Already Voted' : 'Pending'}
                </p>
              </div>
              <div>
                <strong>Constituency ID:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{String(status.constituencyId)}</p>
              </div>
              {status.hasVoted && (
                <div>
                  <strong>Voted For Candidate ID:</strong>
                  <p style={{ margin: '0.5rem 0 0 0' }}>{String(status.votedCandidateId)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Candidates List */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Candidates for Your Constituency</h2>

          {!status ? (
            <div className="alert alert-info">
              ℹ Load your voter status first to see available candidates.
            </div>
          ) : candidates.length === 0 ? (
            <div className="alert alert-warning">
              ⚠ No candidates available for your constituency yet.
            </div>
          ) : (
            <div className="candidate-list">
              {candidates.map(c => (
                <div key={c.id} className="candidate-card">
                  <h3 style={{ marginBottom: '0.5rem' }}>{c.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{c.party}</p>
                  <div className="vote-count">{c.votes} votes</div>
                  <button
                    onClick={() => castVote(c.id)}
                    disabled={status.hasVoted || voting === c.id}
                    className={voting === c.id ? 'loading' : ''}
                  >
                    {voting === c.id ? 'Voting...' : (status.hasVoted ? 'Already Voted' : 'Vote')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info Box */}
        {status?.hasVoted && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            ✓ Thank you for voting! Your vote has been recorded on the blockchain and cannot be changed.
          </div>
        )}
      </main>
    </div>
  );
}
