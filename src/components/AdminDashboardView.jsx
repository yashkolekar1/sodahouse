import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Droplets, 
  FileText, 
  LogOut, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageCircle,
  Phone,
  ShieldCheck,
  Check,
  Building2,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  X,
  Eye,
  Sliders
} from 'lucide-react';
import { 
  BRAND_INFO, 
  SYRUPS, 
  getStoredSyrupAvailability, 
  saveStoredSyrupAvailability, 
  INITIAL_LEADS,
  getMergedProducts,
  addProductToStore,
  removeProductFromStore,
  editProductInStore
} from '../data/sodaData';

const INITIAL_ADMIN_ORDERS = [
  {
    id: "ORD-9821",
    customer: "Rahul Sharma",
    phone: "+91 98221 44819",
    products: "Blue Curacao (300ml), Royal Jeera Masala (450ml)",
    quantity: 2,
    orderMethod: "WhatsApp Order",
    status: "Confirmed",
    date: "2026-09-22 19:40"
  },
  {
    id: "ORD-9820",
    customer: "Pooja Patil",
    phone: "+91 98500 12345",
    products: "Cuban Mint Mojito (450ml), Kokum Splash (Takeaway 1L)",
    quantity: 2,
    orderMethod: "WhatsApp Order",
    status: "Processing",
    date: "2026-09-22 17:15"
  },
  {
    id: "ORD-9819",
    customer: "Anand Joshi",
    phone: "+91 97640 99887",
    products: "Kala Khatta Blast (Takeaway 1L)",
    quantity: 1,
    orderMethod: "WhatsApp Order",
    status: "Completed",
    date: "2026-09-21 20:10"
  },
  {
    id: "ORD-9818",
    customer: "Sneha Kulkarni",
    phone: "+91 98901 22334",
    products: "Green Apple Fizz (300ml)",
    quantity: 3,
    orderMethod: "WhatsApp Order",
    status: "Pending",
    date: "2026-09-21 11:20"
  }
];

const PRESET_IMAGES = [
  { label: 'Berry Red', url: '/images/drinks/drink_berry.png' },
  { label: 'Mint Green', url: '/images/drinks/drink_mint.png' },
  { label: 'Golden Orange', url: '/images/drinks/drink_gold.png' },
  { label: 'Super Cola', url: '/images/drinks/drink_cola.png' },
  { label: 'Zesty Lemon', url: '/images/drinks/drink_lemon.png' }
];

export default function AdminDashboardView({
  currentUser,
  onLogout,
  onBackToSite
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'syrups' | 'orders' | 'enquiries'
  const [productsList, setProductsList] = useState(() => getMergedProducts());
  const [availabilityMap, setAvailabilityMap] = useState(getStoredSyrupAvailability);
  const [feedback, setFeedback] = useState('');

  // Orders and Leads
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem('daddy_admin_orders');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_ADMIN_ORDERS;
  });

  const [leads, setLeads] = useState(() => {
    try {
      const raw = localStorage.getItem('daddy_soda_leads');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_LEADS;
  });

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [syrupSearch, setSyrupSearch] = useState('');
  const [syrupCategory, setSyrupCategory] = useState('All');

  // Modal States: Add / Edit Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mocktail Refreshers',
    flavorNotes: '',
    priceRegular: 30,
    availability: 'Available',
    image: '/images/drinks/drink_berry.png'
  });

  // Listen for real-time changes
  useEffect(() => {
    const handleSync = () => {
      setProductsList(getMergedProducts());
      setAvailabilityMap(getStoredSyrupAvailability());
    };
    window.addEventListener('daddy_products_changed', handleSync);
    window.addEventListener('daddy_syrup_status_changed', handleSync);
    return () => {
      window.removeEventListener('daddy_products_changed', handleSync);
      window.removeEventListener('daddy_syrup_status_changed', handleSync);
    };
  }, []);

  const showNotification = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) return;

    const added = addProductToStore({
      name: formData.name.trim(),
      category: formData.category,
      flavorNotes: formData.flavorNotes.trim() || 'Signature handcrafted soda blended with pure cane syrups.',
      priceRegular: Number(formData.priceRegular) || 30,
      availability: formData.availability,
      image: formData.image,
      popularity: 95
    });

    setProductsList(getMergedProducts());
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: 'Mocktail Refreshers',
      flavorNotes: '',
      priceRegular: 30,
      availability: 'Available',
      image: '/images/drinks/drink_berry.png'
    });
    showNotification(`✅ Successfully added "${added.name}"! Published live to storefront.`);
  };

  // Edit Product Submit
  const handleEditProductSubmit = (e) => {
    if (e) e.preventDefault();
    if (!editingProduct || !formData.name.trim()) return;

    editProductInStore(editingProduct.id, {
      name: formData.name.trim(),
      category: formData.category,
      flavorNotes: formData.flavorNotes.trim(),
      priceRegular: Number(formData.priceRegular) || 30,
      availability: formData.availability,
      image: formData.image
    });

    // Also update availability override if changed
    saveStoredSyrupAvailability(editingProduct.id, formData.availability);

    setProductsList(getMergedProducts());
    setEditingProduct(null);
    showNotification(`✅ Updated product "${formData.name.trim()}"!`);
  };

  // Remove Product
  const handleRemoveProduct = (prod) => {
    if (window.confirm(`Are you sure you want to remove "${prod.name}" from the active storefront?`)) {
      removeProductFromStore(prod.id);
      setProductsList(getMergedProducts());
      showNotification(`🗑️ Removed "${prod.name}" from the active product catalogue.`);
    }
  };

  // Quick Availability Toggle
  const handleToggleProductAvailability = (id, newStatus) => {
    saveStoredSyrupAvailability(id, newStatus);
    editProductInStore(id, { availability: newStatus });
    setAvailabilityMap(prev => ({ ...prev, [id]: newStatus }));
    setProductsList(getMergedProducts());
    showNotification(`⚡ Status updated to "${newStatus}"! Synced instantly.`);
  };

  // Open Edit Modal with prefilled data
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'Mocktail Refreshers',
      flavorNotes: prod.flavorNotes || '',
      priceRegular: prod.priceRegular || 30,
      availability: availabilityMap[prod.id] || prod.availability || 'Available',
      image: prod.image || '/images/drinks/drink_berry.png'
    });
  };

  // Order Status Change
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    try {
      localStorage.setItem('daddy_admin_orders', JSON.stringify(updated));
    } catch (e) {}
    showNotification(`Order #${orderId} marked as ${newStatus}.`);
  };

  const categories = ['All', 'Mocktail Refreshers', 'Desi Masala', 'Fruit Fusion', 'Herbal & Fresh', 'Ice-Gola Counter'];

  const filteredProducts = productsList.filter(item => {
    const matchesCat = productCategoryFilter === 'All' || item.category === productCategoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#140b04', color: '#f6ebd9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header 
        style={{
          backgroundColor: '#1f1207',
          borderBottom: '1px solid rgba(212, 152, 91, 0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
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
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(212, 152, 91, 0.3)',
                color: '#f6ebd9',
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
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>
                  ADMIN <span style={{ color: '#ffb703' }}>PORTAL</span>
                </span>
                <span style={{ marginLeft: '8px', fontSize: '0.65rem', backgroundColor: '#ffb703', color: '#271407', padding: '1px 6px', borderRadius: '4px', fontWeight: 900 }}>
                  MANAGER
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Dashboard, Orders, Products, Syrups, Franchise Enquiries, Settings) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'products', label: 'Products', icon: Package, badge: productsList.length },
              { id: 'syrups', label: 'Syrups', icon: Droplets },
              { id: 'enquiries', label: 'Franchise Enquiries', icon: FileText, badge: leads.length },
              { id: 'settings', label: 'Settings', icon: Sliders },
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
                    backgroundColor: isActive ? '#ffb703' : 'transparent',
                    color: isActive ? '#271407' : '#e8c49a',
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
                  <Icon size={14} color={isActive ? '#271407' : '#b87b43'} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span style={{ backgroundColor: isActive ? '#271407' : 'rgba(255, 183, 3, 0.2)', color: isActive ? '#ffffff' : '#ffea79', padding: '1px 6px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Logout */}
          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(217, 4, 41, 0.2)',
              border: '1px solid rgba(217, 4, 41, 0.5)',
              color: '#ff8597',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Activity Feedback Toast */}
        {feedback && (
          <div style={{ backgroundColor: 'rgba(43, 147, 72, 0.25)', border: '1px solid #2b9348', color: '#70e000', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
            <CheckCircle2 size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {/* ========================================================
            TAB 0: EXECUTIVE DASHBOARD OVERVIEW
           ======================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                EXECUTIVE OVERVIEW
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 8px 0' }}>
                Welcome to Daddy Soda Admin
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#c49a6c' }}>
                Monitor catalog products, live stock availability, incoming WhatsApp orders, and franchise partner leads.
              </p>
            </div>

            {/* KPI Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
              {/* Metric 1 */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', padding: '22px', border: '1.5px solid rgba(212, 152, 91, 0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c49a6c', textTransform: 'uppercase' }}>Total Products</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '6px 0' }}>
                  {productsList.length}
                </p>
                <button onClick={() => setActiveTab('products')} style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  Manage catalog →
                </button>
              </div>

              {/* Metric 2 */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', padding: '22px', border: '1.5px solid rgba(212, 152, 91, 0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c49a6c', textTransform: 'uppercase' }}>Active Syrups</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#25D366', margin: '6px 0' }}>
                  {productsList.filter(p => (availabilityMap[p.id] || p.availability) !== 'Out of Stock').length}
                </p>
                <button onClick={() => setActiveTab('syrups')} style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  Update availability →
                </button>
              </div>

              {/* Metric 3 */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', padding: '22px', border: '1.5px solid rgba(212, 152, 91, 0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c49a6c', textTransform: 'uppercase' }}>WhatsApp Orders</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#ffd000', margin: '6px 0' }}>
                  {orders.length}
                </p>
                <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  View incoming logs →
                </button>
              </div>

              {/* Metric 4 */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', padding: '22px', border: '1.5px solid rgba(212, 152, 91, 0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c49a6c', textTransform: 'uppercase' }}>Franchise Enquiries</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#00b4d8', margin: '6px 0' }}>
                  {leads.length}
                </p>
                <button onClick={() => setActiveTab('enquiries')} style={{ background: 'none', border: 'none', color: '#ffb703', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  Review leads CRM →
                </button>
              </div>
            </div>

            {/* Quick Action Navigation Panels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#1f1207', borderRadius: '20px', padding: '26px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0' }}>
                  Frontend-Only Architecture Notice
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#e8c49a', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  All product catalogs, syrup statuses, and franchise lead submissions are managed purely on the browser client. 
                  Customer orders are dispatched directly to WhatsApp.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontSize: '0.78rem', fontWeight: 800 }}>
                  ✓ WhatsApp Direct Ordering Active
                </div>
              </div>

              <div style={{ backgroundColor: '#1f1207', borderRadius: '20px', padding: '26px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0' }}>
                  Quick Shortcuts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => setActiveTab('products')} 
                    style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,152,91,0.25)', color: '#ffffff', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    + Add or Modify Soda Products
                  </button>
                  <button 
                    onClick={() => setActiveTab('syrups')} 
                    style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,152,91,0.25)', color: '#ffffff', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    ⚡ Toggle Syrup Stock Availability
                  </button>
                  <button 
                    onClick={() => setActiveTab('enquiries')} 
                    style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,152,91,0.25)', color: '#ffffff', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    📋 View Franchise Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 1: PRODUCT MANAGEMENT (Add / Edit / Remove / Availability)
           ======================================================== */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase' }}>
                  ADMIN PRODUCT MANAGEMENT
                </span>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
                  Product & Drink Management ({productsList.length})
                </h1>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#c49a6c' }}>
                  Add new craft drinks, update prices & flavor notes, set live stock availability, or remove items.
                </p>
              </div>

              {/* Action Button: Add Product */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    category: 'Mocktail Refreshers',
                    flavorNotes: '',
                    priceRegular: 30,
                    availability: 'Available',
                    image: '/images/drinks/drink_berry.png'
                  });
                  setIsAddModalOpen(true);
                }}
                style={{
                  backgroundColor: '#ffb703',
                  color: '#271407',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(255, 183, 3, 0.3)'
                }}
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={15} color="#c49a6c" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name or flavor..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '8px',
                    backgroundColor: '#1f1207',
                    border: '1px solid rgba(212, 152, 91, 0.3)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 152, 91, 0.3)',
                      backgroundColor: productCategoryFilter === cat ? '#ffb703' : '#1f1207',
                      color: productCategoryFilter === cat ? '#271407' : '#c49a6c',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', border: '1px solid rgba(212, 152, 91, 0.3)', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', color: '#ffb703' }}>
                    <th style={{ padding: '14px 16px' }}>Product</th>
                    <th style={{ padding: '14px 16px' }}>Category</th>
                    <th style={{ padding: '14px 16px' }}>Price</th>
                    <th style={{ padding: '14px 16px' }}>Availability</th>
                    <th style={{ padding: '14px 16px' }}>Quick Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => {
                    const currentStatus = availabilityMap[prod.id] || prod.availability || 'Available';
                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid rgba(212, 152, 91, 0.15)' }}>
                        <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            style={{ width: '42px', height: '42px', objectFit: 'contain', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#a88159', maxWidth: '300px' }}>
                              {prod.flavorNotes}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#c49a6c' }}>
                          <span style={{ fontSize: '0.74rem', backgroundColor: 'rgba(212, 152, 91, 0.15)', color: '#ffea79', padding: '2px 8px', borderRadius: '4px' }}>
                            {prod.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#ffffff' }}>
                          ₹{prod.priceRegular || 30}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span 
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: currentStatus === 'Out of Stock' ? 'rgba(217, 4, 41, 0.2)' : (currentStatus === 'Low Stock' ? 'rgba(255, 183, 3, 0.2)' : 'rgba(37, 211, 102, 0.2)'),
                              color: currentStatus === 'Out of Stock' ? '#ff4d6d' : (currentStatus === 'Low Stock' ? '#ffea79' : '#25D366')
                            }}
                          >
                            {currentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            {['Available', 'Low Stock', 'Out of Stock'].map(st => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleToggleProductAvailability(prod.id, st)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: currentStatus === st ? (st === 'Out of Stock' ? '#d90429' : (st === 'Low Stock' ? '#f77f00' : '#2b9348')) : 'rgba(255,255,255,0.08)',
                                  color: currentStatus === st ? '#ffffff' : '#c49a6c'
                                }}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              style={{
                                backgroundColor: 'rgba(255, 183, 3, 0.15)',
                                color: '#ffb703',
                                border: '1px solid rgba(255, 183, 3, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Edit size={12} /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(prod)}
                              style={{
                                backgroundColor: 'rgba(217, 4, 41, 0.15)',
                                color: '#ff8597',
                                border: '1px solid rgba(217, 4, 41, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SYRUPS (25+ Availability Controls)
           ======================================================== */}
        {activeTab === 'syrups' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase' }}>
                INVENTORY & AVAILABILITY
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
                Syrup Availability Management (25 Syrups)
              </h1>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#c49a6c' }}>
                Toggle syrup status between <strong>Available</strong>, <strong>Low Stock</strong>, and <strong>Out of Stock</strong>. Toggling automatically syncs with the public website in real-time.
              </p>
            </div>

            {/* Filter and Search */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={15} color="#c49a6c" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={syrupSearch}
                  onChange={(e) => setSyrupSearch(e.target.value)}
                  placeholder="Search 25 syrups..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '8px',
                    backgroundColor: '#1f1207',
                    border: '1px solid rgba(212, 152, 91, 0.3)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSyrupCategory(cat)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 152, 91, 0.3)',
                      backgroundColor: syrupCategory === cat ? '#ffb703' : '#1f1207',
                      color: syrupCategory === cat ? '#271407' : '#c49a6c',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Syrups List Table */}
            <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', border: '1px solid rgba(212, 152, 91, 0.3)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', color: '#ffb703' }}>
                    <th style={{ padding: '12px 16px' }}>Syrup</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Current Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Set Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.filter(s => syrupCategory === 'All' || s.category === syrupCategory).map(syrup => {
                    const currentStatus = availabilityMap[syrup.id] || syrup.availability || 'Available';
                    return (
                      <tr key={syrup.id} style={{ borderBottom: '1px solid rgba(212, 152, 91, 0.15)' }}>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={syrup.image} alt={syrup.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>{syrup.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#a88159' }}>{syrup.flavorNotes.slice(0, 48)}...</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#c49a6c' }}>
                          {syrup.category}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span 
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: currentStatus === 'Out of Stock' ? 'rgba(217, 4, 41, 0.2)' : (currentStatus === 'Low Stock' ? 'rgba(255, 183, 3, 0.2)' : 'rgba(37, 211, 102, 0.2)'),
                              color: currentStatus === 'Out of Stock' ? '#ff4d6d' : (currentStatus === 'Low Stock' ? '#ffea79' : '#25D366')
                            }}
                          >
                            {currentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {['Available', 'Low Stock', 'Out of Stock'].map(st => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleToggleProductAvailability(syrup.id, st)}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: currentStatus === st ? (st === 'Out of Stock' ? '#d90429' : (st === 'Low Stock' ? '#f77f00' : '#2b9348')) : 'rgba(255,255,255,0.08)',
                                  color: currentStatus === st ? '#ffffff' : '#c49a6c'
                                }}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ORDERS
           ======================================================== */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase' }}>
                CLIENT-SIDE ORDER LOGS
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
                Customer Orders (WhatsApp)
              </h1>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#c49a6c' }}>
                View customer orders generated via WhatsApp and update their operational status.
              </p>
            </div>

            <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', border: '1px solid rgba(212, 152, 91, 0.3)', overflowX: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', color: '#ffb703' }}>
                    <th style={{ padding: '14px 16px' }}>Order ID</th>
                    <th style={{ padding: '14px 16px' }}>Customer</th>
                    <th style={{ padding: '14px 16px' }}>Products</th>
                    <th style={{ padding: '14px 16px' }}>Qty</th>
                    <th style={{ padding: '14px 16px' }}>Method</th>
                    <th style={{ padding: '14px 16px' }}>Date</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid rgba(212, 152, 91, 0.15)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 900, color: '#ffea79' }}>
                        {ord.id}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#ffffff' }}>
                        {ord.customer}
                        <div style={{ fontSize: '0.72rem', color: '#a88159' }}>{ord.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#f6ebd9' }}>
                        {ord.products}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                        {ord.quantity}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          WhatsApp
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#c49a6c', fontSize: '0.78rem' }}>
                        {ord.date}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          style={{
                            backgroundColor: '#140b04',
                            color: ord.status === 'Completed' ? '#70e000' : (ord.status === 'Cancelled' ? '#ff4d6d' : '#ffb703'),
                            border: '1px solid rgba(212, 152, 91, 0.4)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${ord.customer}, regarding your Daddy Soda order #${ord.id}: `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#25D366',
                            color: '#ffffff',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MessageCircle size={13} /> Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: FRANCHISE ENQUIRIES
           ======================================================== */}
        {activeTab === 'enquiries' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase' }}>
                EXPANSION LEADS
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
                Franchise Partner Enquiries
              </h1>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#c49a6c' }}>
                Review investor submissions received through the franchise contact form.
              </p>
            </div>

            <div style={{ backgroundColor: '#1f1207', borderRadius: '16px', border: '1px solid rgba(212, 152, 91, 0.3)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(212, 152, 91, 0.3)', color: '#ffb703' }}>
                    <th style={{ padding: '14px 16px' }}>Partner Name</th>
                    <th style={{ padding: '14px 16px' }}>Phone / Email</th>
                    <th style={{ padding: '14px 16px' }}>City & State</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Notes</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Connect</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(212, 152, 91, 0.15)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#ffffff' }}>
                        {lead.name}
                        <div style={{ fontSize: '0.72rem', color: '#ffb703' }}>{lead.tier || 'Tier 3 Cities'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#f6ebd9' }}>
                        <div>{lead.phone}</div>
                        <div style={{ fontSize: '0.74rem', color: '#a88159' }}>{lead.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#c49a6c' }}>
                        {lead.city}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255, 183, 3, 0.15)', color: '#ffea79', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#c49a6c', fontSize: '0.78rem', maxWidth: '280px' }}>
                        {lead.notes || 'Interested in turnkey 8-flavor soda machine setup.'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, regarding your Himmat Beverages franchise enquiry: `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#25D366',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SYSTEM & BRAND SETTINGS (FRONTEND ONLY)
           ======================================================== */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CONFIGURATION & SYSTEM
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 6px 0' }}>
                Brand & Storefront Settings
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#c49a6c' }}>
                Review brand profile, WhatsApp dispatch channels, operating hours, and local client store cache.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Brand Profile Information */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '18px', padding: '24px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Building2 size={20} color="#ffb703" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Brand & Corporate Profile
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Brand Trademark</label>
                    <p style={{ margin: '2px 0 0 0', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>{BRAND_INFO.name}</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Parent Enterprise</label>
                    <p style={{ margin: '2px 0 0 0', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>{BRAND_INFO.parentCompany}</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Legacy / Foundation</label>
                    <p style={{ margin: '2px 0 0 0', color: '#ffb703', fontWeight: 800, fontSize: '0.9rem' }}>Founded in {BRAND_INFO.estYear} ({BRAND_INFO.yearsLegacy} Legacy)</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Brand Tagline</label>
                    <p style={{ margin: '2px 0 0 0', color: '#e8c49a', fontSize: '0.86rem', fontStyle: 'italic' }}>"{BRAND_INFO.tagline}"</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp & Contact Routing */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '18px', padding: '24px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <MessageCircle size={20} color="#25D366" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    WhatsApp & Communications
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Official WhatsApp Hotline</label>
                    <p style={{ margin: '2px 0 0 0', color: '#25D366', fontWeight: 800, fontSize: '0.95rem' }}>{BRAND_INFO.phoneFormatted}</p>
                    <span style={{ fontSize: '0.72rem', color: '#8d99ae' }}>Receives all drink orders, syrup orders, & mixer recipes</span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Support Email</label>
                    <p style={{ margin: '2px 0 0 0', color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>{BRAND_INFO.email}</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#c49a6c', fontWeight: 700, textTransform: 'uppercase' }}>Headquarters & Hours</label>
                    <p style={{ margin: '2px 0 0 0', color: '#ffffff', fontSize: '0.86rem' }}>Himmat Group Headquarters, Maharashtra, India</p>
                    <p style={{ margin: '2px 0 0 0', color: '#ffea79', fontSize: '0.8rem', fontWeight: 700 }}>Mon – Sat: 9:00 AM – 8:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Local Storage & Cache Management */}
              <div style={{ backgroundColor: '#1f1207', borderRadius: '18px', padding: '24px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <RefreshCw size={20} color="#ffb703" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Client Storefront Management
                  </h3>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#c49a6c', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  In accordance with the frontend-only architecture, catalog overrides, stock states, and enquiries are stored in your browser's local state.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('daddy_syrup_availability');
                      setAvailabilityMap({});
                      setFeedback('Reset all syrup stocks to default factory availability.');
                      setTimeout(() => setFeedback(''), 3000);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 183, 3, 0.12)',
                      border: '1px solid rgba(255, 183, 3, 0.4)',
                      color: '#ffea79',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    ↺ Reset Stock Availability Overrides
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `franchise_leads_${new Date().toISOString().slice(0,10)}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      setFeedback('Exported franchise enquiries to JSON successfully.');
                      setTimeout(() => setFeedback(''), 3000);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 180, 216, 0.12)',
                      border: '1px solid rgba(0, 180, 216, 0.4)',
                      color: '#90e0ef',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    📥 Export Franchise Leads CRM (JSON)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `orders_log_${new Date().toISOString().slice(0,10)}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      setFeedback('Exported WhatsApp order logs to JSON successfully.');
                      setTimeout(() => setFeedback(''), 3000);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(37, 211, 102, 0.12)',
                      border: '1px solid rgba(37, 211, 102, 0.4)',
                      color: '#b7efc5',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    📥 Export WhatsApp Orders Log (JSON)
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          MODAL: ADD NEW PRODUCT / EDIT PRODUCT
         ======================================================== */}
      {(isAddModalOpen || editingProduct) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
        >
          <div 
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#1f1207',
              borderRadius: '24px',
              border: '2px solid #b87b43',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(212, 152, 91, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Craft Soda Product'}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#c49a6c' }}>
                  Frontend-only persistence • Updates storefront live
                </span>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                style={{ background: 'none', border: 'none', color: '#ffea79', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editingProduct ? handleEditProductSubmit : handleAddProductSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                  Product Name:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Peach Sparkling Soda"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#140b04',
                    border: '1px solid rgba(212, 152, 91, 0.4)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                    Category:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#140b04',
                      border: '1px solid rgba(212, 152, 91, 0.4)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                    Price (₹):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.priceRegular}
                    onChange={(e) => setFormData({ ...formData, priceRegular: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#140b04',
                      border: '1px solid rgba(212, 152, 91, 0.4)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                  Flavor Notes / Description:
                </label>
                <textarea
                  rows="3"
                  value={formData.flavorNotes}
                  onChange={(e) => setFormData({ ...formData, flavorNotes: e.target.value })}
                  placeholder="Describe the drink flavor profile, ice notes, or citrus finish..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#140b04',
                    border: '1px solid rgba(212, 152, 91, 0.4)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Existing Image Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '8px' }}>
                  Choose Product Image:
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {PRESET_IMAGES.map(img => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: formData.image === img.url ? '2px solid #ffb703' : '1px solid rgba(212, 152, 91, 0.3)',
                        backgroundColor: formData.image === img.url ? 'rgba(255, 183, 3, 0.2)' : 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={img.url} alt={img.label} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      <span style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 700 }}>{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Availability */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#f6ebd9', marginBottom: '6px' }}>
                  Stock Availability:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Available', 'Low Stock', 'Out of Stock'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, availability: st })}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '8px',
                        border: formData.availability === st ? '2px solid #ffb703' : '1px solid rgba(212, 152, 91, 0.3)',
                        backgroundColor: formData.availability === st ? '#ffb703' : '#140b04',
                        color: formData.availability === st ? '#271407' : '#c49a6c',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(212, 152, 91, 0.4)',
                    color: '#c49a6c',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    backgroundColor: '#ffb703',
                    border: 'none',
                    color: '#271407',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 183, 3, 0.3)'
                  }}
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
