// ===== lens.js — KAU E-Campus (Interactive Map) =====
let lensMap, lensInited = false;

const lensAreas = [
  { id: 'lib', name: 'المكتبة', emoji: '📚', lat: 21.498, lng: 39.247, score: 82, crowd: 'منخفض', count: 45 },
  { id: 'cs', name: 'كلية الحاسبات', emoji: '💻', lat: 21.501, lng: 39.252, score: 91, crowd: 'منخفض', count: 112 },
  { id: 'eng', name: 'كلية الهندسة', emoji: '⚙️', lat: 21.495, lng: 39.255, score: 74, crowd: 'متوسط', count: 88 },
  { id: 'cafe', name: 'الكافيتيريا', emoji: '🍽️', lat: 21.499, lng: 39.249, score: 55, crowd: 'عالٍ', count: 200 },
  { id: 'clinic', name: 'العيادة', emoji: '🏥', lat: 21.502, lng: 39.244, score: 72, crowd: 'منخفض', count: 20 },
  { id: 'sports', name: 'الملاعب', emoji: '⚽', lat: 21.493, lng: 39.250, score: 88, crowd: 'متوسط', count: 65 },
  { id: 'admin', name: 'الإدارة', emoji: '🏢', lat: 21.500, lng: 39.246, score: 60, crowd: 'متوسط', count: 35 },
  { id: 'reg', name: 'التسجيل', emoji: '📝', lat: 21.497, lng: 39.253, score: 50, crowd: 'عالٍ', count: 90 },
];

const lensFeed = [
  { loc: 'المكتبة', mood: '😄', text: 'هادئة جداً اليوم، مناسبة للمذاكرة!', time: 'منذ ٥ دقائق' },
  { loc: 'الكافيتيريا', mood: '😕', text: 'ازدحام كبير وقت الغداء', time: 'منذ ١٢ دقيقة' },
  { loc: 'كلية الحاسبات', mood: '😄', text: 'بيئة رائعة وإنترنت سريع', time: 'منذ ٢٠ دقيقة' },
  { loc: 'التسجيل', mood: '😢', text: 'طابور طويل جداً، نحتاج نظام أفضل', time: 'منذ ٣٥ دقيقة' },
  { loc: 'الملاعب', mood: '🙂', text: 'الجو ممتاز للرياضة اليوم', time: 'منذ ساعة' },
];

function scoreColor(s) {
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

  // Initialize Draggable Sheet
  const dataSheet = document.getElementById('lensDataSheet');
  if (dataSheet) {
    initDraggableSheet('lensDataSheet', 'lensDataSheetHandle', { type: 'lens', threshold: -50 });

    // Also expand when tapping the top visible area (optional but helpful)
    document.querySelector('.lens-data-sheet .location-row')?.addEventListener('click', () => {
      dataSheet.classList.add('expanded');
      document.getElementById('sheetBackdrop')?.classList.add('show');
    });
  }

  // Map filter buttons
  document.querySelectorAll('.mfb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mfb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast('🗺️ عرض: ' + btn.textContent.trim());
    });
  });

  // Init map
  setTimeout(() => {
    if (typeof L === 'undefined') return;
    if (lensMap) { lensMap.invalidateSize(); return; }
    lensMap = L.map('lensMap', { zoomControl: false, attributionControl: false }).setView([21.499, 39.250], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(lensMap);

    // Auto heatmap layer
    if (typeof L.heatLayer !== 'undefined') {
      const heatPoints = lensAreas.map(a => [a.lat, a.lng, a.score * 15]);
      L.heatLayer(heatPoints, {
        radius: 40,
        blur: 25,
        maxZoom: 17,
        gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
      }).addTo(lensMap);
    }

    lensAreas.forEach(area => addLensMarker(area));
  }, 150);
}

function addLensMarker(area) {
  const color = scoreColor(area.score);
  const face = area.score >= 80 ? '😄' : area.score >= 65 ? '😐' : '😢';
  const html = `<div class="e-marker">
    <div class="e-bubble" style="background:${color}22;border-color:${color};color:${color}">
      <span class="e-face">${face}</span>
      <span class="e-score">${area.score}%</span>
    </div>
    <div class="e-needle" style="background:${color}"></div>
  </div>`;
  const icon = L.divIcon({ html, className: '', iconSize: [50, 60], iconAnchor: [25, 60] });
  const marker = L.marker([area.lat, area.lng], { icon }).addTo(lensMap);
  const popup = `<div class="lmap-popup">
    <div class="lmap-popup-title">${area.emoji} ${area.name}</div>
    <div class="lmap-popup-score">${face} ${area.score}% سعادة · ازدحام: ${area.crowd}</div>
    <div style="display:flex; gap:6px; margin-top:10px;">
      <button class="lmap-popup-btn" style="margin-top:0; flex:1;" onclick="window.showToast('📍 ${area.name}: ${area.count} تفاعل اليوم')">التفاصيل</button>
      <button class="lmap-popup-btn" style="margin-top:0; flex:1; background:rgba(255,71,87,0.15); border-color:rgba(255,71,87,0.3); color:var(--red);" onclick="window.showToast('📢 جاري فتح نموذج البلاغ في ${area.name}')">إبلاغ هنا</button>
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
  const loc = document.getElementById('lensLocation')?.value;
  if (!sel) { showToast('⚠️ اختر تعبيراً أولاً'); return; }
  showToast('✅ تم تسجيل شعورك! +10 نقاط 🏆');
  document.querySelectorAll('#lensMoodRow .mood-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('lensComment').value = '';
}
