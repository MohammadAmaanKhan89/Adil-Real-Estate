// Editable content. PLACEHOLDER = unconfirmed, verify with client. Listings are SAMPLE content.
const BRAND = { phoneRaw: '923003680043' };
const WA = (t = 'Hello Adil Real Estate & Builders, I would like to inquire about a property.') =>
  `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(t)}`;
const U = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CATEGORIES = ['All', 'Houses', 'Bungalows', 'Apartments', 'Commercial', 'Plots', 'Rental'];
const LOCATIONS = ['Any location', 'Bahria Town Karachi', 'Federal B Area', 'Gulberg Town', 'Other Karachi'];
const BUDGETS = [
  { label: 'Any budget', min: 0, max: Infinity },
  { label: 'Under PKR 5 Crore', min: 0, max: 5e7 },
  { label: 'PKR 5 – 10 Crore', min: 5e7, max: 1e8 },
  { label: 'Above PKR 10 Crore', min: 1e8, max: Infinity },
];
const LOC_CARDS = [
  ['Bahria Town Karachi', 'photo-1600596542815-ffad4c1539a9', 'Planned community living'],
  ['Federal B Area', 'photo-1545324418-cc1a3fa10c00', 'Central & well-connected'],
  ['Gulberg Town', 'photo-1494526585095-c41746248156', 'Established neighbourhoods'],
  ['Other Karachi', 'photo-1480714378408-67cf0d13bc1b', 'Explore more areas'],
];

const PROPERTIES = [
  { id: 1, title: 'Modern Villa with Garden Lounge', area: 'Bahria Town Karachi', category: 'Houses', mode: 'Buy', price: 68000000, beds: 5, baths: 5, sqft: 4500, unit: 'sq ft',
    images: ['photo-1613490493576-7fde63acd811', 'photo-1600596542815-ffad4c1539a9', 'photo-1600607687939-ce8a6c25118c', 'photo-1512917774080-9991f1c4c750'],
    description: 'A contemporary family villa with double-height living spaces, a landscaped garden lounge and generous natural light. Sample content for demonstration purposes.',
    features: ['Landscaped garden', 'Modular kitchen', 'Servant quarter', 'Covered parking', 'Secure community', 'Backup-ready wiring'] },
  { id: 2, title: 'Signature Bungalow, Corner Plot', area: 'Gulberg Town', category: 'Bungalows', mode: 'Buy', price: 145000000, beds: 6, baths: 6, sqft: 7200, unit: 'sq ft',
    images: ['photo-1600585154340-be6161a56a0c', 'photo-1600566753190-17f0baa2a6c3', 'photo-1570129477492-45c003edd2be', 'photo-1600047509807-ba8f99d2cdde'],
    description: 'A spacious corner bungalow with formal and family living areas, terrace and a private driveway. Sample content for demonstration purposes.',
    features: ['Corner plot', 'Terrace', 'Formal drawing room', 'Lawn', 'Two-car porch', 'Maid room'] },
  { id: 3, title: 'Skyline 3-Bed Luxury Apartment', area: 'Federal B Area', category: 'Apartments', mode: 'Buy', price: 32500000, beds: 3, baths: 3, sqft: 2100, unit: 'sq ft',
    images: ['photo-1545324418-cc1a3fa10c00', 'photo-1502672260266-1c1ef2d93688', 'photo-1522708323590-d24dbb6b0267', 'photo-1560448204-e02f11c3d0e2'],
    description: 'A bright high-floor apartment with open-plan living, a private balcony and building amenities. Sample content for demonstration purposes.',
    features: ['Balcony', 'Lift access', 'Reserved parking', 'Security', 'Generator backup', 'Open-plan living'] },
  { id: 4, title: 'Prime Commercial Floor', area: 'Gulberg Town', category: 'Commercial', mode: 'Buy', price: 95000000, beds: 0, baths: 4, sqft: 3800, unit: 'sq ft',
    images: ['photo-1486406146926-c627a92ad1ab', 'photo-1497366216548-37526070297c', 'photo-1486325212027-8081e485255e'],
    description: 'A flexible commercial floor suited to offices or showrooms on a busy road. Sample content for demonstration purposes.',
    features: ['Main road frontage', 'Lift', 'Basement parking', 'Fire exits', 'HVAC-ready', 'Signage space'] },
  { id: 5, title: 'Residential Plot, Precinct Block', area: 'Bahria Town Karachi', category: 'Plots', mode: 'Buy', price: 14500000, beds: 0, baths: 0, sqft: 250, unit: 'sq yd',
    images: ['photo-1448630360428-65456885c650', 'photo-1480714378408-67cf0d13bc1b'],
    description: 'A development-ready residential plot in an established precinct, ideal for building your own home. Sample content for demonstration purposes.',
    features: ['Ready for construction', 'Wide road access', 'Utilities nearby', 'Gated community', 'Park proximity'] },
  { id: 6, title: 'Family Home for Rent', area: 'Federal B Area', category: 'Rental', mode: 'Rent', price: 180000, per: '/ month', beds: 4, baths: 3, sqft: 2800, unit: 'sq ft',
    images: ['photo-1564013799919-ab600027ffc6', 'photo-1502672260266-1c1ef2d93688', 'photo-1600607687939-ce8a6c25118c'],
    description: 'A well-kept family home available on rent in a convenient, central neighbourhood. Sample content for demonstration purposes.',
    features: ['Separate entrance', 'Kitchen cabinets', 'Car porch', 'Near schools', 'Quiet street'] },
  { id: 7, title: 'Contemporary House with Pool', area: 'Other Karachi', category: 'Houses', mode: 'Buy', price: 112000000, beds: 5, baths: 5, sqft: 5400, unit: 'sq ft',
    images: ['photo-1512917774080-9991f1c4c750', 'photo-1613490493576-7fde63acd811', 'photo-1600596542815-ffad4c1539a9'],
    description: 'A statement residence with a private pool deck and entertaining spaces. Sample content for demonstration purposes.',
    features: ['Private pool', 'Home theatre room', 'Smart wiring', 'Landscaped lawn', 'Servant quarter'] },
  { id: 8, title: 'Boutique Office for Rent', area: 'Gulberg Town', category: 'Rental', mode: 'Rent', price: 450000, per: '/ month', beds: 0, baths: 2, sqft: 2200, unit: 'sq ft',
    images: ['photo-1497366216548-37526070297c', 'photo-1486406146926-c627a92ad1ab'],
    description: 'A refined office space with meeting room and reception, ready to move in. Sample content for demonstration purposes.',
    features: ['Reception area', 'Meeting room', 'Parking', 'Backup power', '24/7 access'] },
];

const fmtPrice = (p) => {
  const n = p.price;
  const v = n >= 1e7 ? `${+(n / 1e7).toFixed(2)} Crore` : n >= 1e5 ? `${+(n / 1e5).toFixed(2)} Lakh` : n.toLocaleString('en-PK');
  return `PKR ${v}${p.per ? ' ' + p.per : ''}`;
};

// Approximate AREA centres, for illustration only (not exact property addresses).
const AREA_COORDS = {
  'Bahria Town Karachi': [25.0136, 67.3100],
  'Federal B Area': [24.9333, 67.0833],
  'Gulberg Town': [24.9250, 67.0700],
  'Other Karachi': [24.8138, 67.0299],
};
// Office location, taken from the Google Maps embed supplied by the client (Adil Real Estate).
const OFFICE = { lat: 24.935977, lng: 67.0654601, label: 'Adil Real Estate & Builders' };
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${OFFICE.lat}%2C${OFFICE.lng}`;
const DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat}%2C${OFFICE.lng}`;
// Client-supplied Google Maps embed, used as a fallback if the Leaflet map cannot load.
const GMAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4451.69480475317!2d67.0654601!3d24.935976999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ff6515d6211%3A0x57a388ab12b44df8!2sAdil%20Real%20Estate!5e1!3m2!1sen!2s!4v1794682417289!5m2!1sen!2s';
const fmtShort = (p) => {
  const n = p.price;
  if (p.per) return `${+(n / 1e3).toFixed(0)}K/mo`;
  return n >= 1e7 ? `${+(n / 1e7).toFixed(1)} Cr` : `${+(n / 1e5).toFixed(0)} L`;
};
