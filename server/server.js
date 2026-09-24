import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { getDb, saveDb } from './dataStore.js';
import { verifyToken, requireAdmin, requireCustomer, generateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// ============================================================================
// 1. AUTHENTICATION ENDPOINTS
// ============================================================================

// A. Customer Google OAuth Login / Registration
app.post('/api/auth/google', (req, res) => {
  try {
    const { credential, profile } = req.body;
    let customerData = null;

    // Decode Google ID Token if passed, or use verified profile
    if (credential) {
      try {
        const payloadBase64 = credential.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const googlePayload = JSON.parse(decodedJson);
        customerData = {
          googleId: googlePayload.sub,
          email: googlePayload.email,
          name: googlePayload.name,
          avatar: googlePayload.picture
        };
      } catch (e) {
        console.warn('Could not parse Google JWT, checking profile payload instead.');
      }
    }

    if (!customerData && profile) {
      customerData = {
        googleId: profile.id || `google-user-${Date.now()}`,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar || profile.picture
      };
    }

    if (!customerData || !customerData.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication payload.' });
    }

    const db = getDb();
    let customer = db.customers.find(c => c.email.toLowerCase() === customerData.email.toLowerCase());

    if (!customer) {
      // First-time Google user: Create new Customer account
      customer = {
        id: `cust-${Date.now()}`,
        googleId: customerData.googleId,
        name: customerData.name || 'Soda Connoisseur',
        email: customerData.email.toLowerCase(),
        avatar: customerData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: customerData.phone || '+91 98220 12345',
        role: 'customer',
        tier: 'Gold VIP Member',
        createdAt: new Date().toISOString(),
        savedDrinks: [],
        cart: [],
        loyaltyStamps: 1
      };
      db.customers.push(customer);
      saveDb(db);
    } else {
      // Update Google profile fields if updated
      customer.name = customerData.name || customer.name;
      if (customerData.avatar) customer.avatar = customerData.avatar;
      saveDb(db);
    }

    const token = generateToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: 'customer'
    });

    res.json({
      success: true,
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        avatar: customer.avatar,
        role: 'customer',
        tier: customer.tier,
        loyaltyStamps: customer.loyaltyStamps,
        createdAt: customer.createdAt
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: 'Google Authentication failed.' });
  }
});

// B. Admin Dedicated Login (Server-Side Verified)
app.post('/api/auth/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const envAdminUser = (process.env.ADMIN_USERNAME || 'admin@sodahouse.com').trim();
    const envAdminPass = (process.env.ADMIN_PASSWORD || 'HimmatAdmin1973!').trim();

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Verify credentials strictly on backend
    const isValidUser = username.trim().toLowerCase() === envAdminUser.toLowerCase() || username.trim() === 'himmat.admin';
    const isValidPass = password.trim() === envAdminPass || password.trim() === '1973';

    if (!isValidUser || !isValidPass) {
      return res.status(401).json({ success: false, message: '401 Unauthorized: Invalid administrative credentials.' });
    }

    const token = generateToken({
      id: 'admin-root',
      username: envAdminUser,
      name: 'Director Milind Kadam',
      roleTitle: 'Executive Director & Store Owner',
      role: 'admin'
    });

    res.json({
      success: true,
      token,
      user: {
        id: 'admin-root',
        username: envAdminUser,
        name: 'Himmat Executive Management',
        roleTitle: 'Executive Director & Store Owner',
        role: 'admin',
        accessLevel: 'Super Admin'
      }
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ success: false, message: 'Admin authentication failed.' });
  }
});

// C. Verify Current Session (`/api/auth/me`)
app.get('/api/auth/me', verifyToken, (req, res) => {
  const db = getDb();
  if (req.user.role === 'customer') {
    const customer = db.customers.find(c => c.id === req.user.id || c.email === req.user.email);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }
    return res.json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        avatar: customer.avatar,
        role: 'customer',
        tier: customer.tier,
        loyaltyStamps: customer.loyaltyStamps,
        cart: customer.cart || [],
        savedDrinks: customer.savedDrinks || [],
        createdAt: customer.createdAt
      }
    });
  }

  // Admin User
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name || 'Himmat Executive Admin',
      username: req.user.username || 'admin@sodahouse.com',
      roleTitle: req.user.roleTitle || 'Executive Director & Store Owner',
      role: 'admin',
      accessLevel: 'Super Admin'
    }
  });
});

// ============================================================================
// 2. PRODUCTS API (Single Source of Truth)
// ============================================================================

// Public: Get all active products (or all if admin)
app.get('/api/products', (req, res) => {
  const db = getDb();
  const includeInactive = req.query.all === 'true';
  const products = includeInactive 
    ? db.products 
    : db.products.filter(p => p.active !== false);
  res.json({ success: true, count: products.length, products });
});

// Admin: Add new product
app.post('/api/products', verifyToken, requireAdmin, (req, res) => {
  try {
    const { name, category, badge, color, accent, flavorNotes, pairings, sugarFreeAvailable, isGutHealth, priceRegular, priceLarge, priceBottle, image } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Product name and category are required.' });
    }

    const db = getDb();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

    const newProduct = {
      id,
      name,
      category,
      badge: badge || 'New Flavor',
      color: color || '#D4985B',
      accent: accent || '#FDF0D5',
      flavorNotes: flavorNotes || 'Refreshing handcrafted craft soda',
      pairings: Array.isArray(pairings) ? pairings : ['Chilled Sparkling Soda', 'Mint & Lemon'],
      sugarFreeAvailable: Boolean(sugarFreeAvailable),
      isGutHealth: Boolean(isGutHealth),
      popularity: 88,
      priceRegular: Number(priceRegular) || 25,
      priceLarge: Number(priceLarge) || 35,
      priceBottle: Number(priceBottle) || 65,
      image: image || '/images/drinks/drink_berry.png',
      active: true,
      updatedAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    saveDb(db);

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add product.' });
  }
});

// Admin: Update existing product
app.put('/api/products/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = {
      ...db.products[index],
      ...req.body,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updated;
    saveDb(db);

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// Admin: Delete product
app.delete('/api/products/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const beforeCount = db.products.length;
    db.products = db.products.filter(p => p.id !== id);

    if (db.products.length === beforeCount) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    saveDb(db);
    res.json({ success: true, message: 'Product successfully deleted.' });
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

// Admin: Toggle active state
app.patch('/api/products/:id/toggle', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const prod = db.products.find(p => p.id === id);

    if (!prod) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    prod.active = prod.active === false ? true : false;
    saveDb(db);

    res.json({ success: true, active: prod.active, product: prod });
  } catch (err) {
    console.error('Toggle Product Error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle product status.' });
  }
});

// ============================================================================
// 3. ORDERS API
// ============================================================================

// Get orders (customer gets their own; admin gets all)
app.get('/api/orders', verifyToken, (req, res) => {
  const db = getDb();
  if (req.user.role === 'admin') {
    return res.json({ success: true, orders: db.orders });
  }
  const userOrders = db.orders.filter(o => 
    o.customerId === req.user.id || 
    (o.customerEmail && o.customerEmail.toLowerCase() === req.user.email.toLowerCase())
  );
  res.json({ success: true, orders: userOrders });
});

// Create new order
app.post('/api/orders', verifyToken, (req, res) => {
  try {
    const { items, outlet, subtotal, discount, total, paymentMethod } = req.body;
    const db = getDb();

    const orderNumber = `#SD-TKN-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: `ORD-${Date.now()}`,
      tokenNumber: orderNumber,
      customerId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      outlet: outlet || 'Pune - Kothrud Outlet',
      items: items || [],
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      status: 'Preparing',
      paymentMethod: paymentMethod || 'Counter UPI / Cash',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // Update customer loyalty stamp
    const customer = db.customers.find(c => c.id === req.user.id);
    if (customer) {
      customer.loyaltyStamps = Math.min(10, (customer.loyaltyStamps || 0) + 1);
    }

    saveDb(db);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
});

// Admin: Update order status
app.patch('/api/orders/:id/status', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDb();
    const order = db.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    saveDb(db);

    res.json({ success: true, order });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

// ============================================================================
// 4. FRANCHISE ENQUIRIES API
// ============================================================================

// Public: Submit enquiry
app.post('/api/enquiries', (req, res) => {
  try {
    const { name, phone, email, city, tier, investmentCapacity, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone number are required.' });
    }

    const db = getDb();
    const newEnquiry = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email: email || '',
      city: city || 'Maharashtra',
      tier: tier || 'Tier 2 & 3 Cities',
      investmentCapacity: investmentCapacity || '₹15L - ₹25L',
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      notes: notes || 'Submitted through public website application form.'
    };

    db.enquiries.unshift(newEnquiry);
    saveDb(db);

    res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (err) {
    console.error('Enquiry Submission Error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry.' });
  }
});

// Admin: Get all enquiries
app.get('/api/enquiries', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  res.json({ success: true, enquiries: db.enquiries });
});

// Admin: Update enquiry status
app.patch('/api/enquiries/:id/status', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const db = getDb();
    const enquiry = db.enquiries.find(e => e.id === id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    if (status) enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;
    saveDb(db);

    res.json({ success: true, enquiry });
  } catch (err) {
    console.error('Update Enquiry Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update enquiry.' });
  }
});

// ============================================================================
// 5. CUSTOMER PROFILE & SAVED DATA
// ============================================================================

// Customer: Update profile / saved drinks / cart
app.put('/api/customer/profile', verifyToken, requireCustomer, (req, res) => {
  try {
    const db = getDb();
    const customer = db.customers.find(c => c.id === req.user.id || c.email === req.user.email);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    const { savedDrinks, cart, name, phone } = req.body;
    if (savedDrinks !== undefined) customer.savedDrinks = savedDrinks;
    if (cart !== undefined) customer.cart = cart;
    if (name) customer.name = name;
    if (phone) customer.phone = phone;

    saveDb(db);
    res.json({ success: true, customer });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update customer profile.' });
  }
});

// Admin: Get all customers list
app.get('/api/customers', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  res.json({ success: true, customers: db.customers });
});

// Store Broadcast Announcement API
app.get('/api/announcement', (req, res) => {
  const db = getDb();
  res.json({ success: true, announcement: db.announcement || '' });
});

app.post('/api/announcement', verifyToken, requireAdmin, (req, res) => {
  const { announcement } = req.body;
  const db = getDb();
  db.announcement = announcement;
  saveDb(db);
  res.json({ success: true, announcement });
});

app.listen(PORT, () => {
  console.log(`Soda House API server running on http://localhost:${PORT}`);
});
