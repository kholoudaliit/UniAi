// ===== app.js — Core Navigation & Utilities =====
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 30000);
  initNavigation();
  document.getElementById('splashEnterBtn')?.addEventListener('click', () => goTo('home'));
  document.getElementById('homeAvatarBtn')?.addEventListener('click', () => goTo('profile'));
  document.getElementById('pointsBannerBtn')?.addEventListener('click', () => goTo('gamify'));
});

function updateClock() {
  const el = document.getElementById('statusTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
}

function goTo(screenId) {
  // Hide ALL screens explicitly
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // Show target screen
  const screen = document.getElementById('screen-' + screenId);
  if (screen) {
    screen.style.display = 'flex';
    screen.classList.add('active');
  }

  // Update bottom nav
  document.querySelectorAll('.bn-item').forEach(b => {
    b.classList.toggle('active', b.dataset.nav === screenId);
  });

  // Show/hide bottom nav
  const noNav = ['splash'];
  const nav = document.getElementById('bottomNav');
  if (nav) nav.style.display = noNav.includes(screenId) ? 'none' : 'flex';

  // Init section on first visit
  const inits = { home: initHome, lens: initLens, chat: initChat, mate: initMate, attend: initAttend, vote: initVote, calendar: initCalendar, gamify: initGamify, profile: initProfile };
  if (inits[screenId]) inits[screenId]();
}

function initNavigation() {
  // Nav buttons
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.nav));
  });

  // Back buttons
  document.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.back));
  });

  // Hide bottom nav on splash
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('screen-splash').classList.add('active');
}

// Toast
window.showToast = function (msg) {
  const t = document.getElementById('toastNotif');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
};

// ===== HOME =====
let homeInited = false;
function initHome() {
  if (homeInited) return;
  homeInited = true;

  // Feed items navigate
  document.querySelectorAll('.feed-item[data-nav]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.nav));
  });

  // Service cards
  document.querySelectorAll('.svc-card[data-nav]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.nav));
  });

  // Animate happiness score
  animateValue('qs-happy', 0, 78, '%', 1200);
}

function animateValue(id, from, to, suffix, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * p) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  tick();
}
