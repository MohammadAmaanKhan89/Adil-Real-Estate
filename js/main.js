const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const hasGsap = typeof gsap !== 'undefined';
if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const animate = hasGsap && !reduce;

let filters = { mode: 'All', cat: 'All', loc: LOCATIONS[0], budget: 0 };
let favs = [];
let inDetail = false;

/* ---------- WhatsApp links, year ---------- */
$$('.wa-link').forEach((a) => (a.href = WA()));
$('#yr').textContent = new Date().getFullYear();

/* ---------- selects ---------- */
const opts = (arr) => arr.map((x, i) => `<option value="${i}">${x}</option>`).join('');
$('#sLoc').innerHTML = opts(LOCATIONS);
$('#fLoc').innerHTML = opts(LOCATIONS);
$('#sBudget').innerHTML = opts(BUDGETS.map((b) => b.label));
$('#fBudget').innerHTML = opts(BUDGETS.map((b) => b.label));
$('#chips').innerHTML = CATEGORIES.map((c) => `<button data-cat="${c}">${c}</button>`).join('');

/* ---------- images with fallback ---------- */
const imgTag = (id, w, alt = '') =>
  `<img src="${U(id, w)}" alt="${alt}" loading="lazy" onerror="this.outerHTML='<div class=&quot;img-fallback&quot;></div>'">`;

/* ---------- property cards + filtering ---------- */
const cardHTML = (p) => `
<article class="pcard" data-id="${p.id}">
  <div class="pcard-img">
    <button class="pcard-open" data-open="${p.id}" aria-label="View ${p.title}">${imgTag(p.images[0], 900, p.title)}</button>
    <span class="badge">${p.mode === 'Rent' ? 'For Rent' : p.category}</span>
    <button class="fav ${favs.includes(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-pressed="${favs.includes(p.id)}" aria-label="Toggle favourite">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${favs.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    </button>
    <span class="sample">Sample listing</span>
  </div>
  <div class="pcard-body">
    <p class="loc">📍 ${p.area}</p>
    <h3>${p.title}</h3>
    <p class="price">${fmtPrice(p)}</p>
    <ul class="specs">
      ${p.beds ? `<li>🛏 ${p.beds} Beds</li>` : ''}${p.baths ? `<li>🛁 ${p.baths} Baths</li>` : ''}<li>📐 ${p.sqft.toLocaleString()} ${p.unit}</li>
    </ul>
    <button class="link-btn" data-open="${p.id}">View Details →</button>
  </div>
</article>`;

function filtered() {
  const b = BUDGETS[filters.budget];
  return PROPERTIES.filter((p) =>
    (filters.mode === 'All' || p.mode === filters.mode) &&
    (filters.cat === 'All' || p.category === filters.cat || (filters.cat === 'Rental' && p.mode === 'Rent')) &&
    (filters.loc === LOCATIONS[0] || p.area === filters.loc) &&
    p.price >= b.min && p.price < b.max);
}
function renderGrid() {
  const list = filtered();
  $('#pgrid').innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  $$('#chips button').forEach((b) => b.classList.toggle('on', b.dataset.cat === filters.cat));
  $$('#modeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.m === filters.mode));
  $('#fLoc').value = LOCATIONS.indexOf(filters.loc);
  $('#fBudget').value = filters.budget;
  if (animate) gsap.from('#pgrid .pcard', { y: 28, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'all' });
  if (typeof updateMarkers === 'function') updateMarkers(list);
  if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
}
$('#chips').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { filters.cat = b.dataset.cat; renderGrid(); } });
$('#modeSeg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { filters.mode = b.dataset.m; renderGrid(); } });
$('#fLoc').addEventListener('change', (e) => { filters.loc = LOCATIONS[+e.target.value]; renderGrid(); });
$('#fBudget').addEventListener('change', (e) => { filters.budget = +e.target.value; renderGrid(); });
$('#resetF').addEventListener('click', () => { filters = { mode: 'All', cat: 'All', loc: LOCATIONS[0], budget: 0 }; renderGrid(); });

/* ---------- locations ---------- */
$('#locGrid').innerHTML = LOC_CARDS.map(([n, id, tag]) => `
  <div class="loc-card"><button data-loc="${n}" aria-label="Explore properties in ${n}">${imgTag(id, 1000, n)}
    <span class="loc-over"><small>${tag}</small><strong>${n}</strong><span class="loc-link">Explore Properties ↗</span></span></button></div>`).join('');

/* ---------- inquiry form (frontend validation only) ---------- */
const REQS = ['Buy a property', 'Sell a property', 'Rent a property', 'List my property', 'Construction services', 'Other'];
function mountForm(el, { compact = false, property = '' } = {}) {
  el.innerHTML = `
  <form class="form ${compact ? 'compact' : ''}" novalidate>
    <label class="f"><span>Name</span><input name="name" autocomplete="name" placeholder="Your full name"><em></em></label>
    <label class="f"><span>Phone Number</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0300 1234567"><em></em></label>
    <label class="f"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="you@example.com"><em></em></label>
    <label class="f"><span>Property Requirement</span><select name="req"><option value="">Select…</option>${REQS.map((r) => `<option>${r}</option>`).join('')}</select><em></em></label>
    <label class="f"><span>Message</span><textarea name="message" rows="${compact ? 3 : 4}" placeholder="Tell us what you’re looking for">${property ? `I'm interested in: ${property}.` : ''}</textarea><em></em></label>
    <button class="btn btn-primary lg block" type="submit">Submit Inquiry</button>
  </form>
  <div class="form-done" role="status" hidden><h3>Thank you — inquiry received</h3><p>This is a demo form: nothing has been sent. In production, your details would reach our team.</p><button class="btn btn-outline" type="button">Send another</button></div>`;
  const form = $('form', el), done = $('.form-done', el);
  if (property) form.req.value = 'Buy a property';
  const rules = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    phone: (v) => /^(92|0)?3\d{9}$/.test(v.replace(/[\s\-+]/g, '')) || 'Enter a valid Pakistani mobile number, e.g. 0300 1234567.',
    email: (v) => /^\S+@\S+\.\S+$/.test(v) || 'Enter a valid email address.',
    req: (v) => !!v || 'Please choose a requirement.',
    message: (v) => v.trim().length >= 10 || 'Please add a short message (10+ characters).',
  };
  const check = (k) => { const f = form[k], r = rules[k](f.value); f.parentElement.classList.toggle('bad', r !== true); f.parentElement.querySelector('em').textContent = r === true ? '' : r; return r === true; };
  Object.keys(rules).forEach((k) => form[k].addEventListener('input', () => form[k].parentElement.classList.contains('bad') && check(k)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) return;
    form.hidden = true; done.hidden = false;
    if (animate) gsap.from(done, { y: 16, opacity: 0, duration: 0.5 });
  });
  $('button', done).addEventListener('click', () => { form.reset(); done.hidden = true; form.hidden = false; });
}
mountForm($('#mainForm'));

/* ---------- detail view ---------- */
function openDetail(id) {
  const p = PROPERTIES.find((x) => x.id === id); if (!p) return;
  const similar = PROPERTIES.filter((x) => x.id !== id && (x.category === p.category || x.area === p.area)).slice(0, 3);
  let i = 0; const n = p.images.length;
  $('#detailView').innerHTML = `
  <div class="detail"><div class="container">
    <button class="back" id="back">← Back to properties</button>
    <div class="gallery">
      <div class="g-main"><div id="gImg"></div>
        ${n > 1 ? `<button class="g-nav l" id="gPrev" aria-label="Previous photo">‹</button><button class="g-nav r" id="gNext" aria-label="Next photo">›</button>` : ''}
        <span class="g-count" id="gCount"></span></div>
      <div class="g-thumbs">${p.images.map((s, k) => `<button data-k="${k}" aria-label="Show photo ${k + 1}">${imgTag(s, 300)}</button>`).join('')}</div>
    </div>
    <div class="detail-grid">
      <div class="detail-main">
        <span class="badge static">${p.mode === 'Rent' ? p.category + ' · For Rent' : p.category}</span>
        <h1>${p.title}</h1><p class="loc">📍 ${p.area}, Karachi</p><p class="price lg">${fmtPrice(p)}</p>
        <h2>Description</h2><p class="muted">${p.description}</p>
        <h2>Specifications</h2>
        <dl class="spec-grid">
          <div><dt>Type</dt><dd>${p.category}</dd></div><div><dt>Purpose</dt><dd>${p.mode === 'Rent' ? 'For Rent' : 'For Sale'}</dd></div>
          ${p.beds ? `<div><dt>Bedrooms</dt><dd>${p.beds}</dd></div>` : ''}${p.baths ? `<div><dt>Bathrooms</dt><dd>${p.baths}</dd></div>` : ''}
          <div><dt>${p.category === 'Plots' ? 'Plot size' : 'Covered area'}</dt><dd>${p.sqft.toLocaleString()} ${p.unit}</dd></div><div><dt>Area</dt><dd>${p.area}</dd></div>
        </dl>
        <h2>Location</h2><div class="dmap-wrap"><div id="dMap"></div><p class="demo-note left">Approximate area shown for illustration — not an exact address.</p></div>
        <h2>Features &amp; Amenities</h2>
        <ul class="amen">${p.features.map((f) => `<li><span class="tick">✓</span>${f}</li>`).join('')}</ul>
        <p class="demo-note left">Sample content for design demonstration. Details are illustrative only.</p>
      </div>
      <aside class="inquiry-card"><p class="price">${fmtPrice(p)}</p><h3>Inquire about this property</h3><div id="dForm"></div>
        <a class="btn btn-wa block" target="_blank" rel="noreferrer" href="${WA(`Hello, I'm interested in: ${p.title} (${p.area}).`)}">WhatsApp Inquiry</a></aside>
    </div>
    ${similar.length ? `<h2 class="similar-h">Similar Properties</h2><div class="pgrid">${similar.map(cardHTML).join('')}</div>` : ''}
  </div></div>`;
  mountForm($('#dForm'), { compact: true, property: p.title });
  destroyDetailMap(); mountDetailMap(p);
  const show = () => {
    $('#gImg').innerHTML = imgTag(p.images[i], 1600, `${p.title} photo ${i + 1}`);
    $('#gCount').textContent = `${i + 1} / ${n}`;
    $$('.g-thumbs button').forEach((b, k) => b.classList.toggle('on', k === i));
    if (animate) gsap.fromTo('#gImg img', { opacity: 0.2, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
  };
  show();
  $('#gPrev')?.addEventListener('click', () => { i = (i - 1 + n) % n; show(); });
  $('#gNext')?.addEventListener('click', () => { i = (i + 1) % n; show(); });
  $$('.g-thumbs button').forEach((b) => b.addEventListener('click', () => { i = +b.dataset.k; show(); }));
  $('#back').addEventListener('click', () => go('properties'));
  $('#homeView').classList.add('off'); $('#detailView').classList.add('on');
  inDetail = true; header.classList.add('solid'); window.scrollTo(0, 0);
  if (animate) gsap.from('.detail-main > *, .inquiry-card', { y: 22, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
}
function closeDetail() {
  destroyDetailMap();
  $('#detailView').classList.remove('on'); $('#homeView').classList.remove('off'); inDetail = false;
  window.dispatchEvent(new Event('scroll')); setTimeout(() => { map && map.invalidateSize(); contactMap && contactMap.invalidateSize(); }, 50); if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
}

/* ---------- navigation ---------- */
const header = $('#header');
function go(id) {
  closeDrawer();
  if (inDetail) closeDetail();
  requestAnimationFrame(() => {
    const el = document.getElementById(id); if (!el) return;
    const y = id === 'home' ? 0 : el.getBoundingClientRect().top + scrollY - 84;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });
}
function applyFilters(patch) { filters = { mode: 'All', cat: 'All', loc: LOCATIONS[0], budget: 0, ...patch }; renderGrid(); go('properties'); }

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-open],[data-fav],[data-loc],[data-apply],[data-apply-cat]');
  if (!t) return;
  if (t.dataset.go) { e.preventDefault(); go(t.dataset.go); }
  else if (t.dataset.open) openDetail(+t.dataset.open);
  else if (t.dataset.fav) {
    const id = +t.dataset.fav; favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    $$(`[data-fav="${id}"]`).forEach((b) => { const on = favs.includes(id); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none'); });
    if (animate) gsap.fromTo(t, { scale: 1 }, { scale: 1.3, yoyo: true, repeat: 1, duration: 0.18 });
  }
  else if (t.dataset.loc) { e.preventDefault(); applyFilters({ loc: t.dataset.loc }); flyToArea(t.dataset.loc); }
  else if (t.dataset.apply) { e.preventDefault(); applyFilters({ mode: t.dataset.apply }); }
  else if (t.dataset.applyCat) { e.preventDefault(); applyFilters({ cat: t.dataset.applyCat }); }
});

/* hero search */
let heroMode = 'Buy';
$$('.seg [data-mode]').forEach((b) => b.addEventListener('click', () => { heroMode = b.dataset.mode; $$('.seg [data-mode]').forEach((x) => x.classList.toggle('on', x === b)); }));
$('#searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = $('#sType').value;
  applyFilters({ mode: heroMode, cat: type === 'Any type' ? 'All' : type, loc: LOCATIONS[+$('#sLoc').value], budget: +$('#sBudget').value });
});

/* mobile drawer */
const drawer = $('#drawer'), burger = $('#burger');
function closeDrawer() { drawer.classList.remove('open'); burger.textContent = '☰'; burger.setAttribute('aria-expanded', 'false'); header.classList.toggle('menu', false); document.body.style.overflow = ''; }
burger.addEventListener('click', () => {
  const open = !drawer.classList.contains('open');
  drawer.classList.toggle('open', open); burger.textContent = open ? '✕' : '☰'; burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : ''; header.classList.toggle('solid', open || scrollY > 40 || inDetail);
  if (open && animate) gsap.from('#drawer nav a', { x: 24, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
});

/* header + progress */
const progress = $('#progress');
function onScroll() {
  header.classList.toggle('solid', scrollY > 40 || inDetail || drawer.classList.contains('open'));
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- GSAP animations ---------- */
if (animate) {
  // hero intro
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('[data-hero].eyebrow', { y: 20, opacity: 0, duration: 0.7 })
    .from('.hero h1 .line > span', { yPercent: 110, duration: 1.1, stagger: 0.14 }, '-=0.4')
    .from('.hero-sub, .hero-actions, .hero-chips', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.7')
    .from('.search', { y: 40, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.header', { yPercent: -100, duration: 0.8 }, 0.2);
  gsap.from('#heroBg', { scale: 1.12, duration: 2.4, ease: 'power2.out' });

  if (window.ScrollTrigger) {
    // hero parallax
    gsap.to('#heroBg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-in', { yPercent: -8, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } });
    // section reveals
    $$('[data-fade]').forEach((el) => gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
    $$('[data-stagger]').forEach((wrap) => gsap.from(wrap.children, { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 85%', once: true } }));
    // about image parallax
    gsap.fromTo('.about-img img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.about-img', scrub: true } });
    gsap.from('#pgrid .pcard', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: '#pgrid', start: 'top 85%', once: true } });
  }

  // magnetic hero buttons
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3 }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.5)' }));
  });
}
/* ---------- MAPS (Leaflet + Esri tiles, no API key) ---------- */
const TILES = {
  street: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', attr: '© Esri, HERE, Garmin, OpenStreetMap contributors', max: 19 },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© Esri, Maxar, Earthstar Geographics', max: 19 },
  dark: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', attr: '© Esri, HERE, Garmin, OpenStreetMap contributors', max: 16 },
};
const hasL = typeof L !== 'undefined';
let map = null, tileLayer = null, markers = new Map(), meMarker = null, mapStyle = 'street';
const KHI = [24.95, 67.12];

// deterministic small offset so pins in one area don't stack exactly
const pos = (p) => { const c = AREA_COORDS[p.area] || KHI; const o = ((p.id * 37) % 11 - 5) * 0.0045, o2 = ((p.id * 53) % 11 - 5) * 0.0045; return [c[0] + o, c[1] + o2]; };
const addTiles = (m, style) => L.tileLayer(TILES[style].url, { maxZoom: TILES[style].max, attribution: TILES[style].attr }).addTo(m);
const pinIcon = (p, active) => L.divIcon({ className: 'pin-wrap', html: `<span class="pin ${active ? 'active' : ''} ${p.mode === 'Rent' ? 'rent' : ''}">${fmtShort(p)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
const popupHTML = (p) => `<div class="mp"><div class="mp-img">${imgTag(p.images[0], 500, p.title)}</div><div class="mp-b"><b>${p.title}</b><span>📍 ${p.area}</span><strong>${fmtPrice(p)}</strong><button class="link-btn" data-open="${p.id}">View Details →</button></div></div>`;

const officeIcon = () => L.divIcon({ className: 'pin-wrap', html: '<span class="office-pin"><i></i>Our Office</span>', iconSize: [0, 0] });
const officePopup = () => `<div class="mp-b" style="padding:12px 14px"><b>${OFFICE.label}</b><span>Office location</span><a class="link-btn" href="${DIRECTIONS_LINK}" target="_blank" rel="noreferrer">Get Directions →</a></div>`;
function initMainMap() {
  const el = $('#map'); if (!el) return;
  if (!hasL) { $('#mapFallback').hidden = false; el.style.display = 'none'; return; }
  map = L.map('map', { center: KHI, zoom: 10, zoomControl: true, scrollWheelZoom: false, worldCopyJump: true });
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
  tileLayer = addTiles(map, 'street');
  map.on('moveend zoomend', () => { $('#mapZoom').textContent = `Zoom: ${map.getZoom()}`; const c = map.getCenter(); $('#mapCoords').textContent = `${c.lat.toFixed(4)}°, ${c.lng.toFixed(4)}°`; });
  map.on('focus', () => map.scrollWheelZoom.enable()); map.on('blur', () => map.scrollWheelZoom.disable());
  $$('.map-style-btn').forEach((b) => b.addEventListener('click', () => {
    mapStyle = b.dataset.style; map.removeLayer(tileLayer); tileLayer = addTiles(map, mapStyle); tileLayer.bringToBack();
    $$('.map-style-btn').forEach((x) => x.classList.toggle('active', x === b));
    $('.mapbox').dataset.style = mapStyle;
  }));
  $('#fitAll').addEventListener('click', fitMarkers);
  $('#locateMe').addEventListener('click', locateMe);
  if (OFFICE) L.marker([OFFICE.lat, OFFICE.lng], { icon: officeIcon(), zIndexOffset: 500 }).addTo(map).bindPopup(officePopup());
  $('#officeBtn')?.addEventListener('click', () => map.flyTo([OFFICE.lat, OFFICE.lng], 15, { duration: 1 }));
}
function fitMarkers() {
  if (!map) return;
  const pts = [...markers.values()].map((m) => m.getLatLng());
  if (!pts.length) return map.flyTo(KHI, 10);
  map.flyToBounds(L.latLngBounds(pts).pad(0.25), { duration: 0.9, maxZoom: 13 });
}
function setActive(id, on) {
  const m = markers.get(id); if (!m) return;
  const p = PROPERTIES.find((x) => x.id === id); m.setIcon(pinIcon(p, on)); m.setZIndexOffset(on ? 1000 : 0);
  $$(`.mli[data-id="${id}"]`).forEach((e) => e.classList.toggle('on', on));
}
function updateMarkers(list) {
  const cnt = $('#mapCount'); if (cnt) cnt.textContent = `${list.length} ${list.length === 1 ? 'property' : 'properties'}`;
  const ul = $('#mapList');
  if (ul) ul.innerHTML = list.length ? list.map((p) => `<button class="mli" data-id="${p.id}"><span class="mli-img">${imgTag(p.images[0], 240, '')}</span><span class="mli-t"><b>${p.title}</b><small>${p.area}</small><em>${fmtPrice(p)}</em></span></button>`).join('') : '<p class="mli-empty">No properties match your filters.</p>';
  if (!map) return;
  markers.forEach((m) => map.removeLayer(m)); markers.clear();
  list.forEach((p) => {
    const m = L.marker(pos(p), { icon: pinIcon(p, false), riseOnHover: true }).addTo(map).bindPopup(popupHTML(p), { maxWidth: 260, closeButton: true });
    m.on('mouseover', () => setActive(p.id, true)); m.on('mouseout', () => setActive(p.id, false));
    m.on('click', () => setActive(p.id, true));
    markers.set(p.id, m);
  });
  fitMarkers();
}
// list interactions (delegated)
document.addEventListener('mouseover', (e) => { const li = e.target.closest('.mli'); if (li) setActive(+li.dataset.id, true); });
document.addEventListener('mouseout', (e) => { const li = e.target.closest('.mli'); if (li) setActive(+li.dataset.id, false); });
document.addEventListener('click', (e) => {
  const li = e.target.closest('.mli'); if (!li || !map) return;
  const m = markers.get(+li.dataset.id); if (!m) return;
  map.flyTo(m.getLatLng(), 14, { duration: 0.9 }); setTimeout(() => m.openPopup(), 950);
  if (innerWidth < 900) $('#map').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
function locateMe() {
  if (!map) return;
  if (!navigator.geolocation) return alert('Geolocation is not supported by your browser.');
  const btn = $('#locateMe'); btn.textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition((pos) => {
    const ll = [pos.coords.latitude, pos.coords.longitude];
    if (meMarker) map.removeLayer(meMarker);
    meMarker = L.marker(ll, { icon: L.divIcon({ className: 'pin-wrap', html: '<span class="me-dot"></span>', iconSize: [0, 0] }) }).addTo(map).bindPopup('You are here').openPopup();
    map.flyTo(ll, 13, { duration: 1 }); btn.textContent = '📍 Near me';
  }, () => { btn.textContent = '📍 Near me'; alert('Could not get your location. Allow location access and try again.'); }, { enableHighAccuracy: true, timeout: 10000 });
}
function flyToArea(name) {
  const c = AREA_COORDS[name]; if (!map || !c) return;
  setTimeout(() => map.flyTo(c, 12, { duration: 1 }), 400);
}

// contact map (area view; office pin only when OFFICE is set)
let contactMap = null;
function initContactMap() {
  const el = $('#contactMap'); if (!el) return;
  if (!hasL) { el.innerHTML = `<iframe title="Office location" src="${GMAPS_EMBED}" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`; return; }
  const c = [OFFICE.lat, OFFICE.lng];
  contactMap = L.map('contactMap', { center: c, zoom: 15, scrollWheelZoom: false });
  addTiles(contactMap, 'street');
  L.marker(c, { icon: officeIcon() }).addTo(contactMap).bindPopup(officePopup());
}

// detail-page map: approximate area circle (not an exact address)
let detailMap = null;
function mountDetailMap(p) {
  const el = $('#dMap'); if (!el || !hasL) return;
  const c = pos(p);
  detailMap = L.map('dMap', { center: c, zoom: 13, scrollWheelZoom: false });
  addTiles(detailMap, 'street');
  L.circle(c, { radius: 900, color: '#087B9F', weight: 2, fillColor: '#299BC4', fillOpacity: 0.18 }).addTo(detailMap);
  L.marker(c, { icon: pinIcon(p, true) }).addTo(detailMap);
}
function destroyDetailMap() { if (detailMap) { detailMap.remove(); detailMap = null; } }

initMainMap();
initContactMap();
// leaflet needs a size refresh when containers change size/visibility
const refreshMaps = () => { map && map.invalidateSize(); contactMap && contactMap.invalidateSize(); detailMap && detailMap.invalidateSize(); };
addEventListener('resize', refreshMaps); addEventListener('load', () => setTimeout(refreshMaps, 300));

renderGrid();

// office links
['mapsOpen', 'addrLink', 'footMap'].forEach((id) => { const a = document.getElementById(id); if (a) a.href = MAPS_LINK; });
const md = document.getElementById('mapsDir'); if (md) md.href = DIRECTIONS_LINK;
