import { useState } from 'react';
import Navbar from '../../components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function VoterRegister(){
  const [form, setForm] = useState({ name:'', voterId:'', constituencyId:'1', walletAddress:'', password:'' });
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('Registering...');
    try{
      const res = await fetch(`${API_BASE}/api/auth/voter/register`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
          name: form.name, rawVoterId: form.voterId, constituencyId: Number(form.constituencyId), walletAddress: form.walletAddress, password: form.password
        })
      });
      const j = await res.json();
      if(!j.ok) setMsg('Error: ' + (j.error || JSON.stringify(j)));
      else setMsg('Registered: ' + (j.txHash || j.msg));
    }catch(err){ setMsg('Error: ' + err.message); }
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h1>Voter Register (Demo)</h1>
        <form onSubmit={submit}>
          <div><label>Name <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></label></div>
          <div><label>Voter ID (demo) <input value={form.voterId} onChange={e=>setForm({...form, voterId:e.target.value})} /></label></div>
          <div><label>Constituency ID <input value={form.constituencyId} onChange={e=>setForm({...form, constituencyId:e.target.value})} /></label></div>
          <div><label>Wallet Address <input value={form.walletAddress} onChange={e=>setForm({...form, walletAddress:e.target.value})} /></label></div>
          <div style={{ marginTop: 8 }}><button type="submit">Register</button></div>
        </form>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </main>
    </div>
  );
}
