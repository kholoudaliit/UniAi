// ===== attend.js — Smart Attendance =====
let attendInited = false, qrTimer = null, qrSeconds = 300;

const lectures = [
  { icon:'💻', name:'CS302 — الخوارزميات', time:'٨:٠٠ - ٩:٣٠ ص', room:'أ-١٠٣', status:'done' },
  { icon:'🤖', name:'CS450 — الذكاء الاصطناعي', time:'١٠:٠٠ - ١١:٣٠ ص', room:'ب-٢٠٦', status:'active' },
  { icon:'🗄️', name:'CS401 — قواعد البيانات', time:'١:٠٠ - ٢:٣٠ م', room:'أ-٢٠١', status:'upcoming' },
];

function initAttend() {
  if (attendInited) return; attendInited = true;
  renderLectures();

  document.querySelectorAll('.arole').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arole').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isProf = btn.dataset.role === 'prof';
      document.getElementById('attendStudentView').classList.toggle('hidden', isProf);
      document.getElementById('attendProfView').classList.toggle('hidden', !isProf);
    });
  });

  document.getElementById('mockScanBtn')?.addEventListener('click', mockScan);
  document.getElementById('genQrBtn')?.addEventListener('click', generateQR);
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
  document.getElementById('qrDisplay').classList.remove('hidden');
  document.getElementById('genQrBtn').textContent = '🔄 تحديث QR Code';
  renderQRGrid();
  startQRTimer();
  simulateAttendance();
}

function renderQRGrid() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'qr-cell';
    const dark = Math.random() > 0.5;
    cell.style.background = dark ? '#1a1a2e' : '#ffffff';
    grid.appendChild(cell);
  }
  // Corners
  [0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48].forEach(i => {
    if (grid.children[i]) grid.children[i].style.background = '#1a1a2e';
  });
}

function startQRTimer() {
  if (qrTimer) clearInterval(qrTimer);
  qrSeconds = 300;
  qrTimer = setInterval(() => {
    qrSeconds--;
    const m = Math.floor(qrSeconds / 60);
    const s = String(qrSeconds % 60).padStart(2, '0');
    const el = document.getElementById('qrTimer');
    if (el) el.textContent = `⏱️ ينتهي خلال: ${String(m).padStart(2,'0')}:${s}`;
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
