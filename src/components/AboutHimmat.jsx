import React from 'react';
import {
  Building2,
  Fuel,
  Coins,
  Wine,
  Sparkles,
  ShieldCheck,
  Users,
  Calendar,
  Layers,
  CheckCircle,
  Quote
} from 'lucide-react';
import { HIMMAT_GROUP, BRAND_INFO } from '../data/sodaData';

export default function AboutHimmat() {
  const verticalIcons = {
    Building2: <Building2 size={24} color="#b87b43" />,
    Fuel: <Fuel size={24} color="#b87b43" />,
    Coins: <Coins size={24} color="#b87b43" />,
    Wine: <Wine size={24} color="#b87b43" />,
    Sparkles: <Sparkles size={24} color="#d90429" />,
  };

  return (
    <section
      id="about"
      className="about-section"
      style={{
        padding: '90px 0',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ede4d5',
        borderBottom: '1px solid #ede4d5',
        position: 'relative',
      }}
    >
      <div className="site-container">
        {/* 1. ABOUT THE COMPANY Header & Existing Company Image */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f6ebd9',
              color: '#7b4a22',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={16} /> Heritage & Foundation Since 1973
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              color: '#271407',
              marginBottom: '16px',
              lineHeight: 1.2,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            ABOUT SDADDY SODA HOUSE
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#6b5c52', lineHeight: 1.7, margin: '0 auto' }}>
            {HIMMAT_GROUP.description}
          </p>
        </div>

        {/* Existing Company Counter Image + Quick Story Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            backgroundColor: '#fdfbf7',
            borderRadius: '24px',
            border: '1.5px solid #ede4d5',
            padding: '28px',
            marginBottom: '48px',
            boxShadow: '0 10px 30px rgba(59, 34, 16, 0.05)'
          }}
        >
          {/* Existing Company Image */}
          <div style={{ borderRadius: '18px', overflow: 'hidden', height: '280px', border: '1px solid #ede4d5' }}>
            <img
              src="/images/counter_original.png"
              alt="Himmat Beverages Daddy Soda House Storefront"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Company Introduction */}
          <div>
            <span style={{ fontSize: '0.78rem', color: '#d90429', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              From Maharashtra to All India
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#271407', fontWeight: 900, margin: '8px 0 14px 0' }}>
              Himmat Beverages Pvt. Ltd.
            </h3>
            <p style={{ color: '#5c3518', fontSize: '0.94rem', lineHeight: 1.65, margin: '0 0 16px 0' }}>
              Founded by <strong>Late Shri Nandkumar Shivaji Kadam</strong> in 1973, Himmat Group was built on authentic hospitality, uncompromising ingredient quality, and sustainable community value.
              Daddy Soda House translates that half-century of heritage into high-speed, modern craft soda bars.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #ede4d5', fontSize: '0.84rem', fontWeight: 700, color: '#271407' }}>
                ✓ 50+ Years Legacy
              </div>
              <div style={{ padding: '8px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #ede4d5', fontSize: '0.84rem', fontWeight: 700, color: '#271407' }}>
                ✓ Own Flavor Factory
              </div>
              <div style={{ padding: '8px 14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #ede4d5', fontSize: '0.84rem', fontWeight: 700, color: '#271407' }}>
                ✓ 25+ Products
              </div>
            </div>
          </div>
        </div>

        {/* 2. OUR STORY, OUR VISION, OUR MISSION (3 Visual Cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {/* OUR STORY */}
          <div
            className="wood-card"
            style={{
              padding: '32px 28px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#ffb703', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              1973 — 2026
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#271407', fontWeight: 900, margin: '6px 0 12px 0' }}>
              Our Story
            </h3>
            <p style={{ color: '#6b5c52', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Beginning with a single hospitality venue in Maharashtra over 50 years ago, Himmat Group expanded across 5 successful commercial verticals.
              Our beverage division was born from the passion to preserve classic Indian thirst-quenchers with world-class hygienic standards.
            </p>
          </div>

          {/* OUR VISION */}
          <div
            className="wood-card"
            style={{
              padding: '32px 28px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#d90429', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Future Direction
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#271407', fontWeight: 900, margin: '6px 0 12px 0' }}>
              Our Vision
            </h3>
            <p style={{ color: '#6b5c52', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              To establish Daddy Soda House as India’s premier neighborhood craft soda destination—celebrating real fruit purees, botanical spices, and sparkling carbonation poured fresh in 15 seconds.
            </p>
          </div>

          {/* OUR MISSION */}
          <div
            className="wood-card"
            style={{
              padding: '32px 28px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#2b9348', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Entrepreneur First
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#271407', fontWeight: 900, margin: '6px 0 12px 0' }}>
              Our Mission
            </h3>
            <p style={{ color: '#6b5c52', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              To empower energetic entrepreneurs with a turnkey, high-margin soda business that requires zero culinary experience, zero staff dependency, and delivers guaranteed taste consistency.
            </p>
          </div>
        </div>

        {/* 3. WHY CHOOSE US (Section 12 of Master Prompt) */}
        <div style={{ marginBottom: '70px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
            <span style={{ fontSize: '0.8rem', color: '#d90429', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Core Strengths
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#271407', fontWeight: 900, margin: '6px 0 10px 0' }}>
              Why Choose Us
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.94rem' }}>
              Decades of manufacturing precision and retailer-first margins make our soda model stand out.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Feature 1: Quality */}
            <div
              className="wood-card"
              style={{
                padding: '28px 22px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ede4d5',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#ffe3e3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <ShieldCheck size={26} color="#d90429" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', fontWeight: 900, margin: '0 0 8px 0' }}>
                Quality
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#6b5c52', lineHeight: 1.55, margin: 0 }}>
                100% food-grade ingredients, pure fruit concentrates, and certified botanical spices formulated in our own state-of-the-art facility.
              </p>
            </div>

            {/* Feature 2: Wide Product Range */}
            <div
              className="wood-card"
              style={{
                padding: '28px 22px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ede4d5',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#f6ebd9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Layers size={26} color="#b87b43" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', fontWeight: 900, margin: '0 0 8px 0' }}>
                25+ Syrups
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#6b5c52', lineHeight: 1.55, margin: 0 }}>
                Over 25+ gourmet syrups across mocktail refreshers, authentic desi masalas, citrus kicks, zero-sugar, and prebiotic digestive sodas.
              </p>
            </div>

            {/* Feature 3: Modern Soda Experience */}
            <div
              className="wood-card"
              style={{
                padding: '28px 22px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ede4d5',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <CheckCircle size={26} color="#2b9348" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', fontWeight: 900, margin: '0 0 8px 0' }}>
                Modern Soda Experience
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#6b5c52', lineHeight: 1.55, margin: 0 }}>
                Proprietary batch-blended syrups and standardized 8-tap automated dispensers guarantee that every cup pours fresh in 15 seconds with identical taste.
              </p>
            </div>

            {/* Feature 4: Franchise Support */}
            <div
              className="wood-card"
              style={{
                padding: '28px 22px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #ede4d5',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fff9db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Users size={26} color="#f59f00" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', fontWeight: 900, margin: '0 0 8px 0' }}>
                Franchise Support
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#6b5c52', lineHeight: 1.55, margin: 0 }}>
                Complete turnkey kiosk setup, site evaluation, dispenser installation, recipe training, and continuous supply chain logistics.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Business Verticals Grid */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#271407', marginBottom: '8px' }}>
              5 Pillars of Himmat Conglomerate
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.95rem' }}>
              Each enterprise is dedicated to high-standard execution and dependable consumer satisfaction.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '18px',
            }}
          >
            {HIMMAT_GROUP.verticals.map((v, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: v.highlight ? '#fefae0' : '#ffffff',
                  border: v.highlight ? '2px solid #d90429' : '1px solid #ede4d5',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: v.highlight ? '0 10px 25px rgba(217, 4, 41, 0.12)' : '0 4px 12px rgba(59, 34, 16, 0.04)',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                }}
              >
                {v.highlight && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      backgroundColor: '#d90429',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Current Brand
                  </span>
                )}

                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: v.highlight ? '#ffe3e3' : '#f6ebd9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  {verticalIcons[v.icon]}
                </div>

                <h4 style={{ fontSize: '1.05rem', color: '#271407', marginBottom: '6px' }}>
                  {v.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#6b5c52', margin: 0, lineHeight: 1.5 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Section matching PDF Page 4 */}
        <div
          style={{
            backgroundColor: '#fdfbf7',
            borderRadius: '24px',
            padding: '48px 36px',
            border: '1px solid #ede4d5',
            boxShadow: '0 8px 30px rgba(59, 34, 16, 0.06)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.8rem', color: '#d90429', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Visionary Direction
            </span>
            <h3 style={{ fontSize: '2rem', color: '#271407', marginTop: '6px' }}>
              Our Executive Leadership
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.95rem' }}>
              Steering the brand with decades of business acumen and franchise-first mindset.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {HIMMAT_GROUP.leadership.map((leader, i) => (
              <div
                key={i}
                className="wood-card"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    border: '4px solid #b87b43',
                    boxShadow: '0 8px 24px rgba(59, 34, 16, 0.18)',
                  }}
                >
                  <img
                    src={leader.image}
                    alt={leader.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                <h4 style={{ fontSize: '1.3rem', color: '#271407', marginBottom: '4px' }}>
                  {leader.name}
                </h4>

                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#d90429',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {leader.role}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#5c3518', lineHeight: 1.6, marginBottom: '20px' }}>
                  {leader.bio}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    backgroundColor: '#f6ebd9',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    borderLeft: '4px solid #b87b43',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    textAlign: 'left',
                  }}
                >
                  <Quote size={18} color="#7b4a22" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#3b2210', fontStyle: 'italic', fontWeight: 600 }}>
                    "{leader.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
