// ===== calendar2.js — Smart Calendar =====
let calInited = false;
const eventsData = [
  { day:2, month:'أبر', type:'social', title:'هاكاثون الذكاء الاصطناعي', meta:'٩ص · قاعة الابتكار', cat:'social' },
  { day:3, month:'أبر', type:'exam', title:'اختبار CS302 — الخوارزميات', meta:'١٠ص · أ-١٠٣', cat:'exam' },
  { day:5, month:'أبر', type:'sports', title:'بطولة كرة القدم الجامعية', meta:'٣م · الملعب الرئيسي', cat:'sports' },
  { day:7, month:'أبر', type:'academic', title:'محاضرة: مستقبل الذكاء الاصطناعي', meta:'١١ص · قاعة المؤتمرات', cat:'academic' },
  { day:10, month:'أبر', type:'exam', title:'اختبار CS401 — قواعد البيانات', meta:'٢م · ب-٢٠٤', cat:'exam' },
  { day:12, month:'أبر', type:'academic', title:'معرض مشاريع التخرج', meta:'٩ص - ٣م · المبنى الرئيسي', cat:'academic' },
  { day:15, month:'أبر', type:'social', title:'يوم الكلية المفتوح', meta:'١٠ص · الساحة الرئيسية', cat:'social' },
];

function initCalendar() {
  if (calInited) return; calInited = true;
  renderCalDays();
  renderCalMonth();
  renderEvents('all');

  document.getElementById('btnViewStrip')?.addEventListener('click', (e) => toggleCalView('strip', e.target));
  document.getElementById('btnViewMonth')?.addEventListener('click', (e) => toggleCalView('month', e.target));

  document.getElementById('addEventBtn')?.addEventListener('click', () => {
    document.getElementById('addEventSheet')?.classList.remove('hidden');
  });
  document.getElementById('saveEvtBtn')?.addEventListener('click', saveEvent);
  document.getElementById('calPrev')?.addEventListener('click', () => showToast('◀ مارس ٢٠٢٦'));
  document.getElementById('calNext')?.addEventListener('click', () => showToast('▶ مايو ٢٠٢٦'));

  document.querySelectorAll('.cal-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cal-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderEvents(chip.dataset.cf);
    });
  });
}

function renderCalDays() {
  const row = document.getElementById('calDaysRow');
  if (!row) return;
  const days = ['أح','إث','ثل','أر','خم','جم','سب'];
  const today = 1; // April 1
  row.innerHTML = '';
  for (let i = 1; i <= 7; i++) {
    const hasEvent = eventsData.some(e => e.day === i + 1);
    const div = document.createElement('div');
    div.className = 'cal-day' + (i === today ? ' today' : '');
    div.innerHTML = `<span class="cal-day-name">${days[(i-1) % 7]}</span>
      <span class="cal-day-num">${i}</span>
      ${hasEvent ? '<div class="cal-day-dot"></div>' : ''}`;
    div.addEventListener('click', () => {
      document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
    });
    row.appendChild(div);
  }
}

function renderCalMonth() {
  const grid = document.getElementById('calMonthGrid');
  if (!grid) return;
  const days = ['أح','إث','ثل','أر','خم','جم','سب'];
  grid.innerHTML = '';
  
  // Header row
  days.forEach(d => {
    const div = document.createElement('div');
    div.className = 'cal-day-name';
    div.style.textAlign = 'center';
    div.style.padding = '4px 0';
    div.innerText = d;
    grid.appendChild(div);
  });
  
  // Empty cells for the start of the month (April 2026 starts on Wed = index 3)
  for(let i = 0; i < 3; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
  }
  
  const today = 1; 
  for (let i = 1; i <= 30; i++) {
    const hasEvent = eventsData.some(e => e.day === i);
    const div = document.createElement('div');
    // Using the same CSS class as the strip, but we can customize if needed
    div.className = 'cal-day' + (i === today ? ' today' : '');
    div.innerHTML = `<span class="cal-day-num">${i}</span>
      ${hasEvent ? '<div class="cal-day-dot"></div>' : ''}`;
    div.addEventListener('click', () => {
      document.querySelectorAll('#calMonthGrid .cal-day').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
    });
    grid.appendChild(div);
  }
}

function toggleCalView(view, btn) {
  document.querySelectorAll('.cvt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (view === 'strip') {
    document.getElementById('calDaysRow')?.classList.remove('hidden');
    document.getElementById('calMonthGrid')?.classList.add('hidden');
  } else {
    document.getElementById('calDaysRow')?.classList.add('hidden');
    document.getElementById('calMonthGrid')?.classList.remove('hidden');
  }
}


function renderEvents(filter) {
  const el = document.getElementById('eventsList');
  if (!el) return;
  const evts = filter === 'all' ? eventsData : eventsData.filter(e => e.cat === filter);
  el.innerHTML = evts.map(e => `
    <div class="evt-item">
      <div class="evt-date">
        <div class="evt-day">${e.day}</div>
        <div class="evt-mon">${e.month}</div>
      </div>
      <div class="evt-body">
        <div class="evt-title">${e.title}</div>
        <div class="evt-meta">📍 ${e.meta}</div>
        <span class="evt-tag ${e.type}">${
          e.type==='academic' ? '🎓 أكاديمي' :
          e.type==='exam' ? '📝 اختبار' :
          e.type==='social' ? '🎉 اجتماعي' : '⚽ رياضي'
        }</span>
      </div>
    </div>`).join('');
}

function saveEvent() {
  const name = document.getElementById('evtName')?.value;
  if (!name?.trim()) { showToast('⚠️ أدخل اسم الفعالية'); return; }
  document.getElementById('addEventSheet')?.classList.add('hidden');
  showToast('✅ تمت إضافة الفعالية بنجاح!');
}
