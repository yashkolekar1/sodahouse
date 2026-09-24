import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Check, 
  Plus, 
  Minus, 
  X, 
  MessageCircle, 
  Eye, 
  ArrowRight, 
  SlidersHorizontal,
  Heart,
  Flame,
  Apple,
  Wine,
  ShieldCheck,
  Droplets,
  Sun,
  Snowflake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SYRUPS, BRAND_INFO, getWhatsAppOrderUrl, getStoredSyrupAvailability, getMergedProducts } from '../data/sodaData';
import ProductDetailModal from './ProductDetailModal';

export default function SyrupShowcase({ 
  mixerRef, 
  favorites = [], 
  onToggleFavorite, 
  onSaveMix, 
  onOpenCustomer 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Drinks');
  const [sortBy, setSortBy] = useState('default');
  const [cardQuantities, setCardQuantities] = useState({});
  const [availabilityMap, setAvailabilityMap] = useState(getStoredSyrupAvailability);
  const [products, setProducts] = useState(() => getMergedProducts());
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const handleStatusChange = () => {
      setAvailabilityMap(getStoredSyrupAvailability());
      setProducts(getMergedProducts());
    };
    window.addEventListener('daddy_syrup_status_changed', handleStatusChange);
    window.addEventListener('daddy_products_changed', handleStatusChange);
    return () => {
      window.removeEventListener('daddy_syrup_status_changed', handleStatusChange);
      window.removeEventListener('daddy_products_changed', handleStatusChange);
    };
  }, []);

  const handleSyrupQuantityChange = (syrupId, delta) => {
    setCardQuantities((prev) => ({
      ...prev,
      [syrupId]: Math.max(1, (prev[syrupId] || 1) + delta),
    }));
  };

  // Drink Mixer State
  const [mixerBase, setMixerBase] = useState('Chilled Sparkling Soda');
  const [mixerSyrups, setMixerSyrups] = useState([SYRUPS[0], SYRUPS[18]]); // Blue Curacao + Jeera Masala default
  const [mixerToppings, setMixerToppings] = useState(['Muddled Mint & Lemon', 'Crushed Ice']);
  const [drinkName, setDrinkName] = useState('Curacao Masala Sparkler');

  // Listen for Add to Mixer events from Featured Drinks or other components
  useEffect(() => {
    const handleAddToMixerEvent = (e) => {
      if (e && e.detail) {
        toggleMixerSyrup(e.detail);
      }
    };
    window.addEventListener('daddy_add_to_mixer', handleAddToMixerEvent);
    return () => window.removeEventListener('daddy_add_to_mixer', handleAddToMixerEvent);
  }, [mixerSyrups]);

  const handleSaveCurrentMix = () => {
    if (onSaveMix) {
      onSaveMix({
        id: `MIX-${Date.now()}`,
        name: drinkName,
        base: mixerBase,
        syrups: mixerSyrups,
        toppings: mixerToppings,
        date: new Date().toISOString().split('T')[0]
      });
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onOpenCustomer) {
        setTimeout(() => onOpenCustomer(), 400);
      }
    }
  };

  const categoryList = [
    { id: 'All Drinks', label: 'All Drinks', icon: Sparkles },
    { id: 'Zero Sugar', label: 'Zero Sugar', icon: ShieldCheck },
    { id: 'Gut Health', label: 'Gut Health', icon: Heart },
    { id: 'Mocktail Refreshers', label: 'Mocktails', icon: Wine },
    { id: 'Fruit Fusion', label: 'Fruit Fusion', icon: Apple },
    { id: 'Desi Masala', label: 'Desi Masala', icon: Flame },
    { id: 'Herbal & Fresh', label: 'Herbal & Fresh', icon: Droplets },
    { id: 'Citrus Kick', label: 'Citrus Kick', icon: Sun },
    { id: 'Ice-Gola Counter', label: 'Ice-Gola', icon: Snowflake },
  ];

  const sortedAndFilteredSyrups = useMemo(() => {
    let result = products
      .filter((syrup) => syrup.active !== false && syrup.status !== 'inactive')
      .filter((syrup) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch = 
          !query ||
          (syrup.name && syrup.name.toLowerCase().includes(query)) ||
          (syrup.flavorNotes && syrup.flavorNotes.toLowerCase().includes(query)) ||
          (syrup.category && syrup.category.toLowerCase().includes(query));
        if (!matchesSearch) return false;

        if (activeCategory === 'All Drinks' || activeCategory === 'All') return true;
        if (activeCategory === 'Zero Sugar') return syrup.sugarFreeAvailable;
        if (activeCategory === 'Gut Health') return syrup.isGutHealth;
        if (activeCategory === 'Sugar') return !syrup.sugarFreeAvailable;
        return syrup.category === activeCategory;
      });

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'popularity') {
      result = [...result].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    return result;
  }, [products, searchTerm, activeCategory, sortBy]);

  const toggleMixerSyrup = (syrup) => {
    if (mixerSyrups.some((s) => s.id === syrup.id)) {
      if (mixerSyrups.length > 1) {
        setMixerSyrups(mixerSyrups.filter((s) => s.id !== syrup.id));
      }
    } else {
      if (mixerSyrups.length < 2) {
        setMixerSyrups([...mixerSyrups, syrup]);
      } else {
        setMixerSyrups([mixerSyrups[1], syrup]);
      }
    }
  };

  const toggleMixerTopping = (topping) => {
    if (mixerToppings.includes(topping)) {
      setMixerToppings(mixerToppings.filter((t) => t !== topping));
    } else {
      setMixerToppings([...mixerToppings, topping]);
    }
  };

  const triggerMixEffect = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: [mixerSyrups[0]?.color || '#ff006e', mixerSyrups[1]?.color || '#00b4d8', '#ffb703'],
    });
  };

  const getCombinedGradient = () => {
    if (mixerSyrups.length === 1) {
      return `linear-gradient(180deg, ${mixerSyrups[0].color}cc 0%, ${mixerSyrups[0].color} 100%)`;
    }
    return `linear-gradient(180deg, ${mixerSyrups[0]?.color || '#ff006e'}dd 0%, ${mixerSyrups[1]?.color || '#00b4d8'}ee 100%)`;
  };

  const shareDrinkToWhatsApp = () => {
    const customRecipe = `Base: ${mixerBase}\nFlavour: ${mixerSyrups[0]?.name || 'Sparkling'}\nSyrup: ${mixerSyrups[1]?.name || mixerSyrups[0]?.name || 'Original'}${mixerToppings.length > 0 ? `\nToppings: ${mixerToppings.join(', ')}` : ''}`;
    const url = getWhatsAppOrderUrl({
      name: drinkName,
      customDetails: customRecipe,
      quantity: 1
    });
    window.open(url, '_blank');
  };

  return (
    <section 
      id="syrups"
      className="syrup-section"
      ref={mixerRef}
      style={{
        padding: '90px 0',
        backgroundColor: '#fdfbf7',
        position: 'relative',
      }}
    >
      <div className="site-container">
        
        {/* ================================================================= */}
        {/* 1. SECTION 3: 25+ GOURMET PRODUCTS & SYRUP SHOWCASE CATALOG       */}
        {/* ================================================================= */}
        <div id="products" style={{ marginBottom: '64px', scrollMarginTop: '110px' }}>
          <span id="syrup-catalog" style={{ display: 'block', scrollMarginTop: '110px' }} />

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffe3e3',
                color: '#d90429',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px',
              }}
            >
              <Sparkles size={15} /> 25+ Handcrafted Syrups & Soda Flavors
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#271407', marginBottom: '14px', fontWeight: 900 }}>
              Craft Beverage & Syrup Catalogue
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#6b5c52', lineHeight: 1.7 }}>
              Every syrup is crafted in our own dedicated flavor factory using proprietary fruit purees and botanical spice concentrates. 
              Zero compromise on fizz, consistent taste guaranteed in every outlet.
            </p>
          </div>

          {/* Controls Bar: Search, Dynamic Count & Sort Dropdown */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #ede4d5',
              boxShadow: '0 4px 16px rgba(59, 34, 16, 0.04)',
            }}
          >
            {/* Search Bar (Prompt #11) */}
            <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '260px' }}>
              <Search size={18} color="#9c6332" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search your favourite drink..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 46px',
                  borderRadius: '999px',
                  border: '1px solid #ede4d5',
                  backgroundColor: '#fdfbf7',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  color: '#271407',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9c6332',
                    display: 'flex',
                    padding: '4px',
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dynamic Product Count */}
            <div style={{ fontSize: '0.92rem', color: '#7b4a22', fontWeight: 600 }}>
              <strong style={{ color: '#271407', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                {sortedAndFilteredSyrups.length}
              </strong>{' '}
              refreshing {sortedAndFilteredSyrups.length === 1 ? 'drink' : 'drinks'}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} color="#7b4a22" />
              <label htmlFor="sort-dropdown" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#3b2210' }}>
                Sort by:
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ede4d5',
                  backgroundColor: '#fdfbf7',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#271407',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="default">Default</option>
                <option value="name">Name (A – Z)</option>
                <option value="popularity">Most Popular</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {/* Product Category Filters (Prompt #12 - horizontally scrollable on mobile) */}
          <div 
            className="category-scroll-container"
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '6px 2px 18px 2px',
              marginBottom: '36px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categoryList.map((cat) => {
              const isActive = activeCategory === cat.id;
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: isActive ? '2px solid #271407' : '1.5px solid #ede4d5',
                    backgroundColor: isActive ? '#271407' : '#ffffff',
                    color: isActive ? '#ffd000' : '#3b2210',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 6px 18px rgba(39, 20, 7, 0.22)' : '0 2px 8px rgba(59, 34, 16, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#d4985b';
                      e.currentTarget.style.backgroundColor = '#fdfbf7';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#ede4d5';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <IconComponent size={15} color={isActive ? '#ffd000' : '#d90429'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Desktop / 2-Column Tablet / 1-Column Mobile Product Grid (Prompt #10) */}
          {sortedAndFilteredSyrups.length === 0 ? (
            <div 
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #ede4d5',
              }}
            >
              <h4 style={{ fontSize: '1.3rem', color: '#271407', marginBottom: '8px' }}>No drinks match your search</h4>
              <p style={{ color: '#6b5c52', marginBottom: '16px' }}>Try searching for another flavor or resetting the category filter.</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('All Drinks'); setSortBy('default'); }}
                className="btn-accent-soda"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-catalog-grid">
              {sortedAndFilteredSyrups.map((syrup) => {
                const isSelectedInMixer = mixerSyrups.some((s) => s.id === syrup.id);
                const currentAvailability = availabilityMap[syrup.id] || syrup.availability || 'Available';
                const isOutOfStock = currentAvailability === 'Out of Stock';

                return (
                  <div key={syrup.id} className="product-card-premium">
                    {/* 1. Large Dedicated Product Image Area (Upper 50-60%) */}
                    <div 
                      className="product-image-stage"
                      style={{
                        background: `radial-gradient(circle at 50% 60%, ${syrup.color}22 0%, rgba(253, 251, 247, 0.95) 75%, #f6ebd9 100%)`,
                      }}
                    >
                      {/* Subtle Ambient Color Glow */}
                      <div 
                        className="product-image-glow" 
                        style={{ backgroundColor: syrup.color }} 
                      />

                      {/* Top Badges Overlay */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          right: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          zIndex: 3,
                          pointerEvents: 'none',
                        }}
                      >
                        {/* Subtle Category Badge */}
                        <span 
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(6px)',
                            color: '#5c3518',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            border: '1px solid #ede4d5',
                            boxShadow: '0 2px 8px rgba(59, 34, 16, 0.06)',
                          }}
                        >
                          {syrup.category}
                        </span>

                        {/* Feature Badges & Favorite Heart Toggle */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {/* Availability Badge (Prompt #16) */}
                          <span 
                            style={{
                              backgroundColor: currentAvailability === 'Available' ? '#e8f5e9' : currentAvailability === 'Low Stock' ? '#fff3e0' : '#ffebee',
                              color: currentAvailability === 'Available' ? '#2e7d32' : currentAvailability === 'Low Stock' ? '#e65100' : '#c62828',
                              border: `1px solid ${currentAvailability === 'Available' ? '#c8e6c9' : currentAvailability === 'Low Stock' ? '#ffe0b2' : '#ffcdd2'}`,
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                            }}
                          >
                            {currentAvailability === 'Available' ? '● Available' : currentAvailability === 'Low Stock' ? '⚡ Low Stock' : '✕ Out of Stock'}
                          </span>

                          {syrup.badge && (
                            <span 
                              style={{
                                backgroundColor: '#271407',
                                color: '#ffd000',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                              }}
                            >
                              {syrup.badge}
                            </span>
                          )}

                          {/* Favorite Heart Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleFavorite) onToggleFavorite(syrup.id);
                            }}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              border: '1px solid #ede4d5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(59, 34, 16, 0.08)',
                              pointerEvents: 'auto',
                            }}
                            title={favorites.includes(syrup.id) ? 'Remove from favorites' : 'Save to favorite drinks'}
                          >
                            <Heart 
                              size={14} 
                              fill={favorites.includes(syrup.id) ? '#d90429' : 'none'} 
                              color={favorites.includes(syrup.id) ? '#d90429' : '#7b4a22'} 
                            />
                          </button>
                        </div>
                      </div>

                      {/* Premium Circular Product Presentation */}
                      <div
                        className="product-circle-frame"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${(syrup.color || '#ffb703')}18 70%, ${(syrup.color || '#ffb703')}30 100%)`,
                        }}
                      >
                        {/* Large Product Image (Existing Image) */}
                        <img 
                          src={syrup.image} 
                          alt={syrup.name}
                          className="product-img-element"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* 2. Product Card Body */}
                    <div className="product-card-body">
                      {/* Category */}
                      <div style={{ fontSize: '0.76rem', color: '#9c6332', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {syrup.category}
                      </div>

                      {/* Large & Prominent Product Name */}
                      <h4 className="product-title-large">
                        {syrup.name}
                      </h4>

                      {/* Short 1–2 Line Description */}
                      <p className="product-short-desc" title={syrup.flavorNotes}>
                        {syrup.flavorNotes}
                      </p>

                      {/* Inline Quantity Controls & Action Buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Quantity Selector */}
                        <div 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '6px 12px', 
                            backgroundColor: '#fdfbf7', 
                            borderRadius: '10px', 
                            border: '1px solid #ede4d5',
                            marginBottom: '4px'
                          }}
                        >
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5c3518' }}>
                            Quantity:
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleSyrupQuantityChange(syrup.id, -1)}
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
                              <Minus size={12} />
                            </button>
                            <span style={{ fontWeight: 900, fontSize: '0.92rem', minWidth: '22px', textAlign: 'center', color: '#271407' }}>
                              {cardQuantities[syrup.id] || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSyrupQuantityChange(syrup.id, 1)}
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
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>


                        {/* Order on WhatsApp (Prompt #14 - disabled if Out of Stock) */}
                        {isOutOfStock ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              border: '1px solid #e0e0e0',
                              backgroundColor: '#f5f5f5',
                              color: '#9e9e9e',
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            Out of Stock
                          </button>
                        ) : (
                          <a
                            href={getWhatsAppOrderUrl({ 
                              name: syrup.name, 
                              type: syrup.category === 'Mocktail Refreshers' ? 'Product' : 'Syrup', 
                              quantity: cardQuantities[syrup.id] || 1 
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              boxShadow: '0 3px 10px rgba(37, 211, 102, 0.25)',
                              transition: 'all 0.2s ease',
                              boxSizing: 'border-box',
                            }}
                          >
                            <MessageCircle size={14} />
                            <span>Order on WhatsApp ({cardQuantities[syrup.id] || 1} { (cardQuantities[syrup.id] || 1) === 1 ? 'bottle' : 'bottles' })</span>
                          </a>
                        )}

                        {/* Add to Drink Mixer */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleMixerSyrup(syrup);
                            const mixerEl = document.getElementById('soda-lab');
                            if (mixerEl) mixerEl.scrollIntoView({ behavior: 'smooth' });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: isSelectedInMixer ? '1.5px solid #2b9348' : '1.5px dashed #d4985b',
                            backgroundColor: isSelectedInMixer ? '#e8f5e9' : '#fdfbf7',
                            color: isSelectedInMixer ? '#2b9348' : '#7b4a22',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          title={isSelectedInMixer ? 'Click to remove from live mixer' : 'Add to interactive drink mixer'}
                        >
                          {isSelectedInMixer ? <Check size={14} /> : <Plus size={14} />}
                          <span>{isSelectedInMixer ? 'Added in Drink Mixer' : '+ Add to Drink Mixer'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 2. SECTION 4: THE CRAFT SODA LAB / DRINK MIXER (Prompt #17)       */}
        {/* ================================================================= */}
        <div 
          id="soda-lab" 
          className="mixer-shell"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: '36px',
            border: '2px solid #d4985b',
            boxShadow: '0 20px 50px rgba(59, 34, 16, 0.1)',
            marginBottom: '64px',
            position: 'relative',
            overflow: 'hidden',
            scrollMarginTop: '110px'
          }}
        >
          {/* Top Banner */}
          <div 
            className="mixer-header"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ede4d5',
              paddingBottom: '20px',
              marginBottom: '28px',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#271407', margin: 0, fontWeight: 900 }}>
                  The Craft Soda Lab & Drink Mixer
                </h3>
                <span style={{ backgroundColor: '#2b9348', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                  INTERACTIVE
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#7b4a22' }}>
                Flow: Choose Base → Choose Flavour → Choose Syrup → Add Toppings → Create Drink → Order via WhatsApp!
              </p>
            </div>

            <button
              onClick={triggerMixEffect}
              className="btn-accent-soda"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Sparkles size={15} /> Mix & Fizz!
            </button>
          </div>

          <div 
            className="flavor-gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            {/* Visual Glass Preview */}
            <div 
              style={{
                backgroundColor: '#f8f4ee',
                borderRadius: '24px',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #ede4d5',
              }}
            >
              {/* Cup Visual */}
              <div 
                style={{
                  width: '160px',
                  height: '240px',
                  borderRadius: '16px 16px 36px 36px',
                  background: getCombinedGradient(),
                  border: '4px solid rgba(255,255,255,0.85)',
                  boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.4), 0 20px 35px rgba(59, 34, 16, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '16px',
                }}
              >
                {/* Straw */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-35px',
                    right: '35px',
                    width: '12px',
                    height: '90px',
                    background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, #d90429 8px, #d90429 16px)',
                    transform: 'rotate(15deg)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    zIndex: 2,
                  }}
                />

                {/* Animated Ice Cubes */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '25px',
                    left: '20px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '6px',
                    transform: 'rotate(12deg)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '30px',
                    width: '28px',
                    height: '28px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px',
                    transform: 'rotate(-20deg)',
                    backdropFilter: 'blur(4px)',
                  }}
                />

                {/* Floating Bubbles */}
                <div className="animate-float" style={{ position: 'absolute', bottom: '20px', left: '25px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)' }} />
                <div className="animate-float" style={{ position: 'absolute', bottom: '60px', right: '35px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)', animationDelay: '1s' }} />
                <div className="animate-float" style={{ position: 'absolute', bottom: '110px', left: '45px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', animationDelay: '2s' }} />

                {/* Brand label stamp on cup */}
                <div 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#271407' }}>
                    S DADDY SODA
                  </span>
                </div>
              </div>

              {/* Dynamic Recipe Details */}
              <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
                <input
                  type="text"
                  value={drinkName}
                  onChange={(e) => setDrinkName(e.target.value)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#271407',
                    textAlign: 'center',
                    border: 'none',
                    borderBottom: '2px dashed #b87b43',
                    backgroundColor: 'transparent',
                    width: '90%',
                    padding: '4px',
                    outline: 'none',
                    marginBottom: '8px',
                  }}
                  title="Click to rename drink"
                />

                <p style={{ fontSize: '0.82rem', color: '#6b5c52', margin: '0 0 16px 0' }}>
                  {mixerBase} + {mixerSyrups.map((s) => s.name).join(' & ')}
                </p>

                {/* Action Buttons: Order via WhatsApp & Save */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={shareDrinkToWhatsApp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                    }}
                  >
                    <MessageCircle size={15} /> Order Custom Drink on WhatsApp
                  </button>

                  <button
                    onClick={handleSaveCurrentMix}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#271407',
                      color: '#ffd000',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={14} /> Save Concoction
                  </button>
                </div>
              </div>
            </div>

            {/* Mixer Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Step 1: Base Selection */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b2210', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  1. Choose Your Carbonated Base
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    'Chilled Sparkling Soda',
                    'Low Fizz Tonic',
                    'Cold Water (Still)',
                    'Crushed Ice Gola Base'
                  ].map((base) => (
                    <button
                      key={base}
                      onClick={() => setMixerBase(base)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: mixerBase === base ? '2px solid #d90429' : '1px solid #ede4d5',
                        backgroundColor: mixerBase === base ? '#ffe3e3' : '#ffffff',
                        color: mixerBase === base ? '#d90429' : '#3b2210',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: mixerBase === base ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {base}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Selected Syrups */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b2210', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                    2. Select Up To 2 Syrups / Flavours
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#7b4a22' }}>
                    ({mixerSyrups.length}/2 active)
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {mixerSyrups.map((syrup) => (
                    <div
                      key={syrup.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        backgroundColor: '#ffffff',
                        border: `2px solid ${syrup.color}`,
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: syrup.color }} />
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', color: '#271407' }}>
                        {syrup.name}
                      </span>
                      {mixerSyrups.length > 1 && (
                        <button
                          onClick={() => toggleMixerSyrup(syrup)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                          title="Remove syrup"
                        >
                          <X size={14} color="#d90429" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b5c52' }}>
                  💡 Tip: Click <strong>"+ Add to Drink Mixer"</strong> on any drink in the catalog above to swap flavors!
                </p>
              </div>

              {/* Step 3: Toppings */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b2210', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  3. Add-on Toppings & Boosters
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    'Muddled Mint & Lemon',
                    'Crushed Ice',
                    'Mumbai Ice-Gola Scoop',
                    'Kala Namak Rim',
                    'Prebiotic Gut Booster',
                    'Sweet Sabja Seeds'
                  ].map((topping) => {
                    const isSelected = mixerToppings.includes(topping);
                    return (
                      <button
                        key={topping}
                        onClick={() => toggleMixerTopping(topping)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #b87b43' : '1px solid #ede4d5',
                          backgroundColor: isSelected ? '#f6ebd9' : '#ffffff',
                          color: isSelected ? '#3b2210' : '#6b5c52',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isSelected ? <Check size={14} color="#3b2210" /> : <Plus size={14} color="#9c6332" />}
                        {topping}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Strip: 8 Dedicated Taps + Ice Gola Counter */}
        <div 
          className="wood-card-dark"
          style={{
            padding: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#ffd000', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              High-Velocity Hardware
            </span>
            <h3 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '6px 0 10px 0' }}>
              8 Dedicated Soda Machines + Commercial Ice-Gola Counter
            </h3>
            <p style={{ color: '#e8c49a', margin: 0, maxWidth: '640px', fontSize: '0.92rem' }}>
              Our standardized dispensing equipment allows a single staff member to pour a freshly carbonated beverage in under 15 seconds. 
              The attached Ice-Gola counter unlocks high-margin seasonal sales.
            </p>
          </div>

          <a 
            href="#franchise" 
            className="btn-accent-soda"
            style={{ textDecoration: 'none' }}
          >
            <span>View Equipment Breakdown</span>
          </a>
        </div>

      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToMixer={(prod) => {
          toggleMixerSyrup(prod);
          const el = document.getElementById('soda-lab');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        isFavorite={favorites.includes(selectedProduct?.id)}
        onToggleFavorite={onToggleFavorite}
      />
    </section>
  );
}
