// ===== calendar.js — Interactive Events Calendar =====

const EVENTS = [
  { id: 1, title: 'معرض التوظيف ٢٠٢٦', type: 'career',   date: '2026-03-31', time: '10:00', location: 'المبنى الرئيسي' },
  { id: 2, title: 'هاكاثون الذكاء الاصطناعي', type: 'academic', date: '2026-04-02', time: '09:00', location: 'قاعة الابتكار' },
  { id: 3, title: 'بطولة كرة القدم الجامعية', type: 'sports',   date: '2026-04-05', time: '15:00', location: 'الملعب الرئيسي' },
  { id: 4, title: 'محاضرة: مستقبل الـ AI', type: 'academic', date: '2026-04-08', time: '11:00', location: 'قاعة ٢٠١-أ' },
  { id: 5, title: 'حفل تكريم المتفوقين', type: 'social',   date: '2026-04-10', time: '17:00', location: 'القاعة الكبرى' },
  { id: 6, title: 'ورشة: Python للمبتدئين', type: 'academic', date: '2026-04-12', time: '09:30', location: 'مختبر الحاسب ٣' },
  { id: 7, title: 'يوم المهنة والتوظيف', type: 'career',   date: '2026-04-15', time: '10:00', location: 'فناء الجامعة' },
  { id: 8, title: 'فعالية اليوم الوطني', type: 'social',   date: '2026-03-30', time: '16:00', location: 'الساحة المركزية' },
  { id: 9, title: 'اختبار منتصف الفصل - CS302', type: 'academic', date: '2026-04-03', time: '10:00', location: 'قاعة الاختبارات' },
];

let currentDate = new Date(2026, 2, 30); // March 2026
let activeFilter = 'all';
let events = [...EVENTS];

const ARABIC_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const TYPE_LABELS = { academic: '🎓 أكاديمي', social: '🎉 اجتماعي', sports: '⚽ رياضي', career: '💼 مهني' };

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderUpcomingEvents();
  initCalendarControls();
  initAddEvent();
});

function renderCalendar() {
  const title = document.getElementById('calMonthTitle');
  const grid = document.getElementById('calendarGrid');
  if (!title || !grid) return;

  title.textContent = `${ARABIC_MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Keep headers
  const headers = Array.from(grid.querySelectorAll('.cal-day-header'));
  grid.innerHTML = '';
  headers.forEach(h => grid.appendChild(h));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const today = new Date();

  // Prev month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'cal-day other-month';
    day.innerHTML = `<span class="cal-day-num">${daysInPrev - i}</span>`;
    grid.appendChild(day);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr && (activeFilter === 'all' || e.type === activeFilter));
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

    const day = document.createElement('div');
    day.className = `cal-day${isToday ? ' today' : ''}${dayEvents.length > 0 ? ' has-events' : ''}`;

    let dotsHtml = '';
    dayEvents.slice(0, 2).forEach(ev => {
      const colors = { academic: '#2563EB', social: '#EC4899', sports: '#059669', career: '#D97706' };
      dotsHtml += `<div class="cal-event-dot" style="background:${colors[ev.type] || '#7C3AED'}"></div>`;
    });

    day.innerHTML = `<span class="cal-day-num">${d}</span>${dotsHtml}`;

    if (dayEvents.length > 0) {
      day.addEventListener('click', () => showDayEvents(d, dateStr, dayEvents));
    }
    grid.appendChild(day);
  }

  // Next month filler
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day other-month';
    day.innerHTML = `<span class="cal-day-num">${i}</span>`;
    grid.appendChild(day);
  }
}

function showDayEvents(dayNum, dateStr, dayEvents) {
  const list = document.getElementById('upcomingEventsList');
  if (!list) return;
  list.innerHTML = `<h4 style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:10px;">📅 ${dayNum} ${ARABIC_MONTHS[currentDate.getMonth()]}</h4>`;
  dayEvents.forEach(ev => {
    const colors = { academic: 'var(--blue)', social: 'var(--pink)', sports: 'var(--green)', career: 'var(--amber)' };
    list.innerHTML += `
      <div class="event-card ${ev.type}">
        <div class="event-card-title">${ev.title}</div>
        <div class="event-card-meta">🕐 ${ev.time} · 📍 ${ev.location}</div>
        <div class="event-card-meta">${TYPE_LABELS[ev.type] || ev.type}</div>
      </div>`;
  });
}

function renderUpcomingEvents() {
  const list = document.getElementById('upcomingEventsList');
  if (!list) return;
  list.innerHTML = '';

  const today = new Date();
  const upcoming = events
    .filter(e => {
      const d = new Date(e.date);
      return d >= today && (activeFilter === 'all' || e.type === activeFilter);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  upcoming.forEach(ev => {
    const d = new Date(ev.date);
    list.innerHTML += `
      <div class="event-card ${ev.type}">
        <div class="event-card-title">${ev.title}</div>
        <div class="event-card-meta">📅 ${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]} · 🕐 ${ev.time}</div>
        <div class="event-card-meta">📍 ${ev.location}</div>
      </div>`;
  });
}

function initCalendarControls() {
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.dataset.filter;
      renderCalendar();
      renderUpcomingEvents();
    });
  });
}

function initAddEvent() {
  const modal = document.getElementById('addEventModal');
  document.getElementById('addEventBtn')?.addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('closeEventModal')?.addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('cancelEvent')?.addEventListener('click', () => modal.classList.remove('open'));

  // Set today as default date
  const today = new Date();
  const dateInput = document.getElementById('eventDate');
  if (dateInput) dateInput.value = today.toISOString().split('T')[0];

  document.getElementById('saveEvent')?.addEventListener('click', () => {
    const name = document.getElementById('eventName').value.trim();
    const type = document.getElementById('eventType').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value.trim();

    if (!name || !date) { window.showToast('⚠️ الرجاء ملء الحقول المطلوبة'); return; }

    const newEvent = { id: Date.now(), title: name, type, date, time: time || '09:00', location: location || 'غير محدد' };
    events.push(newEvent);
    renderCalendar();
    renderUpcomingEvents();
    modal.classList.remove('open');
    window.showToast('✅ تمت إضافة الفعالية!');

    // Reset form
    document.getElementById('eventName').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventDesc').value = '';
  });

  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}
