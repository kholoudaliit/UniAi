// ===== chat2.js — KAU Chat =====
let chatInited = false;

const chatRooms = [
  { id:'cs302', type:'courses', icon:'💻', name:'CS302 — الخوارزميات', meta:'د. خالد الغامدي · ٤٢ طالب', last:'اذكروا موعد الاختبار', time:'٩:٣٠', unread:3 },
  { id:'cs401', type:'courses', icon:'🗄️', name:'CS401 — قواعد البيانات', meta:'د. سلمى الزهراني · ٣٨ طالب', last:'تم رفع الواجب', time:'أمس', unread:0 },
  { id:'cs450', type:'courses', icon:'🤖', name:'CS450 — الذكاء الاصطناعي', meta:'د. أحمد مصطفى · ٥٠ طالب', last:'درس اليوم ممتاز!', time:'أمس', unread:0 },
  { id:'startup', type:'interests', icon:'🚀', name:'ريادة الأعمال', meta:'٩٨ عضو', last:'فرصة تسجيل في Hackathon', time:'الإثنين', unread:1 },
  { id:'sports', type:'interests', icon:'⚽', name:'كرة القدم', meta:'٦٤ عضو', last:'المباراة النهائي السبت!', time:'الأحد', unread:2 },
  { id:'ai_club', type:'interests', icon:'🧠', name:'نادي الذكاء الاصطناعي', meta:'١٢٠ عضو', last:'ورشة GPT-4 غداً', time:'السبت', unread:0 },
  { id:'dr_khaled', type:'direct', icon:'👨‍🏫', name:'د. خالد الغامدي', meta:'متاح الآن 🟢', last:'ابحثي عن مصادر الخوارزمية', time:'٨:٠٠', unread:0 },
];

const chatMsgsDB = {
  cs302: [
    { from:'other', name:'أحمد', text:'متى موعد الاختبار النصفي؟', time:'٩:٢٠' },
    { from:'other', name:'د. خالد', text:'موعد الاختبار سيكون في نهاية الشهر، لكن أود معرفة اليوم المناسب لكم', time:'٩:٢٥' },
    { from:'mine', name:'سارة', text:'شكراً دكتور 🙏', time:'٩:٢٨' },
    { from:'other', name:'لمى', text:'هل سيكون الاختبار على كل الفصول؟', time:'٩:٣٠' },
    { from:'vote', vote: true, name:'د. خالد', text:'🗳️ تصويت: ما الموعد المناسب للاختبار النصفي القادم؟', opts:['١٨ أبريل - الأحد','٢٠ أبريل - الثلاثاء','٢٢ أبريل - الخميس'], time:'٩:٣١' },
  ],
  dr_khaled: [
    { from:'other', name:'د. خالد', text:'أهلاً سارة، كيف تسير دراستك؟', time:'٨:٠٠' },
    { from:'mine', name:'سارة', text:'بخير دكتور، لدي سؤال عن المشروع', time:'٨:٠٢' },
    { from:'other', name:'د. خالد', text:'تفضلي، أنا هنا', time:'٨:٠٣' },
    { from:'mine', name:'سارة', text:'هل يجب أن تكون خوارزمية الفرز بالترتيب التنازلي فقط؟', time:'٨:٠٥' },
    { from:'other', name:'د. خالد', text:'لا، ابحثي عن مصادر الخوارزمية واختاري الأنسب لموضوع مشروعك', time:'٨:٠٦' },
  ],
};

let currentRoom = null;

function initChat() {
  if (chatInited) return; chatInited = true;
  renderRooms('courses');
  document.querySelectorAll('.ctab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRooms(tab.dataset.ct);
    });
  });
  document.getElementById('chatSendBtn')?.addEventListener('click', sendChatMsg);
  document.getElementById('chatInput')?.addEventListener('keydown', e => { if (e.key==='Enter') sendChatMsg(); });
  document.getElementById('chatBackToList')?.addEventListener('click', closeChatWindow);
}

function renderRooms(type) {
  const list = document.getElementById('chatRoomsList');
  if (!list) return;
  const rooms = chatRooms.filter(r => r.type === type);
  list.innerHTML = rooms.map(r => `
    <div class="room-item" data-room="${r.id}">
      <div class="room-icon">${r.icon}</div>
      <div class="room-info">
        <div class="room-name">${r.name}</div>
        <div class="room-last">${r.last}</div>
      </div>
      <div class="room-meta">
        <div class="room-time">${r.time}</div>
        ${r.unread ? `<div class="room-unread">${r.unread}</div>` : ''}
      </div>
    </div>`).join('');

  list.querySelectorAll('.room-item').forEach(el => {
    el.addEventListener('click', () => openChatWindow(el.dataset.room));
  });
}

function openChatWindow(roomId) {
  currentRoom = chatRooms.find(r => r.id === roomId);
  if (!currentRoom) return;
  document.getElementById('chatListView').classList.add('hidden');
  const win = document.getElementById('chatWindowView');
  win.classList.remove('hidden');
  document.getElementById('chatWinIcon').textContent = currentRoom.icon;
  document.getElementById('chatWinName').textContent = currentRoom.name;
  document.getElementById('chatWinMeta').textContent = currentRoom.meta;
  
  const pinnedContainer = document.getElementById('chatPinnedContainer');
  if (roomId === 'cs302') {
    pinnedContainer.innerHTML = `
      <div style="background: rgba(123, 47, 255, 0.1); border-bottom: 1px solid rgba(123, 47, 255, 0.2); padding: 12px 16px; display: flex; align-items: flex-start; gap: 12px;">
        <div style="font-size: 1.2rem;">📌</div>
        <div style="flex: 1;">
          <div style="font-family: var(--fn-ar); font-size: 0.75rem; color: var(--c2); margin-bottom: 2px;">إعلان مثبت من د. خالد الغامدي</div>
          <div style="font-family: var(--fn-ar); font-size: 0.85rem; color: var(--txt); margin-bottom: 8px;">تم تحديد موعد الاختبار النصفي يوم الخميس ٢٢ أبريل في القاعة الكبرى الساعة العاشرة صباحاً.</div>
          <button onclick="addToCalendar('الاختبار النصفي - CS302', '2026-04-22', '10:00')" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(123, 47, 255, 0.1); color: var(--c2); border: 1px solid rgba(123, 47, 255, 0.2); border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-family: var(--fn-ar); font-weight: 500;">
            📅 إضافة لـ KAU Calendar
          </button>
        </div>
      </div>
    `;
  } else {
    pinnedContainer.innerHTML = '';
  }

  renderChatMsgs(roomId);
}

function closeChatWindow() {
  document.getElementById('chatWindowView').classList.add('hidden');
  document.getElementById('chatListView').classList.remove('hidden');
  currentRoom = null;
}

function renderChatMsgs(roomId) {
  const msgs = chatMsgsDB[roomId] || [
    { from:'other', name:'كلية الحاسبات', text:'مرحباً بك في المجموعة 👋', time:'٩:٠٠' }
  ];
  const el = document.getElementById('chatMsgs');
  el.innerHTML = msgs.map(m => {
    if (m.vote || m.from === 'vote') return renderVoteMsg(m);
    return `<div class="cmsg ${m.from}">
      ${m.from==='other' ? `<div class="cmsg-av">${m.name[0]}</div>` : ''}
      <div>
        ${m.from==='other' ? `<div style="font-size:0.7rem;color:#8892AA;margin-bottom:3px">${m.name}</div>` : ''}
        <div class="cmsg-bubble">${m.text}</div>
        <div class="cmsg-time">${m.time}</div>
      </div>
    </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function renderVoteMsg(m) {
  const opts = m.opts.map((o,i) => `<button onclick="voteChatOpt(this,${i})" style="display:block;width:100%;padding:8px 12px;margin-top:6px;background:var(--card);border:1px solid var(--border);border-radius:8px;color:var(--txt);font-family:var(--fn-ar);font-size:0.82rem;cursor:pointer;text-align:right;transition:all 0.2s">${o}</button>`).join('');
  return `<div class="cmsg other">
    <div class="cmsg-av">د</div>
    <div>
      <div style="font-size:0.7rem;color:var(--txt2);margin-bottom:3px">${m.name}</div>
      <div class="cmsg-bubble">${m.text}${opts}</div>
      <div class="cmsg-time">${m.time}</div>
    </div>
  </div>`;
}

window.voteChatOpt = function(btn, idx) {
  btn.style.background = 'rgba(123,47,255,0.15)';
  btn.style.borderColor = 'var(--c2)';
  btn.style.color = 'var(--c2)';
  showToast('✅ تم تسجيل صوتك! +5 نقاط');
};

window.addToCalendar = function(title, date, time) {
  showToast(`📅 تم إضافة "${title}" إلى KAU Calendar بنجاح!`);
};

function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const text = input?.value.trim();
  if (!text) return;
  const msgs = document.getElementById('chatMsgs');
  const msgEl = document.createElement('div');
  msgEl.className = 'cmsg mine';
  const now = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
  msgEl.innerHTML = `<div><div class="cmsg-bubble">${text}</div><div class="cmsg-time">${time}</div></div>`;
  msgs.appendChild(msgEl);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'cmsg other';
    reply.innerHTML = `<div class="cmsg-av">🤖</div><div><div class="cmsg-bubble">تم استلام رسالتك ✓</div><div class="cmsg-time">${time}</div></div>`;
    msgs.appendChild(reply);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1000);
}
