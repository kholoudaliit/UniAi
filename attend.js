// ===== attend.js — Smart Attendance =====
let attendInited = false, qrTimer = null, qrSeconds = 300;

const lectures = [
  { icon: '💻', name: 'CS302 — الخوارزميات', time: '٨:٠٠ - ٩:٣٠ ص', room: 'أ-١٠٣', status: 'done' },
  { icon: '🤖', name: 'CS450 — الذكاء الاصطناعي', time: '١٠:٠٠ - ١١:٣٠ ص', room: 'ب-٢٠٦', status: 'active' },
  { icon: '🗄️', name: 'CS401 — قواعد البيانات', time: '١:٠٠ - ٢:٣٠ م', room: 'أ-٢٠١', status: 'upcoming' },
];

function initAttend() {
  if (attendInited) return; attendInited = true;
  renderLectures();

  const screen = document.getElementById('screen-attend');
  if (screen) screen.classList.add('mode-student');

  document.querySelectorAll('.arole').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arole').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isProf = btn.dataset.role === 'prof';
      
      if (screen) {
        screen.classList.toggle('mode-student', !isProf);
        screen.classList.toggle('mode-prof', isProf);
        const title = screen.querySelector('.nav-title');
        if (title) title.textContent = isProf ? 'بوابة الدكتور' : 'تحضيري';
      }

      document.getElementById('attendStudentView').classList.toggle('hidden', isProf);
      document.getElementById('attendProfView').classList.toggle('hidden', !isProf);
      
      if (isProf) {
        setTimeout(() => {
          generateQR();
          showToast('🔄 تم التبديل وتوليد رمز التحضير تلقائياً');
        }, 50);
      }
    });
  });

  document.getElementById('mockScanBtn')?.addEventListener('click', mockScan);
}

function renderLectures() {
  const el = document.getElementById('lecturesList');
  if (!el) return;
  el.innerHTML = lectures.map(l => `
    <div class="lec-item">
      <div class="lec-icon">${l.icon}</div>
      <div class="lec-info">
        <div class="lec-name">${l.name}</div>
        <div class="lec-time">🕐 ${l.time} · 📍 ${l.room}</div>
      </div>
      ${l.status === 'done' ? '<span class="lec-status done">✅ حضرت</span>' :
      l.status === 'active' ? '<span class="lec-status active">🔴 جارية</span>' :
        '<span class="lec-status" style="color:#8892AA;font-size:0.72rem">قادمة</span>'}
    </div>`).join('');
}

function mockScan() {
  const card = document.getElementById('scanCard');
  card.style.borderColor = '#00C896';
  card.innerHTML = `
    <div class="scan-inner" style="text-align:center">
      <div style="font-size:2.5rem;margin-bottom:8px">✅</div>
      <div style="font-size:0.95rem;font-weight:700;color:#00C896">تم تسجيل حضورك!</div>
      <div style="font-size:0.8rem;color:#8892AA;margin-top:6px">CS450 — الذكاء الاصطناعي<br>٩:٥٥ ص · تم التحقق من موقعك</div>
      <div style="margin-top:10px;font-size:0.78rem;color:#FFD93D">+15 نقطة 🏆</div>
    </div>`;
  showToast('✅ تم تسجيل حضورك بنجاح! +15 نقطة');
}

function generateQR() {
  const qrShow = document.getElementById('qrDisplay');
  if (qrShow) qrShow.classList.remove('hidden');
  
  const genBtn = document.getElementById('genQrBtn');
  if (genBtn) genBtn.textContent = '🔄 تحديث QR Code';
  
  renderQRGrid();
  startQRTimer();
  simulateAttendance();
}

function renderQRGrid() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  // Clear and ensure visibility
  grid.innerHTML = '';
  // A clean, realistic SVG mock QR code with fixed dimensions for better reliability
  grid.innerHTML = `<svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white"/>
    <path d="M10 10h30v30h-30zM17 17h16v16h-16zM10 60h30v30h-30zM17 67h16v16h-16zM60 10h30v30h-30zM67 17h16v16h-16z" fill="#1E293B"/>
    <path d="M45 10h10v10h-10zM45 25h10v10h-10zM10 45h10v10h-10zM25 45h10v10h-10zM45 45h10v10h-10zM60 45h30v10h-30zM10 60v30M60 60h10v10h-10zM75 60h15v10h-15zM60 75h10v10h-10zM75 75h15v15h-15z" stroke="#1E293B" stroke-width="2"/>
    <rect x="22" y="22" width="6" height="6" fill="#1E293B"/>
    <rect x="72" y="22" width="6" height="6" fill="#1E293B"/>
    <rect x="22" y="72" width="6" height="6" fill="#1E293B"/>
  </svg>`;
}

function startQRTimer() {
  if (qrTimer) clearInterval(qrTimer);
  qrSeconds = 300;
  qrTimer = setInterval(() => {
    qrSeconds--;
    const m = Math.floor(qrSeconds / 60);
    const s = String(qrSeconds % 60).padStart(2, '0');
    const el = document.getElementById('qrTimer');
    if (el) el.textContent = `⏱️ ينتهي خلال: ${String(m).padStart(2, '0')}:${s}`;
    if (qrSeconds <= 0) { clearInterval(qrTimer); if (el) el.textContent = '⏱️ انتهت صلاحية QR Code'; }
  }, 1000);
}

function simulateAttendance() {
  let present = 23;
  const interval = setInterval(() => {
    if (present >= 28) { clearInterval(interval); return; }
    present++;
    const el = document.getElementById('presentCount');
    if (el) el.textContent = present;
    const absent = 28 - present;
    const abEl = document.getElementById('absentCount');
    if (abEl) abEl.textContent = absent;
  }, 2000);
}
