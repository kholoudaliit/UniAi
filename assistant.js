// ===== assistant.js — AI Academic Assistant =====

const AI_RESPONSES = {
  'كم المقررات المتبقية لتخرجي؟': `بناءً على سجلك الأكاديمي، إليك ملخص وضعك:

📊 **الوضع الحالي:**
- الساعات المكتملة: **102 ساعة** من أصل **150 ساعة**
- الساعات المتبقية: **48 ساعة** (~8 مقررات)
- عدد الفصول المتوقعة: **4 فصول دراسية**

📋 **المقررات الإلزامية المتبقية:**
- CS460 - أمن المعلومات (3 ساعات)
- CS480 - مشروع التخرج (6 ساعات)
- CS415 - هندسة البرمجيات (3 ساعات)

💡 **توصيتي:** سجّلي في CS460 الفصل القادم — متطلب أساسي للتخرج!`,

  'ما هي أفضل وظائف تخصصي؟': `استناداً إلى تخصصك في علم الحاسب ومهاراتك الحالية، هذه أبرز الفرص المهنية المناسبة:

💼 **الوظائف ذات الطلب الأعلى (2026):**

1. 🏆 **مهندس بيانات (Data Engineer)** — 92% تطابق
   الراتب: 18,000 - 35,000 ريال

2. 🤖 **مطور تعلم آلي (ML Engineer)** — 87% تطابق
   الراتب: 20,000 - 40,000 ريال

3. 🔒 **محلل أمن سيبراني** — 75% تطابق
   الراتب: 15,000 - 28,000 ريال

4. 🧬 **باحث ذكاء اصطناعي** — 70% تطابق
   يتطلب دراسات عليا

🎯 **نصيحة:** ابدئي بمشاريع Kaggle وبناء portfolio على GitHub لتعزيز فرصك!`,

  'اقترح لي مقررات اختيارية': `بناءً على توجهك المهني واهتماماتك، إليك أفضل الاختيارات:

📚 **مقررات اختيارية مُوصى بها:**

⭐⭐⭐ **الأولوية القصوى:**
- **CS520 - التعلم الآلي** (3 س) — يفتح أبواباً واسعة
- **CS535 - معالجة اللغات الطبيعية** (3 س) — مجال مزدهر

⭐⭐ **مُوصى بها:**
- **CS510 - رؤية الحاسب** (3 س)
- **STAT310 - الإحصاء للبيانات** (3  س)

⭐ **مكملة للمسار:**
- **MGMT220 - ريادة الأعمال التقنية** (2 س)

💡 **ملاحظة:** CS520 يُدرَّس فقط في الفصل الأول، سارعي بالتسجيل!`,

  'ما هي المهارات المطلوبة في السوق؟': `استناداً إلى أحدث بيانات سوق العمل في المملكة ٢٠٢٦:

🔥 **المهارات الأكثر طلباً:**

**برمجة وتقنية:**
- Python ⭐⭐⭐⭐⭐
- SQL & NoSQL ⭐⭐⭐⭐⭐
- Cloud (AWS/Azure) ⭐⭐⭐⭐
- Machine Learning ⭐⭐⭐⭐⭐

**أدوات:**
- TensorFlow/PyTorch 🤖
- Docker & Kubernetes 🐳
- Git & CI/CD ✅

**مهارات ناعمة:**
- التواصل بالإنجليزية 🌍
- تقديم البيانات في Tableau/Power BI 📊

📈 **مهاراتك الحالية:** لديك Python ✅، SQL ✅، ما زلت تحتاجين Cloud ☁️

أنصحك بشهادة AWS Cloud Practitioner — تستغرق شهراً واحداً فقط!`,
};

const DEFAULT_RESPONSE = `شكراً على سؤالك! 🎓

سأحاول الإجابة بناءً على معلوماتي عن برامج جامعتك وسوق العمل.

💡 **ملاحظة:** هذا نموذج تجريبي. في النظام الحقيقي، سيتصل المساعد مباشرةً بسجلاتك الأكاديمية ونظام التسجيل للإجابة بدقة تامة.

هل تريدين معرفة المزيد عن:
- 📋 خطتك الدراسية
- 💼 فرص العمل في تخصصك
- 📚 المقررات المتاحة`;

document.addEventListener('DOMContentLoaded', () => {
  initAssistant();
  drawProgressRing();
});

function initAssistant() {
  const input = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSendBtn');

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      const response = AI_RESPONSES[text] || DEFAULT_RESPONSE;
      addAIMessage(response);
    }, 1200 + Math.random() * 800);
  };

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      const text = this.dataset.suggest;
      addUserMessage(text);
      showTyping();
      setTimeout(() => {
        removeTyping();
        const response = AI_RESPONSES[text] || DEFAULT_RESPONSE;
        addAIMessage(response);
      }, 1200 + Math.random() * 800);
    });
  });
}

function addUserMessage(text) {
  const container = document.getElementById('assistantMessages');
  const div = document.createElement('div');
  div.className = 'user-message';
  div.innerHTML = `
    <div class="user-msg-avatar">س</div>
    <div class="user-bubble">${text}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addAIMessage(text) {
  const container = document.getElementById('assistantMessages');
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  const div = document.createElement('div');
  div.className = 'ai-message';
  div.innerHTML = `
    <div class="ai-avatar">🎓</div>
    <div class="ai-bubble">${formatted}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('assistantMessages');
  const div = document.createElement('div');
  div.className = 'ai-message';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="ai-avatar">🎓</div>
    <div class="ai-bubble">
      <div class="ai-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function drawProgressRing() {
  const canvas = document.getElementById('progressRing');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 70, cy = 70, r = 55;
  const progress = 0.68;

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Progress ring
  const gradient = ctx.createLinearGradient(0, 0, 140, 140);
  gradient.addColorStop(0, '#7C3AED');
  gradient.addColorStop(1, '#60A5FA');

  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();
}
