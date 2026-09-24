import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Droplets,
  CheckCircle2,
  PhoneCall,
  Store,
  ShieldCheck,
  Award
} from 'lucide-react';
import { BRAND_INFO } from '../data/sodaData';

export default function Hero({ onOpenDrinkMixer }) {

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        paddingTop: '110px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 82% 28%, #8e1a25 0%, #70131c 38%, #530d14 75%, #38070d 100%)',
        color: '#ffffff',
        borderBottom: '3px solid #b87b43',
      }}
    >
      {/* ================================================================= */}
      {/* BACKGROUND VIDEO LAYER - HIGH VISIBILITY                          */}
      {/* ================================================================= */}
      <div
        className="hero-video-bg-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            opacity: 0.90,
            filter: 'contrast(1.08) saturate(1.18) brightness(1.0)',
          }}
        >
          <source src="/images/hero_animation.mp4" type="video/mp4" />
        </video>

        {/* Directional Overlay: Dark on the left for text contrast, open & translucent on center/right so video is clearly visible */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(22, 3, 5, 0.90) 0%, rgba(36, 5, 9, 0.76) 38%, rgba(24, 3, 6, 0.44) 66%, rgba(12, 1, 2, 0.32) 100%)',
          }}
        />

        {/* Ambient bottom smooth fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '130px',
            background: 'linear-gradient(to top, rgba(22, 3, 5, 0.85) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Decorative Gold Concentric Rings / Arcs (matching bottom-left) */}
      <svg
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '340px',
          height: '340px',
          pointerEvents: 'none',
          opacity: 0.28,
          zIndex: 1
        }}
        viewBox="0 0 200 200"
      >
        <circle cx="30" cy="170" r="170" fill="none" stroke="#ffd000" strokeWidth="2.5" />
        <circle cx="30" cy="170" r="130" fill="none" stroke="#ffd000" strokeWidth="1.8" strokeDasharray="6 6" />
        <circle cx="30" cy="170" r="90" fill="none" stroke="#ffd000" strokeWidth="2" />
        <circle cx="30" cy="170" r="50" fill="none" stroke="#ffd000" strokeWidth="1.5" />
      </svg>

      {/* Ambient Radial Glow on right side */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 183, 3, 0.18) 0%, rgba(217, 4, 41, 0.28) 45%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 2 }}>

        {/* ================================================================= */}
        {/* 1. TOP BAR MATCHING IMAGE 2:                                      */}
        {/*    Left: Hexagon 'H' + FRANCHISE OPPORTUNITY                      */}
        {/*    Right: S Daddy SODA HOUSE Official Logo                        */}
        {/* ================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(212, 152, 91, 0.25)',
          }}
        >
          {/* Top-Left: Hexagonal 'H' Badge + "FRANCHISE OPPORTUNITY" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                width: '64px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
              }}
            >
              <svg width="64" height="70" viewBox="0 0 100 110" fill="none">
                {/* Outer Hexagon */}
                <polygon points="50,4 94,28 94,82 50,106 6,82 6,28" fill="#36170a" stroke="#5a2713" strokeWidth="6" strokeLinejoin="round" />
                {/* Inner Hexagon */}
                <polygon points="50,11 87,32 87,78 50,99 13,78 13,32" fill="#200d05" />
                {/* Stylized 'H' Monogram matching image 2 */}
                <path d="M 20 55 L 36 41 L 36 69 Z" fill="#ffd000" stroke="#d90429" strokeWidth="2" />
                <rect x="36" y="25" width="11" height="60" rx="2" fill="#ffd000" stroke="#d90429" strokeWidth="2.5" />
                <rect x="44" y="50" width="22" height="11" fill="#ffd000" stroke="#d90429" strokeWidth="2.5" />
                <rect x="62" y="25" width="11" height="60" rx="2" fill="#ffd000" stroke="#d90429" strokeWidth="2.5" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
                  letterSpacing: '0.14em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                FRANCHISE
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: 'clamp(0.95rem, 1.9vw, 1.25rem)',
                  letterSpacing: '0.16em',
                  color: '#f6ebd9',
                  lineHeight: 1.15,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                OPPORTUNITY
              </span>
            </div>
          </div>

          {/* Top-Right: Official "S Daddy SODA HOUSE" Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/images/logo_perfect.png"
              alt="S Daddy Soda House Logo"
              style={{
                width: 'clamp(140px, 18vw, 210px)',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.5))',
              }}
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MAIN CENTER HERO CONTENT MATCHING IMAGE 2                      */}
        {/* ================================================================= */}
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
          }}
          className="hero-main-layout"
        >
          {/* Main Title & Brand Details */}
          <div style={{ textAlign: 'left' }}>

            {/* Small Label: FRANCHISE OPPORTUNITY with Glowing Glass Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(90deg, rgba(255, 208, 0, 0.22) 0%, rgba(212, 152, 91, 0.12) 100%)',
                border: '1.5px solid rgba(255, 208, 0, 0.75)',
                color: '#ffd000',
                padding: '7px 18px',
                borderRadius: '999px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.82rem',
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.35), inset 0 0 12px rgba(255, 208, 0, 0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={14} color="#ffd000" />
              <span>FRANCHISE OPPORTUNITY</span>
            </div>

            {/* Main Headline: SDADDY SODA HOUSE with Attractive Dual-Tone Gradient */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.7rem, 5.6vw, 4.8rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                margin: '0 0 18px 0',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(180deg, #ffffff 30%, #f4ede4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.85))',
                  display: 'inline-block',
                }}
              >
                SDADDY SODA
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffe066 0%, #ffd000 50%, #fca311 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 22px rgba(255, 208, 0, 0.35)) drop-shadow(0 6px 18px rgba(0,0,0,0.8))',
                  display: 'inline-block',
                }}
              >
                HOUSE
              </span>
            </h1>

            {/* Tagline: Refined Luxury Typography with Sparkling Diamond Accents */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px 14px',
                margin: '0 0 20px 0',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.05rem, 2.1vw, 1.35rem)',
                  fontWeight: 800,
                  color: '#ffd000',
                  letterSpacing: '0.015em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                }}
              >
                Refreshing Taste
              </span>
              <span style={{ color: '#d4985b', fontSize: '0.9rem', opacity: 0.85 }}>✦</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.05rem, 2.1vw, 1.35rem)',
                  fontWeight: 800,
                  color: '#ffd000',
                  letterSpacing: '0.015em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                }}
              >
                Consistent Quality
              </span>
              <span style={{ color: '#d4985b', fontSize: '0.9rem', opacity: 0.85 }}>✦</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.05rem, 2.1vw, 1.35rem)',
                  fontWeight: 800,
                  color: '#ffd000',
                  letterSpacing: '0.015em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                }}
              >
                Profitable Partnership
              </span>
            </div>

            {/* Luminous Gold Horizontal Accent Divider Line */}
            <div
              style={{
                width: '100%',
                maxWidth: '580px',
                height: '2px',
                background: 'linear-gradient(90deg, #ffd000 0%, #d4985b 60%, rgba(212, 152, 91, 0) 100%)',
                marginBottom: '22px',
                boxShadow: '0 0 12px rgba(255, 208, 0, 0.6)',
                borderRadius: '2px',
              }}
            />

            {/* Prestigious Company Credibility Glass Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderLeft: '4px solid #ffd000',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '14px 20px',
                borderRadius: '0 14px 14px 0',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                marginBottom: '28px',
                maxWidth: '600px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  Himmat Beverages Pvt. Ltd.
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 208, 0, 0.18)',
                    color: '#ffd000',
                    border: '1px solid rgba(255, 208, 0, 0.55)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                  }}
                >
                  EST. 1973
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#e8dcce',
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: '0.015em',
                }}
              >
                A Venture of Himmat Group of Business &nbsp;|&nbsp; Est. 1973
              </p>
            </div>

            {/* High-Converting Action Buttons with Luxury Sheen & Glow */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '32px' }}>
              {/* Primary: Explore Products */}
              <a
                href="#products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #ffd000 0%, #ff9f1c 100%)',
                  color: '#260f06',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '15px 32px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: '0 10px 28px rgba(255, 170, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.45)',
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 14px 34px rgba(255, 170, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(255, 170, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.45)';
                }}
              >
                <Droplets size={19} color="#260f06" />
                <span>Explore Products</span>
                <ArrowRight size={19} color="#260f06" />
              </a>
            </div>

            {/* Feature Points Styled as Frosted Glass Luxury Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 208, 0, 0.45)',
                  padding: '7px 15px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <CheckCircle2 size={16} color="#ffd000" />
                <span style={{ fontSize: '0.86rem', color: '#fff9e6', fontWeight: 800 }}>
                  25+ Handcrafted Gourmet Syrups
                </span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 208, 0, 0.45)',
                  padding: '7px 15px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <CheckCircle2 size={16} color="#ffd000" />
                <span style={{ fontSize: '0.86rem', color: '#fff9e6', fontWeight: 800 }}>
                  Zero Sugar & Gut-Health Options
                </span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 208, 0, 0.45)',
                  padding: '7px 15px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <CheckCircle2 size={16} color="#ffd000" />
                <span style={{ fontSize: '0.86rem', color: '#fff9e6', fontWeight: 800 }}>
                  8-Tap Dispenser Station (15s Pour)
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Embedded CSS for responsiveness */}
      <style>{`
        @media (max-width: 960px) {
          .hero-main-layout {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
