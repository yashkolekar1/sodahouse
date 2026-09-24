import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  Layers,
  Store,
  MessageSquare,
  ArrowRight,
  Database,
  Lock,
  Crown,
  Heart,
  LogOut,
  User
} from 'lucide-react';
import { BRAND_INFO } from '../data/sodaData';

export default function Navbar({
  onOpenOwner,
  onOpenAdmin,
  leadsCount = 0,
  onOpenCustomer,
  customerBadgeCount = 0,
  currentUser = null,
  onLogout = null,
  onOpenLogin = null
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Drink Mixer', href: '#soda-lab' },
    { name: 'Franchise', href: '#franchise' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="site-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.35s ease',
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(253, 251, 247, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid #ede4d5' : '1px solid rgba(212, 152, 91, 0.2)',
          boxShadow: isScrolled ? '0 8px 30px rgba(59, 34, 16, 0.08)' : 'none',
        }}
      >
        {/* Top Mini Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, #3b2210, #5c3518, #3b2210)',
            color: '#fff',
            fontSize: '0.78rem',
            padding: '6px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            letterSpacing: '0.03em',
            fontFamily: 'var(--font-heading)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <span style={{ backgroundColor: '#e63946', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>
              EST. 1973
            </span>
            <span>Himmat Beverages Pvt. Ltd. • Turnkey Soda Franchise Available Across India • 8 Dispensers & 25+ Flavors</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="hidden md:flex">
            <a
              href={`tel:${BRAND_INFO.phone}`}
              style={{ color: '#f6ebd9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
            >
              <PhoneCall size={12} /> {BRAND_INFO.phoneFormatted}
            </a>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="site-container navbar-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          {/* Brand Logo */}
          <a className="navbar-brand" href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/images/logo_perfect.png"
              alt="S Daddy Soda House Logo"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(59, 34, 16, 0.25))',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  color: '#271407',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase'
                }}>
                  S Daddy <span style={{ color: '#d90429' }}>Soda</span> House
                </span>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#e8c49a', color: '#3b2210', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                  TM
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 600, margin: 0, letterSpacing: '0.02em' }}>
                Himmat Beverages Pvt. Ltd. | 50+ Years Legacy
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none' }} className="md-nav-links premium-nav-links">
            <ul style={{ display: 'flex', alignItems: 'center', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      color: '#3b2210',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      padding: '6px 4px',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#d90429')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#3b2210')}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Action CTA: Clean Customer Login (Uncrowded) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* If NOT LOGGED IN: Simple Sign In / Login Button */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => onOpenLogin ? onOpenLogin('customer') : (onOpenCustomer ? onOpenCustomer() : (window.location.hash = '#/dashboard'))}
                title="Customer & Admin Sign In"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  color: '#271407',
                  border: '1.5px solid #d4985b',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 34, 16, 0.05)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fdfbf7';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Sparkles size={14} color="#d90429" />
                <span>Login</span>
              </button>
            )}

            {/* If LOGGED IN AS CUSTOMER */}
            {currentUser && currentUser.role === 'customer' && (
              <>
                <button
                  type="button"
                  onClick={() => { window.location.hash = '#/dashboard'; }}
                  title="Open Customer Dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#d90429',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(217, 4, 41, 0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Sparkles size={14} />
                  <span>Customer Dashboard</span>
                </button>

                <div
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#f6ebd9',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#3b2210'
                  }}
                  className="hidden md:flex"
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#06d6a0' }} />
                  <span>{currentUser.name}</span>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Log Out"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(217, 4, 41, 0.12)',
                      border: '1px solid rgba(217, 4, 41, 0.3)',
                      color: '#d90429',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                )}
              </>
            )}

            {/* If LOGGED IN AS ADMIN */}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => { window.location.hash = '#/admin'; }}
                  title="Go to Admin Dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#1f1207',
                    color: '#ffea79',
                    border: '1.5px solid #ffb703',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Lock size={14} color="#ffb703" />
                  <span>Admin Dashboard</span>
                </button>

                <div
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255, 183, 3, 0.15)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#ffb703',
                    border: '1px solid rgba(255, 183, 3, 0.3)'
                  }}
                  className="hidden md:flex"
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ffb703' }} />
                  <span>Admin Active</span>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Log Out"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(217, 4, 41, 0.12)',
                      border: '1px solid rgba(217, 4, 41, 0.3)',
                      color: '#d90429',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                )}
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b2210',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="mobile-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Clean Slide-Out / Full-Screen Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTop: '1px solid #ede4d5',
              borderBottom: '3px solid #b87b43',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(59, 34, 16, 0.18)',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
              {navLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      color: '#271407',
                      textDecoration: 'none',
                      display: 'block',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#fdfbf7',
                      border: '1px solid #f6ebd9',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li style={{ paddingTop: '12px', borderTop: '1px solid #ede4d5', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenLogin) onOpenLogin('customer');
                      else if (onOpenCustomer) onOpenCustomer();
                      else window.location.hash = '#/dashboard';
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#271407',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(39, 20, 7, 0.2)',
                    }}
                  >
                    <Sparkles size={17} color="#ffb703" />
                    <span>Customer Login</span>
                    {customerBadgeCount > 0 && (
                      <span style={{ backgroundColor: '#d90429', color: '#fff', fontSize: '0.72rem', padding: '1px 7px', borderRadius: '999px' }}>
                        {customerBadgeCount}
                      </span>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.location.hash = '#/dashboard';
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        backgroundColor: '#d90429',
                        color: '#ffffff',
                        border: 'none',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={17} />
                      <span>Customer Dashboard</span>
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onLogout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(217, 4, 41, 0.12)',
                          color: '#d90429',
                          border: '1px solid rgba(217, 4, 41, 0.3)',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out ({currentUser.name})</span>
                      </button>
                    )}
                  </>
                )}

                <a
                  href={`tel:${BRAND_INFO.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#5c3518',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <PhoneCall size={16} /> Call Franchise Desk ({BRAND_INFO.phoneFormatted})
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Media query styling for responsive desktop nav */}
      <style>{`
        @media (min-width: 960px) {
          .md-nav-links {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
