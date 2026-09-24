import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Award, 
  QrCode, 
  MapPin, 
  Trash2, 
  Plus, 
  Check, 
  Ticket, 
  Zap,
  Phone,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Coffee,
  Copy,
  Gift,
  Star,
  Send,
  ShoppingBag,
  Minus,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  Sliders,
  LogOut,
  Lock
} from 'lucide-react';
import { BRAND_INFO, SYRUPS } from '../data/sodaData';

export default function CustomerDashboard({
  onBackToSite,
  onSwitchToOwner,
  onSwitchToAdmin,
  currentUser = null,
  onLogout = null,
  onSwitchToAdminLogin = null,
  favorites = [],
  onToggleFavorite,
  savedMixes = [],
  onDeleteMix,
  loyaltyStamps = 6,
  onAddStamp,
  onOpenMixer,
  announcement = '',
  onAddCustomerReview
}) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'recipes' | 'favorites' | 'loyalty' | 'outlets' | 'feedback'
  const [selectedOutlet, setSelectedOutlet] = useState('Pune - Kothrud Outlet');
  const [copiedCode, setCopiedCode] = useState(false);

  // Cart / Order Tray State
  const [orderCart, setOrderCart] = useState([
    {
      cartItemId: 'blue-curacao-Regular-reg',
      id: 'blue-curacao',
      name: 'Blue Curacao',
      image: '/images/drinks/drink_berry.png',
      size: 'Regular (300ml)',
      price: 25,
      isSugarFree: false,
      quantity: 1
    }
  ]);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [orderTokenModal, setOrderTokenModal] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerOrderName, setCustomerOrderName] = useState('Rahul S. (Gold VIP)');
  const [appliedCoupon, setAppliedCoupon] = useState('DADDY-SIP-15');

  // Selected size & sugar options per syrup item
  const [itemSelections, setItemSelections] = useState({});

  const getItemSelection = (syrupId) => {
    return itemSelections[syrupId] || { size: 'Regular', price: 25, isSugarFree: false };
  };

  const updateItemSelection = (syrupId, field, val) => {
    const current = getItemSelection(syrupId);
    let updated = { ...current, [field]: val };
    if (field === 'size') {
      updated.price = val === 'Regular' ? 25 : val === 'Large' ? 35 : 65;
    }
    setItemSelections((prev) => ({ ...prev, [syrupId]: updated }));
  };

  const handleAddToCart = (syrup) => {
    const sel = getItemSelection(syrup.id);
    const sizeLabel = sel.size === 'Regular' ? 'Regular (300ml)' : sel.size === 'Large' ? 'Large (450ml)' : '1 Litre Takeaway Bottle';
    const cartItemId = `${syrup.id}-${sel.size}-${sel.isSugarFree ? 'sf' : 'reg'}`;

    setOrderCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: syrup.id,
          name: syrup.name,
          image: syrup.image,
          size: sizeLabel,
          price: sel.price,
          isSugarFree: sel.isSugarFree,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId, delta) => {
    setOrderCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (cartItemId) => {
    setOrderCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Cart Metrics Calculations
  const totalCartItemsCount = orderCart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = orderCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const couponDiscount = appliedCoupon === 'DADDY-SIP-15' && cartSubtotal > 0 ? Math.round(cartSubtotal * 0.15) : 0;
  const cartFinalTotal = Math.max(0, cartSubtotal - couponDiscount);

  // WhatsApp Order
  const handleOrderCartViaWhatsApp = () => {
    if (orderCart.length === 0) return;
    const itemsList = orderCart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.size}${item.isSugarFree ? ' • Zero-Sugar Stevia' : ''}) x${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join('\n');

    const message = encodeURIComponent(
      `🍹 *NEW SODA PASS ORDER*\n` +
      `👤 *Customer:* ${customerOrderName} (Pass #SD-90218)\n` +
      `📍 *Pickup Counter:* ${selectedOutlet}\n\n` +
      `🛒 *ORDER SUMMARY:*\n${itemsList}\n\n` +
      `💵 Subtotal: ₹${cartSubtotal}\n` +
      `🏷️ Member Discount (${appliedCoupon}): -₹${couponDiscount}\n` +
      `⭐ *TOTAL PAYABLE: ₹${cartFinalTotal}*\n` +
      (orderNotes ? `📝 Notes: ${orderNotes}\n` : '') +
      `\nPlease prepare this order for counter pickup in ~10 mins! Thank you!`
    );

    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${message}`, '_blank');
  };

  // Generate In-Store Digital Token
  const handleGenerateInStoreToken = () => {
    if (orderCart.length === 0) return;
    const tokenNum = `SD-TKN-${Math.floor(100 + Math.random() * 900)}`;
    setOrderTokenModal({
      tokenNumber: tokenNum,
      customerName: customerOrderName,
      items: [...orderCart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      total: cartFinalTotal,
      outlet: selectedOutlet,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    });
    if (onAddStamp) {
      onAddStamp();
    }
    setOrderCart([]);
  };

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    drinkChoice: 'Blue Curacao Sparkler',
    fizzLevel: 'Extra Fizzy',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const favoriteSyrups = SYRUPS.filter((s) => favorites.includes(s.id));

  const outlets = [
    { 
      name: 'Pune - Kothrud Outlet', 
      address: 'Shop 4, Karve Road, Near Shivaji Statue, Kothrud, Pune', 
      timing: '10:00 AM – 11:30 PM', 
      phone: '+91 82375 22072',
      status: 'Open Now'
    },
    { 
      name: 'Kolhapur - Heritage Outlet', 
      address: 'Shivaji Chowk, Main Market Road, Kolhapur', 
      timing: '9:30 AM – 11:00 PM', 
      phone: '+91 82375 22072',
      status: 'Open Now'
    },
    { 
      name: 'Solapur - City Center', 
      address: 'Station Road, Opp. Himmat Commercial Complex, Solapur', 
      timing: '10:00 AM – 11:00 PM', 
      phone: '+91 82375 22072',
      status: 'Open Now'
    },
    { 
      name: 'Mumbai - Dadar West', 
      address: 'Near Plaza Cinema, Ranade Road, Dadar (W), Mumbai', 
      timing: '11:00 AM – Midnight', 
      phone: '+91 82375 22072',
      status: 'Open Now'
    },
  ];

  const handleOrderMixViaWhatsApp = (mix) => {
    const text = encodeURIComponent(
      `Hey Daddy Soda House (${selectedOutlet})! I want to order my saved custom drink from my Soda Pass:\n\n🍹 *${mix.name}*\n• Base: ${mix.base}\n• Syrups: ${mix.syrups.map(s => s.name).join(' + ')}\n• Toppings: ${mix.toppings.join(', ')}\n\nCan you keep this prepared for counter pickup?`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleOrderSyrupViaWhatsApp = (syrup) => {
    const text = encodeURIComponent(
      `Hey Daddy Soda House! I want to order a bottle/cup of your *${syrup.name}* syrup drink (${selectedOutlet}). Can you assist with pickup?`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div className="customer-dashboard-page">
      {/* Top Lounge Navigation Bar */}
      <header className="customer-topbar">
        <div 
          className="site-container" 
          style={{ 
            padding: '14px 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand & Lounge Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={onBackToSite}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(212, 152, 91, 0.4)',
                color: '#f6ebd9',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = '#f6ebd9';
              }}
              title="Return to Main Store"
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/images/logo_perfect.png" 
                alt="Logo" 
                style={{ width: '38px', height: '38px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1.2rem', 
                    fontWeight: 900, 
                    margin: 0, 
                    color: '#ffffff',
                    letterSpacing: '-0.01em'
                  }}>
                    CUSTOMER SODA LOUNGE
                  </h1>
                  <span 
                    style={{
                      backgroundColor: 'rgba(255, 183, 3, 0.2)',
                      border: '1px solid #ffb703',
                      color: '#ffb703',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    VIP SIP PASS
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#e8c49a' }}>
                  Personal Recipe Box • Live Counter QR Pass • Loyalty Rewards
                </p>
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                padding: '6px 14px', 
                borderRadius: '20px',
                border: '1px solid rgba(212, 152, 91, 0.3)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06d6a0' }} />
              <span style={{ fontSize: '0.8rem', color: '#f6ebd9', fontWeight: 700 }}>
                {currentUser?.name || 'Rahul Sharma'} • {currentUser?.tier || 'Gold VIP'}
              </span>
            </div>

            {onSwitchToAdminLogin && (
              <button
                type="button"
                onClick={onSwitchToAdminLogin}
                style={{
                  backgroundColor: 'rgba(255, 183, 3, 0.15)',
                  border: '1.5px solid #ffb703',
                  color: '#ffea79',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title="Switch account to Franchise Admin Dashboard"
              >
                <Lock size={13} />
                <span>Admin Login</span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  backgroundColor: 'rgba(217, 4, 41, 0.22)',
                  border: '1.5px solid #d90429',
                  color: '#ffccd5',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                title="Sign out of customer session"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Customer Dashboard Content Area */}
      <main style={{ flex: 1, padding: '36px 0 60px 0' }}>
        <div className="site-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Live Broadcast Announcement from Owner */}
          {announcement && (
            <div 
              style={{
                backgroundColor: '#fff3cd',
                border: '2px solid #ffeeba',
                borderRadius: '16px',
                padding: '14px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '1.4rem' }}>📢</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#856404', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Official Broadcast from Daddy Soda Management
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#533f03', marginTop: '2px' }}>
                  {announcement}
                </div>
              </div>
            </div>
          )}

          {/* Top Welcome Banner + VIP Pass Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '24px', 
              marginBottom: '32px' 
            }}
          >
            {/* VIP Digital Membership Card */}
            <div className="vip-member-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#ffb703', fontWeight: 800, textTransform: 'uppercase' }}>
                    Himmat Beverages VIP Club
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff' }}>
                    S Daddy Sip Pass
                  </h2>
                </div>
                <div 
                  style={{
                    backgroundColor: 'rgba(255, 183, 3, 0.18)',
                    border: '1px solid #ffb703',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#ffea79',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  <Award size={14} /> GOLD MEMBER
                </div>
              </div>

              {/* Card Center - QR and Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={68} color="#271407" />
                </div>
                <div style={{ fontSize: '0.85rem', color: '#f6ebd9' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#ffffff' }}>
                    Pass ID: <span style={{ fontFamily: 'monospace', color: '#ffb703', fontSize: '1rem' }}>#SD-90218</span>
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#e8c49a' }}>
                    Show QR at any Maharashtra outlet counter to record stamps & redeem instant discounts.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#ffb703', fontWeight: 700 }}>
                    Active Outlets: Pune • Kolhapur • Solapur • Mumbai
                  </p>
                </div>
              </div>

              {/* Coupon Privilege Strip */}
              <div 
                style={{
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px dashed rgba(212, 152, 91, 0.4)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#e8c49a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    In-Store Counter Code:
                  </span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 900, color: '#ffea79', fontSize: '1rem' }}>
                    DADDY-SIP-15
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCoupon('DADDY-SIP-15')}
                  style={{
                    backgroundColor: copiedCode ? '#06d6a0' : '#d4985b',
                    color: copiedCode ? '#000000' : '#271407',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                  {copiedCode ? 'Copied!' : 'Copy 15% OFF'}
                </button>
              </div>
            </div>

            {/* Quick Metrics & Outlet Selector */}
            <div 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ede4d5',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407' }}>
                    My Soda Activity
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#7b4a22', fontWeight: 600 }}>
                    Updated in Real-Time
                  </span>
                </div>

                {/* Stat Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#d90429', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                      {savedMixes.length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700 }}>
                      Custom Mixes
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#271407', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                      {favorites.length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700 }}>
                      Favorite Syrups
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#ffb703', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                      {loyaltyStamps}/10
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700 }}>
                      Sip Stamps
                    </div>
                  </div>
                </div>

                {/* Preferred Pickup Counter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#5c3518', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Preferred Pickup Counter:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedOutlet}
                      onChange={(e) => setSelectedOutlet(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #d4985b',
                        backgroundColor: '#fdfbf7',
                        color: '#271407',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                    >
                      {outlets.map((o) => (
                        <option key={o.name} value={o.name}>
                          📍 {o.name} ({o.timing})
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#7b4a22', fontSize: '0.8rem' }}>
                      ▼
                    </div>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.72rem', color: '#7b4a22' }}>
                    Orders sent via WhatsApp will automatically select this counter location.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f2ece2', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMixer) onOpenMixer();
                    else onBackToSite();
                  }}
                  className="btn-accent-soda"
                  style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                >
                  <Plus size={15} /> Craft New Drink in Mixer
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #ede4d5',
              borderRadius: '16px',
              padding: '6px 12px',
              marginBottom: '28px',
              overflowX: 'auto',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(59, 34, 16, 0.03)',
            }}
          >
            {/* Tab 0: Drinks Menu & Order Tray */}
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`customer-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
              style={{
                backgroundColor: activeTab === 'menu' ? '#d90429' : 'transparent',
                color: activeTab === 'menu' ? '#ffffff' : '#271407',
                fontWeight: 800,
              }}
            >
              <ShoppingBag size={16} color={activeTab === 'menu' ? '#ffffff' : '#d90429'} />
              <span>Drinks Menu & Order ({SYRUPS.length})</span>
              {orderCart.length > 0 && (
                <span 
                  style={{ 
                    backgroundColor: activeTab === 'menu' ? '#ffffff' : '#d90429', 
                    color: activeTab === 'menu' ? '#d90429' : '#ffffff', 
                    borderRadius: '999px', 
                    fontSize: '0.68rem', 
                    padding: '1px 6px', 
                    fontWeight: 900 
                  }}
                >
                  {totalCartItemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recipes')}
              className={`customer-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            >
              <Sparkles size={16} color={activeTab === 'recipes' ? '#d90429' : '#7b4a22'} />
              <span>My Custom Mixes ({savedMixes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`customer-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            >
              <Heart size={16} color={activeTab === 'favorites' ? '#d90429' : '#7b4a22'} />
              <span>Favorite Syrups ({favoriteSyrups.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('loyalty')}
              className={`customer-tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            >
              <Award size={16} color={activeTab === 'loyalty' ? '#d4985b' : '#7b4a22'} />
              <span>Sip Club Loyalty Stamps ({loyaltyStamps}/10)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('outlets')}
              className={`customer-tab-btn ${activeTab === 'outlets' ? 'active' : ''}`}
            >
              <MapPin size={16} color={activeTab === 'outlets' ? '#2b9348' : '#7b4a22'} />
              <span>Counter Outlets ({outlets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`customer-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            >
              <Star size={16} color={activeTab === 'feedback' ? '#ffb703' : '#7b4a22'} />
              <span>Rate Drink & Feedback</span>
            </button>
          </div>

          {/* ==========================================================
              TAB 0: FULL 25+ DRINKS MENU & INTERACTIVE ORDERING
             ========================================================== */}
          {activeTab === 'menu' && (
            <div>
              {/* Menu Filter & Search Bar */}
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  border: '1.5px solid #ede4d5',
                  marginBottom: '24px',
                  boxShadow: '0 4px 14px rgba(59, 34, 16, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: '#271407', margin: 0 }}>
                      Handcrafted Soda & Mocktail Menu
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: '#7b4a22' }}>
                      25+ Gourmet proprietary flavors. Select cup size, customize sugar preference, and place order for counter pickup!
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: 'relative', minWidth: '260px' }}>
                    <Search size={15} color="#9c6332" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Search drinks (e.g. Cola, Mojito, Kokum)..."
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        borderRadius: '10px',
                        border: '1.5px solid #ede4d5',
                        fontSize: '0.82rem',
                        backgroundColor: '#fdfbf7',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    'All',
                    'Mocktail Refreshers',
                    'Desi Masala',
                    'Citrus Kick',
                    'Fruit Fusion',
                    'Herbal & Fresh',
                    'Zero Sugar',
                    'Gut Health'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedMenuCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: selectedMenuCategory === cat ? '1.5px solid #d90429' : '1px solid #ede4d5',
                        backgroundColor: selectedMenuCategory === cat ? '#d90429' : '#fdfbf7',
                        color: selectedMenuCategory === cat ? '#ffffff' : '#5c3518',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat === 'All' ? `All Drinks (${SYRUPS.length})` : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content: Left Drinks Grid + Right Sticky Order Tray */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 360px',
                  gap: '24px',
                  alignItems: 'start',
                }}
                className="menu-and-cart-layout"
              >
                {/* 1. Drinks List Grid */}
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {SYRUPS
                    .filter((s) => {
                      if (selectedMenuCategory === 'Zero Sugar') return s.sugarFreeAvailable;
                      if (selectedMenuCategory === 'Gut Health') return s.isGutHealth;
                      if (selectedMenuCategory !== 'All') return s.category === selectedMenuCategory;
                      return true;
                    })
                    .filter((s) => {
                      if (!menuSearch) return true;
                      const q = menuSearch.toLowerCase();
                      return (
                        s.name.toLowerCase().includes(q) ||
                        (s.flavorNotes && s.flavorNotes.toLowerCase().includes(q)) ||
                        (s.category && s.category.toLowerCase().includes(q))
                      );
                    })
                    .map((syrup) => {
                      const sel = getItemSelection(syrup.id);
                      const isFav = favorites.includes(syrup.id);
                      const cartCountForThis = orderCart
                        .filter(i => i.id === syrup.id)
                        .reduce((a, b) => a + b.quantity, 0);

                      return (
                        <div
                          key={syrup.id}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '18px',
                            border: '1.5px solid #ede4d5',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(59, 34, 16, 0.04)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <div>
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <span 
                                style={{
                                  backgroundColor: 'rgba(212, 152, 91, 0.12)',
                                  color: '#7b4a22',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                {syrup.category}
                              </span>

                              <button
                                type="button"
                                onClick={() => onToggleFavorite(syrup.id)}
                                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                }}
                              >
                                <Heart size={16} fill={isFav ? '#d90429' : 'none'} color={isFav ? '#d90429' : '#b87b43'} />
                              </button>
                            </div>

                            {/* Image and Badges */}
                            <div style={{ textAlign: 'center', margin: '10px 0 14px 0', position: 'relative' }}>
                              <img
                                src={syrup.image}
                                alt={syrup.name}
                                style={{
                                  height: '110px',
                                  width: 'auto',
                                  objectFit: 'contain',
                                  filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.15))',
                                  transition: 'transform 0.25s ease'
                                }}
                              />
                              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                {syrup.badge && (
                                  <span style={{ backgroundColor: '#271407', color: '#ffb703', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                                    {syrup.badge}
                                  </span>
                                )}
                                {syrup.isGutHealth && (
                                  <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                                    Prebiotic
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Title & Flavor description */}
                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 900, color: '#271407', margin: '0 0 4px 0' }}>
                              {syrup.name}
                            </h4>
                            <p style={{ fontSize: '0.78rem', color: '#7b4a22', lineHeight: 1.4, margin: '0 0 12px 0', minHeight: '34px' }}>
                              {syrup.flavorNotes}
                            </p>

                            {/* Size Selection Pills */}
                            <div style={{ marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5c3518', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                Cup Size:
                              </span>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                                {[
                                  { key: 'Regular', label: 'Regular 300ml', price: 25 },
                                  { key: 'Large', label: 'Large 450ml', price: 35 },
                                  { key: 'Bottle', label: '1L Bottle', price: 65 },
                                ].map((sz) => (
                                  <button
                                    key={sz.key}
                                    type="button"
                                    onClick={() => updateItemSelection(syrup.id, 'size', sz.key)}
                                    style={{
                                      padding: '5px 2px',
                                      borderRadius: '6px',
                                      border: sel.size === sz.key ? '1.5px solid #d90429' : '1px solid #ede4d5',
                                      backgroundColor: sel.size === sz.key ? '#fff1f2' : '#fdfbf7',
                                      color: sel.size === sz.key ? '#d90429' : '#271407',
                                      fontSize: '0.7rem',
                                      fontWeight: sel.size === sz.key ? 800 : 600,
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <div>₹{sz.price}</div>
                                    <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{sz.key}</div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Sugar Free Option (if available) */}
                            {syrup.sugarFreeAvailable && (
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#2b9348', fontWeight: 700, marginBottom: '12px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={sel.isSugarFree}
                                  onChange={(e) => updateItemSelection(syrup.id, 'isSugarFree', e.target.checked)}
                                  style={{ accentColor: '#2b9348', cursor: 'pointer' }}
                                />
                                Zero-Sugar Stevia Option (No Calories)
                              </label>
                            )}
                          </div>

                          {/* Add to Cart CTA */}
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f2ede4' }}>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(syrup)}
                              style={{
                                width: '100%',
                                backgroundColor: cartCountForThis > 0 ? '#271407' : '#d90429',
                                color: cartCountForThis > 0 ? '#ffea79' : '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '9px 12px',
                                fontSize: '0.84rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            >
                              <Plus size={15} />
                              <span>{cartCountForThis > 0 ? `Add Another (₹${sel.price}) • ${cartCountForThis} in Tray` : `Add to Order Tray (₹${sel.price})`}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 2. Right Sticky Order Tray & Counter Checkout */}
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '2px solid #b87b43',
                    padding: '22px',
                    position: 'sticky',
                    top: '90px',
                    boxShadow: '0 8px 30px rgba(59, 34, 16, 0.08)',
                  }}
                  className="customer-order-tray-card"
                >
                  {/* Tray Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1.5px solid #ede4d5', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ backgroundColor: '#d90429', color: '#ffffff', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900, color: '#271407', margin: 0 }}>
                          My Order Tray
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: '#7b4a22' }}>
                          {totalCartItemsCount} Drinks Selected
                        </span>
                      </div>
                    </div>

                    {orderCart.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOrderCart([])}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e11d48',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Tray Item List */}
                  {orderCart.length === 0 ? (
                    <div style={{ padding: '36px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🥤</div>
                      <h5 style={{ color: '#271407', fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                        Your Order Tray is Empty
                      </h5>
                      <p style={{ fontSize: '0.78rem', color: '#7b4a22', margin: 0 }}>
                        Tap "+ Add to Order Tray" on any of our 25+ sodas to assemble your counter pickup!
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Items Scroll Area */}
                      <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', paddingRight: '4px' }}>
                        {orderCart.map((item) => (
                          <div 
                            key={item.cartItemId}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#fdfbf7',
                              border: '1px solid #ede4d5',
                              borderRadius: '12px',
                              padding: '8px 10px',
                              gap: '8px',
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                            />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#271407', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#7b4a22' }}>
                                {item.size} {item.isSugarFree ? '• Zero Sugar' : ''}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.cartItemId, -1)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #ede4d5',
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#271407'
                                }}
                              >
                                <Minus size={11} />
                              </button>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#271407', minWidth: '16px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.cartItemId, 1)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #ede4d5',
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#271407'
                                }}
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            {/* Item Price */}
                            <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#271407', minWidth: '38px', textAlign: 'right' }}>
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pickup Counter Selector */}
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#5c3518', marginBottom: '4px', textTransform: 'uppercase' }}>
                          Pickup Counter Location:
                        </label>
                        <select
                          value={selectedOutlet}
                          onChange={(e) => setSelectedOutlet(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            border: '1.5px solid #d4985b',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor: '#fdfbf7',
                            color: '#271407'
                          }}
                        >
                          {outlets.map((o) => (
                            <option key={o.name} value={o.name}>
                              📍 {o.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Customer Name & Notes */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#7b4a22', marginBottom: '2px' }}>
                            Your Name:
                          </label>
                          <input
                            type="text"
                            value={customerOrderName}
                            onChange={(e) => setCustomerOrderName(e.target.value)}
                            placeholder="Rahul S."
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #ede4d5', fontSize: '0.78rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#7b4a22', marginBottom: '2px' }}>
                            Prep Notes:
                          </label>
                          <input
                            type="text"
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="e.g. Less ice"
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #ede4d5', fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div style={{ backgroundColor: '#fdfbf7', borderRadius: '12px', padding: '12px', border: '1px solid #ede4d5', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#7b4a22', marginBottom: '4px' }}>
                          <span>Subtotal ({totalCartItemsCount} Drinks):</span>
                          <span style={{ fontWeight: 700, color: '#271407' }}>₹{cartSubtotal}</span>
                        </div>

                        {couponDiscount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#2e7d32', fontWeight: 700, marginBottom: '4px' }}>
                            <span>VIP Pass Discount (15% OFF):</span>
                            <span>-₹{couponDiscount}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, color: '#271407', borderTop: '1px dashed #d4985b', paddingTop: '8px', marginTop: '6px' }}>
                          <span>Total to Pay:</span>
                          <span style={{ color: '#d90429', fontFamily: 'var(--font-heading)' }}>₹{cartFinalTotal}</span>
                        </div>
                      </div>

                      {/* Primary Order CTAs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* 1. WhatsApp Pre-Order Button */}
                        <button
                          type="button"
                          onClick={handleOrderCartViaWhatsApp}
                          style={{
                            width: '100%',
                            backgroundColor: '#25d366',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '11px 14px',
                            fontSize: '0.88rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <MessageCircle size={17} />
                          <span>Order via WhatsApp (Counter Pickup)</span>
                        </button>

                        {/* 2. In-Store Digital Slip & Token Button */}
                        <button
                          type="button"
                          onClick={handleGenerateInStoreToken}
                          style={{
                            width: '100%',
                            backgroundColor: '#271407',
                            color: '#ffea79',
                            border: '1.5px solid #ffb703',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            fontSize: '0.84rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <Receipt size={16} color="#ffb703" />
                          <span>Get In-Store Token Slip (+1 Stamp)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 1: MY SAVED RECIPES (SODA LAB)
             ========================================================== */}
          {activeTab === 'recipes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#271407', fontFamily: 'var(--font-heading)' }}>
                    My Signature Soda Lab Recipes
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#7b4a22' }}>
                    Custom mixes you engineered. Tap "Order for Counter Pickup" to order freshly mixed drinks directly over WhatsApp!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMixer) onOpenMixer();
                    else onBackToSite();
                  }}
                  className="btn-accent-soda"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  <Plus size={15} /> Mix New Drink
                </button>
              </div>

              {savedMixes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1.5px dashed #d4985b' }}>
                  <Sparkles size={42} color="#d4985b" style={{ margin: '0 auto 14px auto' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#271407', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                    No Saved Concoctions Yet
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#7b4a22', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                    Visit our Swig-style interactive Soda Lab on the homepage, select your base, choose 2 syrups, and click "Save Recipe"!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenMixer) onOpenMixer();
                      else onBackToSite();
                    }}
                    className="btn-accent-soda"
                    style={{ padding: '10px 20px' }}
                  >
                    Take Me to Soda Lab
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                  {savedMixes.map((mix) => (
                    <div 
                      key={mix.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        border: '1.5px solid #ede4d5',
                        padding: '24px',
                        boxShadow: '0 6px 20px rgba(59, 34, 16, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#7b4a22', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Created {mix.date || 'Recent'}
                            </span>
                            <h4 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#271407', fontFamily: 'var(--font-heading)' }}>
                              {mix.name}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteMix && onDeleteMix(mix.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#9c8e84',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '6px',
                              transition: 'color 0.2s ease',
                            }}
                            title="Delete this recipe"
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#d90429')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#9c8e84')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Ingredients specification */}
                        <div style={{ backgroundColor: '#fdfbf7', borderRadius: '12px', padding: '14px', marginBottom: '16px', border: '1px solid #ede4d5' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700, display: 'block' }}>
                              BASE:
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#271407' }}>
                              🥤 {mix.base}
                            </span>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700, display: 'block' }}>
                              SYRUPS (2-SHOT FUSION):
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {mix.syrups && mix.syrups.map((s, idx) => (
                                <span 
                                  key={idx}
                                  style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d4985b',
                                    color: '#5c3518',
                                    borderRadius: '6px',
                                    padding: '2px 8px',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  ✨ {s.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {mix.toppings && mix.toppings.length > 0 && (
                            <div>
                              <span style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700, display: 'block' }}>
                                TOPPINGS & GARNISH:
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#5c3518', fontStyle: 'italic' }}>
                                {mix.toppings.join(' • ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleOrderMixViaWhatsApp(mix)}
                          style={{
                            flex: 1,
                            backgroundColor: '#2b9348',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(43, 147, 72, 0.25)',
                          }}
                        >
                          <MessageCircle size={15} /> Order for Pickup
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              TAB 2: MY FAVORITE SYRUPS
             ========================================================== */}
          {activeTab === 'favorites' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#271407', fontFamily: 'var(--font-heading)' }}>
                    My Favorite Flavors & Syrups ({favoriteSyrups.length})
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#7b4a22' }}>
                    Quick access to the syrups you love from our 25+ gourmet formulation catalog.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onBackToSite}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #d4985b',
                    color: '#271407',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Browse Full 25+ Catalog
                </button>
              </div>

              {favoriteSyrups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1.5px dashed #d4985b' }}>
                  <Heart size={42} color="#d4985b" style={{ margin: '0 auto 14px auto' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#271407', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                    No Favorite Syrups Saved Yet
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#7b4a22', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                    Click the heart icon on any syrup in our 25+ product catalog to pin your go-to flavors here for fast ordering!
                  </p>
                  <button
                    type="button"
                    onClick={onBackToSite}
                    className="btn-accent-soda"
                    style={{ padding: '10px 20px' }}
                  >
                    Explore 25+ Syrups Catalog
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {favoriteSyrups.map((syrup) => (
                    <div
                      key={syrup.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        border: '1.5px solid #ede4d5',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 6px 18px rgba(59, 34, 16, 0.05)',
                      }}
                    >
                      <div 
                        style={{ 
                          height: '160px', 
                          backgroundColor: '#fbf8f2', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative',
                          borderBottom: '1px solid #ede4d5'
                        }}
                      >
                        <img 
                          src={syrup.image || '/images/drinks/drink_cola.png'} 
                          alt={syrup.name}
                          style={{
                            height: '140px',
                            width: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 8px 14px rgba(39, 20, 7, 0.25))',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => onToggleFavorite && onToggleFavorite(syrup.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            border: '1px solid #ede4d5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#d90429',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                          title="Remove from favorites"
                        >
                          <Heart size={16} fill="#d90429" />
                        </button>
                      </div>

                      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#b87b43', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {syrup.tagline || 'Himmat Special'}
                          </span>
                          <h4 style={{ margin: '4px 0 6px 0', fontSize: '1.15rem', color: '#271407', fontFamily: 'var(--font-heading)' }}>
                            {syrup.name}
                          </h4>
                          <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#6b5c52', lineHeight: 1.4 }}>
                            {syrup.shortDesc || syrup.desc}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOrderSyrupViaWhatsApp(syrup)}
                            style={{
                              flex: 1,
                              backgroundColor: '#2b9348',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <MessageCircle size={14} /> Quick Order
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenMixer) onOpenMixer();
                              else onBackToSite();
                            }}
                            style={{
                              backgroundColor: '#fdfbf7',
                              color: '#271407',
                              border: '1px solid #d4985b',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Add to drink mixer"
                          >
                            Mix Drink
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              TAB 3: SIP CLUB LOYALTY CARD (10 STAMPS)
             ========================================================== */}
          {activeTab === 'loyalty' && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '2px solid #ede4d5',
                  padding: '32px',
                  boxShadow: '0 10px 30px rgba(59, 34, 16, 0.06)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(255, 183, 3, 0.15)',
                      color: '#d4985b',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}
                  >
                    <Award size={16} /> DADDY SODA SIP CLUB
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 900, color: '#271407', margin: '4px 0 6px 0' }}>
                    10-Stamp Digital Punch Card
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#7b4a22', margin: 0 }}>
                    Buy any 10 soda drinks at our outlets, and your 11th artisanal bottle is 100% FREE!
                  </p>
                </div>

                {/* The 10 Stamp Grid */}
                <div 
                  style={{
                    backgroundColor: '#fbf8f2',
                    border: '2px dashed #d4985b',
                    borderRadius: '20px',
                    padding: '28px 20px',
                    marginBottom: '28px',
                  }}
                >
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '16px',
                      justifyItems: 'center',
                      maxWidth: '480px',
                      margin: '0 auto 20px auto',
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slotNumber) => {
                      const isStamped = slotNumber <= loyaltyStamps;
                      const isFreeDrink = slotNumber === 10;
                      return (
                        <div key={slotNumber} style={{ textAlign: 'center' }}>
                          <div className={`stamp-slot ${isStamped ? 'stamped' : 'empty'}`}>
                            {isStamped ? (
                              <Check size={26} strokeWidth={3} />
                            ) : isFreeDrink ? (
                              <Gift size={24} color="#d90429" />
                            ) : (
                              slotNumber
                            )}
                          </div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7b4a22', display: 'block', marginTop: '6px' }}>
                            {isFreeDrink ? 'FREE SODA' : `Cup #${slotNumber}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress info & demo button */}
                  <div style={{ textAlign: 'center', borderTop: '1px solid #ede4d5', paddingTop: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#271407', fontWeight: 700 }}>
                      You have earned <span style={{ color: '#d90429', fontSize: '1.1rem' }}>{loyaltyStamps}</span> of 10 stamps!
                      {loyaltyStamps >= 10 ? ' 🎉 You unlocked your FREE DRINK voucher!' : ` (${10 - loyaltyStamps} more to go)`}
                    </p>

                    <button
                      type="button"
                      onClick={onAddStamp}
                      style={{
                        backgroundColor: '#271407',
                        color: '#ffb703',
                        border: '1.5px solid #ffb703',
                        padding: '8px 18px',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(39, 20, 7, 0.2)',
                      }}
                    >
                      <Plus size={16} /> Tap to Simulate Counter Stamp (Demo)
                    </button>
                  </div>
                </div>

                {/* Milestone Rewards Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ backgroundColor: '#06d6a0', color: '#ffffff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        {loyaltyStamps >= 5 ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Stamp 5 Perk</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#7b4a22' }}>
                      Free extra flavor shot or cream float with any counter drink!
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ backgroundColor: loyaltyStamps >= 10 ? '#d90429' : '#9c8e84', color: '#ffffff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        {loyaltyStamps >= 10 ? 'READY TO REDEEM' : 'AT 10 STAMPS'}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#271407' }}>Stamp 10 Grand Reward</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#7b4a22' }}>
                      100% Free 500ml Bottled Masala Soda or Signature Cooler of your choice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 4: COUNTER OUTLETS DIRECTORY
             ========================================================== */}
          {activeTab === 'outlets' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#271407', fontFamily: 'var(--font-heading)' }}>
                  Maharashtra In-Store Counter Locations
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#7b4a22' }}>
                  Visit any of our operational wooden soda counters to redeem coupons, collect stamps, and pick up custom blends.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {outlets.map((outlet, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1.5px solid #ede4d5',
                      padding: '24px',
                      boxShadow: '0 6px 18px rgba(59, 34, 16, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          ● {outlet.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#7b4a22', fontWeight: 600 }}>
                          {outlet.timing}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#271407', fontFamily: 'var(--font-heading)' }}>
                        {outlet.name}
                      </h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#6b5c52', lineHeight: 1.45 }}>
                        📍 {outlet.address}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${outlet.phone}`}
                        style={{
                          flex: 1,
                          backgroundColor: '#fdfbf7',
                          color: '#271407',
                          border: '1.5px solid #d4985b',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Phone size={14} /> Call Outlet
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const text = encodeURIComponent(`Hi ${outlet.name}! I am visiting from my Daddy Soda Pass.`);
                          window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`, '_blank');
                        }}
                        style={{
                          backgroundColor: '#2b9348',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 5: RATE YOUR DRINK & SEND FEEDBACK TO OWNER
             ========================================================== */}
          {activeTab === 'feedback' && (
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid #ede4d5',
                  padding: '32px',
                  boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(255, 183, 3, 0.18)', marginBottom: '8px' }}>
                    <Star size={28} color="#d90429" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: '#271407', margin: '4px 0' }}>
                    Rate Your Soda Experience
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#7b4a22', margin: 0 }}>
                    Your live review transmits instantly to the store owner & management terminal.
                  </p>
                </div>

                {reviewSubmitted ? (
                  <div style={{ backgroundColor: '#e8f5e9', border: '1.5px solid #c8e6c9', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                    <h4 style={{ color: '#1b5e20', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                      Thank You! Your Review has been received.
                    </h4>
                    <p style={{ color: '#2e7d32', fontSize: '0.84rem', margin: '0 0 16px 0' }}>
                      The store owner can now see your rating and comments in their live operations dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(false)}
                      style={{
                        backgroundColor: '#2e7d32',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Submit Another Rating
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const revObj = {
                        customerName: reviewForm.customerName || 'Rahul S. (Gold VIP)',
                        drinkChoice: reviewForm.drinkChoice,
                        fizzLevel: reviewForm.fizzLevel,
                        rating: reviewForm.rating,
                        comment: reviewForm.comment,
                        date: new Date().toISOString().split('T')[0]
                      };
                      if (onAddCustomerReview) {
                        onAddCustomerReview(revObj);
                      }
                      setReviewSubmitted(true);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                        Your Name (or Nickname):
                      </label>
                      <input
                        type="text"
                        value={reviewForm.customerName}
                        onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                        placeholder="Rahul S. / Sneha M."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #ede4d5',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                          Drink Tasted:
                        </label>
                        <select
                          value={reviewForm.drinkChoice}
                          onChange={(e) => setReviewForm({ ...reviewForm, drinkChoice: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid #ede4d5',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="Blue Curacao Sparkler">Blue Curacao Sparkler</option>
                          <option value="Royal Jeera Masala">Royal Jeera Masala</option>
                          <option value="Cuban Mint Mojito">Cuban Mint Mojito</option>
                          <option value="Goan Kokum Masala">Goan Kokum Masala</option>
                          <option value="Fiery Ginger Fizz">Fiery Ginger Fizz</option>
                          <option value="Custom Soda Lab Mix">Custom Soda Lab Mix</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                          Carbonation / Fizz Level:
                        </label>
                        <select
                          value={reviewForm.fizzLevel}
                          onChange={(e) => setReviewForm({ ...reviewForm, fizzLevel: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid #ede4d5',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="Extra Fizzy">⚡ Extra Fizzy (Strong)</option>
                          <option value="Perfect Fizz">✨ Perfect Fizz (Balanced)</option>
                          <option value="Mild Sparkle">🍃 Mild Sparkle (Smooth)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                        Your Star Rating:
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              transform: star <= reviewForm.rating ? 'scale(1.15)' : 'scale(1)',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <Star
                              size={28}
                              fill={star <= reviewForm.rating ? '#ffb703' : 'none'}
                              color={star <= reviewForm.rating ? '#ffb703' : '#d4985b'}
                            />
                          </button>
                        ))}
                        <span style={{ marginLeft: '10px', fontWeight: 800, color: '#d90429', fontSize: '0.9rem' }}>
                          {reviewForm.rating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                        Your Taste Feedback or Compliment:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Loved the cold carbonation and hint of rock salt in the masala soda!"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #ede4d5',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#d90429',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(217, 4, 41, 0.3)'
                      }}
                    >
                      <Send size={16} /> Submit Feedback to Store Owner
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================================
          DIGITAL COUNTER PICKUP TOKEN SLIP MODAL
         ========================================================== */}
      {orderTokenModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              textAlign: 'center',
              border: '3px solid #b87b43',
              position: 'relative'
            }}
          >
            {/* Top Close */}
            <button
              type="button"
              onClick={() => setOrderTokenModal(null)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#7b4a22'
              }}
            >
              <X size={20} />
            </button>

            {/* Stamp celebration badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', color: '#1b5e20', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '12px' }}>
              <Sparkles size={14} color="#2b9348" /> +1 Sip Stamp Credited to Pass!
            </div>

            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#9c6332', fontWeight: 800, textTransform: 'uppercase' }}>
              Himmat Beverages • S Daddy Soda House
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#271407', margin: '4px 0 10px 0' }}>
              Counter Pickup Slip
            </h3>

            {/* Big Token Number Callout */}
            <div style={{ backgroundColor: '#271407', color: '#ffea79', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '2px solid #ffb703' }}>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
                Pickup Order Token
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.05em', color: '#ffffff' }}>
                {orderTokenModal.tokenNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ffea79', fontWeight: 700, marginTop: '2px' }}>
                ⏱ Estimated Prep Time: 8-10 Minutes
              </div>
            </div>

            {/* Receipt Details */}
            <div style={{ textAlign: 'left', backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '14px', padding: '14px', marginBottom: '16px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', borderBottom: '1px solid #ede4d5', paddingBottom: '6px' }}>
                <span style={{ color: '#7b4a22' }}>Counter Outlet:</span>
                <strong style={{ color: '#271407' }}>{orderTokenModal.outlet}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#7b4a22' }}>Customer Name:</span>
                <strong style={{ color: '#271407' }}>{orderTokenModal.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#7b4a22' }}>Order Timestamp:</span>
                <strong style={{ color: '#271407' }}>{orderTokenModal.date} at {orderTokenModal.time}</strong>
              </div>

              {/* Items Table */}
              <div style={{ borderTop: '1px dashed #d4985b', paddingTop: '8px', marginTop: '8px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#5c3518', marginBottom: '4px', textTransform: 'uppercase' }}>Items Ordered:</div>
                {orderTokenModal.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#271407', marginBottom: '3px' }}>
                    <span>{item.quantity}x {item.name} ({item.size})</span>
                    <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div style={{ borderTop: '1px solid #ede4d5', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '0.95rem', color: '#d90429' }}>
                <span>Amount to Pay at Counter:</span>
                <span>₹{orderTokenModal.total}</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1.2rem', color: '#271407', fontWeight: 800 }}>
                ||| | |||| | |||||| || | |||
              </div>
              <span style={{ fontSize: '0.68rem', color: '#7b4a22' }}>Flash this slip or tell Token # at Counter</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(`Hi Daddy Soda House! I just placed pickup order ${orderTokenModal.tokenNumber} for ₹${orderTokenModal.total} at ${orderTokenModal.outlet}.`);
                  window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`, '_blank');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <MessageCircle size={15} /> WhatsApp Counter
              </button>

              <button
                type="button"
                onClick={() => setOrderTokenModal(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#271407',
                  color: '#ffea79',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Order Tray Banner (Visible when items exist in cart and not on menu tab) */}
      {orderCart.length > 0 && activeTab !== 'menu' && (
        <div 
          onClick={() => setActiveTab('menu')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#271407',
            color: '#ffffff',
            borderRadius: '999px',
            padding: '12px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 900,
            border: '2px solid #ffb703',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <div style={{ backgroundColor: '#d90429', padding: '6px', borderRadius: '50%', display: 'flex' }}>
            <ShoppingBag size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.86rem' }}>
              Order Tray: {totalCartItemsCount} Drinks
            </div>
            <div style={{ fontSize: '0.72rem', color: '#ffea79' }}>
              Total: ₹{cartFinalTotal} • Tap to view & checkout
            </div>
          </div>
          <ChevronRight size={18} color="#ffb703" />
        </div>
      )}

      {/* Customer Lounge Footer */}
      <footer 
        style={{
          backgroundColor: '#271407',
          color: '#e8c49a',
          padding: '24px',
          borderTop: '2px solid #b87b43',
          fontSize: '0.82rem',
        }}
      >
        <div 
          className="site-container" 
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '12px' 
          }}
        >
          <div>
            <strong>S Daddy Soda House</strong> • Customer Rewards Lounge • Himmat Beverages Pvt. Ltd. (Est. 1973)
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onBackToSite}
              style={{ background: 'none', border: 'none', color: '#ffea79', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
            >
              Return to Store Homepage
            </button>
            {(onSwitchToOwner || onSwitchToAdmin) && (
              <button
                type="button"
                onClick={onSwitchToOwner || onSwitchToAdmin}
                style={{
                  backgroundColor: 'rgba(255, 183, 3, 0.15)',
                  border: '1px solid rgba(255, 183, 3, 0.3)',
                  color: '#ffea79',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                👑 Owner Portal (PIN 1973)
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
