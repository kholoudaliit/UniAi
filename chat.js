// ===== chat.js — Course Chat System =====

const COURSES = [
  { id: 'cs302', name: 'CS302 - الخوارزميات', code: 'CS302', emoji: '🧠', members: 45, online: 12, unread: 3 },
  { id: 'cs401', name: 'CS401 - قواعد البيانات', code: 'CS401', emoji: '🗄️', members: 38, online: 8, unread: 0 },
  { id: 'cs310', name: 'CS310 - الشبكات', code: 'CS310', emoji: '🌐', members: 42, online: 15, unread: 1 },
  { id: 'cs450', name: 'CS450 - الذكاء الاصطناعي', code: 'CS450', emoji: '🤖', members: 35, online: 20, unread: 0 },
  { id: 'math201', name: 'MATH201 - تفاضل وتكامل', code: 'MATH201', emoji: '📐', members: 60, online: 5, unread: 0 },
  { id: 'eng101', name: 'ENG101 - لغة إنجليزية', code: 'ENG101', emoji: '📚', members: 55, online: 7, unread: 0 },
];

const PRESET_MESSAGES = {
  cs302: [
    { user: 'أحمد السالم', avatar: 'أ', text: 'هل يمكن أحد يشرح خوارزمية Dijkstra؟', time: '10:24', mine: false },
    { user: 'نورة الزهراني', avatar: 'ن', text: 'يوتيوب فيه شرح ممتاز لها من channel "Abdul Bari"', time: '10:26', mine: false },
    { user: 'أنت', avatar: 'س', text: 'شكراً نورة! وين نلقى الواجب ٣؟', time: '10:28', mine: true },
    { user: 'د. عمر الحربي', avatar: 'د', text: 'الواجب الثالث في البلاك بورد، موعد تسليمه الخميس ١١:٥٩ م', time: '10:31', mine: false },
    { user: 'خالد المطيري', avatar: 'خ', text: 'دكتور هل سيكون هناك كويز قبل الاختبار؟', time: '10:33', mine: false },
    { user: 'د. عمر الحربي', avatar: 'د', text: '✅ نعم، كويز قصير الأسبوع القادم على الفصل الخامس', time: '10:35', mine: false },
  ],
  cs401: [
    { user: 'سلمى القحطاني', avatar: 'س', text: 'اشكال ERD موجودة في المذكرة؟', time: '09:15', mine: false },
    { user: 'فهد العتيبي', avatar: 'ف', text: 'نعم الصفحات ٤٥-٦٢', time: '09:17', mine: false },
    { user: 'أنت', avatar: 'س', text: 'شكراً فهد 🙏', time: '09:18', mine: true },
  ],
  cs450: [
    { user: 'ريم الدوسري', avatar: 'ر', text: '🔥 المشروع الأول - نموذج تصنيف الصور جاهز! رابط GitHub في الوصف', time: '11:00', mine: false },
    { user: 'أنت', avatar: 'س', text: 'ممتاز! هل استخدمتي CNN أو ViT؟', time: '11:02', mine: true },
    { user: 'ريم الدوسري', avatar: 'ر', text: 'CNN مع ResNet50، accuracy وصلت 94% على الـ test set 😊', time: '11:05', mine: false },
    { user: 'محمد الغامدي', avatar: 'م', text: 'مشاء الله! ممكن نتعاون في المشروع القادم؟', time: '11:07', mine: false },
  ],
};

let activeCourseId = null;
const courseMessages = {};

document.addEventListener('DOMContentLoaded', () => {
  renderCourseList();
  initChatInput();

  // Pre-load messages
  Object.keys(PRESET_MESSAGES).forEach(id => {
    courseMessages[id] = [...PRESET_MESSAGES[id]];
  });
});

function renderCourseList(filter = '') {
  const list = document.getElementById('courseList');
  if (!list) return;
  list.innerHTML = '';

  const filtered = COURSES.filter(c =>
    c.name.includes(filter) || c.code.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(course => {
    const li = document.createElement('li');
    li.className = `course-item${activeCourseId === course.id ? ' active' : ''}`;
    li.innerHTML = `
      <div class="course-icon-badge">${course.emoji}</div>
      <div>
        <div class="course-item-name">${course.code}</div>
        <div class="course-item-meta">${course.members} طالب · ${course.online} متصل</div>
      </div>
      ${course.unread > 0 ? `<span class="course-unread">${course.unread}</span>` : ''}
    `;
    li.addEventListener('click', () => openCourse(course));
    list.appendChild(li);
  });
}

function openCourse(course) {
  activeCourseId = course.id;
  renderCourseList();

  document.getElementById('chatCourseName').textContent = course.name;
  document.getElementById('chatCourseMeta').textContent = `${course.members} طالب · ${course.emoji} ${course.code}`;
  document.getElementById('chatCourseIcon').textContent = course.emoji;
  document.getElementById('onlineCount').textContent = course.online;
  document.getElementById('chatInput').disabled = false;
  document.getElementById('sendBtn').disabled = false;

  // Reset unread
  course.unread = 0;
  renderCourseList();
  renderMessages(course.id);
}

function renderMessages(courseId) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = '';

  const msgs = courseMessages[courseId] || [];
  if (msgs.length === 0) {
    container.innerHTML = '<div class="chat-empty-state"><div class="empty-icon">💬</div><p>لا توجد رسائل بعد. كن أول من يكتب!</p></div>';
    return;
  }

  msgs.forEach(msg => appendMessage(msg, false));
  scrollToBottom();
}

function appendMessage(msg, scroll = true) {
  const container = document.getElementById('chatMessages');
  const emptyState = container.querySelector('.chat-empty-state');
  if (emptyState) emptyState.remove();

  const div = document.createElement('div');
  div.className = `msg ${msg.mine ? 'mine' : 'other'}`;
  div.innerHTML = `
    <div class="msg-avatar">${msg.avatar}</div>
    <div>
      ${!msg.mine ? `<div class="msg-name">${msg.user}</div>` : ''}
      <div class="msg-bubble">
        ${msg.text}
        <div class="msg-time">${msg.time}</div>
      </div>
    </div>
  `;
  container.appendChild(div);
  if (scroll) scrollToBottom();
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  if (container) container.scrollTop = container.scrollHeight;
}

function initChatInput() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  const sendMsg = () => {
    const text = input.value.trim();
    if (!text || !activeCourseId) return;

    const now = new Date();
    const msg = {
      user: 'أنت',
      avatar: 'س',
      text,
      time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      mine: true,
    };

    if (!courseMessages[activeCourseId]) courseMessages[activeCourseId] = [];
    courseMessages[activeCourseId].push(msg);
    appendMessage(msg);
    input.value = '';

    // Simulate reply
    setTimeout(() => simulateReply(activeCourseId), 1500 + Math.random() * 2000);
  };

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

  document.getElementById('courseSearch')?.addEventListener('input', e => {
    renderCourseList(e.target.value);
  });
}

const AUTO_REPLIES = [
  'شكراً على المشاركة! 👍',
  'سؤال ممتاز!',
  'لدي نفس السؤال!',
  'سأتحقق من المذكرة وأرد لاحقاً',
  'دكتور، هل يمكن التوضيح أكثر؟',
  'رابط مفيد: https://visualgo.net',
  '✅ تم الحل! شكراً',
  'الامتحان شامل لهذا الفصل كله؟',
];

const REPLY_USERS = [
  { user: 'أحمد السالم', avatar: 'أ' },
  { user: 'نورة الزهراني', avatar: 'ن' },
  { user: 'خالد المطيري', avatar: 'خ' },
  { user: 'سلمى القحطاني', avatar: 'س' },
];

function simulateReply(courseId) {
  if (activeCourseId !== courseId) return;
  const u = REPLY_USERS[Math.floor(Math.random() * REPLY_USERS.length)];
  const now = new Date();
  const msg = {
    user: u.user,
    avatar: u.avatar,
    text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
    time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    mine: false,
  };
  courseMessages[courseId].push(msg);
  appendMessage(msg);
}
