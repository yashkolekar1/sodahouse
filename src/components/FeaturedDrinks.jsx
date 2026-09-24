import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Eye, 
  X, 
  Droplets, 
  ShieldCheck, 
  Heart, 
  Flame, 
  Wine, 
  Apple, 
  Sun, 
  Snowflake,
  Check, 
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';
import { SYRUPS, getWhatsAppOrderUrl, getStoredSyrupAvailability, getMergedProducts } from '../data/sodaData';
import ProductDetailModal from './ProductDetailModal';

export default function FeaturedDrinks({ onSelectCategory, onOpenProductModal }) {
  const [quantities, setQuantities] = useState({});
  const [availabilityMap, setAvailabilityMap] = useState(getStoredSyrupAvailability);
  const [productsList, setProductsList] = useState(() => getMergedProducts());
  const [selectedDrink, setSelectedDrink] = useState(null);

  useEffect(() => {
    const handleStatusChange = () => {
      setAvailabilityMap(getStoredSyrupAvailability());
      setProductsList(getMergedProducts());
    };
    window.addEventListener('daddy_syrup_status_changed', handleStatusChange);
    window.addEventListener('daddy_products_changed', handleStatusChange);
    return () => {
      window.removeEventListener('daddy_syrup_status_changed', handleStatusChange);
      window.removeEventListener('daddy_products_changed', handleStatusChange);
    };
  }, []);

  const handleQuantityChange = (drinkId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [drinkId]: Math.max(1, (prev[drinkId] || 1) + delta),
    }));
  };

  const handleAddToDrinkMixer = (drink) => {
    window.dispatchEvent(new CustomEvent('daddy_add_to_mixer', { detail: drink }));
    const mixerEl = document.getElementById('soda-lab') || document.getElementById('syrups');
    if (mixerEl) {
      mixerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Signature Featured Drinks
  const featuredList = productsList.slice(0, 4);

  // Existing project categories
  const quickCategories = [
    { label: 'All Drinks', id: 'All Drinks', icon: Sparkles },
    { label: 'Mocktails', id: 'Mocktail Refreshers', icon: Wine },
    { label: 'Fruit Fusion', id: 'Fruit Fusion', icon: Apple },
    { label: 'Desi Masala', id: 'Desi Masala', icon: Flame },
    { label: 'Herbal & Fresh', id: 'Herbal & Fresh', icon: Droplets },
    { label: 'Citrus Kick', id: 'Citrus Kick', icon: Sun },
    { label: 'Zero Sugar', id: 'Zero Sugar', icon: ShieldCheck },
    { label: 'Gut Health', id: 'Gut Health', icon: Heart },
    { label: 'Ice-Gola', id: 'Ice-Gola Counter', icon: Snowflake },
  ];

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const target = document.getElementById('products') || document.getElementById('syrup-catalog') || document.getElementById('syrups');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="featured-drinks"
      style={{
        backgroundColor: '#ffffff',
        paddingTop: '36px',
        paddingBottom: '80px',
        borderBottom: '1px solid #ede4d5',
        position: 'relative',
      }}
    >
      <div className="site-container">
        
        {/* ================================================================= */}
        {/* 1. QUICK CATEGORY NAVIGATION (Horizontal scroll on mobile)        */}
        {/* ================================================================= */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <span 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem', 
                fontWeight: 800, 
                color: '#b87b43', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em' 
              }}
            >
              Browse By Category
            </span>
          </div>

          <div 
            className="category-scroll-container"
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '10px',
              justifyContent: 'flex-start',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {quickCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: '1.5px solid #ede4d5',
                    backgroundColor: '#fdfbf7',
                    color: '#3b2210',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(59, 34, 16, 0.04)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f6ebd9';
                    e.currentTarget.style.borderColor = '#d4985b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fdfbf7';
                    e.currentTarget.style.borderColor = '#ede4d5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <IconComp size={15} color="#d90429" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. FEATURED DRINKS HEADER                                         */}
        {/* ================================================================= */}
        <div 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '40px' 
          }}
        >
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffe3e3',
                color: '#d90429',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}
            >
              <Sparkles size={14} /> Signature Soda Selection
            </div>
            <h2 
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', 
                color: '#271407', 
                margin: 0,
                lineHeight: 1.15,
                fontWeight: 900 
              }}
            >
              Featured Drinks
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.96rem', color: '#6b5c52', maxWidth: '520px' }}>
              Handcrafted with natural botanical essences, fruit purees, and punchy carbonation.
            </p>
          </div>

          {/* Explore Products CTA Button */}
          <a
            href="#products"
            className="btn-accent-soda"
            style={{
              textDecoration: 'none',
              padding: '12px 24px',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Explore All Products</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* ================================================================= */}
        {/* 3. FEATURED DRINKS GRID (3–4 existing products with large images) */}
        {/* ================================================================= */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px',
          }}
        >
          {featuredList.map((drink) => {
            const currentAvailability = availabilityMap[drink.id] || drink.availability || 'Available';
            const isOutOfStock = currentAvailability === 'Out of Stock';

            return (
              <div
                key={drink.id}
                className="product-large-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid #ede4d5',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 24px rgba(59, 34, 16, 0.06)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Product Image Stage with Circular Presentation */}
                <div 
                  className="product-image-stage"
                  style={{
                    backgroundColor: '#f8f4ee',
                  }}
                >
                  {/* Backlit glow matching drink color */}
                  <div 
                    className="product-image-glow" 
                    style={{ backgroundColor: drink.color || '#ffb703' }} 
                  />

                  {/* Top Badges */}
                  <span 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: '#ffffff',
                      color: '#271407',
                      border: '1px solid #ede4d5',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      zIndex: 3,
                    }}
                  >
                    {drink.badge || 'Signature'}
                  </span>

                  {/* Availability Status Badge */}
                  <span 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: currentAvailability === 'Available' ? '#e8f5e9' : currentAvailability === 'Low Stock' ? '#fff3e0' : '#ffebee',
                      color: currentAvailability === 'Available' ? '#2e7d32' : currentAvailability === 'Low Stock' ? '#e65100' : '#c62828',
                      border: `1px solid ${currentAvailability === 'Available' ? '#c8e6c9' : currentAvailability === 'Low Stock' ? '#ffe0b2' : '#ffcdd2'}`,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      zIndex: 3,
                    }}
                  >
                    {currentAvailability === 'Available' ? '● Available' : currentAvailability === 'Low Stock' ? '⚡ Low Stock' : '✕ Out of Stock'}
                  </span>

                  {/* Premium Circular Product Presentation */}
                  <div
                    className="product-circle-frame"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${(drink.color || '#ffb703')}18 70%, ${(drink.color || '#ffb703')}30 100%)`,
                    }}
                  >
                    {/* Real Product Image Centered */}
                    <img 
                      src={drink.image} 
                      alt={drink.name}
                      className="product-img-element"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div 
                  style={{
                    padding: '22px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  {/* Category */}
                  <div 
                    style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 800, 
                      color: '#b87b43', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.04em',
                      marginBottom: '4px' 
                    }}
                  >
                    {drink.category}
                  </div>

                  {/* Product Name */}
                  <h3 
                    style={{ 
                      fontFamily: 'var(--font-heading)', 
                      fontSize: '1.25rem', 
                      fontWeight: 900, 
                      color: '#271407', 
                      margin: '0 0 8px 0',
                      lineHeight: 1.25 
                    }}
                  >
                    {drink.name}
                  </h3>

                  {/* Short Description */}
                  <p 
                    style={{ 
                      fontSize: '0.86rem', 
                      color: '#6b5c52', 
                      lineHeight: 1.55, 
                      margin: '0 0 18px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {drink.flavorNotes}
                  </p>

                  {/* Inline Quantity Controls & Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                          onClick={() => handleQuantityChange(drink.id, -1)}
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
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 900, fontSize: '0.96rem', minWidth: '22px', textAlign: 'center', color: '#271407' }}>
                          {quantities[drink.id] || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(drink.id, 1)}
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
                          <Plus size={13} />
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
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid #e0e0e0',
                          backgroundColor: '#f5f5f5',
                          color: '#9e9e9e',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
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
                          name: drink.name, 
                          type: 'Product', 
                          quantity: quantities[drink.id] || 1 
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '100%',
                          padding: '10px',
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
                        <MessageCircle size={15} />
                        <span>Order on WhatsApp ({quantities[drink.id] || 1} { (quantities[drink.id] || 1) === 1 ? 'bottle' : 'bottles' })</span>
                      </a>
                    )}

                    {/* Add to Drink Mixer */}
                    <button
                      type="button"
                      onClick={() => handleAddToDrinkMixer(drink)}
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
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#271407';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#271407';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fdfbf7';
                        e.currentTarget.style.color = '#7b4a22';
                        e.currentTarget.style.borderColor = '#d4985b';
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedDrink}
        isOpen={Boolean(selectedDrink)}
        onClose={() => setSelectedDrink(null)}
        onAddToMixer={handleAddToDrinkMixer}
      />
    </section>
  );
}
