import { useState } from 'react';
import Navbar from '../../components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function AdminRegister(){
  const [form, setForm] = useState({ name:'', email:'', password:'', walletAddress:'', inviteCode:'' });
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('Registering admin...');
    try{
      const res = await fetch(`${API_BASE}/api/auth/admin/register`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
      });
      const j = await res.json();
      if(!j.ok) setMsg('Error: ' + (j.error || JSON.stringify(j)));
      else {
        setMsg('Registered admin — saving token');
        localStorage.setItem('ezy_token', j.token);
      }
    }catch(err){ setMsg('Error: ' + err.message); }
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h1>Admin Register (Protected)</h1>
        <p>Requires invite code (set in backend ADMIN_INVITE_CODE env var).</p>
        <form onSubmit={submit}>
          <div><label>Name <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></label></div>
          <div><label>Email <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></label></div>
          <div><label>Password <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /></label></div>
          <div><label>Wallet Address <input value={form.walletAddress} onChange={e=>setForm({...form, walletAddress:e.target.value})} /></label></div>
          <div><label>Invite Code <input type="password" value={form.inviteCode} onChange={e=>setForm({...form, inviteCode:e.target.value})} placeholder="demo-invite-123" /></label></div>
          <div style={{ marginTop: 8 }}><button type="submit">Register Admin</button></div>
        </form>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </main>
    </div>
  );
}
