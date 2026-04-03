// ===== gamify.js — KAU Gamification + Profile =====
let gamifyInited = false, profileInited = false;

const badges = [
  { icon:'🌟', name:'نجم الجامعة', earned:true },
  { icon:'🚀', name:'مبادر', earned:true },
  { icon:'💬', name:'متفاعل', earned:true },
  { icon:'🗺️', name:'مستكشف', earned:true },
  { icon:'✅', name:'ملتزم', earned:true },
  { icon:'📊', name:'محلل', earned:true },
  { icon:'🏆', name:'متميز', earned:true },
  { icon:'💡', name:'مبدع', earned:true },
  { icon:'🎯', name:'ناشط', earned:true },
  { icon:'🌍', name:'عالمي', earned:false },
  { icon:'👑', name:'أسطورة', earned:false },
  { icon:'🔬', name:'باحث', earned:false },
];

const earnItems = [
  { pts:'+10', text:'تسجيل شعورك في KAU E-Campus' },
  { pts:'+15', text:'تسجيل حضور محاضرة' },
  { pts:'+5', text:'المشاركة في تصويت' },
  { pts:'+5', text:'إرسال رسالة في الشات' },
  { pts:'+20', text:'إنشاء تصويت جديد' },
  { pts:'+30', text:'الإبلاغ عن مشكلة (تم حلها)' },
  { pts:'+50', text:'إضافة مقترح مقبول' },
];

const leaderboardData = [
  { rank:'🥇', name:'محمد الأسمري', pts:'4,210' },
  { rank:'🥈', name:'سارة الأحمدي', pts:'2,840', isMe:true },
  { rank:'🥉', name:'نورة السلمي', pts:'2,650' },
  { rank:'4', name:'فهد العتيبي', pts:'2,100' },
  { rank:'5', name:'لمى الزهراني', pts:'1,890' },
];

const rewards = [
  { icon:'☕', name:'قهوة مجانية', req:'٥٠٠ نقطة', eligible:true },
  { icon:'🍱', name:'وجبة غداء مجانية', req:'١٠٠٠ نقطة', eligible:true },
  { icon:'🎟️', name:'تذكرة VIP للفعاليات', req:'٢٠٠٠ نقطة', eligible:true },
  { icon:'🏆', name:'شهادة تميز', req:'٣٠٠٠ نقطة', eligible:false },
  { icon:'💻', name:'اشتراك Coursera مجاني', req:'٥٠٠٠ نقطة', eligible:false },
];

const skills = [
  { name:'Python', pct:90 }, { name:'Data Science', pct:82 },
  { name:'Machine Learning', pct:75 }, { name:'Web Development', pct:68 },
  { name:'Database Design', pct:80 }, { name:'Algorithms', pct:88 },
];

const projects = [
  { name: 'نظام توصية الأغذية الذكي', tech: 'Python, ML, Flask', icon: '🍎' },
  { name: 'محاكي شبكات الجامعة', tech: 'C++, NS3', icon: '🌐' },
  { name: 'تطبيق مساعد المكفوفين', tech: 'Swift, Computer Vision', icon: '👓' },
];

function initGamify() {
  if (gamifyInited) return; gamifyInited = true;
  renderBadges(); renderEarnList(); renderLeaderboard(); renderRewards();
}

function renderBadges() {
  const el = document.getElementById('badgesGrid');
  if (!el) return;
  el.innerHTML = badges.map(b => `
    <div class="badge-item">
      <div class="badge-icon ${b.earned ? 'earned' : 'locked'}">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
    </div>`).join('');
}

function renderEarnList() {
  const el = document.getElementById('earnList');
  if (!el) return;
  el.innerHTML = earnItems.map(e => `
    <div class="earn-item">
      <div class="earn-pts">${e.pts}</div>
      <div class="earn-text">${e.text}</div>
    </div>`).join('');
}

function renderLeaderboard() {
  const el = document.getElementById('leaderboard');
  if (!el) return;
  el.innerHTML = leaderboardData.map(l => `
    <div class="lb-item" style="${l.isMe ? 'border:1px solid rgba(0,212,255,0.4);background:rgba(0,212,255,0.08)' : ''}">
      <div class="lb-rank">${l.rank}</div>
      <div class="lb-av">${l.name[0]}</div>
      <div class="lb-name">${l.name}${l.isMe ? ' <span style="font-size:0.7rem;color:#00D4FF">(أنتِ)</span>' : ''}</div>
      <div class="lb-pts">${l.pts}</div>
    </div>`).join('');
}

function renderRewards() {
  const el = document.getElementById('rewardsList');
  if (!el) return;
  el.innerHTML = rewards.map(r => `
    <div class="reward-item">
      <div class="reward-icon">${r.icon}</div>
      <div class="reward-info">
        <div class="reward-name">${r.name}</div>
        <div class="reward-req">يتطلب: ${r.req}</div>
      </div>
      <button class="reward-btn" onclick="${r.eligible ? `showToast('🎁 تم طلب ${r.name}!')` : `showToast('⚠️ تحتاجين المزيد من النقاط')`}">
        ${r.eligible ? 'استبدال' : '🔒 مقفل'}
      </button>
    </div>`).join('');
}

// ===== PROFILE =====
function initProfile() {
  if (profileInited) return; 
  profileInited = true;
  renderSkills();
  renderProfileProjects();
  renderProfileGamify();
  drawProgressChart();
  initAddProjectLogic();
}

function renderProfileProjects() {
  const el = document.getElementById('profileProjectsList');
  if (!el) return;
  el.innerHTML = projects.map(p => `
    <div class="proj-card">
      <div class="proj-icon">${p.icon}</div>
      <div class="proj-info">
        <div class="proj-name">${p.name}</div>
        <div class="proj-tech">${p.tech}</div>
        <div class="proj-meta">مرتبط بـ KAU Talent</div>
      </div>
    </div>`).join('');
}

function renderProfileGamify() {
  const ptsEl = document.getElementById('profilePoints');
  const badgesEl = document.getElementById('profileBadgesSummary');
  if (ptsEl) ptsEl.textContent = '2,840';
  if (badgesEl) {
    badgesEl.innerHTML = badges.filter(b => b.earned).slice(0, 6).map(b => `
      <div class="mini-badge" title="${b.name}">${b.icon}</div>
    `).join('');
  }
}

function initAddProjectLogic() {
  document.getElementById('addProjectBtn')?.addEventListener('click', () => {
    window.openSheet('addProjectSheet');
  });

  document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
    const name = document.getElementById('projName').value;
    const tech = document.getElementById('projTech').value;
    
    if (!name || !tech) {
      window.showToast('⚠️ يرجى ملء البيانات الأساسية');
      return;
    }

    // Add to local list
    projects.unshift({ name, tech, icon: '🚀' });
    renderProfileProjects();
    
    // Clear & Close
    document.getElementById('projName').value = '';
    document.getElementById('projTech').value = '';
    document.getElementById('projDesc').value = '';
    
    window.closeSheet('addProjectSheet');
    window.showToast('✅ تم إضافة المشروع وربطه بـ KAU Talent!');
    
    // Bonus points
    window.showToast('🏆 حصلت على +50 نقطة لإضافة مشروع!');
  });
}

function renderSkills() {
  const el = document.getElementById('skillsList');
  if (!el) return;
  el.innerHTML = skills.map(s => `
    <div class="skill-item">
      <div class="skill-lbl"><span>${s.name}</span><span>${s.pct}%</span></div>
      <div class="skill-bar"><div class="skill-fill" style="width:${s.pct}%"></div></div>
    </div>`).join('');
}

function drawProgressChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas || typeof Chart === 'undefined') return;
  if (canvas._chart) { canvas._chart.destroy(); }
  canvas._chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [68, 32],
        backgroundColor: ['rgba(123,47,255,0.9)', 'rgba(255,255,255,0.06)'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 1000 }
    }
  });
}
