// ===== voice.js — KAU Voice =====
let voteInited = false;

const pollsData = [
  { id:1, type:'survey', title:'استطلاع جودة الخدمات الجامعية', q:'كيف تقيّم جودة الخدمات في المكتبة؟', opts:[{t:'ممتازة',v:45},{t:'جيدة',v:30},{t:'مقبولة',v:15},{t:'ضعيفة',v:10}], voters:320, ends:'٣ ساعات', voted:false },
  { id:2, type:'election', title:'🏅 انتخابات نجم الجامعة ٢٠٢٦', q:'صوّت لنجم الجامعة لهذا الفصل', opts:[{t:'فهد العتيبي 🌟',v:38},{t:'نورة السلمي ⭐',v:35},{t:'عمر الغامدي 💫',v:27}], voters:890, ends:'٢ أيام', voted:false },
  { id:3, type:'quiz', title:'كويز: الذكاء الاصطناعي', q:'ما هو نموذج الذكاء الاصطناعي الأشهر في 2025؟', opts:[{t:'GPT-4',v:60},{t:'Gemini',v:25},{t:'Claude',v:15}], voters:127, ends:'منتهي', voted:true, userVoteIdx: 0 },
  { id:4, type:'schedule', title:'جدولة: موعد مراجعة CS302', q:'متى يناسبك موعد المراجعة؟', opts:[{t:'الثلاثاء ٢م',v:45},{t:'الأربعاء ١٠ص',v:35},{t:'الخميس ٤م',v:20}], voters:52, ends:'ساعتان', voted:false },
];

function initVoice() {
  if (voteInited) return; voteInited = true;
  renderPolls('all');

  document.querySelectorAll('.vfb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vfb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPolls(btn.dataset.vf);
    });
  });

  document.getElementById('createVoteBtn')?.addEventListener('click', () => {
    openSheet('createVoteSheet');
  });
  initDraggableSheet('createVoteSheet');
  document.getElementById('publishVoteBtn')?.addEventListener('click', publishVote);

  document.querySelectorAll('.vtb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vtb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('addVoteOpt')?.addEventListener('click', () => {
    const container = document.getElementById('voteOptions');
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'vote-opt-input';
    inp.placeholder = `الخيار ${container.children.length + 1}`;
    container.appendChild(inp);
  });
}

function renderPolls(filter) {
  const el = document.getElementById('pollsFeed');
  if (!el) return;
  const filtered = filter === 'all' ? pollsData : pollsData.filter(p => {
    if (filter === 'active') return p.ends !== 'منتهي';
    return p.type === filter;
  });
  el.innerHTML = filtered.map(poll => renderPoll(poll)).join('');
  el.querySelectorAll('.poll-opt[data-pid]').forEach(btn => {
    btn.addEventListener('click', () => castVote(btn.dataset.pid, btn.dataset.oidx));
  });
}

function renderPoll(poll) {
  const total = poll.opts.reduce((a,o) => a + o.v, 0);
  const opts = poll.opts.map((o,i) => {
    const pct = Math.round(o.v / (total || 1) * 100);
    const isSelected = poll.userVoteIdx === i;
    if (poll.voted) {
      return `<div class="poll-opt ${isSelected ? 'user-voted' : 'voted'}" style="cursor:default">
        <span class="poll-opt-label">${isSelected ? '✅ ' : ''}${o.t}</span>
        <div class="poll-opt-bar-wrap"><div class="poll-opt-bar ${isSelected ? 'green-bar' : ''}" style="width:${pct}%"></div></div>
        <span class="poll-opt-pct">${pct}%</span>
      </div>`;
    }
    return `<div class="poll-opt" data-pid="${poll.id}" data-oidx="${i}">
      <span class="poll-opt-label">${o.t}</span>
    </div>`;
  }).join('');

  const tagColors = { survey:'survey', election:'election', quiz:'quiz', schedule:'quiz' };
  const tagLabels = { survey:'📊 استطلاع', election:'🏅 انتخاب', quiz:'📝 كويز', schedule:'📅 موعد' };

  return `<div class="poll-card" id="poll-${poll.id}">
    <div class="poll-header">
      <span class="poll-type-tag ${tagColors[poll.type]}">${tagLabels[poll.type]}</span>
      <span class="poll-ends">${poll.ends === 'منتهي' ? '🔴 منتهي' : '⏰ ' + poll.ends}</span>
    </div>
    <div class="poll-q">${poll.q}</div>
    <div class="poll-opts">${opts}</div>
    <div class="poll-footer">
      <span class="poll-voters">👥 ${poll.voters} مشارك</span>
      <button class="poll-share" onclick="showToast('🔗 تم نسخ رابط المشاركة!')">مشاركة</button>
    </div>
  </div>`;
}

function castVote(pollId, optIdx) {
  const poll = pollsData.find(p => p.id == pollId);
  if (!poll || poll.voted) return;
  poll.voted = true; poll.voters++;
  poll.userVoteIdx = parseInt(optIdx);
  poll.opts[optIdx].v += 1;
  const card = document.getElementById('poll-' + pollId);
  if (card) card.outerHTML = renderPoll(poll);
  showToast('✅ تم تسجيل صوتك! +5 نقاط 🏆');

  // Re-attach events
  document.querySelectorAll('.poll-opt[data-pid]').forEach(btn => {
    btn.addEventListener('click', () => castVote(btn.dataset.pid, btn.dataset.oidx));
  });
}

function publishVote() {
  const q = document.getElementById('voteQuestion')?.value;
  if (!q.trim()) { showToast('⚠️ يرجى إدخال السؤال'); return; }
  closeSheet('createVoteSheet');
  showToast('🚀 تم نشر صوتك بنجاح! +20 نقطة');
}
