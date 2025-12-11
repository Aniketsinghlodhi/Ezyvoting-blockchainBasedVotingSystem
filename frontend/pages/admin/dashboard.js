import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getProvider, getContract, hashVoterId } from '../../lib/contract';
import { showAlert } from '../../lib/alerts';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function AdminDashboard() {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState('');
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [voterForm, setVoterForm] = useState({ 
    name: '', 
    rawVoterId: '', 
    constituencyId: '1', 
    walletAddress: '' 
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('ezy_token');
    if (savedToken) setToken(savedToken);
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      showAlert('MetaMask not installed. Please install it first.', 'error');
      return;
    }
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

  async function loadVoters() {
    if (!token) {
      showAlert('Please login as admin first', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin/voters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      
      if (json.ok) {
        setVoters(json.voters || []);
        showAlert(`Loaded ${json.voters?.length || 0} voters`, 'success');
      } else {
        showAlert(`Error: ${json.error || 'Failed to load voters'}`, 'error');
      }
    } catch (err) {
      console.error('Load voters error:', err);
      showAlert(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function registerVoter(e) {
    e.preventDefault();
    
    if (!token) {
      showAlert('Please login as admin first', 'error');
      return;
    }

    if (!voterForm.name.trim() || !voterForm.rawVoterId.trim() || !voterForm.walletAddress.trim()) {
      showAlert('Please fill in all fields', 'error');
      return;
    }

    setRegistering(true);
    try {
      showAlert('Registering voter...', 'info', 0);
      const res = await fetch(`${API_BASE}/api/auth/voter/register`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: voterForm.name,
          rawVoterId: voterForm.rawVoterId,
          constituencyId: Number(voterForm.constituencyId),
          walletAddress: voterForm.walletAddress
        })
      });

      const json = await res.json();
      
      if (json.ok) {
        showAlert(`✓ Voter registered successfully${json.txHash ? ' (on-chain)' : ''}`, 'success', 4000);
        setVoterForm({ name: '', rawVoterId: '', constituencyId: '1', walletAddress: '' });
        await loadVoters();
      } else {
        showAlert(`Error: ${json.error || 'Failed to register voter'}`, 'error');
      }
    } catch (err) {
      console.error('Register voter error:', err);
      showAlert(`Error: ${err.message}`, 'error');
    } finally {
      setRegistering(false);
    }
  }

  async function addConstituency() {
    const name = prompt('Enter constituency name:');
    if (!name?.trim()) return;

    if (!account) {
      showAlert('Please connect your wallet first', 'error');
      return;
    }

    try {
      showAlert('Confirm transaction in MetaMask...', 'info', 0);
      const provider = getProvider();
      const signer = await provider.getSigner();
      const contract = await getContract(signer);
      const tx = await contract.addConstituency(name);
      
      showAlert('Transaction submitted! Waiting for confirmation...', 'info', 0);
      await tx.wait();
      
      showAlert(`✓ Constituency "${name}" added successfully`, 'success', 4000);
    } catch (err) {
      console.error('Add constituency error:', err);
      const errorMsg = err?.reason || err?.message || 'Failed to add constituency';
      showAlert(`Error: ${errorMsg}`, 'error');
    }
  }

  return (
    <div>
      <Navbar account={account} />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Manage voter registrations and perform administrative actions.</p>

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
            <button onClick={connectWallet} className="btn-secondary">
              {account ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex" style={{ gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={loadVoters} 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Loading...' : 'Load Voters'}
          </button>
          <button 
            onClick={addConstituency} 
            disabled={!account}
            className="btn-secondary"
          >
            + Add Constituency (on-chain)
          </button>
        </div>

        {/* Register Voter Form */}
        <section className="card" style={{ marginBottom: '2rem', backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }}>
          <h2 style={{ marginTop: 0 }}>Register New Voter</h2>
          <p className="text-muted">Fill the form below to register a voter. The voter ID will be hashed on-chain.</p>
          
          <form onSubmit={registerVoter}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={voterForm.name}
                  onChange={e => setVoterForm({ ...voterForm, name: e.target.value })}
                  disabled={registering}
                  style={{ maxWidth: '100%' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="voterId">Voter ID *</label>
                <input
                  id="voterId"
                  type="text"
                  placeholder="e.g., voter-12345"
                  value={voterForm.rawVoterId}
                  onChange={e => setVoterForm({ ...voterForm, rawVoterId: e.target.value })}
                  disabled={registering}
                  style={{ maxWidth: '100%' }}
                />
                <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  Unique identifier for this voter. Will be hashed before on-chain storage.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="constituencyId">Constituency ID *</label>
                <input
                  id="constituencyId"
                  type="number"
                  min="1"
                  value={voterForm.constituencyId}
                  onChange={e => setVoterForm({ ...voterForm, constituencyId: e.target.value })}
                  disabled={registering}
                  style={{ maxWidth: '100%' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="walletAddress">Wallet Address *</label>
                <input
                  id="walletAddress"
                  type="text"
                  placeholder="0x..."
                  value={voterForm.walletAddress}
                  onChange={e => setVoterForm({ ...voterForm, walletAddress: e.target.value })}
                  disabled={registering}
                  style={{ maxWidth: '100%' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={registering}
              className={registering ? 'loading' : 'btn-success'}
              style={{ width: 'auto' }}
            >
              {registering ? 'Registering...' : '✓ Register Voter'}
            </button>
          </form>
        </section>

        {/* Voters List */}
        <section>
          <h2 style={{ marginBottom: '1.5rem' }}>Registered Voters</h2>

          {voters.length === 0 ? (
            <div className="alert alert-info">
              ℹ No voters registered yet. Use the form above to register one.
            </div>
          ) : (
            <div className="voter-list">
              {voters.map(v => (
                <div key={v._id} className="voter-card">
                  <h3 style={{ marginBottom: '0.5rem' }}>{v.name}</h3>
                  <p>
                    <strong>Wallet:</strong>
                    <br />
                    <code style={{ fontSize: '0.85rem' }}>
                      {v.walletAddress.substring(0, 10)}...{v.walletAddress.substring(38)}
                    </code>
                  </p>
                  <p>
                    <strong>Constituency ID:</strong>
                    <br />
                    {v.constituencyId || 'N/A'}
                  </p>
                  <p className="text-muted" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
                    Registered: {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
