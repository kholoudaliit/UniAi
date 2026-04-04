// ===== lens.js — KAU E-Campus (Interactive Map) =====
let lensMap, lensInited = false;
let lensMarkers = [];
let lensHeatLayer = null;

const lensAreas = [
  { id: 'lib', name: 'المكتبة المركزية', emoji: '📚', lat: 21.498, lng: 39.247, score: 82, crowdScore: 20, crowd: 'منخفض', count: 45, category: 'academic' },
  { id: 'cs', name: 'كلية الحاسبات', emoji: '💻', lat: 21.501, lng: 39.252, score: 91, crowdScore: 15, crowd: 'منخفض', count: 112, category: 'academic' },
  { id: 'eng', name: 'كلية الهندسة', emoji: '⚙️', lat: 21.495, lng: 39.255, score: 74, crowdScore: 50, crowd: 'متوسط', count: 88, category: 'academic' },
  { id: 'cafe_main', name: 'ستاربكس - الحاسبات', emoji: '☕', lat: 21.500, lng: 39.251, score: 85, crowdScore: 80, crowd: 'عالٍ', count: 200, category: 'cafe' },
  { id: 'cafe_lib', name: 'بارنز - المكتبة', emoji: '☕', lat: 21.4985, lng: 39.2465, score: 90, crowdScore: 40, crowd: 'متوسط', count: 60, category: 'cafe' },
  { id: 'food_1', name: 'المطعم المركزي', emoji: '🍔', lat: 21.499, lng: 39.249, score: 55, crowdScore: 95, crowd: 'عالٍ', count: 250, category: 'food' },
  { id: 'food_2', name: 'صب واي - الهندسة', emoji: '🥪', lat: 21.496, lng: 39.254, score: 72, crowdScore: 60, crowd: 'متوسط', count: 40, category: 'food' },
  { id: 'study_1', name: 'قاعة المطالعة A', emoji: '📖', lat: 21.4975, lng: 39.248, score: 88, crowdScore: 15, crowd: 'هادئ', count: 30, category: 'study' },
  { id: 'study_2', name: 'مركاز الابتكار', emoji: '💡', lat: 21.502, lng: 39.253, score: 95, crowdScore: 35, crowd: 'متوسط', count: 55, category: 'study' },
  { id: 'study_3', name: 'غرف المذاكرة - الحاسب', emoji: '✍️', lat: 21.5005, lng: 39.2525, score: 92, crowdScore: 70, crowd: 'مزدحم', count: 85, category: 'study' },
  { id: 'clinic', name: 'العيادة', emoji: '🏥', lat: 21.502, lng: 39.244, score: 72, crowdScore: 10, crowd: 'منخفض', count: 20, category: 'other' },
  { id: 'sports', name: 'الملاعب', emoji: '⚽', lat: 21.493, lng: 39.250, score: 88, crowdScore: 30, crowd: 'متوسط', count: 65, category: 'other' },
  { id: 'admin', name: 'الإدارة', emoji: '🏢', lat: 21.500, lng: 39.246, score: 60, crowdScore: 45, crowd: 'متوسط', count: 35, category: 'other' },
  { id: 'reg', name: 'التسجيل', emoji: '📝', lat: 21.497, lng: 39.253, score: 50, crowdScore: 90, crowd: 'عالٍ', count: 90, category: 'other' },
];

const lensFeed = [
  { loc: 'المكتبة', mood: '😄', text: 'هادئة جداً اليوم، مناسبة للمذاكرة!', time: 'منذ ٥ دقائق' },
  { loc: 'المطعم المركزي', mood: '😕', text: 'ازدحام كبير وقت الغداء', time: 'منذ ١٢ دقيقة' },
  { loc: 'كلية الحاسبات', mood: '😄', text: 'بيئة رائعة وإنترنت سريع', time: 'منذ ٢٠ دقيقة' },
  { loc: 'التسجيل', mood: '😢', text: 'طابور طويل جداً، نحتاج نظام أفضل', time: 'منذ ٣٥ دقيقة' },
  { loc: 'الملاعب', mood: '🙂', text: 'الجو ممتاز للرياضة اليوم', time: 'منذ ساعة' },
];

const lensRoads = [
  { name: 'طريق الكليات الرئيسي', score: 95, path: [[21.503, 39.245], [21.501, 39.252], [21.498, 39.255]], status: 'ازدحام شديد 🔴' },
  { name: 'مدخل المكتبة والخدمات', score: 45, path: [[21.498, 39.245], [21.498, 39.247], [21.499, 39.250]], status: 'مرور سلس 🟢' },
  { name: 'شارع الهندسة الجانبي', score: 70, path: [[21.495, 39.255], [21.493, 39.250], [21.496, 39.248]], status: 'تأخير بسيط 🟠' },
  { name: 'طريق الملاعب والرياضة', score: 20, path: [[21.493, 39.250], [21.490, 39.252]], status: 'خالٍ تماماً ✨' }
];

function scoreColor(s, mode = 'happy') {
  if (mode === 'crowd' || mode === 'traffic') {
    if (s >= 90) return '#8B0000'; // Dark Red (Congested)
    if (s >= 75) return '#FF4757'; // Red (Heavy)
    if (s >= 50) return '#FF9F43'; // Orange (Medium)
    return '#00C896'; // Green (Smooth)
  }
  if (s >= 80) return '#00C896';
  if (s >= 65) return '#FFD93D';
  return '#FF4757';
}

function initLens() {
  if (lensInited) return;
  lensInited = true;

  renderHmapBars();
  renderLensFeed();
  initMoodButtons();

  document.getElementById('lensSendBtn')?.addEventListener('click', submitLensMood);
  document.getElementById('lensPhotoBtn')?.addEventListener('click', () => showToast('📷 ميزة الصور قادمة قريباً!'));

  // Click anywhere on the sheet header to toggle open/close
  const dataSheet = document.getElementById('lensDataSheet');
  const sheetHeader = document.getElementById('lensDataSheetHandle');

  if (dataSheet && sheetHeader) {
    sheetHeader.addEventListener('click', () => {
      dataSheet.classList.toggle('expanded');
    });
  }

  // Update mood label when location changes
  const locSelect = document.getElementById('lensLocation');
  const moodLabel = document.getElementById('lensMoodLabel');
  function updateMoodLabel() {
    const name = locSelect?.options[locSelect.selectedIndex]?.text || 'موقعك';
    if (moodLabel) moodLabel.textContent = `سجل شعورك ورضاك في (${name})`;
  }
  locSelect?.addEventListener('change', updateMoodLabel);

  // Map filter buttons
  document.querySelectorAll('.mfb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mfb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode') || 'happy';
      showToast('🗺️ عرض: ' + btn.textContent.trim());
      updateMapLayers(mode);
    });
  });

  // Init map
  setTimeout(() => {
    if (typeof L === 'undefined') return;
    if (lensMap) { lensMap.invalidateSize(); return; }
    lensMap = L.map('lensMap', { zoomControl: false, attributionControl: false }).setView([21.499, 39.250], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(lensMap);

    updateMapLayers('happy');
  }, 150);
}

let crowdCircles = [];
let trafficLines = [];

function updateMapLayers(mode) {
  if (!lensMap || typeof L === 'undefined') return;

  // Clear existing markers
  lensMarkers.forEach(m => lensMap.removeLayer(m));
  lensMarkers = [];

  // Clear existing heat layer
  if (lensHeatLayer) {
    lensMap.removeLayer(lensHeatLayer);
    lensHeatLayer = null;
  }

  // Clear crowd circles
  crowdCircles.forEach(c => lensMap.removeLayer(c));
  crowdCircles = [];

  // Clear traffic lines
  trafficLines.forEach(line => lensMap.removeLayer(line));
  trafficLines = [];

  // 1. Determine which areas to show as markers
  let filteredAreas = lensAreas;
  if (mode === 'cafe') filteredAreas = lensAreas.filter(a => a.category === 'cafe');
  else if (mode === 'food') filteredAreas = lensAreas.filter(a => a.category === 'food');
  else if (mode === 'study') filteredAreas = lensAreas.filter(a => a.category === 'study');
  else if (mode === 'crowd') filteredAreas = []; // No pins in crowd layer mode, just visualization

  filteredAreas.forEach(area => addLensMarker(area, mode));

  // 2. Heatmap logic (ONLY for happy or all)
  if ((mode === 'happy' || mode === 'all') && typeof L.heatLayer !== 'undefined') {
    const heatPoints = [];
    lensAreas.forEach(a => {
      let val = a.score;
      const intensity = val / 180; 
      heatPoints.push([a.lat, a.lng, intensity]);
      for (let i = 0; i < 2; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.003;
        const offsetLng = (Math.random() - 0.5) * 0.003;
        heatPoints.push([a.lat + offsetLat, a.lng + offsetLng, intensity * 0.3]);
      }
    });

    let gradient = {
      0.1: 'rgba(7, 243, 203, 0.1)', 0.3: 'rgba(7, 243, 203, 0.25)', 
      0.6: 'rgba(0, 210, 255, 0.45)', 0.8: 'rgba(255, 230, 0, 0.55)', 1.0: 'rgba(255, 78, 80, 0.65)'
    };

    lensHeatLayer = L.heatLayer(heatPoints, {
      radius: 55, blur: 40, maxZoom: 17, max: 0.4, gradient: gradient
    }).addTo(lensMap);
  }

  // 3. (Removed Density Circles as requested)

  // 4. Enhanced Traffic Layer (Google Maps Style with Halos)
  if (mode === 'crowd' || mode === 'all') {
    lensRoads.forEach(road => {
      const color = scoreColor(road.score, 'traffic');
      const baseWeight = mode === 'crowd' ? 7 : 5;
      
      // 4a. White Background Line (Halo/Outline)
      const halo = L.polyline(road.path, {
        color: '#FFFFFF',
        weight: baseWeight + 2,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      }).addTo(lensMap);
      trafficLines.push(halo);

      // 4b. Actual Colored Traffic Line
      const line = L.polyline(road.path, {
        color: color,
        weight: baseWeight,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'traffic-line' + (road.score >= 90 ? ' traffic-heavy' : '')
      }).addTo(lensMap);

      line.bindPopup(`<div style="font-family:inherit; direction:rtl; text-align:right; min-width:120px;">
        <strong style="color:${color}; font-size:0.95rem;">${road.name}</strong><br>
        <div style="margin-top:6px; display:flex; align-items:center; gap:6px;">
          <span style="font-size:1.1rem;">📊</span>
          <span>الحالة: <b>${road.status}</b></span>
        </div>
        <div style="font-size:0.78rem; color:#666; margin-top:4px;">⏱️ تأخير متوقع: ${Math.floor(road.score/8) + 1} دقائق</div>
      </div>`);

      trafficLines.push(line);
    });
  }
}

function addLensMarker(area, mode) {
  let html = '';
  let iconSize = [50, 60];
  let iconAnchor = [25, 60];

  if (mode === 'happy' || mode === 'all' || area.category === 'academic') {
    const val = area.score;
    const color = scoreColor(val, 'happy');
    const face = val >= 80 ? '😄' : val >= 65 ? '😐' : '😢';
    
    html = `<div class="e-marker">
      <div class="e-bubble" style="background:${color}22;border-color:${color};color:${color}">
        <span class="e-face">${face}</span><span class="e-score">${val}%</span>
      </div>
      <div class="e-needle" style="background:${color}"></div>
    </div>`;
  } else {
    // Standard Pins for Cafes, Food, Study
    let pinColor = '#7B2FFF';
    if (area.category === 'cafe') pinColor = '#6F4E37';
    if (area.category === 'food') pinColor = '#FF9F43';
    if (area.category === 'study') pinColor = '#00C896';

    html = `<div class="std-marker">
      <div class="std-pin" style="background:${pinColor}">
        <span>${area.emoji}</span>
      </div>
      <div class="std-dot"></div>
    </div>`;
    iconSize = [40, 50];
    iconAnchor = [20, 50];
  }

  const icon = L.divIcon({ html, className: '', iconSize, iconAnchor });
  const marker = L.marker([area.lat, area.lng], { icon }).addTo(lensMap);
  lensMarkers.push(marker);

  const popup = `<div class="lmap-popup">
    <div class="lmap-popup-title">${area.emoji} ${area.name}</div>
    <div class="lmap-popup-score">⚡ الحالة: ${area.crowd} · ${area.count} سجلوا اليوم</div>
    <div style="display:flex; gap:6px; margin-top:10px;">
      <button class="lmap-popup-btn" style="margin-top:0; flex:1;" onclick="window.showToast('📍 ${area.name}: شكراً لتقييمك')">تفاصيل</button>
      <button class="lmap-popup-btn" style="margin-top:0; flex:1; background:rgba(255,71,87,0.1); border-color:rgba(255,71,87,0.2); color:var(--red);" onclick="window.showToast('📢 بلاغ تم رفعه')">بلاغ</button>
    </div>
  </div>`;
  marker.bindPopup(popup, { maxWidth: 200 });
}

function renderHmapBars() {
  const el = document.getElementById('hmapBars');
  if (!el) return;
  lensAreas.forEach(a => {
    const color = scoreColor(a.score);
    el.innerHTML += `<div class="hmap-item">
      <div class="hmap-lbl"><span>${a.emoji} ${a.name}</span><span style="color:${color}">${a.score}%</span></div>
      <div class="hmap-track"><div class="hmap-fill" style="width:${a.score}%;background:${color}"></div></div>
    </div>`;
  });
}

function renderLensFeed() {
  const el = document.getElementById('lensFeed');
  if (!el) return;
  lensFeed.forEach(f => {
    el.innerHTML += `<div class="lf-item">
      <div class="lf-meta">${f.mood} ${f.loc} · ${f.time}</div>
      <div class="lf-text">${f.text}</div>
    </div>`;
  });
}

function initMoodButtons() {
  document.querySelectorAll('#lensMoodRow .mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lensMoodRow .mood-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });
  });
}

function submitLensMood() {
  const sel = document.querySelector('#lensMoodRow .mood-btn.sel');
  if (!sel) { showToast('⚠️ اختر تعبيراً أولاً'); return; }
  const loc = document.getElementById('lensLocation')?.value || 'cs';
  showToast('✅ تم تسجيل شعورك! +10 نقاط 🏆');
  document.querySelectorAll('#lensMoodRow .mood-btn').forEach(b => b.classList.remove('sel'));
}
