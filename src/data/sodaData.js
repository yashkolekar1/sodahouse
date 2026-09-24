export const BRAND_INFO = {
  name: "S Daddy Soda House",
  tagline: "Refreshing Taste. Consistent Quality. Profitable Partnership.",
  subTitle: "A Venture of Himmat Group of Business | Est. 1973",
  parentCompany: "Himmat Beverages Pvt. Ltd.",
  founder: "Late Shri Nandkumar Shivaji Kadam",
  phone: "8237522072",
  phoneFormatted: "+91 82375 22072",
  email: "himmat.beverages1290@gmail.com",
  whatsappNumber: "918237522072",
  whatsappMessage: "Hello Daddy Soda House team! I am interested in learning more about your franchise opportunities and syrup range.",
  yearsLegacy: "50+",
  estYear: "1973",
  verticalsCount: 5,
  flavorsCount: "25+",
  sodaMachinesCount: 8,
};

export const HIMMAT_GROUP = {
  legacyTitle: "50+ Years of Unbroken Trust & Entrepreneurial Excellence",
  description:
    "From a humble, single restaurant in 1973 to a diversified, multi-sector conglomerate across Maharashtra, Himmat Group has stood as a beacon of integrity, quality, and community value for over five decades.",
  verticals: [
    { name: "Himmat Enterprise", desc: "Commercial trade & business solutions", icon: "Building2" },
    { name: "Himmat Petroleum", desc: "Fuel logistics & retail distribution networks", icon: "Fuel" },
    { name: "Himmat Finance", desc: "Capital growth, business loans & investment advisory", icon: "Coins" },
    { name: "Himmat Liquors", desc: "Premium retail hospitality & beverage retail", icon: "Wine" },
    { name: "Himmat Beverages Pvt. Ltd.", desc: "FMCG beverage manufacturing, syrups & modern soda bar chains", icon: "Sparkles", highlight: true },
  ],
  leadership: [
    {
      name: "Mr. Milind Nandkumar Kadam",
      role: "CEO & Managing Director",
      bio: "Seasoned business entrepreneur driving the group's strategic vision, network expansion, and successful community presence across Maharashtra.",
      image: "/images/director_milind_original.png",
      quote: "Our mission is to empower everyday entrepreneurs with a proven, recession-proof beverage model.",
    },
    {
      name: "Mr. Ketan Nandkumar Kadam",
      role: "CEO & Managing Director",
      bio: "Responsible for strategic growth, operational excellence, supply chain technology, and tech-driven quality across all group companies.",
      image: "/images/director_ketan_original.png",
      quote: "Quality ingredients and rock-solid SOPs ensure that every glass of Daddy Soda tastes identical across all outlets.",
    },
  ],
};

export const getWhatsAppOrderUrl = ({ name, type = 'Product', quantity = 1, customDetails = '' }) => {
  let message = '';
  if (customDetails) {
    message = `Hi, I would like to order a custom drink:\n\n${customDetails}\n\nQuantity: ${quantity}\n\nPlease share the details.`;
  } else if (type === 'Syrup') {
    message = `Hi, I am interested in ordering:\n\nSyrup: ${name}\nQuantity: ${quantity}\n\nPlease share the details.`;
  } else {
    message = `Hi, I am interested in ordering:\n\nProduct: ${name}\nQuantity: ${quantity}\n\nPlease share the details.`;
  }
  const text = encodeURIComponent(message);
  return `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${text}`;
};

export const getStoredSyrupAvailability = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('daddy_soda_syrup_status');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveStoredSyrupAvailability = (id, status) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredSyrupAvailability();
    current[id] = status;
    localStorage.setItem('daddy_soda_syrup_status', JSON.stringify(current));
    window.dispatchEvent(new Event('daddy_syrup_status_changed'));
  } catch (e) {
    console.error('Error saving syrup availability:', e);
  }
};

export const getStoredProducts = () => {
  if (typeof window === 'undefined') return { added: [], deleted: [], edited: {} };
  try {
    const raw = localStorage.getItem('daddy_soda_products_store');
    return raw ? JSON.parse(raw) : { added: [], deleted: [], edited: {} };
  } catch (e) {
    return { added: [], deleted: [], edited: {} };
  }
};

export const saveStoredProductsState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('daddy_soda_products_store', JSON.stringify(state));
    window.dispatchEvent(new Event('daddy_products_changed'));
    window.dispatchEvent(new Event('daddy_syrup_status_changed'));
  } catch (e) {
    console.error('Error saving products state:', e);
  }
};

export const addProductToStore = (newProduct) => {
  const state = getStoredProducts();
  const productWithId = {
    ...newProduct,
    id: newProduct.id || 'prod-' + Date.now(),
    image: newProduct.image || '/images/drinks/drink_berry.png',
    availability: newProduct.availability || 'Available',
    priceRegular: newProduct.priceRegular || 30
  };
  state.added = [productWithId, ...(state.added || [])];
  saveStoredProductsState(state);
  return productWithId;
};

export const removeProductFromStore = (id) => {
  const state = getStoredProducts();
  const deletedSet = new Set(state.deleted || []);
  deletedSet.add(id);
  state.deleted = Array.from(deletedSet);
  state.added = (state.added || []).filter(p => p.id !== id);
  saveStoredProductsState(state);
};

export const editProductInStore = (id, fields) => {
  const state = getStoredProducts();
  state.edited = { ...(state.edited || {}), [id]: { ...(state.edited?.[id] || {}), ...fields } };
  saveStoredProductsState(state);
};

export const getMergedProducts = () => {
  const { added = [], deleted = [], edited = {} } = getStoredProducts();
  const availabilityOverrides = getStoredSyrupAvailability();
  
  // Base syrups minus deleted
  const base = SYRUPS.filter(p => !deleted.includes(p.id)).map(p => {
    const edit = edited[p.id] || {};
    return {
      ...p,
      ...edit,
      availability: availabilityOverrides[p.id] || edit.availability || p.availability || 'Available'
    };
  });

  // Added custom products
  const custom = (added || []).filter(p => !deleted.includes(p.id)).map(p => {
    const edit = edited[p.id] || {};
    return {
      ...p,
      ...edit,
      availability: availabilityOverrides[p.id] || edit.availability || p.availability || 'Available'
    };
  });

  return [...base, ...custom];
};

export const getMergedSyrups = getMergedProducts;

export const SYRUPS = [
  {
    id: "blue-curacao",
    name: "Blue Curacao",
    image: "/images/drinks/drink_berry.png",
    category: "Mocktail Refreshers",
    badge: "Bestseller",
    color: "#00B4D8",
    accent: "#90E0EF",
    flavorNotes: "Tangy Caribbean citrus, sweet orange peel finish, vibrant oceanic hue",
    pairings: ["Sprite / Club Soda", "Lemon Slice", "Mint Leaves"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 98,
    availability: "Available",
  },
  {
    id: "mojito-original",
    name: "Cuban Mint Mojito",
    image: "/images/drinks/drink_mint.png",
    category: "Mocktail Refreshers",
    badge: "Trending",
    color: "#2EC4B6",
    accent: "#CBF3F0",
    flavorNotes: "Crisp spearmint, zesty key lime, ultra-refreshing fizzy burst",
    pairings: ["Crushed Ice", "Muddled Mint", "Chilled Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 97,
    availability: "Available",
  },
  {
    id: "pina-colada",
    name: "Pina Colada",
    image: "/images/drinks/drink_gold.png",
    category: "Mocktail Refreshers",
    badge: "Tropical",
    color: "#F6BD60",
    accent: "#FDF0D5",
    flavorNotes: "Creamy tropical coconut cream blended with ripe golden pineapple",
    pairings: ["Coconut Flakes", "Pineapple Wedge", "Mild Fizz"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 92,
    availability: "Low Stock",
  },
  {
    id: "mint-original",
    name: "Mint Original",
    image: "/images/drinks/drink_mint.png",
    category: "Herbal & Fresh",
    badge: "Classic",
    color: "#52B788",
    accent: "#D8F3DC",
    flavorNotes: "Pure garden mint extract with cooling botanical undertones",
    pairings: ["Rock Salt", "Ice Cubes", "Lemon Spritz"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 91,
    availability: "Available",
  },
  {
    id: "super-cola",
    name: "Super Cola",
    image: "/images/drinks/drink_cola.png",
    category: "Desi Masala",
    badge: "Signature",
    color: "#4A1E16",
    accent: "#E29578",
    flavorNotes: "Old-school cola spice kick infused with cinnamon, nutmeg and punchy fizz",
    pairings: ["Kala Namak", "Fresh Lemon", "Extra Fizz"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 99,
  },
  {
    id: "kokum",
    name: "Kokum Splash",
    image: "/images/drinks/drink_jeera.png",
    category: "Desi Masala",
    badge: "Gut Health",
    color: "#800F2F",
    accent: "#FFCCD5",
    flavorNotes: "Authentic Konkani wild mangosteen extract, sweet-tart & naturally digestive",
    pairings: ["Roasted Cumin", "Pink Salt", "Chilled Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 96,
  },
  {
    id: "lemon",
    name: "Classic Lemon",
    image: "/images/drinks/drink_lemon.png",
    category: "Citrus Kick",
    badge: "All-Time Fav",
    color: "#FEE440",
    accent: "#FFF3B0",
    flavorNotes: "Sun-drenched Kagzi lemon zest with refreshing citrus aroma",
    pairings: ["Mint Sprig", "Crushed Ice", "Black Pepper"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 94,
  },
  {
    id: "kiwi",
    name: "Kiwi Zing",
    image: "/images/drinks/drink_mint.png",
    category: "Fruit Fusion",
    badge: "Exotic",
    color: "#588157",
    accent: "#DAD7CD",
    flavorNotes: "Vibrant New Zealand kiwi pulp with mild tangy seeds sensation",
    pairings: ["Soda Fizz", "Lime Wedge", "Chia Seeds"],
    sugarFreeAvailable: false,
    isGutHealth: true,
    popularity: 89,
  },
  {
    id: "watermelon",
    name: "Watermelon Rush",
    image: "/images/drinks/drink_berry.png",
    category: "Fruit Fusion",
    badge: "Summer Hit",
    color: "#FF5964",
    accent: "#FFE5D9",
    flavorNotes: "Luscious ruby melon juice, naturally hydrating and aromatic",
    pairings: ["Fresh Basil", "Himalayan Salt", "High Carbonation"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 95,
  },
  {
    id: "rose",
    name: "Royal Rose",
    image: "/images/drinks/drink_berry.png",
    category: "Herbal & Fresh",
    badge: "Heritage",
    color: "#C9184A",
    accent: "#FFB3C1",
    flavorNotes: "Damascene rose petals distillation, floral aroma with royal sweetness",
    pairings: ["Sweet Basil Seeds", "Chilled Soda", "Silver Leaf"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 90,
  },
  {
    id: "blueberry",
    name: "Wild Blueberry",
    image: "/images/drinks/drink_berry.png",
    category: "Fruit Fusion",
    badge: "Antioxidant",
    color: "#3A0CA3",
    accent: "#B5179E",
    flavorNotes: "Rich berry tartness balanced by smooth sweet berry notes",
    pairings: ["Lemon Juice", "Ice Gola Dip", "Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 93,
  },
  {
    id: "pineapple",
    name: "Juicy Pineapple",
    image: "/images/drinks/drink_gold.png",
    category: "Fruit Fusion",
    badge: "Tropical",
    color: "#F4A261",
    accent: "#FFE8D6",
    flavorNotes: "Queen pineapple nectar, intense tropical sweetness with tangy bite",
    pairings: ["Mint", "Soda", "Chat Masala"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 88,
  },
  {
    id: "orange",
    name: "Nagpur Orange",
    image: "/images/drinks/drink_orange.png",
    category: "Citrus Kick",
    badge: "Fresh Pulp",
    color: "#F77F00",
    accent: "#FDE2B3",
    flavorNotes: "Zesty Indian Mandarin orange with fragrant peel oil essence",
    pairings: ["Kala Namak", "Ice Soda", "Orange Slice"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 93,
  },
  {
    id: "mango",
    name: "Alphonso Mango",
    image: "/images/drinks/drink_orange.png",
    category: "Fruit Fusion",
    badge: "King of Fruits",
    color: "#FFB703",
    accent: "#FFF1C5",
    flavorNotes: "Pure Ratnagiri Alphonso mango richness in sparkling effervescence",
    pairings: ["Chili Salt Rim", "Soda", "Ice Gola"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 98,
  },
  {
    id: "guava-green",
    name: "Guava Green Masala",
    image: "/images/drinks/drink_mint.png",
    category: "Desi Masala",
    badge: "Street Style",
    color: "#70E000",
    accent: "#D8F3DC",
    flavorNotes: "Crisp raw green guava with a sprinkle of spicy red chili and rock salt",
    pairings: ["Red Chili Rim", "Chaat Masala", "Chilled Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 97,
  },
  {
    id: "kalakhatta",
    name: "Desi Kalakhatta",
    image: "/images/drinks/drink_cola.png",
    category: "Desi Masala",
    badge: "Crowd Favorite",
    color: "#3F0071",
    accent: "#D1C4E9",
    flavorNotes: "Nostalgic blackberry, tangy pomegranate, cumin, black salt and citric burst",
    pairings: ["Ice-Gola Shavings", "Rock Salt", "Soda"],
    sugarFreeAvailable: true,
    isGutHealth: false,
    popularity: 100,
  },
  {
    id: "rooh-afza",
    name: "Rooh Afza Botanical",
    image: "/images/drinks/drink_berry.png",
    category: "Herbal & Fresh",
    badge: "Legendary",
    color: "#A01A58",
    accent: "#FCE4EC",
    flavorNotes: "Timeless cooling botanical blend of herbs, fruits, and fragrant floral essences",
    pairings: ["Lime", "Sabja Seeds", "Fizzy Water"],
    sugarFreeAvailable: false,
    isGutHealth: true,
    popularity: 94,
  },
  {
    id: "berry-blast",
    name: "Berry Blast Trio",
    image: "/images/drinks/drink_berry.png",
    category: "Fruit Fusion",
    badge: "Super Fruity",
    color: "#8338EC",
    accent: "#E8D7FF",
    flavorNotes: "Fusion of strawberries, raspberries, and blackberries with fizzy excitement",
    pairings: ["Lemon Wedges", "Crushed Ice", "Prebiotic Tonic"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 95,
  },
  {
    id: "jeera-masala",
    name: "Jeera Masala Soda",
    image: "/images/drinks/drink_jeera.png",
    category: "Desi Masala",
    badge: "Digestive Wonder",
    color: "#7F4F24",
    accent: "#EDE0D4",
    flavorNotes: "Toasted cumin seeds, asafoetida, rock salt, and bold Indian digestive spices",
    pairings: ["Heavy Soda Fizz", "Black Salt", "Lemon Drop"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 99,
  },
  {
    id: "bubble-gum",
    name: "Retro Bubble Gum",
    image: "/images/drinks/drink_berry.png",
    category: "Kids & Fun",
    badge: "Fun & Sweet",
    color: "#FF006E",
    accent: "#FFD1DC",
    flavorNotes: "Y2K nostalgia bubblegum scent and candy sweetness that pops on the tongue",
    pairings: ["Rainbow Sprinkles", "Ice Soda", "Ice-Gola"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 88,
  },
  {
    id: "falsa",
    name: "Desi Falsa Berry",
    image: "/images/drinks/drink_cola.png",
    category: "Desi Masala",
    badge: "Seasonal Gem",
    color: "#47126B",
    accent: "#DEC9E9",
    flavorNotes: "Tart wild Indian sherbet berries with mineral pink salt and cumin twist",
    pairings: ["Crushed Ice", "Kala Namak", "Club Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 92,
    availability: "Out of Stock",
  },
  {
    id: "guava-pink",
    name: "Ripe Guava Pink",
    image: "/images/drinks/drink_berry.png",
    category: "Fruit Fusion",
    badge: "Creamy Fruit",
    color: "#FF758F",
    accent: "#FFE5EC",
    flavorNotes: "Sun-ripened pink guava puree flavor, silky sweet with mild tartness",
    pairings: ["Lime Squeeze", "Chaat Masala", "Chilled Soda"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 90,
  },
  {
    id: "honey-lemon",
    name: "Honey Lemon Sparkler",
    image: "/images/drinks/drink_lemon.png",
    category: "Herbal & Fresh",
    badge: "Immunity",
    color: "#E09F3E",
    accent: "#FFF3B0",
    flavorNotes: "Natural forest wild honey infused with fresh zesty lemon juice extract",
    pairings: ["Ginger Juice Drop", "Mint", "Soda"],
    sugarFreeAvailable: false,
    isGutHealth: true,
    popularity: 94,
  },
  {
    id: "jamun",
    name: "Black Jamun Shot",
    image: "/images/drinks/drink_cola.png",
    category: "Desi Masala",
    badge: "Gut Health",
    color: "#240046",
    accent: "#9D4EDD",
    flavorNotes: "Astringent Indian blackberry puree with black salt, digestive and deep purple",
    pairings: ["Salt Rim", "Lemon Squeeze", "Soda"],
    sugarFreeAvailable: true,
    isGutHealth: true,
    popularity: 96,
  },
  {
    id: "ice-gola-special",
    name: "Rainbow Ice-Gola Special",
    image: "/images/drinks/drink_berry.png",
    category: "Ice-Gola Counter",
    badge: "New Hit!",
    color: "#FF007F",
    accent: "#00F5D4",
    flavorNotes: "Fine shaved snow gola soaked in 4 signature syrups (Kalakhatta, Rose, Orange & Khus)",
    pairings: ["Mawa Cream", "Dry Fruits", "Chatpata Masala"],
    sugarFreeAvailable: false,
    isGutHealth: false,
    popularity: 100,
  },
];

export const FRANCHISE_MODELS = {
  tier3: {
    title: "Tier 3 Cities & Towns",
    badge: "High Growth Market",
    franchiseFee: "₹2,00,000*",
    feeNote: "* Franchise Fee + GST",
    estimatedTotal: "₹12,00,000 – ₹15,00,000",
    dailySodaSales: "250 glasses @ ₹20",
    dailyGolaSales: "30 pieces @ ₹30",
    dailyRevenue: "₹5,900*",
    monthlyRevenue: "₹1.77 Lakhs*",
    annualRevenue: "₹21 Lakhs",
    annualProfit25: "₹5 Lakhs",
    annualProfit30: "₹6 Lakhs",
    expectedROI: "18–24 Months",
    calcDefaults: { sodas: 250, sodaPrice: 20, golas: 30, golaPrice: 30 },
  },
  tier12: {
    title: "Tier 1 & Tier 2 Metros",
    badge: "Prime Footfall Location",
    franchiseFee: "₹2,00,000*",
    feeNote: "* Franchise Fee + GST",
    estimatedTotal: "₹15,00,000 – ₹25,00,000",
    dailySodaSales: "350 glasses @ ₹30",
    dailyGolaSales: "75 pieces @ ₹50",
    dailyRevenue: "₹14,250*",
    monthlyRevenue: "₹4.28 Lakhs*",
    annualRevenue: "₹51 Lakhs",
    annualProfit25: "₹13 Lakhs",
    annualProfit30: "₹15 Lakhs",
    expectedROI: "18–24 Months",
    calcDefaults: { sodas: 350, sodaPrice: 30, golas: 75, golaPrice: 50 },
  },
};

export const SETUP_INCLUDES = [
  { item: "Soda Dispensing Machines", desc: "Commercial 8-flavor automated carbonator & multi-tap dispensing station", icon: "Coffee" },
  { item: "Smart POS & Billing System", desc: "Touchscreen POS with real-time per-glass sales tracking and inventory sync", icon: "Receipt" },
  { item: "CCTV & Remote Monitoring", desc: "Cloud CCTV integration for 24/7 store visibility on your smartphone", icon: "Camera" },
  { item: "Branding & Backlit Signage", desc: "Illuminated 3D acrylic signage, menu boards & signature logo mounts", icon: "Flame" },
  { item: "Premium Interior & Wooden Fluted Counter", desc: "Turnkey wooden slat architectural counter and warm LED shelving", icon: "Store" },
  { item: "Initial Stock & Consumables", desc: "Complete initial syrup supply, paper cups, lids, straws & flavor batch", icon: "PackageCheck" },
];

export const US_VS_THEM = {
  companyProvides: [
    { title: "Brand Advertising (Central Level)", desc: "Social media campaigns, state-wide PR, and influencer promotions." },
    { title: "Marketing Salesman Support", desc: "Field activations, seasonal launch kits, and customer retention strategies." },
    { title: "Quality Control & Compliance", desc: "FSSAI compliance standards, ingredient certifications, and SOP audits." },
    { title: "Franchise & Brand Rights", desc: "Protected territory, trademark rights, and recognized branding." },
    { title: "Flavor Liquid Supply", desc: "Direct factory shipments of concentrates ensuring unbeatable profit margins." },
    { title: "SOP Documentation", desc: "Step-by-step preparation guides for zero-error beverage consistency." },
    { title: "Staff Training & Onboarding", desc: "Comprehensive 1-day operator training (no skilled chef required)." },
    { title: "Technical & Business Guidance", desc: "Machine maintenance, equipment servicing, and revenue mentoring." },
  ],
  franchiseeHandles: [
    { title: "Outlet Investment", desc: "Lease/ownership of 120-250 sq. ft. commercial space." },
    { title: "Day-to-Day Operations", desc: "Customer hospitality, cash counter, and store neatness." },
    { title: "Staff Management", desc: "Hiring 1-2 counter staff and shift supervision." },
    { title: "Utility Expenses", desc: "Electricity, filtered water supply, and high-speed Wi-Fi." },
    { title: "Compliance & Local Licenses", desc: "Local municipal trade license and shop establishment act." },
    { title: "Customer Experience", desc: "Warm smiles, fast service, and engaging local community." },
  ],
};

export const PARTNERSHIP_STEPS = [
  { step: "01", title: "Express Interest", desc: "Share your preferred city, locality, and commercial property details with our team." },
  { step: "02", title: "Initial Meeting", desc: "Discuss business goals, ROI expectations, and mutual synergies with Himmat Beverages leadership." },
  { step: "03", title: "Site Evaluation", desc: "Our team verifies footfall, accessibility, and market demographics to approve the location." },
  { step: "04", title: "Sign Agreement", desc: "Execute formal franchise agreement and pay the franchise fee (⏱ 1.5 months to grand opening!)." },
  { step: "05", title: "Setup & Training", desc: "Machine installation, wooden counter fabrication, billing POS setup, and staff onboarding." },
  { step: "06", title: "Grand Opening", desc: "Launch your Daddy Soda House with launch marketing — fully operational within 45 days!" },
];

export const INITIAL_LEADS = [
  {
    id: "LEAD-101",
    name: "Siddhesh Jadhav",
    phone: "+91 98224 55120",
    email: "siddhesh.j@gmail.com",
    city: "Kolhapur, Maharashtra",
    tier: "Tier 3 Cities",
    investmentCapacity: "₹12L - ₹15L",
    status: "Site Evaluation",
    date: "2026-09-18",
    notes: "Has a 200 sq.ft prime shop near Shivaji Chowk. Very interested in Ice-Gola counter combo.",
  },
  {
    id: "LEAD-102",
    name: "Anita Deshmukh",
    phone: "+91 97631 88402",
    email: "anita.deshmukh@yahoo.com",
    city: "Pune (Kothrud), Maharashtra",
    tier: "Tier 1 & 2 Cities",
    investmentCapacity: "₹15L - ₹25L",
    status: "In Discussion",
    date: "2026-09-19",
    notes: "Met Mr. Milind Kadam at Pune trade expo. Reviewing franchise disclosure document.",
  },
  {
    id: "LEAD-103",
    name: "Vikram Rathi",
    phone: "+91 98902 33411",
    email: "vikram.rathi88@gmail.com",
    city: "Solapur, Maharashtra",
    tier: "Tier 3 Cities",
    investmentCapacity: "₹12L - ₹15L",
    status: "New",
    date: "2026-09-20",
    notes: "Submitted via website form. Interested in zero sugar and masala soda lines.",
  },
];
