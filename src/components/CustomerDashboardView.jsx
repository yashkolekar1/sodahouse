import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Droplets, 
  MessageCircle, 
  User, 
  LogOut, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Sliders, 
  X,
  Phone,
  Ticket,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { BRAND_INFO, SYRUPS, getMergedSyrups, getWhatsAppOrderUrl } from '../data/sodaData';

export default function CustomerDashboardView({
  currentUser,
  onLogout,
  onBackToSite
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'syrups' | 'soda-lab' | 'whatsapp' | 'profile'
  const [syrupList, setSyrupList] = useState(() => getMergedSyrups());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToMixer = (item) => {
    if (item.category === 'Mocktail Refreshers' || item.category === 'Desi Masala') {
      setMixerFlavor(item.name);
    } else {
      setMixerSyrup(item.name);
    }
    setActiveTab('soda-lab');
  };

  // Drink Mixer State
  const [mixerBase, setMixerBase] = useState('Chilled Sparkling Soda');
  const [mixerFlavor, setMixerFlavor] = useState('Royal Jeera Masala');
  const [mixerSyrup, setMixerSyrup] = useState('Blue Curacao');

  // Listen for real-time syrup availability updates
  useEffect(() => {
    const handleStatusChange = () => {
      setSyrupList(getMergedSyrups());
    };
    window.addEventListener('daddy_syrup_status_changed', handleStatusChange);
    return () => window.removeEventListener('daddy_syrup_status_changed', handleStatusChange);
  }, []);

  const signatureDrinks = syrupList.slice(0, 4);

  const categories = ['All', 'Mocktail Refreshers', 'Desi Masala', 'Fruit Fusion', 'Herbal & Fresh', 'Ice-Gola Counter'];

  const filteredSyrups = syrupList.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f5f0', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================
          TOP HEADER
         ======================================================== */}
      <header 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1.5px solid #ede4d5',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(59, 34, 16, 0.04)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Brand Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={onBackToSite}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fdfbf7',
                border: '1px solid #ede4d5',
                color: '#7b4a22',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} /> Back to Store
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/images/logo_perfect.png" 
                alt="Logo" 
                style={{ width: '36px', height: '36px', objectFit: 'contain' }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#271407' }}>
                  CUSTOMER <span style={{ color: '#d90429' }}>LOUNGE</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Products, Syrups, Soda Lab, Order via WhatsApp, Profile) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'products', label: 'Products', icon: ShoppingBag },
              { id: 'syrups', label: 'Syrups (25+)', icon: Droplets },
              { id: 'soda-lab', label: 'Soda Lab', icon: Sparkles },
              { id: 'whatsapp', label: 'Order via WhatsApp', icon: MessageCircle },
              { id: 'profile', label: 'Profile', icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#271407' : 'transparent',
                    color: isActive ? '#ffffff' : '#5c3518',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} color={isActive ? '#ffffff' : '#b87b43'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Right & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 800, color: '#271407' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#25D366' }} />
              <span>{currentUser?.name || 'Customer'}</span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(217, 4, 41, 0.1)',
                border: '1px solid rgba(217, 4, 41, 0.3)',
                color: '#d90429',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT AREA
         ======================================================== */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>

        {/* ========================================================
            TAB 1: PRODUCTS (Signature Sodas)
           ======================================================== */}
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d90429', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SIGNATURE CRAFT SODA COLLECTION
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#271407', margin: '4px 0 6px 0' }}>
                Featured Soda Drinks
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b4a22' }}>
                Our most celebrated sodas, blended fresh using pure cane syrups and carbonated ice waters. Order directly via WhatsApp.
              </p>
            </div>

            {/* Responsive 3 Large Cards on Desktop -> 2 Tablet -> 1 Mobile */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {signatureDrinks.map((product) => {
                const isOutOfStock = product.availability === 'Out of Stock';
                const isLowStock = product.availability === 'Low Stock';
                return (
                  <div 
                    key={product.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1.5px solid #ede4d5',
                      boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    {/* Large Product Image Focus */}
                    <div 
                      style={{
                        height: '240px',
                        backgroundColor: '#fbf8f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        padding: '16px'
                      }}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{
                          maxHeight: '210px',
                          maxWidth: '90%',
                          objectFit: 'contain',
                          filter: isOutOfStock ? 'grayscale(0.6) opacity(0.7)' : 'drop-shadow(0 12px 20px rgba(59,34,16,0.15))'
                        }}
                      />
                      
                      {/* Availability Badge */}
                      <span 
                        style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          backgroundColor: isOutOfStock ? '#ffebee' : (isLowStock ? '#fff3cd' : '#e8f5e9'),
                          color: isOutOfStock ? '#c62828' : (isLowStock ? '#856404' : '#2e7d32'),
                          border: `1px solid ${isOutOfStock ? '#ffcdd2' : (isLowStock ? '#ffeeba' : '#c8e6c9')}`
                        }}
                      >
                        {product.availability || 'Available'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b87b43', textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#271407', margin: '4px 0 8px 0' }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#7b4a22', lineHeight: 1.5, flex: 1 }}>
                        {product.flavorNotes}
                      </p>

                      {/* Inline Quantity Controls & Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                        {/* Quantity Selector */}
                        <div 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '6px 12px', 
                            backgroundColor: '#fdfbf7', 
                            borderRadius: '10px', 
                            border: '1px solid #ede4d5' 
                          }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5c3518' }}>
                            Quantity:
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #d4985b',
                                backgroundColor: '#ffffff',
                                color: '#271407',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              title="Decrease quantity"
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 900, fontSize: '0.96rem', minWidth: '22px', textAlign: 'center', color: '#271407' }}>
                              {quantities[product.id] || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #d4985b',
                                backgroundColor: '#ffffff',
                                color: '#271407',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Order on WhatsApp */}
                        {isOutOfStock ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              width: '100%',
                              backgroundColor: '#e0e0e0',
                              color: '#888888',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'not-allowed',
                            }}
                          >
                            Out of Stock
                          </button>
                        ) : (
                          <a
                            href={getWhatsAppOrderUrl({ 
                              name: product.name, 
                              type: 'Product', 
                              quantity: quantities[product.id] || 1 
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: '100%',
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '10px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                              boxSizing: 'border-box',
                            }}
                          >
                            <MessageCircle size={15} /> Order on WhatsApp ({quantities[product.id] || 1} { (quantities[product.id] || 1) === 1 ? 'bottle' : 'bottles' })
                          </a>
                        )}

                        {/* Add to Drink Mixer */}
                        <button
                          type="button"
                          onClick={() => handleAddToMixer(product)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px dashed #d4985b',
                            backgroundColor: '#fdfbf7',
                            color: '#7b4a22',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <Sparkles size={14} color="#d90429" />
                          <span>+ Add to Drink Mixer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SYRUPS (25+ Showcase)
           ======================================================== */}
        {activeTab === 'syrups' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b87b43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DIRECT FACTORY BOTTLED CONCENTRATES
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#271407', margin: '4px 0 6px 0' }}>
                25+ Gourmet Syrups Collection
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b4a22' }}>
                Check live frontend availability and order whole syrup bottles directly on WhatsApp.
              </p>
            </div>

            {/* Search and Category Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
                <Search size={16} color="#7b4a22" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favourite syrup..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #ede4d5',
                    fontSize: '0.88rem',
                    backgroundColor: '#ffffff',
                    color: '#271407',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #ede4d5',
                      backgroundColor: selectedCategory === cat ? '#271407' : '#ffffff',
                      color: selectedCategory === cat ? '#ffffff' : '#5c3518',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Syrups Responsive Grid (3 Desktop -> 2 Tablet -> 1 Mobile) */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {filteredSyrups.map((syrup) => {
                const isOutOfStock = syrup.availability === 'Out of Stock';
                const isLowStock = syrup.availability === 'Low Stock';

                return (
                  <div 
                    key={syrup.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1.5px solid #ede4d5',
                      boxShadow: '0 4px 16px rgba(59, 34, 16, 0.04)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '170px', backgroundColor: '#fbf8f3', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '14px' }}>
                      <img 
                        src={syrup.image} 
                        alt={syrup.name} 
                        style={{
                          maxHeight: '145px',
                          maxWidth: '85%',
                          objectFit: 'contain',
                          filter: isOutOfStock ? 'grayscale(0.6) opacity(0.7)' : 'drop-shadow(0 8px 16px rgba(59,34,16,0.12))'
                        }}
                      />
                      <span 
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          backgroundColor: isOutOfStock ? '#ffebee' : (isLowStock ? '#fff3cd' : '#e8f5e9'),
                          color: isOutOfStock ? '#c62828' : (isLowStock ? '#856404' : '#2e7d32')
                        }}
                      >
                        {syrup.availability || 'Available'}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b87b43', textTransform: 'uppercase' }}>
                      {syrup.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#271407', margin: '4px 0 6px 0' }}>
                      {syrup.name}
                    </h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: '#7b4a22', lineHeight: 1.4, flex: 1 }}>
                      {syrup.flavorNotes}
                    </p>

                    {/* Inline Quantity Controls & Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                      {/* Quantity Selector */}
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '6px 10px', 
                          backgroundColor: '#fdfbf7', 
                          borderRadius: '8px', 
                          border: '1px solid #ede4d5' 
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5c3518' }}>
                          Qty:
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(syrup.id, -1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #d4985b',
                              backgroundColor: '#ffffff',
                              color: '#271407',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 900, fontSize: '0.92rem', minWidth: '20px', textAlign: 'center', color: '#271407' }}>
                            {quantities[syrup.id] || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(syrup.id, 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #d4985b',
                              backgroundColor: '#ffffff',
                              color: '#271407',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Order on WhatsApp */}
                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '100%',
                            backgroundColor: '#e0e0e0',
                            color: '#888888',
                            border: 'none',
                            padding: '9px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: 'not-allowed',
                          }}
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <a
                          href={getWhatsAppOrderUrl({ 
                            name: syrup.name, 
                            type: 'Syrup', 
                            quantity: quantities[syrup.id] || 1 
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            width: '100%',
                            backgroundColor: '#25D366',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '9px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <MessageCircle size={14} /> Order on WhatsApp ({quantities[syrup.id] || 1})
                        </a>
                      )}

                      {/* Add to Drink Mixer */}
                      <button
                        type="button"
                        onClick={() => handleAddToMixer(syrup)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1.5px dashed #d4985b',
                          backgroundColor: '#fdfbf7',
                          color: '#7b4a22',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Sparkles size={13} color="#d90429" />
                        <span>+ Add to Drink Mixer</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: SODA LAB (Drink Mixer)
           ======================================================== */}
        {activeTab === 'soda-lab' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d90429', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                INTERACTIVE CONCOCTION LAB
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, color: '#271407', margin: '4px 0 8px 0' }}>
                Create Your Perfect Drink
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b4a22' }}>
                Pick your carbonated base, signature flavor note, and premium syrup. Then order it directly on WhatsApp.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1.5px solid #ede4d5', padding: '32px', boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)' }}>
              
              {/* Step 1: Base */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, color: '#271407', marginBottom: '10px' }}>
                  1. Choose Your Base:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {['Chilled Sparkling Soda', 'Mountain Club Soda', 'Zero Sugar Chilled Fizz'].map(base => (
                    <button
                      key={base}
                      type="button"
                      onClick={() => setMixerBase(base)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: mixerBase === base ? '2px solid #d90429' : '1px solid #ede4d5',
                        backgroundColor: mixerBase === base ? 'rgba(217, 4, 41, 0.05)' : '#fdfbf7',
                        color: mixerBase === base ? '#d90429' : '#271407',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {base}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Flavor */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, color: '#271407', marginBottom: '10px' }}>
                  2. Choose Your Flavour:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {['Royal Jeera Masala', 'Zesty Lemon Mint', 'Kala Khatta Blast', 'Tangy Kokum Splash'].map(flavor => (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => setMixerFlavor(flavor)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: mixerFlavor === flavor ? '2px solid #d90429' : '1px solid #ede4d5',
                        backgroundColor: mixerFlavor === flavor ? 'rgba(217, 4, 41, 0.05)' : '#fdfbf7',
                        color: mixerFlavor === flavor ? '#d90429' : '#271407',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Syrup */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 900, color: '#271407', marginBottom: '10px' }}>
                  3. Choose Your Syrup:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {['Blue Curacao', 'Cuban Mint Mojito', 'Juicy Mango Blast', 'Green Apple Fizz'].map(syrup => (
                    <button
                      key={syrup}
                      type="button"
                      onClick={() => setMixerSyrup(syrup)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: mixerSyrup === syrup ? '2px solid #d90429' : '1px solid #ede4d5',
                        backgroundColor: mixerSyrup === syrup ? 'rgba(217, 4, 41, 0.05)' : '#fdfbf7',
                        color: mixerSyrup === syrup ? '#d90429' : '#271407',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {syrup}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concoction Summary & WhatsApp Button */}
              <div style={{ backgroundColor: '#fdfbf7', borderRadius: '16px', padding: '20px', border: '1.5px solid #ede4d5' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7b4a22', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Your Custom Mix Recipe:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#271407', marginBottom: '16px' }}>
                  {mixerBase} + {mixerFlavor} + {mixerSyrup}
                </div>

                <a
                  href={getWhatsAppOrderUrl({
                    customDetails: `Base: ${mixerBase}\nFlavour: ${mixerFlavor}\nSyrup: ${mixerSyrup}`
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Order My Drink on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ORDER VIA WHATSAPP (Direct Contact Channel)
           ======================================================== */}
        {activeTab === 'whatsapp' && (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#25D366', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MANUAL WHATSAPP ORDERING CHANNEL
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#271407', margin: '4px 0 8px 0' }}>
                Chat & Order via WhatsApp
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7b4a22' }}>
                All orders are finalized directly through WhatsApp with our soda counter team. No online payment or cart required.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1.5px solid #ede4d5', padding: '32px', boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', borderBottom: '1px solid #ede4d5', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={24} color="#25D366" />
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#7b4a22', fontWeight: 700 }}>
                    Official WhatsApp Ordering Number:
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#271407' }}>
                    {BRAND_INFO.phoneFormatted}
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#271407', marginBottom: '12px' }}>
                Popular One-Tap WhatsApp Orders:
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  { title: "2x Blue Curacao Soda (Regular)", text: "Hi, I am interested in ordering:\n\nProduct: Blue Curacao Soda\nQuantity: 2\n\nPlease share the details." },
                  { title: "1x Full Bottle Mojito Syrup (Takeaway)", text: "Hi, I am interested in ordering:\n\nSyrup: Cuban Mint Mojito (Bottle)\nQuantity: 1\n\nPlease share the details." },
                  { title: "Party Bundle: 4 Signature Sodas Combo", text: "Hi, I am interested in ordering:\n\nProduct: 4 Signature Sodas Combo (Party Pack)\nQuantity: 1\n\nPlease share the details." }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(item.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      backgroundColor: '#fdfbf7',
                      border: '1px solid #ede4d5',
                      textDecoration: 'none',
                      color: '#271407',
                      fontSize: '0.86rem',
                      fontWeight: 800
                    }}
                  >
                    <span>{item.title}</span>
                    <span style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Send <ChevronRight size={16} />
                    </span>
                  </a>
                ))}
              </div>

              <a
                href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Daddy Soda House! I would like to place an order from my customer account.")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageCircle size={18} />
                <span>Start Custom Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: PROFILE
           ======================================================== */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d90429', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CUSTOMER ACCOUNT
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#271407', margin: '4px 0 6px 0' }}>
                Your Profile & Sip Pass
              </h1>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1.5px solid #ede4d5', padding: '32px', boxShadow: '0 8px 24px rgba(59, 34, 16, 0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #ede4d5' }}>
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt="Avatar" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#271407', margin: '0 0 4px 0' }}>
                    {currentUser?.name || 'Rahul Sharma'}
                  </h2>
                  <div style={{ fontSize: '0.84rem', color: '#7b4a22' }}>
                    {currentUser?.email || 'customer@sodahouse.com'}
                  </div>
                  <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.72rem', backgroundColor: '#e8c49a', color: '#3b2210', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    {currentUser?.tier || 'Gold VIP Member'}
                  </span>
                </div>
              </div>

              {/* Loyalty Stamp Card */}
              <div style={{ backgroundColor: '#fdfbf7', borderRadius: '16px', padding: '20px', border: '1px solid #ede4d5', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#271407' }}>
                    10-Stamp Digital Sip Pass
                  </span>
                  <Ticket size={16} color="#d90429" />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d90429' }}>
                  {currentUser?.loyaltyStamps || 7} / 10 Stamps Collected
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#7b4a22' }}>
                  Collect 10 stamps at any S Daddy Soda House outlet to claim a free craft bottle!
                </p>
              </div>

              {/* Profile Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onBackToSite}
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #d4985b',
                    color: '#271407',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Return to Store
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    flex: 1,
                    backgroundColor: '#271407',
                    border: 'none',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
