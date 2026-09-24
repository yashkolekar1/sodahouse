import React from 'react';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Database, 
  Heart, 
  ArrowUp,
  Lock
} from 'lucide-react';
import { BRAND_INFO } from '../data/sodaData';

export default function Footer({ onOpenOwner, onOpenAdmin, onOpenCustomer }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer"
      style={{
        backgroundColor: '#271407',
        color: '#f6ebd9',
        borderTop: '4px solid #b87b43',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top fluted wood slat accent border */}
      <div 
        className="fluted-panel"
        style={{
          height: '14px',
          width: '100%',
        }}
      />

      <div className="site-container" style={{ padding: '70px 24px 30px 24px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Col 1: Brand & Parent Conglomerate */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img 
                src="/images/logo_perfect.png" 
                alt="S Daddy Soda House Logo"
                style={{
                  width: '46px',
                  height: '46px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  S DADDY SODA HOUSE
                </span>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#e8c49a' }}>
                  Himmat Beverages Pvt. Ltd.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#e8c49a', lineHeight: 1.6, marginBottom: '20px' }}>
              A proud venture of <strong>Himmat Group of Business (Est. 1973)</strong>. 
              Pioneering commercial craft soda dispensing systems, 25+ gourmet proprietary syrups, 
              and turnkey micro-franchise models across India.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ backgroundColor: 'rgba(212, 152, 91, 0.2)', color: '#ffea79', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                50+ Years Legacy
              </span>
              <span style={{ backgroundColor: 'rgba(212, 152, 91, 0.2)', color: '#ffea79', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                FSSAI Standard
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (Section 24) */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', paddingBottom: '8px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#products" style={{ color: '#e8c49a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffb703')} onMouseLeave={(e) => (e.currentTarget.style.color = '#e8c49a')}>
                  Products & Drinks
                </a>
              </li>
              <li>
                <a href="#syrups" style={{ color: '#e8c49a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffb703')} onMouseLeave={(e) => (e.currentTarget.style.color = '#e8c49a')}>
                  25+ Gourmet Syrups
                </a>
              </li>
              <li>
                <a href="#franchise" style={{ color: '#e8c49a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffb703')} onMouseLeave={(e) => (e.currentTarget.style.color = '#e8c49a')}>
                  Franchise Opportunity
                </a>
              </li>
              <li>
                <a href="#contact" style={{ color: '#e8c49a', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffb703')} onMouseLeave={(e) => (e.currentTarget.style.color = '#e8c49a')}>
                  Contact & Enquiries
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(BRAND_INFO.whatsappMessage)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#25D366', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  WhatsApp Click-to-Chat →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Leadership & Verticals */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', paddingBottom: '8px' }}>
              Himmat Group Verticals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#e8c49a' }}>
              <li>• Himmat Enterprise</li>
              <li>• Himmat Petroleum</li>
              <li>• Himmat Finance</li>
              <li>• Himmat Liquors</li>
              <li>• Himmat Beverages Pvt. Ltd.</li>
            </ul>

            <div style={{ marginTop: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#ffffff', fontWeight: 700 }}>
                Directors:
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#e8c49a' }}>
                Mr. Milind Nandkumar Kadam & Mr. Ketan Nandkumar Kadam
              </p>
            </div>
          </div>

          {/* Col 4: Reach Out & Portal */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', paddingBottom: '8px' }}>
              Franchise Desk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <a 
                href={`tel:${BRAND_INFO.phone}`} 
                style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Phone size={16} color="#2b9348" /> {BRAND_INFO.phoneFormatted}
              </a>

              <a 
                href={`mailto:${BRAND_INFO.email}`} 
                style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', wordBreak: 'break-all' }}
              >
                <Mail size={16} color="#d90429" /> {BRAND_INFO.email}
              </a>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="#/dashboard"
                  style={{
                    backgroundColor: 'rgba(255, 183, 3, 0.18)',
                    color: '#ffea79',
                    border: '1px solid #ffb703',
                    borderRadius: '8px',
                    padding: '9px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    justifyContent: 'center'
                  }}
                >
                  <Sparkles size={15} color="#ffb703" /> Customer Lounge & Orders
                </a>

                <a
                  href="#contact"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#e8c49a',
                    border: '1px solid rgba(212, 152, 91, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    justifyContent: 'center'
                  }}
                >
                  Apply for Franchise Unit
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid rgba(212, 152, 91, 0.2)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#b87b43',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} <strong>S Daddy Soda House</strong> — Himmat Beverages Pvt. Ltd. All rights reserved.
            </p>
            <span style={{ color: 'rgba(212, 152, 91, 0.4)' }}>•</span>
            <a 
              href="#/admin/login" 
              style={{ 
                color: 'rgba(232, 196, 154, 0.65)', 
                textDecoration: 'none', 
                fontSize: '0.74rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffea79')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232, 196, 154, 0.65)')}
            >
              <Lock size={11} /> Admin Portal
            </a>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'none',
              border: 'none',
              color: '#e8c49a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
