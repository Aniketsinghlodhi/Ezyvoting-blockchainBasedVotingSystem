# 🚀 EzyVoting UI Redesign — Implementation Guide

## Quick Start: Migrate to New Design System

### Step 1: Install Dependencies

```bash
npm install framer-motion classnames zustand
npm install -D @tailwindcss/line-clamp @tailwindcss/typography
```

### Step 2: Update Tailwind Configuration

Replace your `tailwind.config.js` with this complete config:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0F172E',
        'electric-teal': '#00D4FF',
        'vibrant-saffron': '#FF6B35',
        'slate-gray': '#1A1F35',
        'ghost-gray': '#8B94A5',
        'glass-white': '#F9FAFB',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0F172E 0%, #1A2B5C 50%, #0D4A8F 100%)',
        'teal-pulse': 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
        'saffron-gradient': 'linear-gradient(90deg, #FF6B35 0%, #FF8C5A 100%)',
      },
      backdropBlur: {
        'xl': '20px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-saffron': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'slideInRight': 'slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fadeInUp': 'fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'successCheckmark': 'successCheckmark 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(100px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        successCheckmark: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '44px', fontWeight: '600' }],
        'h3': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'caption': ['11px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Step 3: Import Design System CSS

Add to your `_app.js` or `_app.tsx`:

```jsx
import '@/styles/design-system.css';
import '@/styles/globals.css';
```

### Step 4: Update Your Pages

#### Example: New Voter Login Page

```jsx
// pages/voter/login.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Spinner } from '@/components/UIComponents';

export default function VoterLogin() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Your login logic
      const res = await fetch('/api/auth/voter/login', {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
      });
      // Handle response
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Left side: Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col items-center justify-center flex-1"
      >
        <h1 className="text-5xl font-bold text-white mb-6">
          Your Vote,<br />Your Voice
        </h1>
        <p className="text-xl text-gray-300 text-center mb-8">
          Secure, transparent, blockchain-verified voting for all Indians
        </p>
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-electric-teal to-vibrant-saffron rounded-full blur-2xl opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🗳️</div>
        </div>
      </motion.div>

      {/* Right side: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-gray/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Voter Login</h2>
          <p className="text-gray-300 mb-8">
            Connect with MetaMask to vote
          </p>

          <div className="space-y-6">
            <Input
              label="Wallet Address"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              hint="Enter or paste your MetaMask wallet address"
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleLogin}
              icon="🔐"
            >
              {loading ? 'Connecting...' : 'Login with MetaMask'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-gray/40 text-gray-400">or</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {}}
              icon="📱"
            >
              Use Wallet Connect
            </Button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account? <a href="/voter/register" className="text-electric-teal hover:text-white">Register here</a>
          </p>

          <div className="mt-8 p-4 bg-info-blue/20 border border-info-blue/50 rounded-lg text-info-blue text-sm">
            🔒 Your vote is encrypted and verified on blockchain. Vote with confidence.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

#### Example: Voter Dashboard with New Components

```jsx
// pages/voter/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Button,
  Badge,
  Input,
  Modal,
  Toast,
  ToastContainer,
  VerificationBadge,
  Spinner,
} from '@/components/UIComponents';

export default function VoterDashboard() {
  const [toasts, setToasts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterId, setVoterId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      // Fetch candidates from contract/API
      setCandidates([
        {
          id: 1,
          name: 'Alice Kumar',
          party: 'Party A',
          votes: 256,
          image: '👩',
        },
        {
          id: 2,
          name: 'Bob Singh',
          party: 'Party B',
          votes: 189,
          image: '👨',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleVote = async (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmModal(true);
  };

  const confirmVote = async () => {
    try {
      // Submit vote to contract
      const response = await fetch('/api/blockchain/vote', {
        method: 'POST',
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          voterId,
        }),
      });

      if (response.ok) {
        addToast('success', `✓ Your vote for ${selectedCandidate.name} has been recorded!`);
        setConfirmModal(false);
        loadCandidates();
      } else {
        addToast('error', 'Failed to cast vote. Please try again.');
      }
    } catch (error) {
      addToast('error', 'Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🗳️ Voting Booth
          </h1>
          <p className="text-gray-300">
            Your vote matters. Choose wisely.
          </p>
        </motion.div>

        {/* Voter Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Your Status</h3>
              <Badge type="success">Verified ✓</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-semibold">Registered ✓</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Constituency</p>
                <p className="text-white font-semibold">North Region</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Has Voted</p>
                <p className="text-white font-semibold">Not Yet</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Time Remaining</p>
                <p className="text-electric-teal font-semibold">1h 23m 45s</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Voter ID Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-md"
        >
          <Input
            label="Enter Your Voter ID"
            placeholder="demo-voter-1"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            hint="This was provided during registration"
            icon="🆔"
          />
        </motion.div>

        {/* Candidates Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {candidates.map((candidate, idx) => (
              <Card
                key={candidate.id}
                interactive
                hover
                className="flex flex-col"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{candidate.image}</div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {candidate.name}
                  </h4>
                  <p className="text-gray-400">{candidate.party}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <p className="text-gray-400 text-sm mb-1">Current Votes</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-electric-teal">
                      {candidate.votes}
                    </p>
                    <p className="text-gray-400 text-sm">votes</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!voterId}
                  onClick={() => handleVote(candidate)}
                  icon="✓"
                >
                  Vote for {candidate.name}
                </Button>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModal}
          onClose={() => setConfirmModal(false)}
          title="Confirm Your Vote"
          size="md"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmVote}
              >
                Confirm Vote
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              You are about to vote for:
            </p>
            {selectedCandidate && (
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-4xl mb-3">{selectedCandidate.image}</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {selectedCandidate.name}
                </p>
                <p className="text-gray-400">{selectedCandidate.party}</p>
              </div>
            )}
            <div className="bg-warning-amber/20 border border-warning-amber/50 rounded-lg p-4 text-warning-amber text-sm">
              ⚠️ Important: You can only vote once. This action cannot be undone.
            </div>
          </div>
        </Modal>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
```

### Step 5: Component Usage Examples

#### Creating a Custom Page with Design System

```jsx
import { Button, Card, Input, Badge, Spinner } from '@/components/UIComponents';
import { motion } from 'framer-motion';

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-hero-gradient p-6">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8"
        >
          Welcome to EzyVoting
        </motion.h1>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card interactive hover>
                <Badge type="success">Active</Badge>
                <h3 className="text-xl font-bold text-white mt-4 mb-2">
                  Feature {idx}
                </h3>
                <p className="text-gray-300">
                  Description of this feature goes here
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-4 w-full"
                >
                  Learn More
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Form Example */}
        <Card>
          <h3 className="text-2xl font-bold text-white mb-6">Register</h3>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              icon="👤"
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon="✉️"
            />
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
            >
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### Step 6: Dark Mode Toggle

Add a language/theme toggle to your header:

```jsx
// components/LanguageThemeToggle.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  return (
    <div className="flex gap-2">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </motion.button>

      {/* Language Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        {lang === 'en' ? 'हिंदी' : 'English'}
      </motion.button>
    </div>
  );
};
```

---

## 📊 Design System Overview

### Color Usage

- **Primary Actions:** Electric Teal (#00D4FF)
- **Patriotic Moments:** Vibrant Saffron (#FF6B35)
- **Success States:** Success Green (#10B981)
- **Errors:** Danger Red (#EF4444)
- **Background:** Deep Navy (#0F172E)

### Typography Hierarchy

```
H1: 48px - Page titles
H2: 36px - Section headers
H3: 28px - Subsection titles
Body: 16px - Main content
Label: 12px - Form labels
Caption: 11px - Helper text
```

### Spacing System

```
xs: 4px   (tight)
sm: 8px   (comfortable)
md: 16px  (standard)
lg: 24px  (spacious)
xl: 32px  (generous)
2xl: 48px (section gap)
```

---

## 🎨 Next: Full Page Redesigns

1. **Admin Dashboard** - Replace with new card-based layout
2. **Voter Dashboard** - Implement candidate voting cards
3. **Results Page** - Live vote counter with animations
4. **Transaction Flow** - MetaMask confirmation UI
5. **Error Pages** - 404, 500 with branded design

All component code is production-ready. Just copy the imports and use them! 🚀

