import React, { useState } from 'react';
import {
  Check,
  TrendingUp,
  Store,
  Factory,
  Cpu,
  Users,
  PackageCheck,
  Sliders,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  DollarSign,
  Coffee,
  Receipt,
  Camera,
  Flame
} from 'lucide-react';
import {
  FRANCHISE_MODELS,
  SETUP_INCLUDES,
  US_VS_THEM,
  PARTNERSHIP_STEPS,
  BRAND_INFO
} from '../data/sodaData';

export default function FranchiseSection({ onOpenEnquiry }) {
  const [selectedTierTab, setSelectedTierTab] = useState('tier3'); // 'tier3' | 'tier12'

  // Dynamic ROI Calculator State
  const [calcTier, setCalcTier] = useState('tier3');
  const [dailySodas, setDailySodas] = useState(250);
  const [sodaPrice, setSodaPrice] = useState(20);
  const [dailyGolas, setDailyGolas] = useState(30);
  const [golaPrice, setGolaPrice] = useState(30);

  // Switch presets
  const handleTierPreset = (tierKey) => {
    setCalcTier(tierKey);
    if (tierKey === 'tier3') {
      setDailySodas(250);
      setSodaPrice(20);
      setDailyGolas(30);
      setGolaPrice(30);
    } else {
      setDailySodas(350);
      setSodaPrice(30);
      setDailyGolas(75);
      setGolaPrice(50);
    }
  };

  // Calculations
  const dailyTotal = (dailySodas * sodaPrice) + (dailyGolas * golaPrice);
  const monthlyTotal = dailyTotal * 30;
  const annualTotalLakhs = (monthlyTotal * 12) / 100000;
  const annualProfit25Lakhs = (annualTotalLakhs * 0.25);
  const annualProfit30Lakhs = (annualTotalLakhs * 0.30);

  const iconMap = {
    Coffee: <Coffee size={20} color="#b87b43" />,
    Receipt: <Receipt size={20} color="#b87b43" />,
    Camera: <Camera size={20} color="#b87b43" />,
    Flame: <Flame size={20} color="#b87b43" />,
    Store: <Store size={20} color="#b87b43" />,
    PackageCheck: <PackageCheck size={20} color="#b87b43" />,
  };

  return (
    <section
      id="franchise"
      className="franchise-section"
      style={{
        padding: '90px 0',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ede4d5',
        position: 'relative',
      }}
    >
      <div className="site-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 50px auto' }}>
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
              marginBottom: '14px',
            }}
          >
            <TrendingUp size={16} /> Profitable Business Opportunity
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', color: '#271407', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            START YOUR OWN SODA BUSINESS
          </h2>

          <p style={{ fontSize: '1.08rem', color: '#6b5c52', lineHeight: 1.7, marginBottom: '24px' }}>
            No culinary expertise. No chef dependency. Just an automated, high-margin craft soda bar backed by 50+ years of Himmat Group trust and standardized 8-tap dispensing.
          </p>

          <div>
            <a
              href="#contact"
              className="btn-accent-soda"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                fontSize: '0.96rem',
                boxShadow: '0 8px 24px rgba(217, 4, 41, 0.3)',
              }}
            >
              <Sparkles size={16} />

              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* 3 CORE PILLARS FROM PDF PAGE 5 & 6 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          {/* Pillar 1: Exclusive Flavor Factory */}
          <div className="wood-card" style={{ padding: '32px', backgroundColor: '#fdfbf7' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#ffe3e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Factory size={28} color="#d90429" />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: '#271407', marginBottom: '12px' }}>
              Exclusive Flavor Factory
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Own modern manufacturing plant in Maharashtra',
                'Proprietary syrup formulations & concentrates',
                '100% consistent taste guaranteed in every cup',
                'Reliable direct supply chain with max retailer margins',
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#5c3518' }}>
                  <Check size={16} color="#2b9348" style={{ flexShrink: 0 }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Tech-Driven Operations */}
          <div className="wood-card" style={{ padding: '32px', backgroundColor: '#fdfbf7' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#fefae0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Cpu size={28} color="#b87b43" />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: '#271407', marginBottom: '12px' }}>
              Tech-Driven Operations
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Smart touchscreen POS & cloud billing system',
                'Automated per-glass sale tracking (zero pilferage)',
                'Remote 24/7 CCTV monitoring on owner’s phone',
                'Automated low-stock alerts & sales dashboards',
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#5c3518' }}>
                  <Check size={16} color="#2b9348" style={{ flexShrink: 0 }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: Zero Skilled Staff Needed */}
          <div className="wood-card" style={{ padding: '32px', backgroundColor: '#fdfbf7' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Users size={28} color="#2b9348" />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: '#271407', marginBottom: '12px' }}>
              No Skilled Chef Required
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'SOP-based fixed recipes with push-button taps',
                'Easy machine operation (anyone can pour)',
                '1-day quick onboarding & complete training',
                'Zero chef dependency; hire any counter staff anytime',
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#5c3518' }}>
                  <Check size={16} color="#2b9348" style={{ flexShrink: 0 }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* INVESTMENT BREAKDOWN (TIER 3 VS TIER 1 & 2) */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#271407', marginBottom: '8px' }}>
              Investment Breakdown & Setup Scope
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.95rem' }}>
              Transparent pricing with everything included from machinery to interior & stock.
            </p>

            {/* Toggle Tabs */}
            <div style={{ display: 'inline-flex', backgroundColor: '#f6ebd9', padding: '5px', borderRadius: '999px', marginTop: '14px' }}>
              <button
                onClick={() => setSelectedTierTab('tier3')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: selectedTierTab === 'tier3' ? '#271407' : 'transparent',
                  color: selectedTierTab === 'tier3' ? '#ffffff' : '#5c3518',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Tier 3 Cities & Towns
              </button>
              <button
                onClick={() => setSelectedTierTab('tier12')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: selectedTierTab === 'tier12' ? '#271407' : 'transparent',
                  color: selectedTierTab === 'tier12' ? '#ffffff' : '#5c3518',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Tier 1 & Tier 2 Metros
              </button>
            </div>
          </div>

          {/* Active Tier Investment Display */}
          {(() => {
            const tierData = FRANCHISE_MODELS[selectedTierTab];
            return (
              <div
                style={{
                  backgroundColor: '#fdfbf7',
                  border: '2px solid #d4985b',
                  borderRadius: '24px',
                  padding: '36px',
                  boxShadow: '0 12px 30px rgba(59, 34, 16, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px',
                    alignItems: 'center',
                    marginBottom: '32px',
                  }}
                >
                  {/* Left: Fee & Total Investment Banner */}
                  <div
                    className="wood-card-dark"
                    style={{ padding: '32px', textAlign: 'center' }}
                  >
                    <span style={{ fontSize: '0.78rem', color: '#ffb703', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {tierData.title}
                    </span>

                    <div style={{ margin: '14px 0 6px 0' }}>
                      <span style={{ fontSize: '1.1rem', color: '#e8c49a' }}>Franchise Fee: </span>
                      <strong style={{ fontSize: '2.4rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                        {tierData.franchiseFee}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#d4985b', margin: 0 }}>
                      {tierData.feeNote}
                    </p>

                    <hr style={{ borderColor: 'rgba(212, 152, 91, 0.3)', margin: '20px 0' }} />

                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#e8c49a', textTransform: 'uppercase' }}>
                        Estimated Total Setup Investment:
                      </span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffea79', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                        {tierData.estimatedTotal}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#f6ebd9' }}>
                        Includes equipment, turnkey fluted counter interior, billing, CCTV & opening stock
                      </span>
                    </div>
                  </div>

                  {/* Right: Setup & Equipment Includes Checklist matching PDF */}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', color: '#271407', marginBottom: '16px' }}>
                      What Your Setup Package Includes:
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      {SETUP_INCLUDES.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            backgroundColor: '#ffffff',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid #ede4d5',
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>{iconMap[item.icon]}</div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#271407' }}>
                              {item.item}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#7b4a22' }}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benchmark Numbers Bar from Brochure */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #ede4d5',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Daily Soda Target</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#271407' }}>{tierData.dailySodaSales}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Daily Ice-Gola Target</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#271407' }}>{tierData.dailyGolaSales}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Daily Revenue</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#d90429' }}>{tierData.dailyRevenue}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Revenue</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#2b9348' }}>{tierData.monthlyRevenue}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Annual Revenue</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#271407' }}>{tierData.annualRevenue}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7b4a22', textTransform: 'uppercase', fontWeight: 700 }}>Expected ROI</span>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.1rem', color: '#800f2f' }}>{tierData.expectedROI}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* INTERACTIVE CUSTOM ROI & REVENUE CALCULATOR */}
        <div
          style={{
            backgroundColor: '#271407',
            borderRadius: '28px',
            padding: '40px 32px',
            color: '#fff',
            border: '2px solid #b87b43',
            boxShadow: '0 20px 45px rgba(39, 20, 7, 0.4)',
            marginBottom: '70px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffb703', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Sliders size={18} /> Interactive Financial Model
            </div>
            <h3 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '6px' }}>
              Calculate Your Custom Revenue & Profit Potential
            </h3>
            <p style={{ color: '#e8c49a', fontSize: '0.92rem' }}>
              Adjust daily volume and price points to see projected daily, monthly, and yearly cash flow.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            {/* Sliders Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleTierPreset('tier3')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: calcTier === 'tier3' ? '2px solid #ffb703' : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: calcTier === 'tier3' ? '#4a2e18' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Load Tier 3 Preset (250 Glasses @ ₹20)
                </button>
                <button
                  onClick={() => handleTierPreset('tier12')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: calcTier === 'tier12' ? '2px solid #ffb703' : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: calcTier === 'tier12' ? '#4a2e18' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Load Metro Tier 1 & 2 Preset (350 Glasses @ ₹30)
                </button>
              </div>

              {/* Slider 1: Daily Soda Glasses */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f6ebd9' }}>Daily Soda Glasses:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffea79' }}>{dailySodas} glasses / day</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="10"
                  value={dailySodas}
                  onChange={(e) => setDailySodas(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ffb703', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Average Price Per Glass */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f6ebd9' }}>Average Soda Price:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffea79' }}>₹{sodaPrice} per glass</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={sodaPrice}
                  onChange={(e) => setSodaPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ffb703', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 3: Daily Ice-Golas */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f6ebd9' }}>Daily Ice-Gola Sales:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffea79' }}>{dailyGolas} pcs @ ₹{golaPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={dailyGolas}
                  onChange={(e) => setDailyGolas(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ffb703', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Results Display Board */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(212, 152, 91, 0.3)',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#e8c49a', textTransform: 'uppercase' }}>Daily Projected Revenue</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                    ₹{dailyTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#e8c49a', textTransform: 'uppercase' }}>Monthly Projected Revenue</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffea79', fontFamily: 'var(--font-heading)' }}>
                    ₹{monthlyTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Annual Breakdown */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#f6ebd9' }}>Annual Projected Gross Turnover:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>₹{annualTotalLakhs.toFixed(2)} Lakhs</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#e8c49a' }}>Estimated Net Profit @ 25%:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2b9348' }}>₹{annualProfit25Lakhs.toFixed(2)} Lakhs / yr</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#e8c49a' }}>Estimated Net Profit @ 30%:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#52b788' }}>₹{annualProfit30Lakhs.toFixed(2)} Lakhs / yr</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#4a2e18',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#ffb703', textTransform: 'uppercase', fontWeight: 800 }}>Projected Payback</span>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>18 – 24 Months</p>
                </div>

                <a
                  href="#contact"
                  className="btn-accent-soda"
                  style={{ padding: '8px 18px', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  Apply for Territory
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT WE PROVIDE VS WHAT YOU DO (PDF PAGE 13) */}
        <div style={{ marginBottom: '70px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
            <span style={{ fontSize: '0.8rem', color: '#d90429', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              True Partnership Model
            </span>
            <h3 style={{ fontSize: '2rem', color: '#271407', marginTop: '6px' }}>
              What We Provide VS What You Do
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.92rem' }}>
              Clear demarcation of responsibilities ensuring maximum synergy and peace of mind.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {/* Company Provides */}
            <div
              className="wood-card"
              style={{
                padding: '32px',
                borderTop: '5px solid #2b9348',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '10px' }}>
                  <Store size={22} color="#2b9348" />
                </div>
                <h4 style={{ fontSize: '1.3rem', color: '#271407', margin: 0 }}>
                  Company Provides (Himmat Beverages)
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {US_VS_THEM.companyProvides.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Check size={18} color="#2b9348" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#271407' }}>
                        {item.title}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b5c52' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Franchisee Handles */}
            <div
              className="wood-card"
              style={{
                padding: '32px',
                borderTop: '5px solid #b87b43',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f6ebd9', padding: '8px', borderRadius: '10px' }}>
                  <Users size={22} color="#7b4a22" />
                </div>
                <h4 style={{ fontSize: '1.3rem', color: '#271407', margin: 0 }}>
                  Franchisee Handles (Store Partner)
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {US_VS_THEM.franchiseeHandles.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <ArrowRight size={18} color="#b87b43" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#271407' }}>
                        {item.title}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b5c52' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6-STEP PATH TO PARTNERSHIP (PDF PAGE 14) */}
        <div>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
            <span style={{ fontSize: '0.8rem', color: '#d90429', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Fast-Track Onboarding
            </span>
            <h3 style={{ fontSize: '2rem', color: '#271407', marginTop: '6px' }}>
              Your 6-Step Path to Partnership
            </h3>
            <p style={{ color: '#7b4a22', fontSize: '0.92rem' }}>
              Only <strong>1.5 months (45 days)</strong> from agreement signing to grand opening!
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '16px',
            }}
          >
            {PARTNERSHIP_STEPS.map((step) => (
              <div
                key={step.step}
                className="wood-card"
                style={{
                  padding: '24px 18px',
                  backgroundColor: '#fdfbf7',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#d90429',
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(217, 4, 41, 0.3)',
                  }}
                >
                  {step.step}
                </div>

                <h4 style={{ fontSize: '1.05rem', color: '#271407', marginBottom: '8px' }}>
                  {step.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: '#6b5c52', margin: 0, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* REQUIREMENTS & FAQ (Per Master Prompt Section 15) */}
        <div style={{ marginTop: '70px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

          {/* Requirements Card */}
          <div
            className="wood-card"
            style={{
              padding: '32px',
              backgroundColor: '#fdfbf7',
              border: '1.5px solid #ede4d5',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '0.76rem', color: '#d90429', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Site Criteria
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#271407', fontWeight: 900, margin: '6px 0 16px 0' }}>
              Franchise Requirements
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Check size={18} color="#2b9348" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Commercial Carpet Area:</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#6b5c52' }}>
                    120 sq. ft. to 250 sq. ft. on high-footfall main roads, transit hubs, college areas, or shopping markets.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Check size={18} color="#2b9348" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Utilities:</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#6b5c52' }}>
                    Standard electrical connection (single or 3-phase depending on model) plus clean drinking water inlet & drainage.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Check size={18} color="#2b9348" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Staffing:</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#6b5c52' }}>
                    Requires only 1 to 2 counter operators per shift. No trained chef or beverage technician needed.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Check size={18} color="#2b9348" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Commitment:</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#6b5c52' }}>
                    Adherence to brand recipes, hygienic dispenser cleaning protocols, and territory guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Card */}
          <div
            className="wood-card"
            style={{
              padding: '32px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #ede4d5',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '0.76rem', color: '#b87b43', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Common Questions
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#271407', fontWeight: 900, margin: '6px 0 16px 0' }}>
              Franchise FAQ
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#271407', display: 'block', marginBottom: '2px' }}>
                  Q: How long does the setup take?
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b5c52', lineHeight: 1.5 }}>
                  Only 45 days (1.5 months) from franchise agreement signing to grand opening and live dispensing.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.88rem', color: '#271407', display: 'block', marginBottom: '2px' }}>
                  Q: Do I need prior restaurant or soda experience?
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b5c52', lineHeight: 1.5 }}>
                  No prior experience required. Our automated 8-tap dispensing machines and batch-ready syrups make operation foolproof.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.88rem', color: '#271407', display: 'block', marginBottom: '2px' }}>
                  Q: Where are the syrups and ingredients sourced from?
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b5c52', lineHeight: 1.5 }}>
                  All 25+ syrups and spice concentrates are manufactured exclusively in our own flavor factory in Maharashtra, ensuring direct factory prices.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.88rem', color: '#271407', display: 'block', marginBottom: '2px' }}>
                  Q: How do I apply?
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b5c52', lineHeight: 1.5 }}>
                  Submit the enquiry form below. Our leadership team will review your target city and schedule a direct consultation.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Callout pointing to Enquiry Form */}
        <div
          style={{
            marginTop: '48px',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#f6ebd9',
            borderRadius: '16px',
            border: '1px solid #d4985b',
          }}
        >
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#271407', margin: '0 0 6px 0', fontWeight: 900 }}>
            Ready to bring S Daddy Soda House to your city?
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#5c3518' }}>
            Complete the short application form below to request city territory availability and franchise prospectus.
          </p>
          <a
            href="#contact"
            className="btn-accent-soda"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Proceed to Franchise Enquiry Form</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
