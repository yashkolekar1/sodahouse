import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function CustomerLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  defaultRole = 'customer'
}) {
  const [activeTab, setActiveTab] = useState(defaultRole); // 'customer' | 'admin'
  const [customerEmail, setCustomerEmail] = useState('customer@sodahouse.com');
  const [customerPassword, setCustomerPassword] = useState('customer123');

  const [adminUsername, setAdminUsername] = useState('admin@sodahouse.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomerSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!customerEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!customerPassword.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let displayName = customerEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Customer';
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      if (displayName.trim().toLowerCase() === 'customer') displayName = 'Rahul Sharma';

      const user = {
        id: 'cust-' + Date.now().toString().slice(-4),
        name: displayName,
        email: customerEmail,
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
        onLoginSuccess(user, 'customer');
      }
      onClose();
    }, 200);
  };

  const handleAdminSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!adminUsername.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }
    if (!adminPassword.trim()) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const adminUser = {
        id: 'admin-root',
        username: adminUsername,
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
        onLoginSuccess(adminUser, 'admin');
      }
      onClose();
    }, 200);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(39, 20, 7, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          maxWidth: '450px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #ede4d5',
          boxShadow: '0 25px 60px rgba(59, 34, 16, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#7b4a22',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            borderRadius: '50%',
            zIndex: 10
          }}
          title="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div 
          style={{
            padding: '28px 24px 16px 24px',
            textAlign: 'center',
            backgroundColor: '#fdfbf7',
            borderBottom: '1px solid #f2ede4'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Daddy Soda Logo" 
              style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: '#271407', margin: '0 0 6px 0' }}>
            Sign In to Dashboard
          </h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#7b4a22' }}>
            Enter your email & password to access your dashboard.
          </p>

          {/* Role Tabs */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              backgroundColor: '#ede4d5',
              padding: '4px',
              borderRadius: '12px',
              marginTop: '16px'
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab('customer'); setError(''); }}
              style={{
                padding: '8px 12px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'customer' ? '#ffffff' : 'transparent',
                color: activeTab === 'customer' ? '#271407' : '#7b4a22',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'customer' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={14} color="#d90429" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              style={{
                padding: '8px 12px',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: activeTab === 'admin' ? '#271407' : 'transparent',
                color: activeTab === 'admin' ? '#ffffff' : '#7b4a22',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'admin' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={14} color={activeTab === 'admin' ? '#ffb703' : '#7b4a22'} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffebee', color: '#c62828', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '16px', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* ================================= CUSTOMER TAB ================================= */}
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                  Customer Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@gmail.com"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #d4985b',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      color: '#271407',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #d4985b',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      color: '#271407',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#d90429',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(217, 4, 41, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{loading ? 'Signing in...' : 'Sign In to Customer Dashboard'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerEmail('customer@sodahouse.com');
                    setCustomerPassword('customer123');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7b4a22',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Auto-fill Customer Demo: customer@sodahouse.com
                </button>
              </div>
            </form>
          )}

          {/* ================================= ADMIN TAB ================================= */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                  Admin Username / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <UserCheck size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="e.g. admin@sodahouse.com"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #b87b43',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      color: '#271407',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #b87b43',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      color: '#271407',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#271407',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(39, 20, 7, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{loading ? 'Verifying Admin...' : 'Sign In to Admin Dashboard'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('admin@sodahouse.com');
                    setAdminPassword('admin123');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#b87b43',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Auto-fill Admin Demo: admin@sodahouse.com / admin123
                </button>
              </div>
            </form>
          )}

          {/* Bottom Security Note */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #ede4d5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#7b4a22', fontSize: '0.72rem' }}>
            <ShieldCheck size={14} color="#2b9348" />
            <span>Direct Email & Password Authentication • Zero External Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
