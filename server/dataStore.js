import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SYRUPS } from '../src/data/sodaData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial 25+ Handcrafted Syrups & Sodas mapped from official brand catalog
const INITIAL_PRODUCTS = SYRUPS.map((s, idx) => ({
  ...s,
  priceRegular: s.priceRegular || 25,
  priceLarge: s.priceLarge || 35,
  priceBottle: s.priceBottle || 65,
  active: true,
  stockLitres: 28 - (idx % 12)
}));

// Initial Customers Demo Data
const INITIAL_CUSTOMERS = [
  {
    id: "cust-google-101",
    googleId: "google-oauth-109283746",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98220 12345",
    role: "customer",
    tier: "Gold VIP Member",
    createdAt: "2026-08-14T10:30:00Z",
    savedDrinks: [
      {
        id: "MIX-CUST-1",
        name: "Curacao Masala Sparkler",
        base: "Chilled Sparkling Soda",
        syrups: ["Blue Curacao", "Royal Jeera Masala"],
        toppings: ["Muddled Mint & Lemon", "Crushed Ice"],
        date: "2026-09-21"
      }
    ],
    cart: [
      {
        id: "blue-curacao",
        name: "Blue Curacao",
        size: "Regular (300ml)",
        price: 25,
        quantity: 2
      }
    ],
    loyaltyStamps: 7
  }
];

// Initial Orders Demo Data
const INITIAL_ORDERS = [
  {
    id: "ORD-9821",
    tokenNumber: "#SD-TKN-842",
    customerId: "cust-google-101",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@gmail.com",
    outlet: "Pune - Kothrud Outlet",
    items: [
      { name: "Blue Curacao Sparkler (300ml)", quantity: 2, price: 25 },
      { name: "Royal Jeera Masala (450ml)", quantity: 1, price: 35 }
    ],
    subtotal: 85,
    discount: 12.75,
    total: 72.25,
    status: "Ready for Pickup",
    paymentMethod: "Counter UPI / Cash",
    createdAt: "2026-09-22T19:40:00Z"
  },
  {
    id: "ORD-9820",
    tokenNumber: "#SD-TKN-839",
    customerId: "cust-google-101",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@gmail.com",
    outlet: "Pune - Kothrud Outlet",
    items: [
      { name: "Konkan Kokum Splash (Takeaway 1L)", quantity: 1, price: 65 }
    ],
    subtotal: 65,
    discount: 9.75,
    total: 55.25,
    status: "Completed",
    paymentMethod: "Prepaid Online",
    createdAt: "2026-09-20T17:15:00Z"
  }
];

// Initial Franchise Enquiries
const INITIAL_ENQUIRIES = [
  {
    id: "LEAD-101",
    name: "Amit Deshmukh",
    phone: "+91 98230 45678",
    email: "amit.deshmukh@gmail.com",
    city: "Pune (Baner)",
    tier: "Tier 1 Metro",
    investmentCapacity: "₹20L - ₹30L",
    status: "In Discussion",
    date: "2026-09-21",
    notes: "Prime commercial corner shop shortlisted. 420 sq ft with water line ready."
  },
  {
    id: "LEAD-102",
    name: "Suresh Patil",
    phone: "+91 94220 89123",
    email: "suresh.patil@kolhapurbeverages.com",
    city: "Kolhapur (Shahupuri)",
    tier: "Tier 2 & 3 Cities",
    investmentCapacity: "₹15L - ₹20L",
    status: "Site Evaluation",
    date: "2026-09-20",
    notes: "Heritage high footfall market. Wants 8-tap fountain with full syrup line."
  },
  {
    id: "LEAD-103",
    name: "Rajesh Gaikwad",
    phone: "+91 99210 33445",
    email: "rajesh.g@yahoo.com",
    city: "Solapur (Station Road)",
    tier: "Tier 2 & 3 Cities",
    investmentCapacity: "₹15L - ₹20L",
    status: "Agreement Signed",
    date: "2026-09-18",
    notes: "Franchise agreement finalized. Equipment dispatch scheduled for next week."
  }
];

// Read/Write Helper Functions
export function getDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialDb = {
        products: INITIAL_PRODUCTS,
        customers: INITIAL_CUSTOMERS,
        orders: INITIAL_ORDERS,
        enquiries: INITIAL_ENQUIRIES,
        announcement: "Summer Fiesta: Buy 2 Signature Sodas, get 1 Bombay Masala Free at all counters!"
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning fallback:', err);
    return {
      products: INITIAL_PRODUCTS,
      customers: INITIAL_CUSTOMERS,
      orders: INITIAL_ORDERS,
      enquiries: INITIAL_ENQUIRIES,
      announcement: "Summer Fiesta: Buy 2 Signature Sodas, get 1 Bombay Masala Free at all counters!"
    };
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}
