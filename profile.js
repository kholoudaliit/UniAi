// ===== profile.js — User Profile & Badges =====

const BADGES = [
  { icon: '🐍', name: 'Python Pro', level: 'متقدم', color: '#3B82F6' },
  { icon: '🤖', name: 'AI Explorer', level: 'متوسط', color: '#7C3AED' },
  { icon: '🗄️', name: 'Database Master', level: 'متقدم', color: '#059669' },
  { icon: '🌐', name: 'Web Developer', level: 'مبتدئ', color: '#F59E0B' },
  { icon: '📊', name: 'Data Analyst', level: 'متوسط', color: '#EC4899' },
  { icon: '🔒', name: 'Security Aware', level: 'مبتدئ', color: '#EF4444' },
  { icon: '☁️', name: 'Cloud Learner', level: 'مبتدئ', color: '#06B6D4' },
  { icon: '🏆', name: 'Dean\'s List', level: 'إنجاز', color: '#D97706' },
  { icon: '🎓', name: 'Academic Star', level: 'إنجاز', color: '#8B5CF6' },
  { icon: '💡', name: 'Innovator', level: 'متوسط', color: '#10B981' },
  { icon: '🤝', name: 'Team Player', level: 'متقدم', color: '#6366F1' },
  { icon: '📝', name: 'Research Ready', level: 'مبتدئ', color: '#F43F5E' },
];

const SKILLS = [
  { name: 'Python', level: 88 },
  { name: 'Machine Learning', level: 72 },
  { name: 'SQL & Databases', level: 85 },
  { name: 'Data Analysis', level: 78 },
  { name: 'Algorithms', level: 80 },
  { name: 'JavaScript', level: 60 },
  { name: 'Cloud Computing', level: 45 },
];

const PROJECTS = [
  { name: 'نظام توصية الكتب بالذكاء الاصطناعي', tech: 'Python · TensorFlow · Flask', stars: '⭐ 42' },
  { name: 'تطبيق تحليل مشاعر التغريدات', tech: 'NLP · BERT · Streamlit', stars: '⭐ 28' },
  { name: 'لوحة متابعة أسعار الأسهم', tech: 'React · Python · Alpha Vantage API', stars: '⭐ 15' },
  { name: 'نظام التعرف على الوجوه', tech: 'OpenCV · DeepFace · Python', stars: '⭐ 37' },
  { name: 'موقع حجز المختبرات الجامعية', tech: 'Vue.js · Node.js · MongoDB', stars: '⭐ 19' },
];

document.addEventListener('DOMContentLoaded', () => {
  renderBadges();
  renderSkills();
  renderProjects();
  initEditProfile();
});

function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  BADGES.forEach((badge, idx) => {
    const div = document.createElement('div');
    div.className = 'badge-item';
    div.style.animationDelay = `${idx * 0.05}s`;
    div.innerHTML = `
      <span class="badge-icon" style="filter: drop-shadow(0 0 6px ${badge.color})">${badge.icon}</span>
      <div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-level" style="color:${badge.color}">${badge.level}</div>
      </div>
    `;
    div.title = `${badge.name} — ${badge.level}`;
    div.addEventListener('click', () => window.showToast(`🏆 ${badge.name} — ${badge.level}`));
    grid.appendChild(div);
  });
}

function renderSkills() {
  const container = document.getElementById('skillsBars');
  if (!container) return;
  container.innerHTML = '';

  SKILLS.forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill-bar-item';
    div.innerHTML = `
      <div class="skill-bar-label">
        <span>${skill.name}</span>
        <span>${skill.level}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" style="width: 0%" data-target="${skill.level}"></div>
      </div>
    `;
    container.appendChild(div);
  });

  // Animate bars when section becomes visible
  animateSkillBars();
}

function animateSkillBars() {
  // Use Intersection Observer or just delay
  setTimeout(() => {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const target = bar.dataset.target;
      bar.style.width = `${target}%`;
    });
  }, 200);
}

function renderProjects() {
  const list = document.getElementById('projectsList');
  if (!list) return;
  list.innerHTML = '';

  PROJECTS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `
      <div>
        <div class="project-name">${p.name}</div>
        <div class="project-tech">${p.tech}</div>
      </div>
      <div class="project-stars">${p.stars}</div>
    `;
    list.appendChild(div);
  });
}

function initEditProfile() {
  document.getElementById('editProfileBtn')?.addEventListener('click', () => {
    window.showToast('✏️ تعديل البروفايل — قريباً في النسخة الكاملة!');
  });

  // Re-animate skills when profile section activated
  document.querySelector('[data-section="profile"]')?.addEventListener('click', () => {
    setTimeout(animateSkillBars, 400);
  });
}
