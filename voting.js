// ===== voting.js — Multi-purpose Voting System =====

let polls = [
  {
    id: 1, type: 'schedule', status: 'active',
    title: 'ما أنسب وقت لاختبار CS302؟',
    creator: 'د. عمر الحربي', target: 'CS302 - خوارزميات',
    createdAt: 'منذ ٣ ساعات', endsIn: 'ينتهي بعد ٢١ ساعة',
    options: [
      { text: 'الأربعاء ١٠ص', votes: 18 },
      { text: 'الخميس ٢م', votes: 12 },
      { text: 'السبت ١٠ص', votes: 25 },
    ],
    voted: false, totalVotes: 55,
  },
  {
    id: 2, type: 'quiz', status: 'active',
    title: 'ما هو الـ Big-O لخوارزمية Merge Sort؟',
    creator: 'د. عمر الحربي', target: 'CS302 - خوارزميات',
    createdAt: 'منذ ساعة', endsIn: 'ينتهي بعد ٢٣ ساعة',
    options: [
      { text: 'O(n)', votes: 5 },
      { text: 'O(n log n)', votes: 42 },
      { text: 'O(n²)', votes: 8 },
      { text: 'O(log n)', votes: 3 },
    ],
    voted: true, votedIndex: 1, totalVotes: 58,
  },
  {
    id: 3, type: 'survey', status: 'active',
    title: 'كيف تقيّم الخدمات الرقمية للجامعة؟',
    creator: 'إدارة الجامعة', target: 'جميع الطلاب',
    createdAt: 'منذ يوم', endsIn: 'ينتهي بعد ٦ أيام',
    options: [
      { text: '⭐⭐⭐⭐⭐ ممتاز', votes: 120 },
      { text: '⭐⭐⭐⭐ جيد جداً', votes: 210 },
      { text: '⭐⭐⭐ جيد', votes: 180 },
      { text: '⭐⭐ يحتاج تحسين', votes: 95 },
      { text: '⭐ ضعيف', votes: 45 },
    ],
    voted: false, totalVotes: 650,
  },
  {
    id: 4, type: 'survey', status: 'active',
    title: 'ما أكثر خدمة تودّون إضافتها للحرم الجامعي؟',
    creator: 'عمادة شؤون الطلاب', target: 'جميع الطلاب',
    createdAt: 'منذ ٢ أيام', endsIn: 'ينتهي بعد ٥ أيام',
    options: [
      { text: '🚌 حافلات داخلية أكثر', votes: 345 },
      { text: '☕ مقهى متطور', votes: 289 },
      { text: '🏋️ صالة لياقة', votes: 412 },
      { text: '📱 تطبيق جامعي أفضل', votes: 523 },
    ],
    voted: false, totalVotes: 1569,
  },
  {
    id: 5, type: 'quiz', status: 'closed',
    title: 'ما هي عاصمة المملكة العربية السعودية؟',
    creator: 'د. فاطمة العمري', target: 'ENG101',
    createdAt: 'منذ أسبوع', endsIn: 'انتهى',
    options: [
      { text: 'الرياض', votes: 55 },
      { text: 'جدة', votes: 2 },
      { text: 'مكة المكرمة', votes: 1 },
    ],
    voted: true, votedIndex: 0, totalVotes: 58,
  },
];

let activeVFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderPolls();
  initVotingControls();
  initCreatePoll();
});

function renderPolls() {
  const container = document.getElementById('pollsList');
  if (!container) return;
  container.innerHTML = '';

  const filtered = polls.filter(p => {
    if (activeVFilter === 'all') return true;
    if (activeVFilter === 'active') return p.status === 'active';
    return p.type === activeVFilter;
  });

  filtered.forEach(poll => {
    const card = createPollCard(poll);
    container.appendChild(card);
  });
}

function createPollCard(poll) {
  const div = document.createElement('div');
  div.className = 'poll-card';
  div.id = `poll-${poll.id}`;

  const typeLabels = { survey: 'استطلاع رأي', quiz: 'كويز', schedule: 'جدولة موعد' };
  const typeClasses = { survey: 'poll-type-survey', quiz: 'poll-type-quiz', schedule: 'poll-type-schedule' };

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  let optionsHtml = '';
  poll.options.forEach((opt, idx) => {
    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
    const isVoted = poll.voted && poll.votedIndex === idx;
    optionsHtml += `
      <div class="poll-option ${isVoted ? 'voted' : ''} ${poll.voted || poll.status === 'closed' ? 'no-hover' : ''}"
           data-poll-id="${poll.id}" data-opt-idx="${idx}">
        <div class="poll-option-fill" style="width: ${poll.voted || poll.status === 'closed' ? pct : 0}%"></div>
        <span class="poll-option-text">${opt.text}</span>
        ${poll.voted || poll.status === 'closed' ? `<span class="poll-option-pct">${pct}%</span>` : ''}
      </div>`;
  });

  div.innerHTML = `
    <div class="poll-card-header">
      <div class="poll-card-title">${poll.title}</div>
      <span class="poll-type-tag ${typeClasses[poll.type]}">${typeLabels[poll.type]}</span>
    </div>
    <div class="poll-meta">👤 ${poll.creator} · 🎯 ${poll.target} · ${poll.createdAt}</div>
    <div class="poll-options">${optionsHtml}</div>
    <div class="poll-footer">
      <div class="poll-votes-count">📊 ${totalVotes.toLocaleString('ar')} صوت</div>
      <span class="${poll.status === 'active' ? 'poll-status-active' : 'poll-status-closed'}">
        ${poll.status === 'active' ? '🟢 ' + poll.endsIn : '🔴 ' + poll.endsIn}
      </span>
    </div>
  `;

  // Click to vote
  if (!poll.voted && poll.status === 'active') {
    div.querySelectorAll('.poll-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const pollId = parseInt(opt.dataset.pollId);
        const optIdx = parseInt(opt.dataset.optIdx);
        castVote(pollId, optIdx);
      });
    });
  }

  return div;
}

function castVote(pollId, optIdx) {
  const poll = polls.find(p => p.id === pollId);
  if (!poll || poll.voted) return;
  poll.options[optIdx].votes++;
  poll.voted = true;
  poll.votedIndex = optIdx;
  poll.totalVotes++;

  // Animate
  const card = document.getElementById(`poll-${pollId}`);
  if (card) {
    const newCard = createPollCard(poll);
    card.replaceWith(newCard);
    // Animate fills
    setTimeout(() => {
      const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
      newCard.querySelectorAll('.poll-option-fill').forEach((fill, i) => {
        const pct = Math.round((poll.options[i].votes / totalVotes) * 100);
        fill.style.width = `${pct}%`;
      });
    }, 50);
  }
  window.showToast('✅ تم تسجيل صوتك!');
}

function initVotingControls() {
  document.querySelectorAll('[data-vfilter]').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-vfilter]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeVFilter = this.dataset.vfilter;
      renderPolls();
    });
  });
}

function initCreatePoll() {
  const modal = document.getElementById('createPollModal');

  document.getElementById('createPollBtn')?.addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('closePollModal')?.addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('cancelPoll')?.addEventListener('click', () => modal.classList.remove('open'));

  // Poll type selector
  document.querySelectorAll('.poll-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.poll-type-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Remove option
  document.addEventListener('click', e => {
    if (e.target.classList.contains('remove-option')) {
      const opts = document.querySelectorAll('.poll-option-input');
      if (opts.length > 2) e.target.closest('.poll-option-input').remove();
      else window.showToast('⚠️ يجب أن يكون هناك خياران على الأقل');
    }
  });

  // Add option
  document.getElementById('addOption')?.addEventListener('click', () => {
    const container = document.getElementById('pollOptions');
    const count = container.querySelectorAll('.poll-option-input').length + 1;
    const div = document.createElement('div');
    div.className = 'poll-option-input';
    div.innerHTML = `<input type="text" placeholder="الخيار ${count}" /><button class="remove-option">×</button>`;
    container.appendChild(div);
  });

  // Save poll
  document.getElementById('savePoll')?.addEventListener('click', () => {
    const question = document.getElementById('pollQuestion').value.trim();
    if (!question) { window.showToast('⚠️ أدخل سؤال التصويت'); return; }

    const optionInputs = document.querySelectorAll('#pollOptions input');
    const options = Array.from(optionInputs).map(i => i.value.trim()).filter(v => v);
    if (options.length < 2) { window.showToast('⚠️ أضف خيارين على الأقل'); return; }

    const activeType = document.querySelector('.poll-type-btn.active')?.dataset.ptype || 'survey';
    const target = document.getElementById('pollTarget').value;
    const duration = document.getElementById('pollDuration').value;
    const durationLabels = { '1h': 'ينتهي بعد ساعة', '24h': 'ينتهي بعد يوم', '3d': 'ينتهي بعد ٣ أيام', '1w': 'ينتهي بعد أسبوع' };

    const newPoll = {
      id: Date.now(),
      type: activeType,
      status: 'active',
      title: question,
      creator: 'سارة الأحمدي',
      target,
      createdAt: 'الآن',
      endsIn: durationLabels[duration] || 'ينتهي قريباً',
      options: options.map(text => ({ text, votes: 0 })),
      voted: false,
      totalVotes: 0,
    };

    polls.unshift(newPoll);
    modal.classList.remove('open');
    renderPolls();
    window.showToast('🚀 تم نشر التصويت بنجاح!');

    // Reset form
    document.getElementById('pollQuestion').value = '';
    document.querySelectorAll('#pollOptions input').forEach((inp, i) => { if (i >= 2) inp.closest('.poll-option-input').remove(); else inp.value = ''; });
  });

  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}
