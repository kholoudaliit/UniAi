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
  const inits = { home: initHome, lens: initLens, chat: initChat, mate: initMate, attend: initAttend, vote: initVoice, calendar: initCalendar, gamify: initGamify, profile: initProfile, talent: initTalent };
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

/* ===== Draggable Sheet Logic ===== */
window.initDraggableSheet = function(sheetId, handleId, options = {}) {
  const sheet = document.getElementById(sheetId);
  if (!sheet) return;
  const handle = handleId ? document.getElementById(handleId) : sheet.querySelector('.bs-handle-area');
  
  if (!handle) return;

  let startY, startTranslateY = 0, currentY;
  let isDragging = false;
  const snapThreshold = options.threshold || 100;
  const isLens = options.type === 'lens';

  const onPointerDown = (e) => {
    isDragging = true;
    startY = e.clientY;
    startTranslateY = getTranslateY(sheet);
    sheet.classList.add('dragging');
    handle.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    currentY = e.clientY;
    const deltaY = currentY - startY;
    let newTranslateY = startTranslateY + deltaY;

    // Dampening at the top (don't go too far up)
    if (newTranslateY < 0 && !isLens) {
      newTranslateY = newTranslateY * 0.2;
    }

    sheet.style.transform = `translateY(${newTranslateY}px)`;
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    sheet.classList.remove('dragging');
    const finalTranslateY = getTranslateY(sheet);
    
    if (isLens) {
      const backdrop = document.getElementById('sheetBackdrop');
      if (finalTranslateY < snapThreshold) {
        sheet.classList.add('expanded');
        if (backdrop) backdrop.classList.add('show');
        sheet.style.transform = '';
      } else {
        sheet.classList.remove('expanded');
        if (backdrop) backdrop.classList.remove('show');
        sheet.style.transform = '';
      }
    } else {
      // Snap to fully open or close
      if (finalTranslateY > snapThreshold) {
        closeSheet(sheetId);
      } else {
        sheet.style.transform = ''; 
      }
    }
  };

  handle.addEventListener('pointerdown', onPointerDown);
  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
  handle.addEventListener('pointercancel', onPointerUp);
};

function getTranslateY(el) {
  const style = window.getComputedStyle(el);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m42;
}

window.openSheet = function(id) {
  const sheet = document.getElementById(id);
  const backdrop = document.getElementById('sheetBackdrop');
  if (!sheet) return;
  
  sheet.classList.remove('hidden');
  // Trigger reflow to ensure the initial state is applied before animation
  void sheet.offsetWidth; 
  
  sheet.classList.add('animate-up');
  if (backdrop) backdrop.classList.add('show');
  
  setTimeout(() => {
    sheet.classList.remove('animate-up');
    sheet.style.transform = 'translateY(0)';
  }, 400);
};

window.closeSheet = function(id) {
  const sheet = document.getElementById(id);
  const backdrop = document.getElementById('sheetBackdrop');
  if (!sheet) return;
  
  sheet.style.transform = 'translateY(100%)';
  if (backdrop) backdrop.classList.remove('show');
  
  setTimeout(() => {
    sheet.classList.add('hidden');
    sheet.style.transform = '';
  }, 300);
};

// Global backdrop click
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sheetBackdrop')?.addEventListener('click', () => {
        // Close modal bottom sheets
        const openModalSheet = document.querySelector('.bottom-sheet:not(.hidden)');
        if (openModalSheet) closeSheet(openModalSheet.id);
        
        // Minimize the lens data sheet if it was expanded
        const lensSheet = document.getElementById('lensDataSheet');
        const backdrop = document.getElementById('sheetBackdrop');
        if (lensSheet && lensSheet.classList.contains('expanded')) {
            lensSheet.classList.remove('expanded');
            if (backdrop) backdrop.classList.remove('show');
        }
    });
});
