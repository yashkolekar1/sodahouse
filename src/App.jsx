import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedDrinks from './components/FeaturedDrinks';
import AboutHimmat from './components/AboutHimmat';
import SyrupShowcase from './components/SyrupShowcase';
import FranchiseSection from './components/FranchiseSection';
import GallerySection from './components/GallerySection';
import ContactEnquiry from './components/ContactEnquiry';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';

// Distinct Dashboards and Authentication Portals
import CustomerLoginModal from './components/CustomerLoginModal';
import CustomerLoginPage from './components/CustomerLoginPage';
import CustomerDashboardView from './components/CustomerDashboardView';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardView from './components/AdminDashboardView';

import { INITIAL_LEADS, SYRUPS } from './data/sodaData';

export default function App() {
  const mixerRef = useRef(null);

  // Parse view from URL Hash ('site' | 'customer' | 'admin' | 'admin-login')
  const getViewFromHash = () => {
    if (typeof window === 'undefined') return 'site';
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('admin/login') || hash.includes('admin-login')) return 'admin-login';
    if (hash.includes('admin') || hash.includes('owner')) return 'admin';
    if (hash.includes('dashboard') || hash.includes('customer')) return 'customer';
    return 'site';
  };

  const [currentView, setCurrentView] = useState(getViewFromHash);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      if (hash.includes('admin') || hash.includes('owner')) {
        const storedAdmin = localStorage.getItem('daddy_admin_user');
        if (storedAdmin) return JSON.parse(storedAdmin);
      }
      const storedCustomer = localStorage.getItem('daddy_soda_user');
      if (storedCustomer) return JSON.parse(storedCustomer);

      const storedAdmin = localStorage.getItem('daddy_admin_user');
      if (storedAdmin) return JSON.parse(storedAdmin);
    } catch (e) {
      console.error('Error reading stored user session:', e);
    }
    return null;
  });

  // Synchronize view state with hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const newView = getViewFromHash();
      setCurrentView(newView);

      // Re-read current user if role context might have changed
      try {
        if (newView === 'admin') {
          const storedAdmin = localStorage.getItem('daddy_admin_user');
          if (storedAdmin) setCurrentUser(JSON.parse(storedAdmin));
        } else if (newView === 'customer') {
          const storedCustomer = localStorage.getItem('daddy_soda_user');
          if (storedCustomer) setCurrentUser(JSON.parse(storedCustomer));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'customer') {
      window.location.hash = '#/dashboard';
    } else if (view === 'admin') {
      window.location.hash = '#/admin';
    } else if (view === 'admin-login') {
      window.location.hash = '#/admin/login';
    } else {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customer Login Handler (supports remaining on homepage with active session)
  const handleCustomerLoginSuccess = (user, shouldNavigate = false) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('daddy_soda_user', JSON.stringify(user));
      localStorage.setItem('daddy_soda_token', 'token_cust_' + Date.now());
    } catch (e) {
      console.error('Error storing customer user:', e);
    }
    setIsCustomerLoginOpen(false);
    if (shouldNavigate) {
      navigateTo('customer');
    }
  };

  // Admin Dedicated Login Handler (supports remaining on homepage with active session)
  const handleAdminLoginSuccess = (user, shouldNavigate = false) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('daddy_admin_user', JSON.stringify(user));
      localStorage.setItem('daddy_admin_token', 'token_admin_' + Date.now());
    } catch (e) {
      console.error('Error storing admin user:', e);
    }
    setIsCustomerLoginOpen(false);
    if (shouldNavigate) {
      navigateTo('admin');
    }
  };

  // Global Sign Out Handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('daddy_soda_user');
      localStorage.removeItem('daddy_soda_token');
      localStorage.removeItem('daddy_admin_user');
      localStorage.removeItem('daddy_admin_token');
      sessionStorage.removeItem('daddy_soda_owner_authed');
    } catch (e) {
      console.error('Error clearing session:', e);
    }
    navigateTo('site');
  };

  // Initialize franchise leads state
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem('daddy_soda_leads');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LEADS;
  });

  // Customer favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('daddy_soda_favorites');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ['blue-curacao', 'jeera-masala', 'kokum'];
  });

  // Customer saved concoctions
  const [savedMixes, setSavedMixes] = useState(() => {
    try {
      const stored = localStorage.getItem('daddy_soda_saved_mixes');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'MIX-DEMO-1',
        name: 'Curacao Masala Sparkler',
        base: 'Chilled Sparkling Soda',
        syrups: [SYRUPS[0], SYRUPS[18]],
        toppings: ['Muddled Mint & Lemon', 'Crushed Ice'],
        date: '2026-09-22'
      }
    ];
  });

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('daddy_soda_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Section scroll reveal animation for public site
  useEffect(() => {
    if (currentView !== 'site') return;

    const sections = Array.from(document.querySelectorAll('main > section'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((section) => {
      section.classList.add('section-reveal');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const handleSaveLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleToggleFavorite = (syrupId) => {
    setFavorites((prev) =>
      prev.includes(syrupId) ? prev.filter((id) => id !== syrupId) : [...prev, syrupId]
    );
  };

  const handleSaveMix = (newMix) => {
    setSavedMixes((prev) => [newMix, ...prev]);
  };

  const scrollToMixer = () => {
    const el = document.getElementById('syrups');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================================================
  // VIEW 1: DEDICATED ADMIN LOGIN (/admin/login)
  // ==========================================================================
  if (currentView === 'admin-login') {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSite={() => navigateTo('site')}
        onSwitchToCustomer={() => navigateTo('customer')}
      />
    );
  }

  // ==========================================================================
  // VIEW 2: DEDICATED ADMIN DASHBOARD (/admin or /admin/dashboard)
  // Protected with Role-Based Access Control: shows Admin Login if not authenticated
  // ==========================================================================
  if (currentView === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={() => navigateTo('site')}
          onSwitchToCustomer={() => navigateTo('customer')}
        />
      );
    }

    return (
      <AdminDashboardView
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToSite={() => navigateTo('site')}
      />
    );
  }

  // ==========================================================================
  // VIEW 3: DEDICATED CUSTOMER DASHBOARD (/dashboard or /customer)
  // Protected with Customer Login: without login, looks like clean Customer Login
  // ==========================================================================
  if (currentView === 'customer') {
    if (!currentUser || currentUser.role !== 'customer') {
      return (
        <CustomerLoginPage
          onLoginSuccess={handleCustomerLoginSuccess}
          onBackToSite={() => navigateTo('site')}
          onSwitchToAdmin={() => navigateTo('admin-login')}
        />
      );
    }

    return (
      <CustomerDashboardView
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToSite={() => navigateTo('site')}
      />
    );
  }

  // ==========================================================================
  // VIEW 4: PUBLIC MARKETING WEBSITE (Accessible to everyone)
  // Preserves 50+ yr legacy, brand colors, images, products, and franchise info
  // Strictly Customer Login only in public navbar
  // ==========================================================================
  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Public Floating Navigation Bar */}
      <Navbar 
        onOpenLogin={(role) => {
          if (role === 'admin') navigateTo('admin-login');
          else setIsCustomerLoginOpen(true);
        }}
        onOpenCustomer={() => {
          if (currentUser?.role === 'customer') navigateTo('customer');
          else setIsCustomerLoginOpen(true);
        }}
        customerBadgeCount={favorites.length + savedMixes.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main style={{ flex: 1 }}>
        <Hero onOpenDrinkMixer={scrollToMixer} />
        <FeaturedDrinks />
        <SyrupShowcase 
          mixerRef={mixerRef}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSaveMix={handleSaveMix}
          onOpenCustomer={() => {
            if (currentUser?.role === 'customer') navigateTo('customer');
            else setIsCustomerLoginOpen(true);
          }}
        />
        <AboutHimmat />
        <FranchiseSection onOpenEnquiry={() => {
          const contactEl = document.getElementById('contact');
          if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
        }} />
        <GallerySection />
        <ContactEnquiry onSaveLead={handleSaveLead} />
      </main>

      {/* Footer with Subtle Admin Portal Link */}
      <Footer 
        onOpenCustomer={() => {
          if (currentUser?.role === 'customer') navigateTo('customer');
          else setIsCustomerLoginOpen(true);
        }}
      />

      {/* WhatsApp Floating Floating Widget */}
      <WhatsAppWidget />

      {/* Simple Email & Password Login Modal (Customer & Admin) */}
      <CustomerLoginModal
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLoginSuccess={(user, role) => {
          if (role === 'admin' || user.role === 'admin') {
            handleAdminLoginSuccess(user);
          } else {
            handleCustomerLoginSuccess(user);
          }
        }}
      />
    </div>
  );
}
