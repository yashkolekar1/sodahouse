import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Maximize2, 
  Store, 
  Coffee, 
  Layers, 
  Heart,
  Droplets,
  X,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function GallerySection() {
  const [activeMedia, setActiveMedia] = useState(0);
  const [lightboxItem, setLightboxItem] = useState(null);

  const galleryItems = [
    {
      title: "Original Daddy Soda House Bar Counter & Neon Signage",
      category: "Turnkey Modular Kiosk",
      img: "/images/counter_original.png",
      caption: "The official turnkey modular kiosk as shown in the brand brochure, featuring natural fluted timber slats, warm illuminated shelving, 8 automated dispensers, and glowing Daddy Soda House neon signage.",
    },
    {
      title: "Signature Soda Blends & Mumbai Rainbow Ice-Gola",
      category: "Signature Beverages",
      img: "/images/drinks_lineup_original.png",
      caption: "The original brochure beverage lineup: Zeera Masala, Orange Masala, Lemon Masala, Cola Masala, Honey Lemon, Mojito Masala, and authentic snow-shaved Rainbow Ice-Gola popsicle.",
    },
    {
      title: "High-Capacity 8-Tap Commercial Dispenser Station",
      category: "Machine Architecture",
      img: "/images/counter_bar_original.png",
      caption: "High-resolution architectural view of the 8 dedicated automated dispensers, stainless steel drip tray, and backlit syrup display bottles designed for 15-second per-cup pour speeds.",
    },
    {
      title: "Turnkey Storefront & Brand Ambiance",
      category: "Live Retail Setup",
      img: "/images/counter.jpg",
      caption: "Full front elevation showing customer ordering zone, illuminated menu overhead, and fast-throughput service counter.",
    },
    {
      title: "Fresh Carbonated Soda Lineup Spread",
      category: "Product Variety",
      img: "/images/drinks_lineup.jpg",
      caption: "Vibrant fizzy concoctions poured ice-cold: tropical mocktails, authentic desi digestives, citrus sodas, and zero-sugar thirst quenchers.",
    },
    {
      title: "In-House Proprietary Syrups & Concentrates",
      category: "Flavor Factory",
      img: "/images/syrup_bottles.jpg",
      caption: "Batch-formulated in our dedicated Maharashtra syrup plant using real fruit purees and botanical spices to ensure guaranteed identical taste.",
    },
  ];

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxItem]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section 
      id="gallery"
      className="gallery-section"
      style={{
        padding: '90px 0',
        backgroundColor: '#fdfbf7',
        borderTop: '1px solid #ede4d5',
        position: 'relative',
      }}
    >
      <div className="site-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
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
            <Camera size={16} /> Visual Showcase & Store Aesthetics
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#271407', fontWeight: 900, marginBottom: '16px' }}>
            Inside The Daddy Soda House Experience
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#6b5c52', lineHeight: 1.7 }}>
            Designed for high visual appeal, quick grab-and-go throughput, and an inviting premium ambiance that attracts crowds across high streets and malls.
          </p>
        </div>

        {/* Featured Big Spotlight */}
        <div className="gallery-spotlight"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            border: '2px solid #d4985b',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(59, 34, 16, 0.1)',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          <div 
            style={{ position: 'relative', minHeight: '380px', backgroundColor: '#3b2210', cursor: 'pointer' }}
            onClick={() => setLightboxItem(galleryItems[activeMedia])}
          >
            <img 
              src={galleryItems[activeMedia].img} 
              alt={galleryItems[activeMedia].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(39, 20, 7, 0.85)',
                color: '#ffea79',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                backdropFilter: 'blur(6px)',
              }}
            >
              {galleryItems[activeMedia].category}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#271407',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Maximize2 size={14} /> Click to View Fullscreen
            </div>
          </div>

          {/* Details Column with Fluted Timber Styling */}
          <div className="gallery-spotlight-copy"
            style={{
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#fdfbf7',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#d90429', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Outlet Highlight
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#271407', margin: '8px 0 16px 0', lineHeight: 1.25, fontWeight: 900 }}>
              {galleryItems[activeMedia].title}
            </h3>
            <p style={{ color: '#5c3518', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {galleryItems[activeMedia].caption}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ede4d5',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#3b2210',
                }}
              >
                <Store size={16} color="#b87b43" /> Turnkey Counter Design
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ede4d5',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#3b2210',
                }}
              >
                <Coffee size={16} color="#d90429" /> 8 Commercial Taps
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setLightboxItem(galleryItems[activeMedia])}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1.5px solid #d4985b',
                  backgroundColor: '#ffffff',
                  color: '#271407',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                <Eye size={16} /> Open in Lightbox
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Modern Grid (Section 21) */}
        <div 
          className="gallery-thumb-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setActiveMedia(idx);
                setLightboxItem(item);
              }}
              className="gallery-thumb"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: activeMedia === idx ? '3px solid #d90429' : '1px solid #ede4d5',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                boxShadow: activeMedia === idx ? '0 10px 25px rgba(217, 4, 41, 0.15)' : '0 4px 12px rgba(59, 34, 16, 0.04)',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.img} 
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    padding: '3px',
                    borderRadius: '6px',
                  }}
                >
                  <Maximize2 size={12} />
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: '0.68rem', color: '#9c6332', fontWeight: 800, textTransform: 'uppercase' }}>
                  {item.category}
                </span>
                <p style={{ margin: '3px 0 0 0', fontWeight: 700, fontSize: '0.84rem', color: '#271407', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* LIGHTBOX POPUP MODAL (Section 21 Requirement)                       */}
      {/* =================================================================== */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxItem(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 10, 6, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1f1207',
              border: '2px solid rgba(212, 152, 91, 0.4)',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '92vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 25px 70px rgba(0,0,0,0.8)',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              title="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Lightbox Image Stage */}
            <div 
              style={{ 
                flex: 1, 
                minHeight: '360px', 
                maxHeight: '60vh', 
                backgroundColor: '#0c0704', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '16px' 
              }}
            >
              <img 
                src={lightboxItem.img} 
                alt={lightboxItem.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
            </div>

            {/* Caption & Category Footer */}
            <div style={{ padding: '24px 30px', backgroundColor: '#1a0e06', borderTop: '1px solid rgba(212, 152, 91, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: '#ffb703', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {lightboxItem.category}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#ffffff', margin: '6px 0 10px 0', fontWeight: 900 }}>
                {lightboxItem.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#e8c49a', lineHeight: 1.6 }}>
                {lightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
