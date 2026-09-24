import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall } from 'lucide-react';
import { BRAND_INFO } from '../data/sodaData';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    "Hello Daddy Soda House team! I am interested in exploring franchise opportunities in my city."
  );

  const quickChips = [
    "Franchise Investment Details",
    "Request 25+ Syrup Sample Kit",
    "Site Evaluation Process",
    "Schedule Call with Director"
  ];

  const handleSend = () => {
    const text = encodeURIComponent(customMsg);
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
      }}
    >
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #25D366',
            boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
          }}
        >
          {/* Header */}
          <div 
            style={{
              backgroundColor: '#075E54',
              color: '#ffffff',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                D
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
                  Daddy Soda House Team
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#80ED99' }}>
                  Typically replies within minutes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px', backgroundColor: '#ECE5DD' }}>
            <div 
              style={{
                backgroundColor: '#ffffff',
                padding: '10px 14px',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontSize: '0.85rem',
                color: '#3b2210',
                marginBottom: '12px',
              }}
            >
              👋 Namaste! Interested in opening a Daddy Soda House in your area? Chat with our leadership directly.
            </div>

            {/* Quick Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomMsg(chip)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #c8e6c9',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    color: '#075E54',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input & Send */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: '1px solid #ccc',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Click-to-Chat Button (Section 23) */}
      <a
        href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(BRAND_INFO.whatsappMessage)}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '12px 20px 12px 16px',
          borderRadius: '999px',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          cursor: 'pointer',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Chat on WhatsApp with Daddy Soda House"
      >
        <MessageSquare size={20} />
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
