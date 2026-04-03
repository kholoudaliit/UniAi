// ===== talent.js — KAU TalentHub Logic (Refined) =====
const SVG_ICONS = {
  loc: `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  money: `<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01M17 15h.01"/></svg>`,
  time: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  save: `<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.7 7.8l1.1 1.1 7.7 7.7 7.7-7.7 1.1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`
};

const mockOpportunities = [
  {
    id: 1,
    title: "مساعد بحث في الذكاء الاصطناعي",
    type: "paid",
    typeLabel: "بمقابل مادي",
    icon: "🧠",
    amount: "2,500 ريال / شهر",
    duration: "٦ أشهر قابل للتمديد",
    skills: ["Python", "Machine Learning", "Research"],
    location: "كلية الحاسبات",
    description: "نبحث عن طالب متميز للمساعدة في مشروع بحثي يتعلق بمعالجة اللغات الطبيعية وتطوير نماذج ذكاء اصطناعي مخصصة."
  },
  {
    id: 2,
    title: "مدير وسائل التواصل الاجتماعي",
    type: "part",
    typeLabel: "دوام جزئي",
    icon: "📱",
    amount: "1,200 ريال / شهر",
    duration: "فصل دراسي كامل",
    skills: ["Canva", "Arabic Writing", "Engagement"],
    location: "عمادة شؤون الطلاب",
    description: "إدارة حسابات الجامعة على منصات التواصل الاجتماعي، التفاعل مع الطلاب، ونشر التحديثات اليومية."
  },
  {
    id: 3,
    title: "متطوع في تنظيم أسبوع التقنية",
    type: "volt",
    typeLabel: "تطوع",
    icon: "🤝",
    amount: "شهادة تطوع",
    duration: "٥ أيام",
    skills: ["Teamwork", "Organization", "Tech Savvy"],
    location: "مركز الابتكار",
    description: "الانضمام لفريق تنظيم أسبوع التقنية لمساعدة الزوار وتنظيم ورش العمل التقنية."
  },
  {
    id: 4,
    title: "مطور واجهات الويب",
    type: "paid",
    typeLabel: "بمقابل مادي",
    icon: "💻",
    amount: "3,000 ريال / مشروع",
    duration: "بنهاية المشروع",
    skills: ["Web Development", "CSS", "UI Design"],
    location: "وحدة البرمجيات الدراسية",
    description: "تطوير واجهة مستخدم لموقع داخلي يسهل عملية تسجيل المواد للطلاب الجدد."
  },
  {
    id: 5,
    title: "مساعد في المكتبة المركزية",
    type: "part",
    typeLabel: "دوام جزئي",
    icon: "📚",
    amount: "1,000 ريال / شهر",
    duration: "١٢ ساعة أسبوعياً",
    skills: ["Data Entry", "Archiving", "Arabic"],
    location: "المكتبة المركزية",
    description: "المساعدة في أرشفة الكتب الجديدة وإرشاد الطلاب لكيفية استخدام نظام البحث في المكتبة."
  }
];

let selectedFilter = 'all';
let talentInited = false;

/* ===== AI Smart Match Engine ===== */
function getSmartRecommendation() {
  const studentSkillNames = (typeof skills !== 'undefined' ? skills : []).map(s => s.name.toLowerCase());
  const studentProjectTech = (typeof projects !== 'undefined' ? projects : []).map(p => p.tech.toLowerCase()).join(' ');
  const projectKeywords = studentProjectTech.split(/[,\s]+/).filter(Boolean);

  // Expanded synonyms / related terms map
  const synonymMap = {
    'python': ['python', 'flask', 'django', 'pytorch'],
    'machine learning': ['machine learning', 'ml', 'tensorflow', 'keras', 'sklearn', 'deep learning', 'ai'],
    'data science': ['data science', 'data analysis', 'pandas', 'numpy', 'research'],
    'web development': ['web development', 'react', 'vue', 'html', 'css', 'javascript', 'js', 'frontend'],
    'database design': ['database design', 'sql', 'mysql', 'mongodb', 'database'],
    'algorithms': ['algorithms', 'data structures', 'c++', 'competitive programming'],
  };

  // Expand student keywords using synonyms
  const expandedKeywords = new Set([...studentSkillNames, ...projectKeywords]);
  studentSkillNames.forEach(skill => {
    Object.entries(synonymMap).forEach(([base, syns]) => {
      if (skill.includes(base) || syns.some(s => skill.includes(s))) {
        syns.forEach(s => expandedKeywords.add(s));
        expandedKeywords.add(base);
      }
    });
  });

  let bestMatch = null;
  let bestScore = -1;
  let matchedSkills = [];
  let matchedOriginalSkills = [];

  mockOpportunities.forEach(opp => {
    const oppSkillsLower = opp.skills.map(s => s.toLowerCase());
    const matched = oppSkillsLower.filter(s =>
      [...expandedKeywords].some(k => k.includes(s) || s.includes(k))
    );
    const score = (matched.length / opp.skills.length) * 100;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = opp;
      matchedSkills = matched;
      // Map back to original casing
      matchedOriginalSkills = opp.skills.filter(s =>
        [...expandedKeywords].some(k => k.includes(s.toLowerCase()) || s.toLowerCase().includes(k))
      );
    }
  });

  return { opp: bestMatch, score: Math.round(bestScore), matchedSkills: matchedOriginalSkills };
}

const TYPE_CONFIG = {
  paid:  { color: '#00C896', bg: 'rgba(0,200,150,0.12)', label: 'بمقابل مادي', dot: '#00C896' },
  part:  { color: '#00D4FF', bg: 'rgba(0,212,255,0.12)', label: 'دوام جزئي',   dot: '#00D4FF' },
  volt:  { color: '#7B2FFF', bg: 'rgba(123,47,255,0.12)', label: 'تطوع',      dot: '#7B2FFF' },
};

function initTalent() {
  if (talentInited) return;
  talentInited = true;

  renderTalentList();

  document.querySelectorAll('.tfb').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tfb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFilter = btn.dataset.tf;
      renderTalentList();
    };
  });

  initDraggableSheet('talentDetailSheet');
}

function renderTalentList() {

  const container = document.getElementById('talentList');
  if (!container) return;

  container.innerHTML = '';

  const filtered = selectedFilter === 'all'
    ? mockOpportunities
    : mockOpportunities.filter(o => o.type === selectedFilter);

  const { opp: recOpp, score: recScore, matchedSkills: recMatched } = getSmartRecommendation();

  filtered.forEach(opp => {
    const isRecommended = recOpp && opp.id === recOpp.id && selectedFilter === 'all';
    const tc = TYPE_CONFIG[opp.type] || TYPE_CONFIG.paid;
    const card = document.createElement('div');

    if (isRecommended) {
      // ===== Premium Featured Card =====
      card.className = 'talent-card talent-card-featured';
      card.onclick = () => showTalentDetail(opp);

      // Build matched skill tags with glow style
      const matchedTags = recMatched.slice(0, 3).map(s =>
        `<span class="ai-match-skill">${s}</span>`
      ).join('');

      // Score arc SVG
      const radius = 18, circ = 2 * Math.PI * radius;
      const arcFill = (recScore / 100) * circ;

      card.innerHTML = `
        <div class="ai-rec-particles">
          <span class="p1">✦</span><span class="p2">✦</span><span class="p3">·</span>
        </div>
        <div class="feat-top">
          <div class="feat-badge">✦ موصى به KAU AI</div>
          <div class="feat-score-wrap">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="${radius}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
              <circle cx="22" cy="22" r="${radius}" fill="none" stroke="url(#fArcGrad)" stroke-width="4"
                stroke-dasharray="${arcFill} ${circ}" stroke-dashoffset="${circ * 0.25}" stroke-linecap="round"/>
              <defs>
                <linearGradient id="fArcGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#00D4FF"/>
                  <stop offset="100%" stop-color="#7B2FFF"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="feat-score-text">
              <span class="feat-score-pct">${recScore}%</span>
              <span class="feat-score-lbl">تطابق</span>
            </div>
          </div>
        </div>
        <div class="feat-header">
          <div class="feat-icon" style="background:${tc.bg}; color:${tc.color}">${opp.icon}</div>
          <div class="feat-title">${opp.title}</div>
        </div>
        <div class="feat-match-row">بناءً على مهاراتك: ${matchedTags}</div>
        <div class="feat-info">
          <span>${SVG_ICONS.loc} ${opp.location}</span>
          <span>${SVG_ICONS.money} ${opp.amount.split('/')[0].trim()}</span>
          <span>${SVG_ICONS.time} ${opp.duration}</span>
        </div>
        <div class="feat-skills">
          ${opp.skills.map(s => `<span class="feat-skill-tag ${recMatched.includes(s) ? 'feat-skill-matched' : ''}">${s}</span>`).join('')}
        </div>
      `;
    } else {
      // ===== Normal Card =====
      card.className = 'talent-card';
      card.onclick = () => showTalentDetail(opp);
      card.innerHTML = `
        <div class="talent-card-header">
          <div class="tc-icon-wrap" style="background:${tc.bg}; color:${tc.color}">${opp.icon}</div>
          <div class="tc-title-block">
            <div class="talent-title">${opp.title}</div>
            <div class="tc-meta-line">
              <span class="tc-type-dot" style="background:${tc.color}"></span>
              <span class="tc-type-lbl" style="color:${tc.color}">${tc.label}</span>
            </div>
          </div>
        </div>
        <div class="talent-info">
          <div class="talent-info-item">${SVG_ICONS.loc} <span>${opp.location}</span></div>
          <div class="talent-info-item">${SVG_ICONS.money} <span>${opp.amount.split('/')[0].trim()}</span></div>
          <div class="talent-info-item">${SVG_ICONS.time} <span>${opp.duration}</span></div>
        </div>
        <div class="talent-skills" style="margin-top:8px">
          ${opp.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      `;
    }

    container.appendChild(card);
  });
}

function showTalentDetail(opp) {
  const content = document.getElementById('talentDetailContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="talent-detail-actions-top">
      <button class="btn-icon-only" id="detSaveBtn">${SVG_ICONS.save}</button>
      <button class="btn-icon-only" id="detShareBtn">${SVG_ICONS.share}</button>
    </div>

    <div class="talent-detail-head">
      <div class="td-title">${opp.title}</div>
      <div class="td-meta">
        <span class="talent-type type-${opp.type}">${opp.typeLabel}</span>
      </div>
      <div class="talent-info" style="margin-top:12px; gap:16px">
        <div class="talent-info-item">${SVG_ICONS.loc} ${opp.location}</div>
        <div class="talent-info-item">${SVG_ICONS.time} ${opp.duration}</div>
      </div>
    </div>
    
    <div class="talent-amount">
      ${opp.amount}
      <p style="font-size:0.75rem; color:var(--txt3); font-weight:400; margin-top:4px">المبلغ المتوقع للفرصة المتاحة</p>
    </div>
    
    <div class="section-subtitle">الوصف</div>
    <div class="td-desc">${opp.description}</div>
    
    <div class="section-subtitle">المهارات المطلوبة</div>
    <div class="talent-skills">
      ${opp.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
    </div>
  `;
  
  // Attach new listeners to the dynamically created buttons
  document.getElementById('detSaveBtn').onclick = () => showToast("تم حفظ الفرصة في قائمة المحفوظات ❤️");
  document.getElementById('detShareBtn').onclick = () => showToast("تم نسخ رابط الفرصة للمشاركة 🔗");
  document.getElementById('talentApplyBtn').onclick = () => {
    showToast("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً 🚀");
    closeSheet('talentDetailSheet');
  };

  openSheet('talentDetailSheet');
}

// Handle redundant functions removed
