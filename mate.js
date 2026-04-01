// ===== mate.js — KAU MateAI =====
let mateInited = false, mateMode = 'support';

const mateResponses = {
  support: {
    chips: ['مشكلة في الدخول', 'نسيت كلمة المرور', 'مشكلة في التسجيل', 'أين أجد الجدول؟'],
    welcome: 'مرحباً! 🛠️ أنا هنا لمساعدتك في أي مشكلة تقنية. كيف يمكنني مساعدتك اليوم؟',
    replies: {
      default: 'حسناً، سأساعدك! هل يمكنك وصف المشكلة بشكل أوضح؟ 🔧',
      'مشكلة': 'فهمت! سأرفع تذكرة دعم فني فورياً وسيتواصل معك الفريق خلال ١٥ دقيقة. رقم التذكرة: #TK-4872 ✅',
      'دخول': 'تأكد من استخدام بريدك الجامعي @stu.kau.edu.sa وكلمة المرور الصحيحة. إذا نسيتها اضغط "نسيت كلمة المرور" 🔐',
      'كلمة المرور': 'انقر على "نسيت كلمة المرور" في صفحة الدخول، ستصلك رسالة على بريدك الجامعي لإعادة الضبط 📧',
    }
  },
  academic: {
    chips: ['كم ساعة تبقت؟', 'اقترح مقررات', 'خطتي الدراسية', 'متى التخرج؟'],
    welcome: 'مرحباً سارة! 📚 أنا مرشدك الأكاديمي. أستطيع مساعدتك في التخطيط الدراسي وخيارات التخرج.',
    replies: {
      default: 'سؤال رائع! سأحلل ملفك الأكاديمي... 🔍',
      'ساعة': 'بناءً على ملفك الأكاديمي:\n✅ مكتمل: 102 ساعة\n⏳ متبقي: 48 ساعة (4 فصول تقريباً)\n🎯 المعدل: 3.8',
      'مقررات': '🎯 اقتراحاتي لك الفصل القادم:\n• CS480 — تعلم الآلة ⭐\n• CS462 — أمن المعلومات\n• CS490 — مشروع التخرج\n• IS310 — قواعد البيانات المتقدمة',
      'تخرج': 'بوتيرتك الحالية ستتخرجين في:\n🎓 الفصل الثاني - ١٤٤٨هـ\nأي ما يقارب 4 فصول دراسية',
      'خط': 'خطتك الدراسية تسير بشكل ممتاز! أنجزتِ 68% من المتطلبات. استمري هكذا! 💪',
    }
  },
  career: {
    chips: ['ما هي وظيفتي المناسبة؟', 'مهارات سوق العمل', 'اختبار هولاند', 'فرص التدريب'],
    welcome: 'مرحباً! 💼 سأساعدك في اكتشاف مسارك المهني باستخدام تحليل هولاند RIASEC المبني على ذكاء اصطناعي.',
    replies: {
      default: 'سؤال مهم لمستقبلك! دعيني أحلل ملفك المهني... 🎯',
      'وظيف': '🎯 بناءً على تخصصك ومعدلك، أقترح:\n1. مهندس/ة بيانات — 92% تطابق\n2. مطور/ة ذكاء اصطناعي — 87%\n3. محلل/ة أنظمة — 75%\n4. باحث/ة أكاديمي — 70%',
      'مهارات': '📈 أكثر المهارات طلباً في 2026:\n• Python & AI/ML\n• Cloud (AWS/Azure)\n• Cybersecurity\n• Data Analysis\n• React/NextJS',
      'هولاند': 'اختبار هولاند RIASEC يحدد نمطك المهني:\n🔬 Investigative: ١٨/٢٠\n🎨 Artistic: ١٦/٢٠\n🤝 Social: ١٤/٢٠\nأنتِ Researcher-Creator بامتياز! 🌟',
      'تدريب': '🚀 فرص متاحة الآن:\n• أرامكو السعودية — تقنية المعلومات\n• STC — ذكاء اصطناعي\n• علم — Data Science\n• Noon — Software Eng.',
    }
  }
};

function initMate() {
  if (mateInited) return; mateInited = true;
  setMateMode('support');
  document.querySelectorAll('.mmode').forEach(btn => {
    btn.addEventListener('click', () => setMateMode(btn.dataset.mode));
  });
  document.getElementById('mateSendBtn')?.addEventListener('click', sendMateMsg);
  document.getElementById('mateInput')?.addEventListener('keydown', e => { if(e.key==='Enter') sendMateMsg(); });
}

function setMateMode(mode) {
  mateMode = mode;
  document.querySelectorAll('.mmode').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const msgs = document.getElementById('mateMsgs');
  msgs.innerHTML = '';
  const data = mateResponses[mode];
  appendAiMsg(data.welcome);
  renderMateChips(data.chips);
}

function appendAiMsg(text) {
  const msgs = document.getElementById('mateMsgs');
  const el = document.createElement('div');
  el.className = 'ai-msg';
  const lines = text.split('\n').map(l => `<span>${l}</span>`).join('<br>');
  el.innerHTML = `<div class="ai-av">🤖</div><div class="ai-bubble">${lines}</div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendUserMsg(text) {
  const msgs = document.getElementById('mateMsgs');
  const el = document.createElement('div');
  el.className = 'user-msg';
  el.innerHTML = `<div class="user-bubble">${text}</div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

function renderMateChips(chips) {
  const el = document.getElementById('mateChips');
  el.innerHTML = chips.map(c => `<button class="mate-chip" data-chip="${c}">${c}</button>`).join('');
  el.querySelectorAll('.mate-chip').forEach(btn => {
    btn.addEventListener('click', () => { appendUserMsg(btn.dataset.chip); getAiReply(btn.dataset.chip); });
  });
}

function sendMateMsg() {
  const input = document.getElementById('mateInput');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  appendUserMsg(text);
  getAiReply(text);
}

function getAiReply(text) {
  const data = mateResponses[mateMode];
  const reply = Object.entries(data.replies).find(([k]) => k !== 'default' && text.includes(k));
  setTimeout(() => appendAiMsg(reply ? reply[1] : data.replies.default), 600);
}
