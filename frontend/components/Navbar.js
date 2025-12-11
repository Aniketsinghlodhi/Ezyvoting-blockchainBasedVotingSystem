import Link from 'next/link';

export default function Navbar({ account }) {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
      <Link href="/">EzyVoting</Link>
      <Link href="/voter/dashboard">Voter</Link>
      <Link href="/admin/dashboard">Admin</Link>
      <div style={{ marginLeft: 'auto' }}>{account ? `Connected: ${account.substring(0,6)}...${account.slice(-4)}` : 'Not connected'}</div>
    </nav>
  );
}
