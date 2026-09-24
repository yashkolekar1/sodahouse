import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Sparkles, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Heart, 
  Droplets,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { getWhatsAppOrderUrl, BRAND_INFO } from '../data/sodaData';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose,
  onAddToMixer,
  isFavorite = false,
  onToggleFavorite = null
}) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity whenever a new product is selected
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.availability === 'Out of Stock';
  const isSyrup = product.category !== 'Mocktail Refreshers' && product.category !== 'Citrus Kick' && !product.name.toLowerCase().includes('soda');

  const whatsappUrl = getWhatsAppOrderUrl({
    name: product.name,
    type: isSyrup ? 'Syrup' : 'Product',
    quantity: quantity
  });

  return (
    <div 
      className="product-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} Details`}
    >
      <div 
        className="product-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '720px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(39, 20, 7, 0.35)',
          border: '2px solid #d4985b',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #ede4d5',
            color: '#271407',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fdfbf7';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Container */}
        <div style={{ overflowY: 'auto', padding: '0 0 24px 0' }}>
          
          {/* Upper Image Hero Stage */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '300px',
              backgroundColor: '#f8f4ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              overflow: 'hidden',
              borderBottom: '1px solid #ede4d5',
            }}
          >
            {/* Ambient Backlight Glow */}
            <div 
              style={{
                position: 'absolute',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                backgroundColor: product.color || '#ffb703',
                opacity: 0.35,
                filter: 'blur(36px)',
              }}
            />

            {/* Top Badges */}
            <div 
              style={{
                position: 'absolute',
                top: '18px',
                left: '20px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                zIndex: 2,
              }}
            >
              <span 
                style={{
                  backgroundColor: '#ffffff',
                  color: '#5c3518',
                  border: '1px solid #ede4d5',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {product.category}
              </span>

              {product.badge && (
                <span 
                  style={{
                    backgroundColor: '#271407',
                    color: '#ffd000',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '8px',
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Image */}
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                maxHeight: '250px',
                maxWidth: '90%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 16px 24px rgba(59, 34, 16, 0.22))',
              }}
            />
          </div>

          {/* Modal Content Body */}
          <div style={{ padding: '24px 28px' }}>
            
            {/* Category & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b87b43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.category}
              </span>

              {/* Availability Badge */}
              <span 
                style={{
                  backgroundColor: product.availability === 'Available' ? '#e8f5e9' : product.availability === 'Low Stock' ? '#fff3e0' : '#ffebee',
                  color: product.availability === 'Available' ? '#2e7d32' : product.availability === 'Low Stock' ? '#e65100' : '#c62828',
                  border: `1px solid ${product.availability === 'Available' ? '#c8e6c9' : product.availability === 'Low Stock' ? '#ffe0b2' : '#ffcdd2'}`,
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                {product.availability === 'Available' ? '● Available' : product.availability === 'Low Stock' ? '⚡ Low Stock' : '✕ Out of Stock'}
              </span>
            </div>

            {/* Product Title */}
            <h2 
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', 
                color: '#271407', 
                fontWeight: 900, 
                margin: '0 0 12px 0',
                lineHeight: 1.2
              }}
            >
              {product.name}
            </h2>

            {/* Short Flavor Notes / Description */}
            <p style={{ fontSize: '0.98rem', color: '#5c3518', lineHeight: 1.65, margin: '0 0 20px 0' }}>
              {product.flavorNotes || 'Authentic craft soda blend formulated in Himmat Beverages dedicated syrup factory.'}
            </p>

            {/* Badges / Dietary Specs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {product.sugarFreeAvailable && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #c8e6c9' }}>
                  <ShieldCheck size={14} /> Zero Sugar Option Available
                </span>
              )}
              {product.isGutHealth && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', backgroundColor: '#fff3e0', color: '#e65100', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #ffe0b2' }}>
                  <Heart size={14} /> Digestive & Gut-Health
                </span>
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', backgroundColor: '#fdfbf7', color: '#7b4a22', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #ede4d5' }}>
                <CheckCircle2 size={14} color="#2b9348" /> 100% Food-Grade Concentrates
              </span>
            </div>

            {/* Pairing Information */}
            {product.pairings && product.pairings.length > 0 && (
              <div 
                style={{ 
                  backgroundColor: '#fdfbf7', 
                  borderRadius: '14px', 
                  padding: '16px', 
                  border: '1px solid #ede4d5',
                  marginBottom: '24px' 
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3b2210', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Recommended Pairings & Mixes:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.pairings.map((pairing, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: 700, 
                        color: '#271407', 
                        backgroundColor: '#ffffff', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        border: '1px solid #ede4d5' 
                      }}
                    >
                      + {pairing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & WhatsApp Ordering Box */}
            <div 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1.5px solid #d4985b', 
                borderRadius: '16px', 
                padding: '18px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#271407', display: 'block' }}>
                    Select Quantity:
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#7b4a22' }}>
                    Direct order dispatch via official WhatsApp
                  </span>
                </div>

                {/* Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #d4985b',
                      backgroundColor: '#fdfbf7',
                      color: '#271407',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span style={{ fontWeight: 900, fontSize: '1.15rem', minWidth: '32px', textAlign: 'center', color: '#271407' }}>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #d4985b',
                      backgroundColor: '#fdfbf7',
                      color: '#271407',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Primary CTA: Order via WhatsApp */}
                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      flex: '1 1 200px',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f5f5f5',
                      color: '#9e9e9e',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'not-allowed',
                      textAlign: 'center',
                    }}
                  >
                    Out of Stock
                  </button>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: '1 1 200px',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Order via WhatsApp ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                  </a>
                )}

                {/* Secondary CTA: Add to Drink Mixer */}
                {onAddToMixer && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToMixer(product);
                      onClose();
                    }}
                    style={{
                      padding: '13px 18px',
                      borderRadius: '12px',
                      border: '1.5px solid #271407',
                      backgroundColor: '#fdfbf7',
                      color: '#271407',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#271407';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fdfbf7';
                      e.currentTarget.style.color = '#271407';
                    }}
                  >
                    <Sparkles size={16} color="#d90429" />
                    <span>Add to Live Drink Mixer</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
