import React, { useState, useMemo } from 'react';
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
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LayoutDashboard,
  Users,
  BarChart3,
  Coffee,
  Database,
  Sparkles,
  MapPin,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { BRAND_INFO, SYRUPS } from '../data/sodaData';

export default function AdminDashboard({ 
  onBackToSite,
  onSwitchToCustomer,
  leads = [], 
  onUpdateStatus, 
  onDeleteLead, 
  onResetDemoData 
}) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'analytics' | 'syrups'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState(null);

  const statusOptions = ['New', 'In Discussion', 'Site Evaluation', 'Agreement Signed', 'Closed'];

  // Filtered Leads
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

    // Approximate investment pipeline estimation
    const totalEstValue = leads.reduce((acc, lead) => {
      if (lead.investmentCapacity && lead.investmentCapacity.includes('30')) return acc + 28;
      if (lead.investmentCapacity && lead.investmentCapacity.includes('20')) return acc + 18;
      if (lead.investmentCapacity && lead.investmentCapacity.includes('15')) return acc + 12;
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
      `Hello ${lead.name}, this is the Franchise Desk at Himmat Beverages Pvt. Ltd. (S Daddy Soda House). We received your inquiry for the ${lead.tier} in ${lead.city}. When is a good time for a brief discussion regarding location feasibility and turnkey setup?`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="admin-dashboard-page">
      {/* ==========================================================
          LEFT ENTERPRISE SIDEBAR
         ========================================================== */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(212, 152, 91, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img 
              src="/images/logo_perfect.png" 
              alt="Daddy Soda Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                HIMMAT BEVERAGES
              </div>
              <div style={{ fontSize: '0.68rem', color: '#e8c49a', letterSpacing: '0.04em' }}>
                Executive Franchise Portal
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <span style={{ backgroundColor: 'rgba(212, 152, 91, 0.2)', color: '#ffea79', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
              EST. 1973
            </span>
            <span style={{ fontSize: '0.7rem', color: '#e8c49a' }}>
              • Live Operations Console
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`admin-nav-item ${activeTab === 'pipeline' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span style={{ flex: 1 }}>Franchise Pipeline</span>
            <span 
              style={{
                backgroundColor: activeTab === 'pipeline' ? '#ffb703' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'pipeline' ? '#271407' : '#ffffff',
                padding: '1px 7px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span style={{ flex: 1 }}>Pipeline KPIs & Capital</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('syrups')}
            className={`admin-nav-item ${activeTab === 'syrups' ? 'active' : ''}`}
          >
            <Coffee size={18} />
            <span style={{ flex: 1 }}>25+ Syrups & Dispensers</span>
          </button>

          <div style={{ margin: '16px 0 8px 0', borderTop: '1px solid rgba(212, 152, 91, 0.15)' }} />

          {/* Quick Tools in Sidebar */}
          <button
            type="button"
            onClick={exportToCSV}
            className="admin-nav-item"
            style={{ fontSize: '0.84rem' }}
          >
            <FileSpreadsheet size={16} color="#06d6a0" />
            <span>Export CSV Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset franchise leads to original demo dataset?')) {
                onResetDemoData();
              }
            }}
            className="admin-nav-item"
            style={{ fontSize: '0.84rem', color: '#ffccd5' }}
          >
            <RefreshCw size={16} />
            <span>Reset Demo Leads</span>
          </button>
        </div>

        {/* Sidebar Footer Shortcuts */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(212, 152, 91, 0.2)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
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
              marginBottom: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <ArrowLeft size={16} /> Return to Store
          </button>

          {onSwitchToCustomer && (
            <button
              type="button"
              onClick={onSwitchToCustomer}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
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
                gap: '6px'
              }}
            >
              <Sparkles size={14} /> Open Customer Lounge
            </button>
          )}

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.7rem', color: '#9c8e84' }}>
            Logged in: <strong style={{ color: '#ffffff' }}>Himmat Mgmt</strong>
          </div>
        </div>
      </aside>

      {/* ==========================================================
          MAIN ADMIN CONSOLE CONTENT AREA
         ========================================================== */}
      <main className="admin-main-content">
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
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, color: '#271407', margin: 0 }}>
              {activeTab === 'pipeline' && 'Franchise Inquiries & Lead Operations'}
              {activeTab === 'analytics' && 'Executive KPIs & Investment Pipeline'}
              {activeTab === 'syrups' && '25+ Gourmet Syrups & Fountain Dispenser Fleet'}
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#7b4a22' }}>
              Himmat Beverages Pvt. Ltd. • Turnkey Commercial Soda Franchise Desk
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={exportToCSV}
              style={{
                backgroundColor: '#fdfbf7',
                border: '1.5px solid #d4985b',
                color: '#271407',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} color="#d90429" /> Export Leads CSV
            </button>

            <div 
              style={{
                backgroundColor: '#e8f5e9',
                color: '#1b5e20',
                border: '1px solid #c8e6c9',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2e7d32' }} />
              Active System Live
            </div>
          </div>
        </header>

        {/* Console Body Area */}
        <div style={{ padding: '28px', flex: 1 }}>
          
          {/* Executive KPI Metric Tiles */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '18px', 
              marginBottom: '28px' 
            }}
          >
            {/* KPI 1: Total Leads */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #ede4d5', boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Inquiries
                </span>
                {kpiStats.newCount > 0 && (
                  <span style={{ backgroundColor: '#ffe3e3', color: '#d90429', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '999px', fontWeight: 800 }}>
                    {kpiStats.newCount} NEW
                  </span>
                )}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#271407' }}>
                {kpiStats.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9c8e84', marginTop: '4px' }}>
                From Maharashtra & Pan-India
              </div>
            </div>

            {/* KPI 2: Estimated Pipeline Capital */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #ede4d5', boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Est. Pipeline Capital
                </span>
                <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '999px', fontWeight: 800 }}>
                  ₹ LAKHS
                </span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#2b9348' }}>
                ₹{kpiStats.totalEstLakhs} L
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9c8e84', marginTop: '4px' }}>
                Average ₹15L – ₹28L per setup
              </div>
            </div>

            {/* KPI 3: Active Discussions & Evaluations */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #ede4d5', boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Feasibility
                </span>
                <Clock size={16} color="#e65100" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#e65100' }}>
                {kpiStats.activePipeline}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9c8e84', marginTop: '4px' }}>
                In Discussion / Site Evaluation
              </div>
            </div>

            {/* KPI 4: Signed Agreements */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #ede4d5', boxShadow: '0 4px 14px rgba(39, 20, 7, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#7b4a22', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Agreements Signed
                </span>
                <CheckCircle2 size={16} color="#0d47a1" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#0d47a1' }}>
                {kpiStats.signedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9c8e84', marginTop: '4px' }}>
                Turnkey Outlets in Rollout
              </div>
            </div>
          </div>

          {/* ==========================================================
              TAB 1: FRANCHISE PIPELINE TABLE
             ========================================================== */}
          {activeTab === 'pipeline' && (
            <div>
              {/* Search & Filter Bar */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '18px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Search Box */}
                <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 300px' }}>
                  <Search size={16} color="#9c8e84" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search leads by name, city, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #ede4d5',
                      backgroundColor: '#ffffff',
                      fontSize: '0.88rem',
                      color: '#271407',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9c8e84',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7b4a22', textTransform: 'uppercase', marginRight: '4px' }}>
                    Status:
                  </span>
                  {['All', ...statusOptions].map((status) => {
                    const count = status === 'All' ? leads.length : leads.filter(l => l.status === status).length;
                    const isActive = statusFilter === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isActive ? '1.5px solid #271407' : '1px solid #ede4d5',
                          backgroundColor: isActive ? '#271407' : '#ffffff',
                          color: isActive ? '#ffffff' : '#5c3518',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? 800 : 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{status}</span>
                        <span 
                          style={{
                            backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f2ece2',
                            color: isActive ? '#ffffff' : '#7b4a22',
                            padding: '1px 5px',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 800
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CRM Data Table */}
              <div className="admin-table-container">
                {filteredLeads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7b4a22' }}>
                    <Search size={36} color="#d4985b" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#271407' }}>No matching leads found</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                      Try adjusting your search criteria or clear the status filter.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-crm-table">
                      <thead>
                        <tr>
                          <th>Lead ID & Date</th>
                          <th>Inquirer & Location</th>
                          <th>Model & Investment</th>
                          <th>Quick Communication</th>
                          <th>Franchise Status</th>
                          <th>Inquiry Notes</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => {
                          const statusStyle = getStatusBadgeStyle(lead.status);
                          return (
                            <tr key={lead.id}>
                              {/* Col 1: ID & Date */}
                              <td>
                                <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#271407' }}>
                                  {lead.id}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#9c8e84', marginTop: '2px' }}>
                                  {lead.date}
                                </div>
                              </td>

                              {/* Col 2: Inquirer & City */}
                              <td>
                                <div style={{ fontWeight: 800, color: '#271407', fontSize: '0.94rem' }}>
                                  {lead.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#7b4a22', marginTop: '2px' }}>
                                  <MapPin size={12} /> {lead.city}
                                </div>
                              </td>

                              {/* Col 3: Model & Investment */}
                              <td>
                                <div style={{ fontWeight: 700, color: '#5c3518', fontSize: '0.82rem' }}>
                                  {lead.tier}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#2b9348', fontWeight: 800, marginTop: '2px' }}>
                                  Budget: {lead.investmentCapacity}
                                </div>
                              </td>

                              {/* Col 4: Quick Contact Shortcuts */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <a
                                    href={`tel:${lead.phone}`}
                                    title={`Call ${lead.phone}`}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      backgroundColor: '#fdfbf7',
                                      border: '1px solid #d4985b',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#271407',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <Phone size={14} />
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => sendWhatsAppFollowup(lead)}
                                    title="Send WhatsApp Message"
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      backgroundColor: '#2b9348',
                                      border: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#ffffff',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <MessageSquare size={14} />
                                  </button>

                                  {lead.email && (
                                    <a
                                      href={`mailto:${lead.email}?subject=Regarding your S Daddy Soda Franchise Inquiry`}
                                      title={`Email ${lead.email}`}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: '#fdfbf7',
                                        border: '1px solid #ede4d5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#d90429',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      <Mail size={14} />
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Col 5: Status Dropdown */}
                              <td>
                                <select
                                  value={lead.status}
                                  onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                                  style={{
                                    ...statusStyle,
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontWeight: 800,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontFamily: 'var(--font-body)',
                                  }}
                                >
                                  {statusOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Col 6: Notes Preview */}
                              <td style={{ maxWidth: '240px' }}>
                                <div 
                                  style={{
                                    fontSize: '0.78rem',
                                    color: '#6b5c52',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    cursor: 'pointer',
                                  }}
                                  title={lead.notes || 'No notes available. Click to read.'}
                                  onClick={() => setSelectedLeadForNotes(lead)}
                                >
                                  {lead.notes || <em style={{ color: '#b87b43' }}>No notes provided</em>}
                                </div>
                              </td>

                              {/* Col 7: Delete */}
                              <td>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete lead ${lead.id} (${lead.name})?`)) {
                                      onDeleteLead(lead.id);
                                    }
                                  }}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#b87b43',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    transition: 'color 0.2s ease',
                                  }}
                                  title="Delete lead"
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#d90429')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = '#b87b43')}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 2: EXECUTIVE ANALYTICS & CAPITAL
             ========================================================== */}
          {activeTab === 'analytics' && (
            <div>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
                  gap: '24px' 
                }}
              >
                {/* Territory Breakdown */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #ede4d5' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', margin: '0 0 16px 0' }}>
                    Geographic Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { city: 'Pune & PCMC', leads: 4, share: 45 },
                      { city: 'Solapur & Sangli', leads: 3, share: 30 },
                      { city: 'Kolhapur Heritage Belt', leads: 2, share: 15 },
                      { city: 'Mumbai & Thane', leads: 2, share: 10 },
                    ].map((row, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: '#271407' }}>{row.city}</span>
                          <span style={{ color: '#7b4a22', fontWeight: 800 }}>{row.leads} inquiries ({row.share}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#f2ece2', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${row.share}%`, backgroundColor: '#271407', borderRadius: '999px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Capacity Spread */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #ede4d5' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#271407', margin: '0 0 16px 0' }}>
                    Investment Model Interest
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#271407' }}>Master Turnkey Soda Outlet</strong>
                        <span style={{ color: '#2b9348', fontWeight: 800, fontSize: '0.84rem' }}>₹25L – ₹30L</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#7b4a22' }}>
                        Full 8-valve dispenser counter, wooden interior, tasting station, dual cylinder system.
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#271407' }}>Compact Food Court Kiosk</strong>
                        <span style={{ color: '#2b9348', fontWeight: 800, fontSize: '0.84rem' }}>₹15L – ₹20L</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#7b4a22' }}>
                        Designed for high footfall malls, cinema corridors, and highway food courts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 3: SYRUPS FLEET & DISPENSER STATUS
             ========================================================== */}
          {activeTab === 'syrups' && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#271407' }}>
                    25+ Handcrafted Syrups & Fountain Formulations
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#7b4a22' }}>
                    Proprietary Himmat Beverages concentrates supplied to all authorized franchise counters.
                  </p>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#2b9348', fontWeight: 800, backgroundColor: '#e8f5e9', padding: '6px 12px', borderRadius: '8px' }}>
                  ✓ All 25 Recipes In Active Production
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {SYRUPS.map((syrup) => (
                  <div
                    key={syrup.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #ede4d5',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: '0 2px 8px rgba(39, 20, 7, 0.03)',
                    }}
                  >
                    <img
                      src={syrup.image || '/images/drinks/drink_cola.png'}
                      alt={syrup.name}
                      style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: '0.68rem', color: '#b87b43', fontWeight: 800, textTransform: 'uppercase' }}>
                        {syrup.tagline}
                      </span>
                      <h4 style={{ margin: '2px 0 4px 0', fontSize: '0.94rem', color: '#271407', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {syrup.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.7rem' }}>
                        <span style={{ backgroundColor: '#fdfbf7', border: '1px solid #ede4d5', padding: '1px 5px', borderRadius: '4px', color: '#5c3518' }}>
                          Batch: Active
                        </span>
                        <span style={{ backgroundColor: '#e8f5e9', padding: '1px 5px', borderRadius: '4px', color: '#2e7d32', fontWeight: 700 }}>
                          FSSAI
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Notes Modal Popover */}
      {selectedLeadForNotes && (
        <div 
          className="product-modal-backdrop"
          onClick={() => setSelectedLeadForNotes(null)}
          style={{ zIndex: 9999 }}
        >
          <div 
            className="product-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#271407' }}>
                Inquiry Details & Notes
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLeadForNotes(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#7b4a22' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#fdfbf7', borderRadius: '12px', padding: '16px', border: '1px solid #ede4d5', marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 800 }}>LEAD:</span>
                <div style={{ fontWeight: 800, color: '#271407' }}>
                  {selectedLeadForNotes.name} ({selectedLeadForNotes.id})
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 800 }}>LOCATION & MODEL:</span>
                <div style={{ color: '#271407', fontSize: '0.88rem' }}>
                  📍 {selectedLeadForNotes.city} • {selectedLeadForNotes.tier} ({selectedLeadForNotes.investmentCapacity})
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: '#7b4a22', fontWeight: 800 }}>APPLICANT NOTES:</span>
                <div style={{ color: '#271407', fontSize: '0.88rem', marginTop: '4px', lineHeight: 1.5 }}>
                  "{selectedLeadForNotes.notes || 'No custom notes provided.'}"
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  sendWhatsAppFollowup(selectedLeadForNotes);
                  setSelectedLeadForNotes(null);
                }}
                className="btn-accent-soda"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <MessageSquare size={16} /> Open WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
