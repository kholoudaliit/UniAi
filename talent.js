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
    typeLabel: "✨ بمقابل مادي",
    amount: "2,500 ريال / شهر",
    duration: "٦ أشهر قابل للتمديد",
    skills: ["Python", "TensorFlow", "Research"],
    location: "كلية الحاسبات",
    description: "نبحث عن طالب متميز للمساعدة في مشروع بحثي يتعلق بمعالجة اللغات الطبيعية وتطوير نماذج ذكاء اصطناعي مخصصة."
  },
  {
    id: 2,
    title: "مدير وسائل التواصل الاجتماعي",
    type: "part",
    typeLabel: "⏱️ دوام جزئي",
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
    typeLabel: "🤝 تطوع",
    amount: "شهادة تطوع (بدون سداد)",
    duration: "٥ أيام (أسبوع التقنية)",
    skills: ["Teamwork", "Organization", "Tech Savvy"],
    location: "مركز الابتكار",
    description: "الانضمام لفريق تنظيم أسبوع التقنية لمساعدة الزوار وتنظيم ورش العمل التقنية."
  },
  {
    id: 4,
    title: "مطور واجهات الويب (طلاب)",
    type: "paid",
    typeLabel: "✨ بمقابل مادي",
    amount: "3,000 ريال / مشروع",
    duration: "منتهي بنهاية المشروع",
    skills: ["React", "CSS", "UI Design"],
    location: "وحدة البرمجيات الدراسية",
    description: "تطوير واجهة مستخدم لموقع داخلي يسهل عملية تسجيل المواد للطلاب الجدد."
  },
  {
    id: 5,
    title: "مساعد في المكتبة المركزية",
    type: "part",
    typeLabel: "⏱️ دوام جزئي",
    amount: "1,000 ريال / شهر",
    duration: "١٢ ساعة أسبوعياً",
    skills: ["Data Entry", "Archiving", "Arabic"],
    location: "المكتبة المركزية",
    description: "المساعدة في أرشفة الكتب الجديدة وإرشاد الطلاب لكيفية استخدام نظام البحث في المكتبة."
  }
];

let selectedFilter = 'all';
let talentInited = false;

function initTalent() {
  if (talentInited) return;
  talentInited = true;
  
  renderTalentList();
  
  // Filter chips interaction
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
    
  filtered.forEach(opp => {
    const card = document.createElement('div');
    card.className = 'talent-card';
    card.onclick = () => showTalentDetail(opp);
    
    card.innerHTML = `
      <div class="talent-card-header">
        <div class="talent-title">${opp.title}</div>
        <div class="talent-type type-${opp.type}">${opp.typeLabel}</div>
      </div>
      <div class="talent-info">
        <div class="talent-info-item">${SVG_ICONS.loc} <strong>${opp.location}</strong></div>
        <div class="talent-info-item">${SVG_ICONS.money} <strong>${opp.amount.split(' ')[0]} ريال</strong></div>
        <div class="talent-info-item">${SVG_ICONS.time} <strong>${opp.duration}</strong></div>
      </div>
      <div class="talent-skills">
        ${opp.skills.slice(0, 2).map(s => `<span class="skill-tag">${s}</span>`).join('')}
        ${opp.skills.length > 2 ? `<span class="skill-tag">+${opp.skills.length - 2}</span>` : ''}
      </div>
    `;
    
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
