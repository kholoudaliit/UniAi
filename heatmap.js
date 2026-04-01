// ===== heatmap.js — Real Map with Leaflet.js + Emoji Heatmap =====
// جامعة الملك عبدالعزيز — جدة
// إحداثيات حقيقية لمواقع الحرم الجامعي

const CAMPUS_AREAS = [
  {
    id: 'library',
    name: 'المكتبة الجامعية',
    emoji: '📚',
    lat: 21.4925, lng: 39.2475,
    score: 82, responses: 124,
    color: '#22c55e',
  },
  {
    id: 'cs',
    name: 'كلية الحاسبات',
    emoji: '💻',
    lat: 21.4940, lng: 39.2460,
    score: 91, responses: 98,
    color: '#22c55e',
  },
  {
    id: 'engineering',
    name: 'كلية الهندسة',
    emoji: '⚙️',
    lat: 21.4910, lng: 39.2450,
    score: 74, responses: 87,
    color: '#eab308',
  },
  {
    id: 'cafeteria',
    name: 'الكافيتيريا',
    emoji: '🍽️',
    lat: 21.4930, lng: 39.2490,
    score: 68, responses: 210,
    color: '#eab308',
  },
  {
    id: 'clinic',
    name: 'العيادة الجامعية',
    emoji: '🏥',
    lat: 21.4955, lng: 39.2470,
    score: 72, responses: 45,
    color: '#eab308',
  },
  {
    id: 'sports',
    name: 'المنشآت الرياضية',
    emoji: '⚽',
    lat: 21.4900, lng: 39.2480,
    score: 88, responses: 76,
    color: '#22c55e',
  },
  {
    id: 'admin',
    name: 'الإدارة العامة',
    emoji: '🏢',
    lat: 21.4945, lng: 39.2440,
    score: 55, responses: 63,
    color: '#ef4444',
  },
  {
    id: 'registration',
    name: 'التسجيل والقبول',
    emoji: '📝',
    lat: 21.4935, lng: 39.2500,
    score: 60, responses: 112,
    color: '#ef4444',
  },
  {
    id: 'mosque',
    name: 'المسجد الجامعي',
    emoji: '🕌',
    lat: 21.4920, lng: 39.2465,
    score: 95, responses: 88,
    color: '#22c55e',
  },
  {
    id: 'parking',
    name: 'مواقف السيارات',
    emoji: '🚗',
    lat: 21.4960, lng: 39.2455,
    score: 48, responses: 95,
    color: '#ef4444',
  },
  {
    id: 'bookstore',
    name: 'مكتبة الكتب',
    emoji: '📖',
    lat: 21.4915, lng: 39.2435,
    score: 78, responses: 52,
    color: '#eab308',
  },
  {
    id: 'lab',
    name: 'المختبرات العلمية',
    emoji: '🔬',
    lat: 21.4948, lng: 39.2485,
    score: 83, responses: 67,
    color: '#22c55e',
  },
];

const FEEDBACK_POOL = [
  { area: 'المكتبة', mood: 5, text: 'جو هادئ ومريح للمذاكرة 👍', time: 'منذ ٥ دقائق' },
  { area: 'الكافيتيريا', mood: 2, text: 'الازدحام شديد وقت الغداء', time: 'منذ ١٠ دقائق' },
  { area: 'كلية الحاسبات', mood: 5, text: 'الأجهزة ممتازة والإنترنت سريع!', time: 'منذ ١٥ دقيقة' },
  { area: 'الإدارة', mood: 2, text: 'طول الانتظار مزعج جداً', time: 'منذ ٢٠ دقيقة' },
  { area: 'المنشآت الرياضية', mood: 4, text: 'الملاعب نظيفة ومنظمة', time: 'منذ ٢٥ دقيقة' },
  { area: 'مواقف السيارات', mood: 1, text: 'لا توجد أماكن فارغة في الصباح!', time: 'منذ ٣٠ دقيقة' },
  { area: 'المسجد', mood: 5, text: 'جميل ومريح للصلاة والتأمل', time: 'منذ ٤٥ دقيقة' },
];

let leafletMap = null;
const leafletMarkers = {};
let selectedMood = null;
let activeMapFilter = 'all';

// ===== EMOJI FACE by score =====
function scoreToFace(score) {
  if (score >= 85) return '😄';
  if (score >= 70) return '🙂';
  if (score >= 55) return '😐';
  if (score >= 40) return '😕';
  return '😢';
}

function scoreToColor(score) {
  if (score >= 80) return { bg: '#22c55e', ring: '#16a34a' };
  if (score >= 60) return { bg: '#eab308', ring: '#ca8a04' };
  return { bg: '#ef4444', ring: '#dc2626' };
}

function updateAreaColor(area) {
  const c = scoreToColor(area.score);
  area.color = c.bg;
}

// ===== BUILD CUSTOM MARKER HTML =====
function buildMarkerIcon(area) {
  updateAreaColor(area);
  const c = scoreToColor(area.score);
  const face = scoreToFace(area.score);
  const html = `
    <div class="emoji-marker" style="--ring:${c.ring}; --bg:${c.bg}">
      <div class="emoji-bubble">
        <span class="emoji-face">${face}</span>
        <span class="emoji-place">${area.emoji}</span>
      </div>
      <div class="emoji-score">${area.score}%</div>
      <div class="emoji-needle"></div>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [70, 80],
    iconAnchor: [35, 80],
    popupAnchor: [0, -80],
  });
}

// ===== CIRCLE LAYER (heatmap glow) =====
const circleOverlays = {};

function getCircleColor(area) {
  const c = scoreToColor(area.score);
  return c.bg;
}

// ===== INIT MAP =====
document.addEventListener('DOMContentLoaded', () => {
  initLeafletMap();
  renderHeatmapBars();
  renderFeedbackList();
  initMoodSubmit();
  startLiveUpdates();
  initMapFilterBtns();
});

function initLeafletMap() {
  const mapEl = document.getElementById('campusLeafletMap');
  if (!mapEl || leafletMap) return;

  // Center: جامعة الملك عبدالعزيز
  leafletMap = L.map('campusLeafletMap', {
    center: [21.4930, 39.2468],
    zoom: 16,
    zoomControl: true,
    attributionControl: false,
  });

  // OpenStreetMap tiles (dark style via CartoDB)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(leafletMap);

  // Add attribution small
  L.control.attribution({ position: 'bottomleft', prefix: '© OpenStreetMap · CARTO' }).addTo(leafletMap);

  // Add all markers
  CAMPUS_AREAS.forEach(area => addAreaMarker(area));

  // Add campus boundary polygon (approximate KAU boundary)
  const campusBounds = [
    [21.4958, 39.2430],
    [21.4958, 39.2510],
    [21.4895, 39.2510],
    [21.4895, 39.2430],
  ];
  L.polygon(campusBounds, {
    color: 'rgba(124,58,237,0.6)',
    weight: 2,
    fillColor: 'rgba(124,58,237,0.04)',
    fillOpacity: 1,
    dashArray: '6 4',
  }).addTo(leafletMap).bindPopup('<b>🏛️ حرم جامعة الملك عبدالعزيز</b><br>جدة، المملكة العربية السعودية');

  // Force map to render correctly after section shown
  document.querySelector('[data-section="heatmap"]')?.addEventListener('click', () => {
    setTimeout(() => leafletMap.invalidateSize(), 300);
  });
}

function addAreaMarker(area) {
  if (!leafletMap) return;

  // Glow circle
  const circle = L.circle([area.lat, area.lng], {
    radius: 55,
    color: scoreToColor(area.score).ring,
    fillColor: scoreToColor(area.score).bg,
    fillOpacity: 0.18,
    weight: 1,
  }).addTo(leafletMap);
  circleOverlays[area.id] = circle;

  // Emoji marker
  const marker = L.marker([area.lat, area.lng], {
    icon: buildMarkerIcon(area),
    zIndexOffset: 100,
  }).addTo(leafletMap);

  // Popup
  const face = scoreToFace(area.score);
  marker.bindPopup(buildPopupHtml(area), {
    className: 'custom-popup',
    maxWidth: 260,
    minWidth: 220,
  });

  marker.on('click', () => {
    document.getElementById('locationSelect').value = area.id;
  });

  leafletMarkers[area.id] = marker;
}

function buildPopupHtml(area) {
  const c = scoreToColor(area.score);
  const face = scoreToFace(area.score);
  return `
    <div class="map-popup-inner">
      <div class="popup-header" style="background:${c.bg}20; border-right:3px solid ${c.bg}">
        <span class="popup-place-icon">${area.emoji}</span>
        <div>
          <div class="popup-name">${area.name}</div>
          <div class="popup-face-score">${face} ${area.score}% سعادة</div>
        </div>
      </div>
      <div class="popup-bar-wrap">
        <div class="popup-bar-fill" style="width:${area.score}%;background:${c.bg}"></div>
      </div>
      <div class="popup-stats">
        <span>👥 ${area.responses} تقييم</span>
        <span style="color:${c.bg}">${getMoodLabel(area.score)}</span>
      </div>
      <button class="popup-cta" onclick="document.getElementById('locationSelect').value='${area.id}'; window.showToast('📍 تم اختيار ${area.name}')">
        قيّم هذا المكان 💬
      </button>
    </div>`;
}

function getMoodLabel(score) {
  if (score >= 85) return '😄 ممتاز';
  if (score >= 70) return '🙂 جيد';
  if (score >= 55) return '😐 متوسط';
  if (score >= 40) return '😕 سيء';
  return '😢 سيء جداً';
}

function updateMarker(area) {
  if (!leafletMap) return;

  // Update marker icon
  const marker = leafletMarkers[area.id];
  if (marker) {
    marker.setIcon(buildMarkerIcon(area));
    marker.setPopupContent(buildPopupHtml(area));
  }

  // Update circle
  const circle = circleOverlays[area.id];
  if (circle) {
    const c = scoreToColor(area.score);
    circle.setStyle({
      color: c.ring,
      fillColor: c.bg,
    });
  }
}

// ===== MAP FILTER BUTTONS =====
function initMapFilterBtns() {
  document.getElementById('mapViewAll')?.addEventListener('click', function() {
    setMapFilter('all', this);
  });
  document.getElementById('mapViewHappy')?.addEventListener('click', function() {
    setMapFilter('happy', this);
  });
  document.getElementById('mapViewSad')?.addEventListener('click', function() {
    setMapFilter('sad', this);
  });
}

function setMapFilter(filter, btn) {
  activeMapFilter = filter;
  document.querySelectorAll('.map-ctrl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  CAMPUS_AREAS.forEach(area => {
    const marker = leafletMarkers[area.id];
    const circle = circleOverlays[area.id];
    if (!marker) return;

    let show = true;
    if (filter === 'happy' && area.score < 70) show = false;
    if (filter === 'sad' && area.score >= 70) show = false;

    const mapPane = leafletMap.getPanes().markerPane;
    if (show) {
      if (!leafletMap.hasLayer(marker)) marker.addTo(leafletMap);
      if (!leafletMap.hasLayer(circle)) circle.addTo(leafletMap);
    } else {
      leafletMap.removeLayer(marker);
      leafletMap.removeLayer(circle);
    }
  });
}

// ===== STATS BARS =====
function renderHeatmapBars() {
  const container = document.getElementById('heatmapBarList');
  if (!container) return;
  container.innerHTML = '';

  [...CAMPUS_AREAS].sort((a, b) => b.score - a.score).slice(0, 6).forEach(area => {
    const c = scoreToColor(area.score);
    const face = scoreToFace(area.score);
    container.innerHTML += `
      <div class="heatmap-bar-item">
        <div class="heatmap-bar-label">
          <span>${area.emoji} ${area.name}</span>
          <span style="color:${c.bg}">${face} ${area.score}%</span>
        </div>
        <div class="heatmap-bar-track">
          <div class="heatmap-bar-fill" style="width:${area.score}%;background:linear-gradient(to left,${c.bg},${c.bg}77)"></div>
        </div>
      </div>`;
  });
}

function renderFeedbackList() {
  const list = document.getElementById('feedbackList');
  if (!list) return;
  list.innerHTML = '';

  FEEDBACK_POOL.forEach(f => {
    const emojiMap = { 5: '😄', 4: '🙂', 3: '😐', 2: '😕', 1: '😢' };
    list.innerHTML += `
      <li class="feedback-item">
        <div class="feedback-meta">${f.area} · ${f.time}</div>
        ${emojiMap[f.mood]} ${f.text}
      </li>`;
  });
}

// ===== MOOD SUBMIT =====
function initMoodSubmit() {
  const emojis = document.querySelectorAll('.mood-emoji');
  emojis.forEach(btn => {
    btn.addEventListener('click', function() {
      emojis.forEach(e => e.classList.remove('selected'));
      this.classList.add('selected');
      selectedMood = parseInt(this.dataset.mood);
    });
  });

  document.getElementById('submitMoodBtn')?.addEventListener('click', () => {
    if (!selectedMood) { window.showToast('⚠️ الرجاء اختيار حالتك أولاً'); return; }

    const loc = document.getElementById('locationSelect').value;
    const area = CAMPUS_AREAS.find(a => a.id === loc);
    if (area) {
      area.score = Math.min(99, Math.round((area.score * area.responses + selectedMood * 20) / (area.responses + 1)));
      area.responses++;

      const comment = document.getElementById('moodComment').value.trim();
      if (comment) {
        const emojiMap = { 5: '😄', 4: '🙂', 3: '😐', 2: '😕', 1: '😢' };
        FEEDBACK_POOL.unshift({ area: area.name, mood: selectedMood, text: comment, time: 'الآن' });
        document.getElementById('moodComment').value = '';
      }

      updateMarker(area);
      renderHeatmapBars();
      renderFeedbackList();

      // Fly to updated area
      if (leafletMap) leafletMap.flyTo([area.lat, area.lng], 17, { duration: 1 });

      window.showToast(`✅ ${scoreToFace(area.score)} شكراً! تم تسجيل شعورك في ${area.name}`);
      document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
      selectedMood = null;
    }
  });
}

// ===== LIVE UPDATES =====
function startLiveUpdates() {
  setInterval(() => {
    const idx = Math.floor(Math.random() * CAMPUS_AREAS.length);
    const area = CAMPUS_AREAS[idx];
    const delta = (Math.random() - 0.45) * 3;
    area.score = Math.max(20, Math.min(99, Math.round(area.score + delta)));
    area.responses++;
    updateMarker(area);
    renderHeatmapBars();
  }, 5000);
}

// ===== Mini campus for dashboard =====
function renderMiniCampus() {
  const container = document.getElementById('miniCampusAreas');
  if (!container) return;
  container.innerHTML = '';
  CAMPUS_AREAS.slice(0, 8).forEach(a => {
    const div = document.createElement('div');
    div.className = 'campus-area-mini';
    div.style.background = `linear-gradient(135deg, ${scoreToColor(a.score).bg}aa, ${scoreToColor(a.score).ring}88)`;
    div.innerHTML = `<span>${scoreToFace(a.score)}</span><span style="font-size:0.6rem">${a.emoji}</span>`;
    div.title = `${a.name}: ${a.score}%`;
    container.appendChild(div);
  });
}

// Expose for app.js
window.renderMiniCampus = renderMiniCampus;
window.scoreToColor = scoreToColor;
window.scoreToGradient = (score) => {
  const c = scoreToColor(score);
  return `linear-gradient(135deg, ${c.bg}, ${c.ring})`;
};
