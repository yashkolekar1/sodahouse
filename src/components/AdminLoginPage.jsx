import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess, onBackToSite, onSwitchToCustomer }) {
  const [username, setUsername] = useState('admin@sodahouse.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const adminUser = {
        id: 'admin-root',
        username,
        name: 'Himmat Executive Management',
        roleTitle: 'Executive Director & Store Owner',
        role: 'admin',
        accessLevel: 'Super Admin'
      };

      try {
        localStorage.setItem('daddy_admin_user', JSON.stringify(adminUser));
        localStorage.setItem('daddy_admin_token', 'token_admin_' + Date.now());
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(adminUser);
      }
    }, 200);
  };

  const handleFillDemoAdmin = () => {
    setUsername('admin@sodahouse.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#140b04',
        backgroundImage: 'radial-gradient(ellipse at top, #2f1708 0%, #140b04 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative'
      }}
    >
      {/* Top navigation actions */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={onBackToSite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(212, 152, 91, 0.3)',
            color: '#f6ebd9',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Return to Store
        </button>

        <button
          type="button"
          onClick={onSwitchToCustomer || (() => { window.location.hash = '#/dashboard'; })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(217, 4, 41, 0.15)',
            border: '1px solid rgba(217, 4, 41, 0.4)',
            color: '#ffccd5',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={14} color="#ff4d6d" /> Customer Login
        </button>
      </div>

      {/* Main Container Card */}
      <div 
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#1f1207',
          borderRadius: '26px',
          border: '2px solid #b87b43',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '28px 28px 20px 28px',
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.25)',
            borderBottom: '1px solid rgba(212, 152, 91, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Logo" 
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>
                HIMMAT BEVERAGES
              </div>
              <div style={{ fontSize: '0.68rem', color: '#e8c49a' }}>
                Executive Operations & Syrup Management
              </div>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 183, 3, 0.15)', padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
            <ShieldCheck size={14} color="#ffea79" />
            <span style={{ fontSize: '0.72rem', color: '#ffea79', fontWeight: 800 }}>
              ADMINISTRATIVE ACCESS
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: '6px 0 4px 0', color: '#ffffff' }}>
            Admin Portal Sign In
          </h2>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#e8c49a' }}>
            Enter your credentials to manage syrup availability, orders, and inquiries.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(217, 4, 41, 0.2)', border: '1px solid #d90429', color: '#ffccd5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '18px', fontWeight: 700 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                Admin Email / Username:
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@sodahouse.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(212, 152, 91, 0.4)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: '#140b04',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                Admin Password:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(212, 152, 91, 0.4)',
                  fontSize: '0.95rem',
                  backgroundColor: '#140b04',
                  color: '#ffb703',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
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
                boxShadow: '0 4px 14px rgba(217, 4, 41, 0.4)',
                marginTop: '4px'
              }}
            >
              <KeyRound size={17} />
              <span>{loading ? 'Signing in...' : 'Sign In to Admin Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div style={{ borderTop: '1px solid rgba(212, 152, 91, 0.25)', marginTop: '20px', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 183, 3, 0.12)',
                border: '1.5px dashed #ffb703',
                color: '#ffea79',
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
              <span>⚡ Auto-fill Admin Demo: admin@sodahouse.com / admin123</span>
            </button>
            <p style={{ fontSize: '0.72rem', color: '#c49a6c', textAlign: 'center', margin: '10px 0 0 0' }}>
              Direct credential login • Pure client-side access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
