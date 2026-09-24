import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Phone, 
  Mail, 
  MessageSquare, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  BarChart3, 
  Coffee, 
  Database, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  FileSpreadsheet,
  Lock,
  Unlock,
  KeyRound,
  Radio,
  AlertTriangle,
  Plus,
  Send,
  Star,
  Activity,
  Layers,
  Check,
  ChevronRight,
  Sliders,
  Store,
  LogOut
} from 'lucide-react';
import { BRAND_INFO, SYRUPS } from '../data/sodaData';

export default function OwnerDashboard({ 
  onBackToSite,
  onSwitchToCustomer,
  currentUser = null,
  onLogout = null,
  onSwitchToCustomerLogin = null,
  leads = [], 
  onUpdateStatus, 
  onDeleteLead, 
  onResetDemoData,
  onAddLead,
  announcement = '',
  onUpdateAnnouncement,
  customerReviews = []
}) {
  // Owner Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (currentUser?.role === 'admin') return true;
    try {
      return sessionStorage.getItem('daddy_soda_owner_authed') === 'true';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'pipeline' | 'dispensary' | 'inventory' | 'roi' | 'broadcasts'
  const [activeTab, setActiveTab] = useState('pipeline');
  
  // Pipeline filter & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Manual Add Lead Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    tier: 'Tier 2 & 3 Cities',
    investmentCapacity: '₹15L - ₹25L',
    notes: ''
  });

  // Live Counter Dispensary State (Interactive simulation)
  const [dispenseCountToday, setDispenseCountToday] = useState(() => {
    try {
      const stored = localStorage.getItem('daddy_soda_dispensed_today');
      return stored ? parseInt(stored, 10) : 482;
    } catch {
      return 482;
    }
  });

  // Syrup Stock Overrides
  const [syrupStocks, setSyrupStocks] = useState(() => {
    try {
      const stored = localStorage.getItem('daddy_soda_syrup_stocks');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default seed stocks for 25+ syrups (in litres)
    const initial = {};
    SYRUPS.forEach((s, idx) => {
      // Create varied initial stock levels
      initial[s.id] = idx === 1 ? 8 : idx === 4 ? 6 : 28 - (idx % 12);
    });
    return initial;
  });

  // Store Broadcast Draft
  const [broadcastDraft, setBroadcastDraft] = useState(announcement || 'Summer Fiesta: Buy 2 Signature Sodas, get 1 Bombay Masala Free at all Pune & Mumbai counters!');
  const [broadcastSavedNotice, setBroadcastSavedNotice] = useState(false);

  // Financial ROI Calculator State
  const [roiModel, setRoiModel] = useState('Lounge'); // 'Kiosk' | 'Lounge' | 'Mall'
  const [cupsPerDay, setCupsPerDay] = useState(380);
  const [avgCupPrice, setAvgCupPrice] = useState(30);

  // Authentication Handlers
  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    if (pinInput === '1973') {
      setIsAuthenticated(true);
      setPinError(false);
      try {
        sessionStorage.setItem('daddy_soda_owner_authed', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2500);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setPinError(false);
    try {
      sessionStorage.setItem('daddy_soda_owner_authed', 'true');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('daddy_soda_owner_authed');
    } catch (err) {
      console.error(err);
    }
    if (onLogout) {
      onLogout();
    }
  };

  // Filtered Leads
  const statusOptions = ['New', 'In Discussion', 'Site Evaluation', 'Agreement Signed', 'Closed'];

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        lead.name.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q));
      
      if (!matchesSearch) return false;
      if (statusFilter === 'All') return true;
      return lead.status === statusFilter;
    });
  }, [leads, searchQuery, statusFilter]);

  // Derived KPIs
  const kpiStats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'New').length;
    const inDiscussionCount = leads.filter(l => l.status === 'In Discussion').length;
    const siteEvalCount = leads.filter(l => l.status === 'Site Evaluation').length;
    const signedCount = leads.filter(l => l.status === 'Agreement Signed').length;

    const totalEstValue = leads.reduce((acc, lead) => {
      if (lead.investmentCapacity && lead.investmentCapacity.includes('30')) return acc + 28;
      if (lead.investmentCapacity && lead.investmentCapacity.includes('20')) return acc + 18;
      if (lead.investmentCapacity && lead.investmentCapacity.includes('15')) return acc + 14;
      return acc + 15;
    }, 0);

    return {
      total,
      newCount,
      activePipeline: inDiscussionCount + siteEvalCount,
      signedCount,
      totalEstLakhs: totalEstValue
    };
  }, [leads]);

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Lead ID', 'Date', 'Name', 'Phone', 'Email', 'City', 'Tier', 'Investment Capacity', 'Status', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      l.date,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.city}"`,
      `"${l.tier}"`,
      `"${l.investmentCapacity}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daddy_Soda_Franchise_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return { backgroundColor: '#ffe3e3', color: '#d90429', border: '1px solid #ffccd5' };
      case 'In Discussion':
        return { backgroundColor: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' };
      case 'Site Evaluation':
        return { backgroundColor: '#e3f2fd', color: '#0d47a1', border: '1px solid #bbdefb' };
      case 'Agreement Signed':
        return { backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9' };
      default:
        return { backgroundColor: '#ede4d5', color: '#5c3518', border: '1px solid #d4985b' };
    }
  };

  const sendWhatsAppFollowup = (lead) => {
    const text = encodeURIComponent(
      `Hello ${lead.name}, this is the Executive Desk at Himmat Beverages Pvt. Ltd. (S Daddy Soda House). We received your franchise application for ${lead.city}. When is a good time for a call with our directors regarding turnkey store setup & site evaluation?`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Dispensary 8-Tap configuration
  const taps = [
    { tapNum: 1, flavor: 'Signature Fizzy Cola', category: 'Classic', temp: '2.6°C', psi: 94, status: 'Optimal' },
    { tapNum: 2, flavor: 'Royal Jeera Masala', category: 'Digestive', temp: '2.8°C', psi: 95, status: 'Optimal' },
    { tapNum: 3, flavor: 'Tangy Fresh Lemon', category: 'Citrus', temp: '2.7°C', psi: 93, status: 'Optimal' },
    { tapNum: 4, flavor: 'Electric Blue Curacao', category: 'Mocktail', temp: '2.5°C', psi: 94, status: 'Optimal' },
    { tapNum: 5, flavor: 'Fiery Ginger Fizz', category: 'Digestive', temp: '2.9°C', psi: 96, status: 'Optimal' },
    { tapNum: 6, flavor: 'Goan Kokum Masala', category: 'Traditional', temp: '2.8°C', psi: 95, status: 'Optimal' },
    { tapNum: 7, flavor: 'Nagpur Orange Burst', category: 'Fruit Soda', temp: '2.6°C', psi: 94, status: 'Optimal' },
    { tapNum: 8, flavor: 'Ultra-Chilled Club Soda', category: 'Base Plain', temp: '2.2°C', psi: 98, status: 'Optimal' },
  ];

  const handleSimulateDispense = (tap) => {
    const newCount = dispenseCountToday + 1;
    setDispenseCountToday(newCount);
    try {
      localStorage.setItem('daddy_soda_dispensed_today', newCount.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleReorderSyrup = (syrup) => {
    const current = syrupStocks[syrup.id] !== undefined ? syrupStocks[syrup.id] : 15;
    const updated = { ...syrupStocks, [syrup.id]: current + 25 }; // Add 25L batch
    setSyrupStocks(updated);
    try {
      localStorage.setItem('daddy_soda_syrup_stocks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    alert(`25 Litre Batch Order for "${syrup.name}" sent to Himmat Beverages Factory! Dispatched from Pune manufacturing plant.`);
  };

  const handleSaveBroadcast = (e) => {
    if (e) e.preventDefault();
    if (onUpdateAnnouncement) {
      onUpdateAnnouncement(broadcastDraft);
    }
    setBroadcastSavedNotice(true);
    setTimeout(() => setBroadcastSavedNotice(false), 3000);
  };

  const handleCreateManualLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;
    const leadObj = {
      id: `LEAD-MANUAL-${Date.now().toString().slice(-4)}`,
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      email: newLeadForm.email || '',
      city: newLeadForm.city || 'Maharashtra',
      tier: newLeadForm.tier,
      investmentCapacity: newLeadForm.investmentCapacity,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      notes: newLeadForm.notes || 'Manually logged by Store Owner'
    };

    if (onAddLead) {
      onAddLead(leadObj);
    }
    setShowAddLeadModal(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      city: '',
      tier: 'Tier 2 & 3 Cities',
      investmentCapacity: '₹15L - ₹25L',
      notes: ''
    });
  };

  // ROI Calculations
  const calculatedMonthlyRevenue = cupsPerDay * avgCupPrice * 30;
  const syrupCo2Cost = calculatedMonthlyRevenue * 0.22; // ~22% syrup & CO2 costs
  const estRentStaff = roiModel === 'Kiosk' ? 35000 : roiModel === 'Lounge' ? 65000 : 95000;
  const netMonthlyProfit = Math.max(0, calculatedMonthlyRevenue - syrupCo2Cost - estRentStaff);
  const initialCapEx = roiModel === 'Kiosk' ? 1400000 : roiModel === 'Lounge' ? 2400000 : 3200000;
  const paybackMonths = netMonthlyProfit > 0 ? (initialCapEx / netMonthlyProfit).toFixed(1) : '—';
  const annualRoiPercent = ((netMonthlyProfit * 12 / initialCapEx) * 100).toFixed(0);

  // =========================================================================
  // 1. PIN ACCESS LOCK SCREEN (Shown when Owner is not yet authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: '#190e06',
          backgroundImage: 'radial-gradient(ellipse at top, #3b2210 0%, #190e06 70%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative'
        }}
      >
        {/* Top return button */}
        <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <button
            type="button"
            onClick={onBackToSite}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(212, 152, 91, 0.3)',
              color: '#f6ebd9',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Return to Store
          </button>
        </div>

        {/* Security Card */}
        <div 
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#271407',
            border: '2px solid #b87b43',
            borderRadius: '24px',
            padding: '36px 30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(217, 4, 41, 0.15)', border: '1px solid rgba(217, 4, 41, 0.3)', marginBottom: '18px' }}>
            <Lock size={32} color="#ffb703" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ backgroundColor: '#d90429', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px' }}>
              EXECUTIVE ACCESS
            </span>
            <span style={{ color: '#ffb703', fontSize: '0.72rem', fontWeight: 800 }}>
              EST. 1973
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, margin: '8px 0', color: '#ffffff' }}>
            Owner & Franchise Hub
          </h2>

          <p style={{ fontSize: '0.86rem', color: '#e8c49a', marginBottom: '24px', lineHeight: 1.5 }}>
            Restricted to Himmat Beverages Management, Franchise Operators, and Store Directors.
          </p>

          {/* PIN Input Form */}
          <form onSubmit={handlePinSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#ffea79', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enter Owner PIN (Default: 1973)
              </label>
              <div style={{ position: 'relative', maxWidth: '240px', margin: '0 auto' }}>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    letterSpacing: '0.4em',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#190e06',
                    border: pinError ? '2px solid #d90429' : '2px solid #d4985b',
                    color: '#ffea79',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                  autoFocus
                />
              </div>
              {pinError && (
                <p style={{ color: '#ff4d6d', fontSize: '0.78rem', fontWeight: 700, marginTop: '8px' }}>
                  Incorrect PIN. Hint: Founding year 1973.
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#d90429',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(217, 4, 41, 0.4)'
              }}
            >
              <KeyRound size={18} /> Unlock Executive Console
            </button>
          </form>

          {/* 1-Click Quick Demo Unlock */}
          <div style={{ borderTop: '1px solid rgba(212, 152, 91, 0.2)', paddingTop: '18px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={handleQuickUnlock}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 183, 3, 0.15)',
                border: '1.5px dashed #ffb703',
                color: '#ffea79',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} color="#ffb703" /> Quick 1-Click Demo Unlock (Reviewer Mode)
            </button>
            <p style={{ fontSize: '0.72rem', color: '#9c8e84', margin: '8px 0 0 0' }}>
              Quick bypass enables instant access without typing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED OWNER & EXECUTIVE HUB CONSOLE
  // =========================================================================
  return (
    <div className="admin-dashboard-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f6f0' }}>
      
      {/* ==========================================================
          LEFT EXECUTIVE SIDEBAR
         ========================================================== */}
      <aside className="admin-sidebar" style={{ width: '280px', backgroundColor: '#1f1207', borderRight: '2px solid #b87b43', display: 'flex', flexDirection: 'column', color: '#f6ebd9', zIndex: 20 }}>
        
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(212, 152, 91, 0.25)', background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Daddy Soda Logo" 
              style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.08rem', color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                OWNER HUB <span style={{ fontSize: '0.62rem', backgroundColor: '#ffb703', color: '#1f1207', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>PRO</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e8c49a', letterSpacing: '0.04em' }}>
                Himmat Beverages Pvt. Ltd.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <span style={{ backgroundColor: 'rgba(212, 152, 91, 0.2)', color: '#ffea79', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
              EST. 1973
            </span>
            <span style={{ fontSize: '0.7rem', color: '#e8c49a' }}>
              • Turnkey Soda Network
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ padding: '18px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          
          {/* Tab 1: Franchise CRM */}
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'pipeline' ? '#d90429' : 'transparent',
              color: activeTab === 'pipeline' ? '#ffffff' : '#e8c49a',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={18} />
            <span style={{ flex: 1 }}>Franchise CRM</span>
            <span 
              style={{
                backgroundColor: activeTab === 'pipeline' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'pipeline' ? '#d90429' : '#ffffff',
                padding: '1px 7px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              {leads.length}
            </span>
          </button>

          {/* Tab 2: 8-Tap Dispensary Monitor */}
          <button
            type="button"
            onClick={() => setActiveTab('dispensary')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'dispensary' ? '#d90429' : 'transparent',
              color: activeTab === 'dispensary' ? '#ffffff' : '#e8c49a',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={18} />
            <span style={{ flex: 1 }}>8-Tap Dispensary</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06d6a0' }} />
          </button>

          {/* Tab 3: Syrup Inventory */}
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'inventory' ? '#d90429' : 'transparent',
              color: activeTab === 'inventory' ? '#ffffff' : '#e8c49a',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Coffee size={18} />
            <span style={{ flex: 1 }}>25+ Syrup Inventory</span>
          </button>

          {/* Tab 4: Financial ROI Simulator */}
          <button
            type="button"
            onClick={() => setActiveTab('roi')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'roi' ? '#d90429' : 'transparent',
              color: activeTab === 'roi' ? '#ffffff' : '#e8c49a',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={18} />
            <span style={{ flex: 1 }}>ROI & Profit Model</span>
          </button>

          {/* Tab 5: Customer Reviews & Broadcasts */}
          <button
            type="button"
            onClick={() => setActiveTab('broadcasts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'broadcasts' ? '#d90429' : 'transparent',
              color: activeTab === 'broadcasts' ? '#ffffff' : '#e8c49a',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Radio size={18} />
            <span style={{ flex: 1 }}>Reviews & Broadcasts</span>
            {customerReviews.length > 0 && (
              <span style={{ backgroundColor: '#ffb703', color: '#1f1207', padding: '1px 6px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                {customerReviews.length}
              </span>
            )}
          </button>

          <div style={{ margin: '14px 0 8px 0', borderTop: '1px solid rgba(212, 152, 91, 0.18)' }} />

          {/* Quick Operations Actions */}
          <button
            type="button"
            onClick={() => setShowAddLeadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 183, 3, 0.15)',
              border: '1px solid rgba(255, 183, 3, 0.3)',
              color: '#ffea79',
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Plus size={16} /> Add Franchise Lead
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f6ebd9',
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <FileSpreadsheet size={16} color="#06d6a0" /> Export CSV Sheet
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset franchise leads to original demo dataset?')) {
                onResetDemoData();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffccd5',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              marginTop: '4px'
            }}
          >
            <RefreshCw size={14} /> Reset Demo Dataset
          </button>
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(212, 152, 91, 0.25)', backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <button
            type="button"
            onClick={onBackToSite}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#271407',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '10px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <ArrowLeft size={16} /> Return to Store
          </button>

          {onSwitchToCustomerLogin && (
            <button
              type="button"
              onClick={onSwitchToCustomerLogin}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 183, 3, 0.12)',
                color: '#ffea79',
                border: '1px solid rgba(255, 183, 3, 0.4)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '8px'
              }}
            >
              <Sparkles size={14} /> Switch to Customer Login
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.7rem', color: '#9c8e84' }}>
              Admin: <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Himmat Mgmt'}</strong>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                backgroundColor: 'rgba(217, 4, 41, 0.22)',
                border: '1px solid #d90429',
                color: '#ffccd5',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Sign out of Admin Dashboard"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================================
          MAIN OWNER CONTENT AREA
         ========================================================== */}
      <main className="admin-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <header 
          style={{ 
            backgroundColor: '#ffffff', 
            borderBottom: '1px solid #ede4d5', 
            padding: '16px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: '#271407', color: '#ffea79', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                FRANCHISE OWNER & EXECUTIVE TERMINAL
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: '#271407', margin: '4px 0 0 0' }}>
              {activeTab === 'pipeline' && 'Franchise Leads & Application Pipeline'}
              {activeTab === 'dispensary' && 'Live 8-Tap Soda Fountain Station & POS Counter'}
              {activeTab === 'inventory' && '25+ Gourmet Syrups & Factory Supply Chain'}
              {activeTab === 'roi' && 'Franchise Financial ROI & Payback Calculator'}
              {activeTab === 'broadcasts' && 'Customer Reviews & Marquee Flash Broadcasts'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                backgroundColor: '#e8f5e9',
                color: '#1b5e20',
                border: '1px solid #c8e6c9',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2e7d32' }} />
              Live Operations Online
            </div>

            <button
              type="button"
              onClick={() => setShowAddLeadModal(true)}
              style={{
                backgroundColor: '#d90429',
                color: '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(217, 4, 41, 0.3)'
              }}
            >
              <Plus size={16} /> New Lead
            </button>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <div style={{ padding: '28px', flex: 1 }}>

          {/* Quick Metrics Bar across all tabs */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              marginBottom: '26px' 
            }}
          >
            {/* KPI 1: Active Leads */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #ede4d5', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase' }}>Franchise Pipeline</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#271407', fontFamily: 'var(--font-heading)' }}>{leads.length}</span>
                <span style={{ fontSize: '0.74rem', color: '#d90429', fontWeight: 800 }}>({kpiStats.newCount} New)</span>
              </div>
            </div>

            {/* KPI 2: Pipeline Capital Value */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #ede4d5', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase' }}>Est. Pipeline Capital</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#271407', fontFamily: 'var(--font-heading)' }}>₹{kpiStats.totalEstLakhs}L</span>
                <span style={{ fontSize: '0.74rem', color: '#2e7d32', fontWeight: 800 }}>Active ROI</span>
              </div>
            </div>

            {/* KPI 3: Today's Dispensed Cups */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #ede4d5', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase' }}>Today's Glasses Sold</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#271407', fontFamily: 'var(--font-heading)' }}>{dispenseCountToday}</span>
                <span style={{ fontSize: '0.74rem', color: '#0077b6', fontWeight: 800 }}>₹{(dispenseCountToday * 28).toLocaleString()} Gross</span>
              </div>
            </div>

            {/* KPI 4: 25+ Syrups Catalog */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '18px', border: '1px solid #ede4d5', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase' }}>Factory Syrups Range</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#271407', fontFamily: 'var(--font-heading)' }}>{SYRUPS.length}</span>
                <span style={{ fontSize: '0.74rem', color: '#52b788', fontWeight: 800 }}>100% In-House</span>
              </div>
            </div>
          </div>

          {/* ==========================================================
              TAB 1: FRANCHISE CRM & LEADS PIPELINE
             ========================================================== */}
          {activeTab === 'pipeline' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #ede4d5', overflow: 'hidden', boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)' }}>
              
              {/* Search & Filter Bar */}
              <div style={{ padding: '20px', borderBottom: '1px solid #ede4d5', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} color="#9c6332" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applicant by name, phone, city, or email..."
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 40px',
                      borderRadius: '10px',
                      border: '1.5px solid #ede4d5',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#fdfbf7'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={16} color="#5c3518" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5c3518' }}>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ede4d5',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                      color: '#271407',
                      outline: 'none'
                    }}
                  >
                    <option value="All">All Statuses ({leads.length})</option>
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fdfbf7', borderBottom: '1px solid #ede4d5', color: '#5c3518' }}>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Applicant & Contact</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Location & Model</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Capital Range</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Status Stage</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Date</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Owner Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const badgeStyle = getStatusBadgeStyle(lead.status);
                      return (
                        <tr key={lead.id} style={{ borderBottom: '1px solid #f2ede4' }}>
                          {/* Applicant */}
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ fontWeight: 800, color: '#271407', fontSize: '0.94rem' }}>{lead.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.78rem', color: '#7b4a22' }}>
                              <span>{lead.phone}</span>
                              {lead.email && <span>• {lead.email}</span>}
                            </div>
                          </td>

                          {/* Location */}
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#271407', fontWeight: 600 }}>
                              <MapPin size={14} color="#d90429" /> {lead.city}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#7b4a22' }}>{lead.tier}</span>
                          </td>

                          {/* Capital */}
                          <td style={{ padding: '16px 18px' }}>
                            <span style={{ backgroundColor: '#eaf4f4', color: '#006d77', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.76rem' }}>
                              {lead.investmentCapacity}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '16px 18px' }}>
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                              style={{
                                ...badgeStyle,
                                padding: '5px 10px',
                                borderRadius: '8px',
                                fontWeight: 800,
                                fontSize: '0.76rem',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              {statusOptions.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>

                          {/* Date */}
                          <td style={{ padding: '16px 18px', color: '#7b4a22', fontSize: '0.78rem' }}>
                            {lead.date}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => sendWhatsAppFollowup(lead)}
                                title="Send official Franchise Follow-up WhatsApp"
                                style={{
                                  backgroundColor: '#e8f5e9',
                                  border: '1px solid #c8e6c9',
                                  color: '#2e7d32',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700
                                }}
                              >
                                <MessageSquare size={13} /> WhatsApp
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeadForNotes(lead);
                                  setNoteDraft(lead.notes || '');
                                }}
                                title="Edit Internal Notes"
                                style={{
                                  backgroundColor: '#f6ebd9',
                                  border: '1px solid #d4985b',
                                  color: '#5c3518',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '0.76rem',
                                  fontWeight: 700
                                }}
                              >
                                Notes
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete lead record for ${lead.name}?`)) {
                                    onDeleteLead(lead.id);
                                  }
                                }}
                                title="Delete Lead"
                                style={{
                                  backgroundColor: '#fff1f2',
                                  border: '1px solid #ffe4e6',
                                  color: '#e11d48',
                                  padding: '6px',
                                  borderRadius: '8px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#7b4a22' }}>
                          No franchise inquiries found matching current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 2: 8-TAP LIVE DISPENSARY OPERATIONS
             ========================================================== */}
          {activeTab === 'dispensary' && (
            <div>
              {/* Dispensary Status Summary Banner */}
              <div 
                style={{
                  backgroundColor: '#1f1207',
                  borderRadius: '18px',
                  padding: '24px',
                  color: '#ffffff',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: '2px solid #b87b43'
                }}
              >
                <div>
                  <span style={{ backgroundColor: '#2b9348', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    AUTOMATED 8-TAP FOUNTAIN MANIFOLD
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, margin: '8px 0 4px 0' }}>
                    Central Beverage Chiller & CO2 Pressure Station
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#e8c49a' }}>
                    Calibrated for 100% glass-to-glass taste identity across all Pune, Kolhapur, Solapur & Mumbai outlets.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#ffea79', fontWeight: 700 }}>CO2 CYLINDER</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#06d6a0' }}>95 PSI</div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#ffea79', fontWeight: 700 }}>CHILLING BATH</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#90e0ef' }}>2.6°C</div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#ffea79', fontWeight: 700 }}>TOTAL DISPENSED</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffb703' }}>{dispenseCountToday} Cups</div>
                  </div>
                </div>
              </div>

              {/* 8 Tap Station Grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '18px'
                }}
              >
                {taps.map((tap) => (
                  <div
                    key={tap.tapNum}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1.5px solid #ede4d5',
                      padding: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ backgroundColor: '#271407', color: '#ffea79', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px' }}>
                          TAP #{tap.tapNum}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#2b9348', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2b9348' }} />
                          {tap.status}
                        </span>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#271407', margin: '0 0 4px 0' }}>
                        {tap.flavor}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#7b4a22' }}>
                        Line Category: {tap.category}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '14px', padding: '10px', backgroundColor: '#fdfbf7', borderRadius: '10px' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#9c6332', display: 'block' }}>Line Temp</span>
                          <strong style={{ fontSize: '0.88rem', color: '#271407' }}>{tap.temp}</strong>
                        </div>
                        <div style={{ borderLeft: '1px solid #ede4d5', paddingLeft: '12px' }}>
                          <span style={{ fontSize: '0.68rem', color: '#9c6332', display: 'block' }}>Pressure</span>
                          <strong style={{ fontSize: '0.88rem', color: '#271407' }}>{tap.psi} PSI</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => handleSimulateDispense(tap)}
                        style={{
                          width: '100%',
                          backgroundColor: '#f6ebd9',
                          color: '#3b2210',
                          border: '1.5px solid #d4985b',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Plus size={15} /> Simulate Counter Dispense
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 3: 25+ SYRUP INVENTORY & FACTORY SUPPLY CHAIN
             ========================================================== */}
          {activeTab === 'inventory' && (
            <div>
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '18px', 
                  padding: '20px 24px', 
                  border: '1px solid #ede4d5', 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#271407', margin: 0 }}>
                    Proprietary Handcrafted Syrups (25+ Varieties)
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#7b4a22' }}>
                    Manufactured at Himmat Beverages Central Processing Facility. Direct franchisee dispatch.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ backgroundColor: '#e8f5e9', color: '#1b5e20', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                    Standard Batch: 25 Litres
                  </span>
                  <span style={{ backgroundColor: '#fff3e0', color: '#e65100', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                    Yield: 28-30 Cups / Litre
                  </span>
                </div>
              </div>

              {/* Syrups Inventory Grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '18px'
                }}
              >
                {SYRUPS.map((syrup) => {
                  const stock = syrupStocks[syrup.id] !== undefined ? syrupStocks[syrup.id] : 20;
                  const isLow = stock < 10;
                  return (
                    <div
                      key={syrup.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: isLow ? '2px solid #ffccd5' : '1px solid #ede4d5',
                        padding: '18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#7b4a22', fontWeight: 700 }}>{syrup.category}</span>
                          {isLow ? (
                            <span style={{ backgroundColor: '#ffe3e3', color: '#d90429', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                              LOW STOCK
                            </span>
                          ) : (
                            <span style={{ backgroundColor: '#e8f5e9', color: '#2b9348', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                              IN STOCK
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <img 
                            src={syrup.image} 
                            alt={syrup.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                          <div>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: '#271407', margin: 0 }}>
                              {syrup.name}
                            </h3>
                            <span style={{ fontSize: '0.72rem', color: '#9c6332' }}>
                              Batch Ref: HB-SYR-26
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fdfbf7', borderRadius: '10px', marginBottom: '14px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#7b4a22', display: 'block' }}>Store Stock</span>
                            <strong style={{ fontSize: '1.05rem', color: isLow ? '#d90429' : '#271407' }}>
                              {stock} Litres
                            </strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.7rem', color: '#7b4a22', display: 'block' }}>Potential Cups</span>
                            <strong style={{ fontSize: '1.05rem', color: '#2b9348' }}>
                              {stock * 28} Cups
                            </strong>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReorderSyrup(syrup)}
                        style={{
                          width: '100%',
                          backgroundColor: isLow ? '#d90429' : '#ffffff',
                          color: isLow ? '#ffffff' : '#5c3518',
                          border: isLow ? 'none' : '1.5px solid #d4985b',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <RefreshCw size={14} /> Reorder 25L Batch from Factory
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 4: FRANCHISE ROI & FINANCIAL SIMULATOR
             ========================================================== */}
          {activeTab === 'roi' && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {/* Left Column: Interactive Sliders */}
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '1px solid #ede4d5',
                  boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)'
                }}
              >
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#271407', marginBottom: '6px' }}>
                  Franchise Model & Variables
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#7b4a22', marginBottom: '24px' }}>
                  Simulate daily counter footfalls and calculate monthly franchisee profits.
                </p>

                {/* Model Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '10px' }}>
                    1. Select Turnkey Outlet Format:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { key: 'Kiosk', label: 'Express Kiosk', capex: '₹14-15L' },
                      { key: 'Lounge', label: 'Premium Lounge', capex: '₹22-25L' },
                      { key: 'Mall', label: 'Mall Island', capex: '₹30-32L' }
                    ].map(m => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setRoiModel(m.key)}
                        style={{
                          backgroundColor: roiModel === m.key ? '#271407' : '#fdfbf7',
                          color: roiModel === m.key ? '#ffea79' : '#3b2210',
                          border: roiModel === m.key ? '2px solid #ffb703' : '1px solid #ede4d5',
                          borderRadius: '10px',
                          padding: '12px 8px',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{m.label}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '2px' }}>{m.capex}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider: Daily Cups */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#271407' }}>
                      2. Average Cups Dispensed Daily:
                    </label>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d90429', fontFamily: 'var(--font-heading)' }}>
                      {cupsPerDay} cups/day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={900}
                    step={20}
                    value={cupsPerDay}
                    onChange={(e) => setCupsPerDay(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#d90429' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9c6332', marginTop: '4px' }}>
                    <span>120 (Quiet Locality)</span>
                    <span>500 (Moderate Footfall)</span>
                    <span>900 (High Transit Metro)</span>
                  </div>
                </div>

                {/* Slider: Average Price per Cup */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#271407' }}>
                      3. Average Selling Price (ASP):
                    </label>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2b9348', fontFamily: 'var(--font-heading)' }}>
                      ₹{avgCupPrice} / cup
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[20, 25, 30, 40, 50].map(price => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setAvgCupPrice(price)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          border: avgCupPrice === price ? '2px solid #2b9348' : '1px solid #ede4d5',
                          backgroundColor: avgCupPrice === price ? '#e8f5e9' : '#ffffff',
                          color: avgCupPrice === price ? '#1b5e20' : '#271407',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        ₹{price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Breakdown Output */}
              <div 
                style={{
                  backgroundColor: '#1f1207',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '2px solid #b87b43',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ backgroundColor: 'rgba(255, 183, 3, 0.2)', color: '#ffea79', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                      PROJECTED MONTHLY P&L
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#e8c49a' }}>30-Day Operational Cycle</span>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(212, 152, 91, 0.25)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.82rem', color: '#e8c49a' }}>Estimated Monthly Gross Revenue</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffea79', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                      ₹{calculatedMonthlyRevenue.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e8c49a' }}>
                      <span>Raw Material (Syrup concentrate, CO2, cup):</span>
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>- ₹{syrupCo2Cost.toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e8c49a' }}>
                      <span>Staff & Store Rent:</span>
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>- ₹{estRentStaff.toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#06d6a0', fontWeight: 800, borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '10px', marginTop: '6px' }}>
                      <span>Projected Net Monthly Profit:</span>
                      <span style={{ fontSize: '1.2rem' }}>₹{netMonthlyProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(212, 152, 91, 0.3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#e8c49a' }}>Payback Period</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffb703', fontFamily: 'var(--font-heading)' }}>
                        {paybackMonths} Months
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#e8c49a' }}>Annualized ROI</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#06d6a0', fontFamily: 'var(--font-heading)' }}>
                        {annualRoiPercent}% / yr
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 5: CUSTOMER REVIEWS & BROADCAST ANNOUNCEMENTS
             ========================================================== */}
          {activeTab === 'broadcasts' && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {/* Broadcast Composer */}
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '1px solid #ede4d5',
                  boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Radio size={20} color="#d90429" />
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#271407', margin: 0 }}>
                    Live Customer Announcement Banner
                  </h2>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#7b4a22', marginBottom: '18px' }}>
                  Broadcast flash discounts, holiday hours, or seasonal mocktail launches directly onto the Customer Lounge & public store marquee.
                </p>

                <form onSubmit={handleSaveBroadcast}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#271407', marginBottom: '6px' }}>
                      Current Broadcast Message:
                    </label>
                    <textarea
                      rows={4}
                      value={broadcastDraft}
                      onChange={(e) => setBroadcastDraft(e.target.value)}
                      placeholder="e.g. Summer Special: Buy any 2 sodas, get 1 Kokum Masala FREE this weekend!"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1.5px solid #ede4d5',
                        fontSize: '0.86rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'vertical',
                        backgroundColor: '#fdfbf7'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#d90429',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Send size={15} /> Publish Live Broadcast
                    </button>

                    {broadcastSavedNotice && (
                      <span style={{ fontSize: '0.78rem', color: '#2b9348', fontWeight: 800 }}>
                        ✓ Published to Customer Lounge!
                      </span>
                    )}
                  </div>
                </form>

                {/* Live Preview Box */}
                <div style={{ marginTop: '24px', padding: '14px', backgroundColor: '#fdfbf7', border: '1px dashed #d4985b', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9c6332', fontWeight: 800, textTransform: 'uppercase' }}>
                    Customer View Preview:
                  </span>
                  <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#271407', fontWeight: 600 }}>
                    📢 {broadcastDraft}
                  </div>
                </div>
              </div>

              {/* Customer Reviews Feed */}
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '1px solid #ede4d5',
                  boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)'
                }}
              >
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#271407', marginBottom: '6px' }}>
                  Customer Reviews & Drink Feedback ({customerReviews.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#7b4a22', marginBottom: '18px' }}>
                  Real-time drink satisfaction ratings submitted by customers from their VIP Soda Pass.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
                  {customerReviews.map((rev, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #f2ede4',
                        backgroundColor: '#fdfbf7'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#271407' }}>
                          {rev.customerName || 'Customer'}
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(st => (
                            <Star 
                              key={st} 
                              size={13} 
                              fill={st <= (rev.rating || 5) ? '#ffb703' : 'none'} 
                              color={st <= (rev.rating || 5) ? '#ffb703' : '#ccc'} 
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#d90429', fontWeight: 700, marginBottom: '4px' }}>
                        Drink: {rev.drinkChoice || 'Craft Soda'} • Fizz Rating: {rev.fizzLevel || 'Extra Fizzy'}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#5c3518', margin: 0, fontStyle: 'italic' }}>
                        "{rev.comment || 'Amazing carbonation and authentic taste!'}"
                      </p>

                      <div style={{ fontSize: '0.7rem', color: '#9c8e84', marginTop: '6px' }}>
                        {rev.date || 'Recent Visit'}
                      </div>
                    </div>
                  ))}

                  {customerReviews.length === 0 && (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#7b4a22', fontSize: '0.86rem' }}>
                      No new customer reviews submitted yet today.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================================
          MODAL 1: ADD FRANCHISE LEAD MANUALLY
         ========================================================== */}
      {showAddLeadModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: '#271407', margin: '0 0 6px 0' }}>
              Log New Franchise Application
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#7b4a22', marginBottom: '20px' }}>
              Add a candidate met via telephone inquiry, expos, or direct store walk-in.
            </p>

            <form onSubmit={handleCreateManualLead} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+91 98..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                    Proposed City / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    placeholder="e.g. Kolhapur"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="name@gmail.com"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                    Market Tier
                  </label>
                  <select
                    value={newLeadForm.tier}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, tier: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.82rem' }}
                  >
                    <option value="Tier 1 Metros">Tier 1 Metros</option>
                    <option value="Tier 2 & 3 Cities">Tier 2 & 3 Cities</option>
                    <option value="Townships & Highway">Townships & Highway</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                    Investment Range
                  </label>
                  <select
                    value={newLeadForm.investmentCapacity}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, investmentCapacity: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.82rem' }}
                  >
                    <option value="₹12L - ₹15L">₹12L - ₹15L (Kiosk)</option>
                    <option value="₹15L - ₹25L">₹15L - ₹25L (Lounge)</option>
                    <option value="₹25L - ₹35L">₹25L - ₹35L (Mall Island)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#271407', marginBottom: '4px' }}>
                  Internal Evaluation Notes
                </label>
                <textarea
                  rows={2}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Prime commercial location notes, current business background..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #ede4d5', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #ede4d5', backgroundColor: '#fdfbf7', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#d90429', color: '#ffffff', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL 2: INTERNAL LEAD NOTES
         ========================================================== */}
      {selectedLeadForNotes && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 900, color: '#271407', margin: '0 0 4px 0' }}>
              Notes for {selectedLeadForNotes.name}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#7b4a22', marginBottom: '16px' }}>
              {selectedLeadForNotes.city} • {selectedLeadForNotes.phone}
            </p>

            <textarea
              rows={4}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Record location feasibility, site visit date, partner background..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #ede4d5',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                outline: 'none',
                marginBottom: '16px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedLeadForNotes(null)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ede4d5', backgroundColor: '#fdfbf7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(selectedLeadForNotes.id, selectedLeadForNotes.status);
                  selectedLeadForNotes.notes = noteDraft;
                  setSelectedLeadForNotes(null);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#d90429', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
