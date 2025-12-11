import { useState } from 'react';
import Navbar from '../../components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function VoterLogin(){
  const [wallet, setWallet] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('Logging in...');
    try{
      const res = await fetch(`${API_BASE}/api/auth/voter/login`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletAddress: wallet })
      });
      const j = await res.json();
      if(!j.ok) setMsg('Error: ' + (j.error || JSON.stringify(j)));
      else {
        setMsg('Logged in (token returned)');
        localStorage.setItem('ezy_token', j.token);
      }
    }catch(err){ setMsg('Error: ' + err.message); }
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h1>Voter Login (Demo)</h1>
        <form onSubmit={submit}>
          <div><label>Wallet Address <input value={wallet} onChange={e=>setWallet(e.target.value)} /></label></div>
          <div style={{ marginTop: 8 }}><button type="submit">Login</button></div>
        </form>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </main>
    </div>
  );
}
