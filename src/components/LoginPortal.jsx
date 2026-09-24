import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  UserCheck, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  Coffee,
  Ticket
} from 'lucide-react';
import { BRAND_INFO } from '../data/sodaData';

export default function LoginPortal({
  initialRole = 'customer', // 'customer' | 'admin'
  onLoginSuccess,
  onBackToSite
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Customer Form Fields
  const [customerPhone, setCustomerPhone] = useState('9822012345');
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerError, setCustomerError] = useState('');

  // Admin Form Fields
  const [adminUsername, setAdminUsername] = useState('himmat.admin');
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  // Handle Customer Form Submission
  const handleCustomerLogin = (e) => {
    if (e) e.preventDefault();
    if (!customerPhone || customerPhone.length < 10) {
      setCustomerError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setCustomerError('');
    const user = {
      role: 'customer',
      name: customerName || 'Rahul Sharma',
      phone: `+91 ${customerPhone.replace(/[^0-9]/g, '').slice(-10)}`,
      passId: 'SD-90218',
      tier: 'Gold VIP Member',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onLoginSuccess(user);
  };

  // Quick Demo Customer Login
  const handleQuickCustomerDemo = () => {
    const user = {
      role: 'customer',
      name: 'Rahul Sharma',
      phone: '+91 98220 12345',
      passId: 'SD-90218',
      tier: 'Gold VIP Member',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onLoginSuccess(user);
  };

  // Handle Admin Form Submission
  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    if (adminPin !== '1973') {
      setAdminError('Incorrect PIN. (Default Himmat Founding Year PIN is 1973)');
      return;
    }
    setAdminError('');
    const user = {
      role: 'admin',
      name: 'Director Milind Kadam',
      username: adminUsername || 'himmat.admin',
      roleTitle: 'Executive Director & Store Owner',
      accessLevel: 'Super Admin',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onLoginSuccess(user);
  };

  // Quick Demo Admin Login
  const handleQuickAdminDemo = () => {
    const user = {
      role: 'admin',
      name: 'Himmat Executive Admin',
      username: 'himmat.admin',
      roleTitle: 'Executive Director & Store Owner',
      accessLevel: 'Super Admin',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onLoginSuccess(user);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: selectedRole === 'admin' ? '#140b04' : '#fdfaf5',
        backgroundImage: selectedRole === 'admin' 
          ? 'radial-gradient(ellipse at top, #2f1708 0%, #140b04 80%)'
          : 'radial-gradient(ellipse at top, #ffe8d6 0%, #fdfaf5 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Return to Site Button */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <button
          type="button"
          onClick={onBackToSite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: selectedRole === 'admin' ? 'rgba(255,255,255,0.08)' : '#ffffff',
            border: selectedRole === 'admin' ? '1px solid rgba(212, 152, 91, 0.3)' : '1px solid #ede4d5',
            color: selectedRole === 'admin' ? '#f6ebd9' : '#271407',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <ArrowLeft size={16} /> Return to Store
        </button>
      </div>

      {/* Main Container Card */}
      <div 
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: selectedRole === 'admin' ? '#1f1207' : '#ffffff',
          borderRadius: '26px',
          border: selectedRole === 'admin' ? '2px solid #b87b43' : '1.5px solid #ede4d5',
          boxShadow: selectedRole === 'admin' 
            ? '0 20px 60px rgba(0,0,0,0.7)' 
            : '0 16px 40px rgba(59, 34, 16, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            padding: '24px 28px 18px 28px',
            textAlign: 'center',
            borderBottom: selectedRole === 'admin' ? '1px solid rgba(212, 152, 91, 0.2)' : '1px solid #f2ede4',
            backgroundColor: selectedRole === 'admin' ? 'rgba(0,0,0,0.2)' : '#fdfbf7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: selectedRole === 'admin' ? '#ffffff' : '#271407' }}>
                S DADDY SODA HOUSE
              </div>
              <div style={{ fontSize: '0.7rem', color: selectedRole === 'admin' ? '#e8c49a' : '#7b4a22' }}>
                Himmat Beverages Pvt. Ltd. (Est. 1973)
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: '10px 0 4px 0', color: selectedRole === 'admin' ? '#ffea79' : '#271407' }}>
            Sign In to Your Dashboard
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: selectedRole === 'admin' ? '#e8c49a' : '#7b4a22' }}>
            Choose your login type below to access your dedicated portal
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px', gap: '8px', backgroundColor: selectedRole === 'admin' ? 'rgba(0,0,0,0.3)' : '#f6ebd9' }}>
          {/* Customer Tab Button */}
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            style={{
              padding: '11px',
              borderRadius: '12px',
              border: selectedRole === 'customer' ? '2px solid #d90429' : 'none',
              backgroundColor: selectedRole === 'customer' ? '#ffffff' : 'transparent',
              color: selectedRole === 'customer' ? '#d90429' : selectedRole === 'admin' ? '#e8c49a' : '#5c3518',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: selectedRole === 'customer' ? '0 4px 12px rgba(217,4,41,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={17} /> Customer Login
          </button>

          {/* Admin Tab Button */}
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            style={{
              padding: '11px',
              borderRadius: '12px',
              border: selectedRole === 'admin' ? '2px solid #ffb703' : 'none',
              backgroundColor: selectedRole === 'admin' ? '#271407' : 'transparent',
              color: selectedRole === 'admin' ? '#ffb703' : '#5c3518',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: selectedRole === 'admin' ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Lock size={16} /> Admin Login
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '28px' }}>
          
          {/* ==========================================================
              1. CUSTOMER LOGIN FORM
             ========================================================== */}
          {selectedRole === 'customer' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ backgroundColor: 'rgba(217, 4, 41, 0.12)', color: '#d90429', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                  FOR SODA PATRONS & SIP CLUB
                </span>
              </div>

              <form onSubmit={handleCustomerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                    Mobile Number:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7b4a22', fontSize: '0.85rem', fontWeight: 700 }}>
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="98220 12345"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 50px',
                        borderRadius: '12px',
                        border: '1.5px solid #ede4d5',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        backgroundColor: '#fdfbf7',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Rahul Sharma"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #ede4d5',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      backgroundColor: '#fdfbf7',
                      outline: 'none'
                    }}
                  />
                </div>

                {customerError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d90429', fontSize: '0.78rem', fontWeight: 700 }}>
                    <AlertCircle size={14} /> {customerError}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#d90429',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(217, 4, 41, 0.35)',
                    marginTop: '4px'
                  }}
                >
                  <Sparkles size={17} /> Access Customer Dashboard
                </button>
              </form>

              {/* 1-Click Quick Demo Login */}
              <div style={{ borderTop: '1px solid #ede4d5', marginTop: '20px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleQuickCustomerDemo}
                  style={{
                    width: '100%',
                    backgroundColor: '#fdfbf7',
                    border: '1.5px dashed #d4985b',
                    color: '#271407',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚡ 1-Click Demo Login as Customer (Rahul S. • Gold VIP)</span>
                </button>
                <p style={{ fontSize: '0.72rem', color: '#7b4a22', textAlign: 'center', margin: '8px 0 0 0' }}>
                  Loads your VIP Sip Pass, 25+ Sodas Menu & Saved Recipes immediately.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================================
              2. ADMIN / OWNER LOGIN FORM
             ========================================================== */}
          {selectedRole === 'admin' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ backgroundColor: 'rgba(255, 183, 3, 0.18)', color: '#ffea79', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                  FOR HIMMAT BEVERAGES MANAGEMENT & OPERATORS
                </span>
              </div>

              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                    Admin Username:
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="himmat.admin"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(212, 152, 91, 0.4)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      backgroundColor: '#140b04',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9' }}>
                      Admin Access PIN:
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#ffea79', fontWeight: 700 }}>
                      (Default PIN: 1973)
                    </span>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: adminError ? '2px solid #d90429' : '1.5px solid rgba(212, 152, 91, 0.4)',
                      fontSize: '1.2rem',
                      letterSpacing: '0.3em',
                      backgroundColor: '#140b04',
                      color: '#ffb703',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                </div>

                {adminError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff85a1', fontSize: '0.78rem', fontWeight: 700 }}>
                    <AlertCircle size={14} /> {adminError}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#d90429',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(217, 4, 41, 0.4)',
                    marginTop: '4px'
                  }}
                >
                  <KeyRound size={17} /> Unlock Admin Dashboard
                </button>
              </form>

              {/* 1-Click Quick Demo Login */}
              <div style={{ borderTop: '1px solid rgba(212, 152, 91, 0.25)', marginTop: '20px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleQuickAdminDemo}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 183, 3, 0.12)',
                    border: '1.5px dashed #ffb703',
                    color: '#ffea79',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚡ 1-Click Demo Login as Admin (Himmat Mgmt)</span>
                </button>
                <p style={{ fontSize: '0.72rem', color: '#9c8e84', textAlign: 'center', margin: '8px 0 0 0' }}>
                  Instant access to Franchise CRM, 8-Tap POS & Inventory controls.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
