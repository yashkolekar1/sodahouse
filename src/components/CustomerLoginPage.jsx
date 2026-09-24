import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CustomerLoginPage({ onLoginSuccess, onBackToSite, onSwitchToAdmin }) {
  const [email, setEmail] = useState('customer@sodahouse.com');
  const [password, setPassword] = useState('customer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your customer email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let displayName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Customer';
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      if (displayName.trim().toLowerCase() === 'customer') displayName = 'Rahul Sharma';

      const user = {
        id: 'cust-' + Date.now().toString().slice(-4),
        name: displayName,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        tier: 'Gold VIP Member',
        loyaltyStamps: 7
      };

      try {
        localStorage.setItem('daddy_soda_user', JSON.stringify(user));
        localStorage.setItem('daddy_soda_token', 'token_cust_' + Date.now());
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    }, 200);
  };

  const handleFillDemo = () => {
    setEmail('customer@sodahouse.com');
    setPassword('customer123');
    setError('');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f5f0',
        backgroundImage: 'radial-gradient(ellipse at top, #ffffff 0%, #f4ede2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative'
      }}
    >
      {/* Top Navigation Actions */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={onBackToSite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #ede4d5',
            color: '#7b4a22',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(59, 34, 16, 0.05)'
          }}
        >
          <ArrowLeft size={16} /> Return to Store
        </button>

        <button
          type="button"
          onClick={onSwitchToAdmin || (() => { window.location.hash = '#/admin/login'; })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#271407',
            border: 'none',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(39, 20, 7, 0.15)'
          }}
        >
          <ShieldCheck size={14} color="#ffb703" /> Admin Login
        </button>
      </div>

      {/* Main Container Card */}
      <div 
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '26px',
          border: '1.5px solid #ede4d5',
          boxShadow: '0 20px 50px rgba(59, 34, 16, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '32px 28px 20px 28px',
            textAlign: 'center',
            backgroundColor: '#fdfbf7',
            borderBottom: '1px solid #f2ede4'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Daddy Soda Logo" 
              style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', color: '#271407' }}>
                S DADDY SODA LOUNGE
              </div>
              <div style={{ fontSize: '0.7rem', color: '#d90429', fontWeight: 800 }}>
                Customer VIP Portal
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: '8px 0 4px 0', color: '#271407' }}>
            Customer Dashboard Login
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#7b4a22' }}>
            Sign in to access your loyalty Sip Pass, pickup tokens, and custom mixes.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '18px', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                Customer Email:
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@gmail.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d4985b',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: '#271407',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                Password:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d4985b',
                    fontSize: '0.95rem',
                    backgroundColor: '#ffffff',
                    color: '#271407',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#d90429',
                color: '#ffffff',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(217, 4, 41, 0.35)',
                marginTop: '4px'
              }}
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Customer Dashboard'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div style={{ borderTop: '1px solid #ede4d5', marginTop: '20px', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                width: '100%',
                backgroundColor: '#fdfbf7',
                border: '1.5px dashed #d4985b',
                color: '#7b4a22',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} color="#d90429" />
              <span>⚡ Auto-fill Customer Demo: customer@sodahouse.com</span>
            </button>

            {/* Member Perks */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem', color: '#7b4a22' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2b9348" /> 10-Stamp Digital Loyalty Pass (Free Bottle at 10)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2b9348" /> Real-time order token slips and pickup tracking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2b9348" /> Soda Lab custom recipe concoctions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
