/* Shared learning home, planner, notebooks and focus clock. All saved records use the app bridge. */
(function () {
  "use strict";
  var bridge, tickHandle, composing = false, renderQueued = false;
  var subjects = { ai: "AI / 编程", cet4: "英语四级", general: "其他学习" };
  var subjectIcons = { ai: "🤖", cet4: "🔤", general: "📚" };
  var state = {
    planFilter: "today", planSubject: "all", noteFilter: "all", noteSubject: "all", noteSearch: "",
    planDraft: null, noteDraft: null, settingsDraft: null, timer: null
  };
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function safeSubject(subject) { return subjects[subject] ? subject : "general"; }
  function subjectLabel(subject) { return subjects[safeSubject(subject)]; }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || min)); }
  function read() { return bridge.read() || {}; }
  function dateString(value) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''; var time = Date.parse(value + 'T12:00:00Z'); return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? value : ''; }
  function normalizeRecord(record, key) { var minutes = Number(record.minutes); return Object.assign({}, record, { key: key, title: typeof record.title === 'string' ? record.title : '', content: typeof record.content === 'string' ? record.content : '', date: dateString(record.date), minutes: Number.isFinite(minutes) ? Math.max(0, Math.min(1440, minutes)) : 0, subject: safeSubject(record.subject), done: record.done === true }); }
  function records(prefix, snapshot) {
    var study = (snapshot || read()).study || {};
    return Object.keys(study).filter(function (key) { return key.indexOf(prefix) === 0 && study[key] && typeof study[key] === 'object' && !study[key].deleted; }).map(function (key) { return normalizeRecord(study[key], key); });
  }
  function settings(snapshot) {
    var value = ((snapshot || read()).study || {})["hub:settings"] || {};
    if (value.deleted) value = {};
    return Object.assign({ dailyGoalMinutes: 60, cet4ExamDate: "" }, value, { dailyGoalMinutes: clamp(value.dailyGoalMinutes || 60, 5, 720), cet4ExamDate: dateString(value.cet4ExamDate) });
  }
  function dateOffset(date, offset) { var part = String(date).split("-").map(Number); var d = new Date(part[0], part[1] - 1, part[2] + offset, 12); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-"); }
  function dayDiff(a, b) { return Math.round((Date.parse(a + "T12:00:00Z") - Date.parse(b + "T12:00:00Z")) / 86400000); }
  function shortDate(date) { return dateString(date) ? date.slice(5).replace("-", "/") : "未定日期"; }
  function newPlan() { return { key: "", title: "", date: bridge.today(), subject: "ai", minutes: "25" }; }
  function newNote() { return { key: "", title: "", content: "", subject: "ai", type: "note" }; }
  function allLogs(snapshot) { return Array.isArray(snapshot.log) ? snapshot.log.filter(function (r) { return r && typeof r === 'object' && !r.deleted; }).map(function (r) { return normalizeRecord(r, r.id || ''); }) : []; }
  function dailyMinutes(snapshot, date) {
    return records("focus:", snapshot).concat(records("practice:", snapshot)).filter(function (r) { return r.date === date; }).reduce(function (n, r) { return n + Math.max(0, Number(r.minutes) || 0); }, 0) + allLogs(snapshot).filter(function (r) { return r.date === date; }).reduce(function (n, r) { return n + Math.max(0, Number(r.minutes) || 0); }, 0);
  }
  function streak(checkins, today) {
    var dates = new Set(checkins.map(function (r) { return r.date; }));
    var cursor = dates.has(today) ? today : dateOffset(today, -1), count = 0;
    while (dates.has(cursor) && count < 10000) { count += 1; cursor = dateOffset(cursor, -1); }
    return count;
  }
  function subjectOptions(selected, includeAll) {
    var html = includeAll ? '<option value="all"' + (selected === "all" ? " selected" : "") + '>全部学科</option>' : "";
    return html + Object.keys(subjects).map(function (key) { return '<option value="' + key + '"' + (key === selected ? " selected" : "") + '>' + subjects[key] + '</option>'; }).join("");
  }
  function pill(subject) { subject = safeSubject(subject); return '<span class="hub-tag hub-tag-' + subject + '">' + subjectIcons[subject] + ' ' + subjects[subject] + '</span>'; }
  function empty(icon, title, text) { return '<div class="hub-empty"><span aria-hidden="true">' + icon + '</span><strong>' + title + '</strong><p>' + text + '</p></div>'; }
  function heading(eyebrow, title, text) { return '<header class="hub-page-heading"><span class="hub-kicker">' + eyebrow + '</span><h1>' + title + '</h1><p>' + text + '</p></header>'; }
  function stat(icon, value, label, tone) { return '<article class="hub-stat hub-tone-' + tone + '"><span class="hub-stat-icon" aria-hidden="true">' + icon + '</span><div><strong>' + value + '</strong><span>' + label + '</span></div></article>'; }
  function progress(percent, label) { return '<div class="hub-progress" role="progressbar" aria-label="' + esc(label) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '"><span style="width:' + percent + '%"></span></div>'; }
  function checkinCalendar(checkins, today) {
    var dates = new Set(checkins.map(function (r) { return r.date; }));
    var weekdays = ["日", "一", "二", "三", "四", "五", "六"], html = "";
    for (var i = 27; i >= 0; i -= 1) {
      var date = dateOffset(today, -i), done = dates.has(date);
      html += '<span class="hub-calendar-day' + (done ? ' is-checked' : '') + (date === today ? ' is-today' : '') + '" title="' + date + (done ? ' 已打卡' : ' 未打卡') + '" aria-label="' + date + (done ? ' 已打卡' : ' 未打卡') + '"><small>周' + weekdays[new Date(date + "T12:00:00").getDay()] + '</small><b>' + (done ? '✓' : Number(date.slice(-2))) + '</b></span>';
    }
    return html;
  }
  function renderHome(snapshot) {
    var today = bridge.today(), plans = records("plan:", snapshot), todayPlans = plans.filter(function (r) { return r.date === today; }), done = todayPlans.filter(function (r) { return r.done; }).length;
    var checkins = records("checkin:", snapshot), checked = checkins.some(function (r) { return r.date === today; }), config = settings(snapshot);
    var minutes = dailyMinutes(snapshot, today), pct = Math.min(100, Math.round(minutes / config.dailyGoalMinutes * 100));
    var notes = records("note:", snapshot), focuses = records("focus:", snapshot).filter(function (r) { return r.date === today; });
    var examDays = config.cet4ExamDate ? dayDiff(config.cet4ExamDate, today) : null;
    var examLabel = examDays === null ? "添加自己的考试目标" : examDays > 0 ? '距离目标还有 ' + examDays + ' 天' : examDays === 0 ? "今天是你的目标日" : "目标日已过，设置新计划";
    return '<div class="learning-hub">' + heading("MY LEARNING WORLD", "今天，也向前一步 <span aria-hidden=\"true\">🌈</span>", '把 AI、四级和每天的小进步，装进同一个学习口袋。') +
      '<div class="hub-welcome"><img class="hub-welcome-art" src="assets/doraemon-sky.jpg" alt="" aria-hidden="true"><div class="hub-welcome-copy"><span class="hub-date">' + today.replace(/-/g, ".") + ' · 你的学习冒险</span><h2>' + (checked ? '今日已打卡，继续保持好奇心！' : '和哆啦 A 梦一起，开启今天的学习') + '</h2><p>不必一次完成全部。选一件小事，认真做完就很好。</p><button class="hub-btn hub-btn-primary" type="button" data-hub-action="checkin"' + (checked ? ' disabled' : '') + '>' + (checked ? '✓ 今日已打卡' : '☀️ 今天来打卡') + '</button></div><div class="hub-welcome-sticker" aria-hidden="true"><span>每日进步</span><b>✦</b><small>一点点，也很棒</small></div></div>' +
      '<div class="hub-stats">' + stat("🔥", streak(checkins, today) + '<small> 天</small>', "连续打卡", "orange") + stat("⏱️", Math.round(minutes) + '<small> 分钟</small>', "今日学习投入", "blue") + stat("✅", done + '<small> / ' + todayPlans.length + '</small>', "今日计划完成", "green") + stat("📝", notes.length + '<small> 篇</small>', "我的笔记与错题", "purple") + '</div>' +
      '<div class="hub-two-col"><section class="hub-panel"><div class="hub-panel-head"><h2>🎯 今日学习目标</h2><button class="hub-text-btn" type="button" data-hub-action="navigate" data-tab="planner">调整计划 →</button></div><div class="hub-goal-line"><strong>' + Math.round(minutes) + '<small> / ' + config.dailyGoalMinutes + ' 分钟</small></strong><span>' + pct + '%</span></div>' + progress(pct, "今日学习时长目标") + '<p class="hub-caption">统计专注计时、学习日志与四级训练记录时长</p><div class="hub-today-tasks">' + (todayPlans.length ? todayPlans.slice(0, 4).map(function (r) { return '<div class="hub-compact-task"><input type="checkbox" aria-label="完成计划：' + esc(r.title) + '" data-hub-plan-toggle="' + esc(r.key) + '"' + (r.done ? ' checked' : '') + '><span class="' + (r.done ? 'is-complete' : '') + '">' + esc(r.title) + '</span><small>' + esc(r.minutes || 25) + ' 分</small></div>'; }).join("") : '<p class="hub-inline-empty">今天还没有安排，先添加一项小任务吧。</p>') + '</div></section>' +
      '<section class="hub-panel hub-calendar"><div class="hub-panel-head"><h2>📅 我的打卡足迹</h2><span class="hub-count">近 28 天</span></div><div class="hub-calendar-grid">' + checkinCalendar(checkins, today) + '</div><p class="hub-caption">' + (checked ? '今天的努力已经留下小脚印。' : '点上方「今天来打卡」，留下今天的脚印。') + '</p></section></div>' +
      '<section class="hub-panel hub-research-entry"><div><span class="hub-kicker">研一 · 电子信息 · 当前重点</span><h2>先把文献读明白，把想法写清楚。</h2><p>导师资料、研究方向、小论文前中后期路线与文献阅读卡，逐步形成能讨论的研究成果。</p></div><button class="hub-btn hub-btn-primary" type="button" data-hub-action="navigate" data-tab="research">进入我的学术研究 →</button></section>' +
      '<div class="hub-section-heading"><h2>课程与练习</h2><span>打好基础，慢慢积累</span></div><div class="hub-course-grid"><button class="hub-course hub-course-ai" type="button" data-hub-action="navigate" data-tab="roadmap"><span class="hub-course-icon" aria-hidden="true">🤖</span><span class="hub-course-content"><span class="hub-kicker">BUILD SOMETHING</span><strong>AI Agent 成长之旅</strong><span>Git · Python · 文献 · Agent 实战</span><b>继续我的学习路线 <span aria-hidden="true">→</span></b></span></button><button class="hub-course hub-course-english" type="button" data-hub-action="navigate" data-tab="cet4"><span class="hub-course-icon" aria-hidden="true">🔤</span><span class="hub-course-content"><span class="hub-kicker">A LITTLE EVERY DAY</span><strong>英语四级通关计划</strong><span>单词 · 听力 · 阅读 · 写作翻译</span><b>' + examLabel + ' <span aria-hidden="true">→</span></b></span></button></div>' +
      '<div class="hub-two-col hub-bottom-grid">' + renderTimer() + '<section class="hub-panel"><div class="hub-panel-head"><h2>✨ 最近的小进步</h2><button class="hub-text-btn" type="button" data-hub-action="navigate" data-tab="log">学习日志 →</button></div>' + renderActivity(snapshot) + '</section></div>' +
      '<div class="hub-quick-links"><button type="button" data-hub-action="navigate" data-tab="notes"><span>📝</span><strong>灵感笔记</strong><small>随手记下一个想法</small></button><button type="button" data-hub-action="new-mistake"><span>🔍</span><strong>错题口袋</strong><small>让错误成为下一次的进步</small></button><button type="button" data-hub-action="navigate" data-tab="stats"><span>📊</span><strong>成长报告</strong><small>回看你的学习轨迹</small></button><button type="button" data-hub-action="navigate" data-tab="settings"><span>☁️</span><strong>设备同步</strong><small>电脑手机接着学</small></button></div></div>';
  }
  function renderActivity(snapshot) {
    var items = [];
    records("focus:", snapshot).forEach(function (r) { items.push({ icon: "🍅", title: '完成 ' + r.minutes + ' 分钟专注', text: subjectLabel(r.subject), date: r.date, at: r.updatedAt || r.date }); });
    records("practice:", snapshot).forEach(function (r) { items.push({ icon: "🔤", title: r.title || '四级专项训练', text: '记录 ' + (r.minutes || 0) + ' 分钟四级练习', date: r.date, at: r.updatedAt || r.date }); });
    records("note:", snapshot).forEach(function (r) { items.push({ icon: r.type === "mistake" ? "🔍" : "📝", title: r.title, text: r.type === "mistake" ? "整理了一道错题" : "保存了一篇笔记", date: String(r.updatedAt || "").slice(0, 10), at: r.updatedAt || "" }); });
    records("plan:", snapshot).filter(function (r) { return r.done; }).forEach(function (r) { items.push({ icon: "✅", title: r.title, text: "完成学习计划", date: r.date, at: r.updatedAt || r.date }); });
    records("knowledge:", snapshot).filter(function (r) { return r.done; }).forEach(function (r) { items.push({ icon: "📚", title: r.title, text: "学完一篇知识指南", date: r.doneAt || String(r.updatedAt || '').slice(0, 10), at: r.updatedAt || r.doneAt }); });
    records("paper:", snapshot).forEach(function (r) { items.push({ icon: "📑", title: r.title, text: "整理文献阅读卡", date: String(r.updatedAt || '').slice(0, 10), at: r.updatedAt || '' }); });
    records("research-step:", snapshot).filter(function (r) { return r.done; }).forEach(function (r) { items.push({ icon: "🎓", title: r.title, text: "完成一个科研步骤", date: r.doneAt || String(r.updatedAt || '').slice(0, 10), at: r.updatedAt || '' }); });
    allLogs(snapshot).forEach(function (r) { items.push({ icon: "📖", title: r.title, text: "记录学习日志", date: r.date, at: r.updatedAt || r.date }); });
    records("checkin:", snapshot).forEach(function (r) { items.push({ icon: "☀️", title: "今日学习打卡", text: "留下一个前进的脚印", date: r.date, at: r.updatedAt || r.date }); });
    items.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
    return items.length ? '<ul class="hub-activity-list">' + items.slice(0, 4).map(function (r) { return '<li><span class="hub-activity-icon" aria-hidden="true">' + r.icon + '</span><div><strong>' + esc(r.title) + '</strong><span>' + esc(r.text) + '</span></div><time>' + esc(shortDate(r.date)) + '</time></li>'; }).join("") + '</ul>' : empty("🌱", "你的成长故事，从今天开始", "打个卡、完成一次专注，或写下第一篇笔记。");
  }
  function renderTimer() {
    var t = state.timer, selected = Math.round(t.duration / 60);
    return '<section class="hub-panel hub-focus"><div class="hub-panel-head"><h2>🍅 专注时间口袋</h2><span class="hub-count">每次只做一件事</span></div><div class="hub-timer-face"><span class="hub-timer-digits" data-hub-timer-clock role="timer" aria-label="专注倒计时">' + clockText(remaining()) + '</span><span class="hub-timer-state" data-hub-timer-status>' + (t.running ? '专注中，好好享受这段时间' : t.recorded ? '这次专注已记录，做得好！' : t.remaining < t.duration ? '已经暂停，准备好再继续' : '准备好，给自己一段安静的时间') + '</span></div><div class="hub-timer-controls"><label>专注时长<select id="hubTimerDuration" data-hub-field="timer-duration"' + (t.running || t.remaining < t.duration && !t.recorded ? ' disabled' : '') + '>' + [15, 25, 45, 60].map(function (n) { return '<option value="' + n + '"' + (selected === n ? ' selected' : '') + '>' + n + ' 分钟</option>'; }).join("") + '</select></label><label>学习内容<select id="hubTimerSubject" data-hub-field="timer-subject"' + (t.running || t.remaining < t.duration && !t.recorded ? ' disabled' : '') + '>' + subjectOptions(t.subject) + '</select></label></div><div class="hub-button-row"><button class="hub-btn hub-btn-primary" type="button" data-hub-action="timer-toggle">' + (t.running ? 'Ⅱ 暂停一下' : t.recorded ? '▶ 再专注一次' : '▶ ' + (t.remaining < t.duration ? '继续专注' : '开始专注')) + '</button><button class="hub-btn hub-btn-subtle" type="button" data-hub-action="timer-reset">重置</button></div><p class="hub-caption">完成倒计时会记录学习时长。关闭浏览器后，计时仍按结束时间继续。</p><span class="hub-sr" aria-live="polite" data-hub-timer-announcement></span></section>';
  }
  function clockText(seconds) { seconds = Math.max(0, Math.ceil(seconds)); return String(Math.floor(seconds / 60)).padStart(2, "0") + ':' + String(seconds % 60).padStart(2, "0"); }
  function renderPlanner(snapshot) {
    var today = bridge.today(), draft = state.planDraft, config = state.settingsDraft || settings(snapshot), all = records("plan:", snapshot);
    var plans = all.filter(function (r) {
      return (state.planSubject === "all" || r.subject === state.planSubject) && (state.planFilter === "all" || state.planFilter === "today" && r.date === today || state.planFilter === "upcoming" && r.date > today || state.planFilter === "overdue" && r.date < today && !r.done);
    }).sort(function (a, b) { return String(a.date).localeCompare(String(b.date)) || Number(!!a.done) - Number(!!b.done) || String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var overdue = all.filter(function (r) { return r.date < today && !r.done; }).length;
    return '<div class="learning-hub">' + heading("SMALL STEPS, BIG ADVENTURES", "学习计划 <span aria-hidden=\"true\">🎒</span>", '给每一天一点方向，也给自己的节奏留一点空间。') +
      '<div class="hub-planner-layout"><div><section class="hub-panel hub-task-editor"><div class="hub-panel-head"><h2>' + (draft.key ? '✏️ 修改学习计划' : '➕ 给今天加一点动力') + '</h2></div><form id="hubPlanForm" data-hub-form="plan"><label>想完成什么？<input id="hubPlanTitle" data-hub-field="plan-title" name="title" maxlength="160" required placeholder="例如：完成一篇四级阅读并整理错题" value="' + esc(draft.title) + '"></label><div class="hub-form-row hub-form-row-three"><label>安排日期<input id="hubPlanDate" data-hub-field="plan-date" name="date" type="date" required value="' + esc(draft.date) + '"></label><label>学习学科<select id="hubPlanSubject" data-hub-field="plan-subject" name="subject">' + subjectOptions(draft.subject) + '</select></label><label>预计分钟<input id="hubPlanMinutes" data-hub-field="plan-minutes" name="minutes" type="number" min="5" max="480" step="1" required value="' + esc(draft.minutes) + '"></label></div><div class="hub-button-row"><button class="hub-btn hub-btn-primary" type="submit">' + (draft.key ? '保存修改' : '＋ 添加计划') + '</button>' + (draft.key ? '<button class="hub-btn hub-btn-subtle" type="button" data-hub-action="cancel-plan">取消编辑</button>' : '') + '<span class="hub-caption">预计时长用于安排，不计入实际学习时长</span></div></form></section>' +
      '<section class="hub-panel hub-plan-list-panel"><div class="hub-panel-head"><h2>📌 我的待办清单</h2><span class="hub-count">' + plans.length + ' 项</span></div><div class="hub-filter-toolbar"><div class="hub-segments" role="group" aria-label="计划日期筛选">' + [{ id: 'today', title: '今天' }, { id: 'upcoming', title: '未来' }, { id: 'overdue', title: '待补上' + (overdue ? ' ' + overdue : '') }, { id: 'all', title: '全部' }].map(function (f) { return '<button type="button" class="' + (state.planFilter === f.id ? 'is-active' : '') + '" aria-pressed="' + (state.planFilter === f.id) + '" data-hub-action="plan-filter" data-filter="' + f.id + '">' + f.title + '</button>'; }).join("") + '</div><label class="hub-filter-select"><span class="hub-sr">筛选计划学科</span><select id="hubPlanFilterSubject" data-hub-field="plan-filter-subject">' + subjectOptions(state.planSubject, true) + '</select></label></div><div class="hub-plan-list">' + (plans.length ? plans.map(function (r) { return renderPlanRow(r, today); }).join("") : empty("🪁", "这里还空着，安排一件喜欢的小事", "可以从 25 分钟编程，或一篇四级阅读开始。")) + '</div></section></div>' +
      '<aside class="hub-planner-side"><section class="hub-panel hub-goal-settings"><div class="hub-panel-head"><h2>🎯 我的学习目标</h2></div><form data-hub-form="settings"><label>每日学习目标（分钟）<input id="hubDailyGoal" data-hub-field="settings-goal" name="dailyGoalMinutes" type="number" min="5" max="720" required value="' + esc(config.dailyGoalMinutes) + '"></label><label>四级考试 / 自定目标日<input id="hubExamDate" data-hub-field="settings-exam" name="cet4ExamDate" type="date" value="' + esc(config.cet4ExamDate || '') + '"></label><p class="hub-caption">日期由你选择。请以考试官方安排为准；留空可暂时隐藏倒计时。</p><button class="hub-btn hub-btn-primary" type="submit">保存目标</button></form></section><section class="hub-panel hub-tip-card"><span class="hub-tip-illustration" aria-hidden="true">🌱</span><h3>让计划刚刚好</h3><p>把「学好英语」换成「听一段材料并跟读三遍」。任务越具体，开始就越容易。</p><button class="hub-text-btn" type="button" data-hub-action="navigate" data-tab="cet4">去四级学习中心 →</button></section></aside></div></div>';
  }
  function renderPlanRow(r, today) {
    return '<article class="hub-plan-row' + (r.done ? ' is-done' : '') + '"><label class="hub-plan-check"><input type="checkbox" data-hub-plan-toggle="' + esc(r.key) + '" aria-label="完成计划：' + esc(r.title) + '"' + (r.done ? ' checked' : '') + '></label><div class="hub-plan-main"><h3>' + esc(r.title) + '</h3><div class="hub-plan-meta">' + pill(r.subject) + '<span' + (r.date < today && !r.done ? ' class="hub-overdue"' : '') + '>' + (r.date === today ? '今天' : esc(r.date)) + '</span><span>约 ' + esc(r.minutes) + ' 分钟</span></div></div><div class="hub-item-tools"><button type="button" class="hub-icon-btn" data-hub-action="edit-plan" data-key="' + esc(r.key) + '" aria-label="编辑计划：' + esc(r.title) + '" title="编辑">✎</button><button type="button" class="hub-icon-btn hub-danger" data-hub-action="delete-plan" data-key="' + esc(r.key) + '" aria-label="删除计划：' + esc(r.title) + '" title="删除">×</button></div></article>';
  }
  function renderNotes(snapshot) {
    var draft = state.noteDraft, all = records("note:", snapshot), q = state.noteSearch.trim().toLowerCase();
    var notes = all.filter(function (r) { return (state.noteFilter === 'all' || r.type === state.noteFilter) && (state.noteSubject === 'all' || r.subject === state.noteSubject) && (!q || (String(r.title) + '\n' + String(r.content)).toLowerCase().indexOf(q) !== -1); }).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    return '<div class="learning-hub">' + heading("COLLECT EVERY LITTLE DISCOVERY", "笔记与错题口袋 <span aria-hidden=\"true\">📝</span>", '好想法要记下来，做错的题也值得认真收藏。') +
      '<div class="hub-notebook-layout"><section class="hub-panel hub-note-editor"><div class="hub-panel-head"><h2>' + (draft.key ? '✏️ 编辑我的记录' : '✍️ 写下新的发现') + '</h2><span class="hub-count">' + (draft.type === 'mistake' ? '错题复盘' : '学习笔记') + '</span></div><form id="hubNoteForm" data-hub-form="note"><div class="hub-form-row"><label>记录类型<select id="hubNoteType" data-hub-field="note-type" name="type"><option value="note"' + (draft.type === 'note' ? ' selected' : '') + '>📝 学习笔记</option><option value="mistake"' + (draft.type === 'mistake' ? ' selected' : '') + '>🔍 错题复盘</option></select></label><label>所属学科<select id="hubNoteSubject" data-hub-field="note-subject" name="subject">' + subjectOptions(draft.subject) + '</select></label></div><label>给这条记录起个名字<input id="hubNoteTitle" data-hub-field="note-title" name="title" maxlength="160" required value="' + esc(draft.title) + '" placeholder="例如：阅读长难句分析 / Python 列表切片"></label><label>内容<textarea id="hubNoteContent" data-hub-field="note-content" name="content" rows="9" maxlength="20000" required placeholder="可以写下：学习内容 → 我的理解 → 下次怎么用。\n错题可以记录：题目 / 错误原因 / 正确思路 / 复习提醒。">' + esc(draft.content) + '</textarea></label><div class="hub-button-row"><button class="hub-btn hub-btn-primary" type="submit">' + (draft.key ? '保存修改' : '收进口袋') + '</button><button class="hub-btn hub-btn-subtle" type="button" data-hub-action="cancel-note">' + (draft.key ? '取消编辑' : '清空') + '</button></div><p class="hub-caption">保存后支持搜索；跨设备同步沿用网站的数据同步设置。</p></form></section>' +
      '<section class="hub-notes-library"><div class="hub-panel hub-note-filters"><div class="hub-panel-head"><h2>🗂️ 我的收藏架</h2><span class="hub-count">' + notes.length + ' / ' + all.length + ' 篇</span></div><label class="hub-search"><span aria-hidden="true">⌕</span><span class="hub-sr">搜索笔记标题和内容</span><input id="hubNoteSearch" data-hub-field="note-search" type="search" placeholder="搜索标题或内容…" value="' + esc(state.noteSearch) + '"></label><div class="hub-filter-toolbar"><div class="hub-segments" role="group" aria-label="笔记类型筛选">' + [{ id: 'all', title: '全部' }, { id: 'note', title: '📝 笔记' }, { id: 'mistake', title: '🔍 错题' }].map(function (f) { return '<button type="button" class="' + (state.noteFilter === f.id ? 'is-active' : '') + '" aria-pressed="' + (state.noteFilter === f.id) + '" data-hub-action="note-filter" data-filter="' + f.id + '">' + f.title + '</button>'; }).join("") + '</div><label class="hub-filter-select"><span class="hub-sr">筛选笔记学科</span><select id="hubNoteFilterSubject" data-hub-field="note-filter-subject">' + subjectOptions(state.noteSubject, true) + '</select></label></div></div><div class="hub-notes-grid">' + (notes.length ? notes.map(renderNoteCard).join("") : '<div class="hub-panel">' + empty("📓", q ? '没有找到匹配的记录' : '你的第一篇记录，会是什么？', q ? '试试其他关键词，或切换学科与记录类型。' : '把今天学到的一点点，写进左边的笔记。') + '</div>') + '</div></section></div></div>';
  }
  function renderNoteCard(r) {
    return '<article class="hub-note-card' + (r.type === 'mistake' ? ' hub-note-mistake' : '') + '"><div class="hub-note-card-head">' + pill(r.subject) + '<span class="hub-note-kind">' + (r.type === 'mistake' ? '🔍 错题' : '📝 笔记') + '</span></div><h3>' + esc(r.title) + '</h3><p class="hub-note-excerpt">' + esc(r.content) + '</p><div class="hub-note-card-bottom"><time>' + esc(shortDate(String(r.updatedAt || '').slice(0, 10))) + '</time><div class="hub-item-tools"><button class="hub-text-btn" type="button" data-hub-action="edit-note" data-key="' + esc(r.key) + '">阅读 / 编辑</button><button class="hub-icon-btn hub-danger" type="button" data-hub-action="delete-note" data-key="' + esc(r.key) + '" aria-label="删除记录：' + esc(r.title) + '" title="删除">×</button></div></div></article>';
  }
  function defaultTimer() { return { id: '', duration: 1500, remaining: 1500, endAt: 0, running: false, subject: 'ai', recorded: false }; }
  function restoreTimer() {
    var timer = defaultTimer();
    try {
      var saved = JSON.parse(sessionStorage.getItem('study-hub-focus-v1') || 'null');
      if (saved && Number.isFinite(saved.duration) && saved.duration >= 60 && saved.duration <= 7200 && Number.isFinite(saved.remaining) && saved.remaining >= 0 && saved.remaining <= saved.duration && (!saved.running || typeof saved.id === 'string' && saved.id && Number.isFinite(saved.endAt) && saved.endAt > 0)) timer = Object.assign(timer, saved, { subject: safeSubject(saved.subject) });
    } catch (error) { /* Session storage may be blocked; the in-memory clock still works. */ }
    return timer;
  }
  function saveTimer() { try { sessionStorage.setItem('study-hub-focus-v1', JSON.stringify(state.timer)); } catch (error) { /* In-memory fallback. */ } }
  function remaining() { return state.timer.running ? Math.max(0, (state.timer.endAt - Date.now()) / 1000) : state.timer.remaining; }
  function updateClock() {
    if (!bridge || !state.timer) return;
    if (state.timer.running && remaining() <= 0) { finishTimer(); return; }
    document.querySelectorAll('[data-hub-timer-clock]').forEach(function (node) { node.textContent = clockText(remaining()); });
  }
  function finishTimer() {
    var t = state.timer;
    if (t.recorded) return;
    t.remaining = 0; t.running = false; t.recorded = true;
    var key = 'focus:' + t.id, endDate = new Date(t.endAt || Date.now()), date = [endDate.getFullYear(), String(endDate.getMonth() + 1).padStart(2, '0'), String(endDate.getDate()).padStart(2, '0')].join('-');
    saveTimer();
    if (!((read().study || {})[key])) bridge.put(key, { date: date, subject: t.subject, minutes: t.duration / 60, title: subjectLabel(t.subject) + '专注', completed: true });
    render(); bridge.toast('完成 ' + t.duration / 60 + ' 分钟专注，已记录！');
    var announcement = document.querySelector('[data-hub-timer-announcement]'); if (announcement) announcement.textContent = '本次专注结束，学习时长已记录。';
  }
  function setTimer(field, value) {
    if (state.timer.running || state.timer.remaining < state.timer.duration && !state.timer.recorded) return;
    if (field === 'duration') { state.timer.duration = clamp(value, 1, 120) * 60; state.timer.remaining = state.timer.duration; state.timer.recorded = false; }
    else state.timer.subject = safeSubject(value);
    saveTimer(); render();
  }
  function toggleTimer() {
    var t = state.timer;
    if (t.running) { t.remaining = remaining(); if (t.remaining <= 0) { finishTimer(); return; } t.running = false; }
    else { if (t.recorded || t.remaining <= 0) { t.remaining = t.duration; t.recorded = false; t.id = ''; } if (!t.id) t.id = bridge.uid(); t.endAt = Date.now() + t.remaining * 1000; t.running = true; }
    saveTimer(); render();
  }
  function resetTimer() {
    if ((state.timer.running || state.timer.remaining < state.timer.duration && !state.timer.recorded) && !window.confirm('重置会放弃本次尚未完成的专注计时，确定重置吗？')) return;
    state.timer = Object.assign(defaultTimer(), { duration: state.timer.duration, remaining: state.timer.duration, subject: state.timer.subject }); saveTimer(); render();
  }
  function preserveFocus() {
    var node = document.activeElement;
    if (!node || !node.closest('.learning-hub') || !node.id) return null;
    return { id: node.id, start: node.selectionStart, end: node.selectionEnd, scrollTop: node.scrollTop };
  }
  function render() {
    if (!bridge) return;
    if (composing) { renderQueued = true; return; }
    var focus = preserveFocus(), snapshot = read();
    var home = document.getElementById('hubHome'), planner = document.getElementById('hubPlanner'), notes = document.getElementById('hubNotes');
    if (home) home.innerHTML = renderHome(snapshot);
    if (planner) planner.innerHTML = renderPlanner(snapshot);
    if (notes) notes.innerHTML = renderNotes(snapshot);
    if (focus) {
      var replacement = document.getElementById(focus.id);
      if (replacement) { replacement.focus({ preventScroll: true }); if (typeof focus.start === 'number' && (/^(text|search|email|url|tel|password)$/.test(replacement.type || '') || replacement.tagName === 'TEXTAREA')) { try { replacement.setSelectionRange(focus.start, focus.end); } catch (error) {} } replacement.scrollTop = focus.scrollTop; }
    }
    updateClock();
  }
  function getRecord(key) { var r = (read().study || {})[key]; return r && typeof r === 'object' && !r.deleted ? normalizeRecord(r, key) : null; }
  function captureField(target) {
    var field = target.dataset.hubField, value = target.value;
    if (!field) return;
    var planFields = { 'plan-title': 'title', 'plan-date': 'date', 'plan-subject': 'subject', 'plan-minutes': 'minutes' };
    var noteFields = { 'note-title': 'title', 'note-content': 'content', 'note-type': 'type', 'note-subject': 'subject' };
    if (planFields[field]) state.planDraft[planFields[field]] = value;
    else if (noteFields[field]) state.noteDraft[noteFields[field]] = value;
    else if (field === 'settings-goal' || field === 'settings-exam') { if (!state.settingsDraft) state.settingsDraft = settings(); state.settingsDraft[field === 'settings-goal' ? 'dailyGoalMinutes' : 'cet4ExamDate'] = value; }
    else if (field === 'note-search') { state.noteSearch = value; render(); }
    else if (field === 'plan-filter-subject') { state.planSubject = value; render(); }
    else if (field === 'note-filter-subject') { state.noteSubject = value; render(); }
  }
  function focusEditor(id) { setTimeout(function () { var node = document.getElementById(id); if (node) { node.scrollIntoView({ behavior: 'smooth', block: 'center' }); node.focus({ preventScroll: true }); } }, 0); }
  function hasNoteDraft() { return state.noteDraft.title.trim() || state.noteDraft.content.trim(); }
  function acceptReplaceNote() {
    var d = state.noteDraft, old = d.key ? getRecord(d.key) : null;
    var clean = old && d.title === old.title && d.content === old.content && d.subject === safeSubject(old.subject) && d.type === (old.type === 'mistake' ? 'mistake' : 'note');
    return !hasNoteDraft() || clean || window.confirm('当前有尚未保存的笔记，确定放弃并打开另一篇吗？');
  }
  function handleAction(target) {
    var action = target.dataset.hubAction, key = target.dataset.key, record;
    if (action === 'navigate') bridge.navigate(target.dataset.tab);
    else if (action === 'checkin') { var today = bridge.today(); if (!getRecord('checkin:' + today)) { bridge.put('checkin:' + today, { date: today }); bridge.toast('打卡成功！今天又向前迈了一步 ☀️'); } }
    else if (action === 'plan-filter') { state.planFilter = target.dataset.filter; render(); }
    else if (action === 'note-filter') { state.noteFilter = target.dataset.filter; render(); }
    else if (action === 'cancel-plan') { state.planDraft = newPlan(); render(); }
    else if (action === 'cancel-note') { if (!hasNoteDraft() || window.confirm('确定清空当前尚未保存的笔记内容吗？')) { state.noteDraft = newNote(); render(); } }
    else if (action === 'edit-plan') { record = getRecord(key); if (record) { if (state.planDraft.key === key) { focusEditor('hubPlanTitle'); return; } if (state.planDraft.title && !window.confirm('当前计划还未保存，确定打开另一项吗？')) return; state.planDraft = { key: key, title: record.title || '', date: record.date || bridge.today(), subject: safeSubject(record.subject), minutes: String(record.minutes || 25) }; render(); focusEditor('hubPlanTitle'); } }
    else if (action === 'delete-plan') { if (window.confirm('确定删除这项计划吗？')) { if (state.planDraft.key === key) state.planDraft = newPlan(); bridge.remove(key); bridge.toast('计划已删除'); } }
    else if (action === 'edit-note') { record = getRecord(key); if (record && state.noteDraft.key === key) { focusEditor('hubNoteTitle'); return; } if (record && acceptReplaceNote()) { state.noteDraft = { key: key, title: record.title || '', content: record.content || '', subject: safeSubject(record.subject), type: record.type === 'mistake' ? 'mistake' : 'note' }; render(); focusEditor('hubNoteTitle'); } }
    else if (action === 'new-mistake') { if (acceptReplaceNote()) { state.noteDraft = Object.assign(newNote(), { type: 'mistake' }); bridge.navigate('notes'); render(); focusEditor('hubNoteTitle'); } }
    else if (action === 'delete-note') { if (window.confirm('确定删除这条记录吗？')) { if (state.noteDraft.key === key) state.noteDraft = newNote(); bridge.remove(key); bridge.toast('记录已删除'); } }
    else if (action === 'timer-toggle') toggleTimer();
    else if (action === 'timer-reset') resetTimer();
  }
  function onSubmit(event) {
    var form = event.target.closest('[data-hub-form]'); if (!form) return;
    event.preventDefault(); var kind = form.dataset.hubForm;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (kind === 'plan') {
      var d = state.planDraft, title = d.title.trim(); if (!title) { bridge.toast('先给计划起个名字吧'); return; }
      var key = d.key || 'plan:' + bridge.uid(), old = getRecord(key) || {}, fields = { title: title.slice(0, 160), date: d.date || bridge.today(), subject: safeSubject(d.subject), minutes: clamp(d.minutes, 5, 480), done: !!old.done };
      state.planDraft = newPlan(); state.planFilter = d.date === bridge.today() ? 'today' : d.date > bridge.today() ? 'upcoming' : 'all'; state.planSubject = 'all'; bridge.put(key, fields); bridge.toast(d.key ? '计划修改好了' : '已添加一项小目标');
    } else if (kind === 'note') {
      var n = state.noteDraft; if (!n.title.trim() || !n.content.trim()) { bridge.toast('标题和内容都写一点吧'); return; }
      var noteKey = n.key || 'note:' + bridge.uid(), noteFields = { title: n.title.trim().slice(0, 160), content: n.content.trim().slice(0, 20000), subject: safeSubject(n.subject), type: n.type === 'mistake' ? 'mistake' : 'note' };
      state.noteDraft = newNote(); state.noteFilter = 'all'; state.noteSubject = 'all'; state.noteSearch = ''; bridge.put(noteKey, noteFields); bridge.toast('已经收进你的学习口袋');
    } else if (kind === 'settings') {
      var config = state.settingsDraft || settings(); var fieldsToSave = Object.assign({}, settings(), { dailyGoalMinutes: clamp(config.dailyGoalMinutes, 5, 720), cet4ExamDate: config.cet4ExamDate || '' });
      state.settingsDraft = null; bridge.put('hub:settings', fieldsToSave); bridge.toast('学习目标已保存');
    }
    render();
  }
  function init(appBridge) {
    if (bridge) return;
    bridge = appBridge; state.planDraft = newPlan(); state.noteDraft = newNote(); state.timer = restoreTimer();
    document.addEventListener('click', function (event) { var target = event.target.closest('[data-hub-action]'); if (target && target.closest('.learning-hub')) { try { handleAction(target); } catch (error) { bridge.toast('操作没有完成，请稍后重试'); console.error('Learning hub action failed', error); } } });
    document.addEventListener('input', function (event) { if (event.target.closest('.learning-hub')) captureField(event.target); });
    document.addEventListener('change', function (event) {
      var target = event.target; if (!target.closest('.learning-hub')) return;
      if (target.dataset.hubPlanToggle) { var key = target.dataset.hubPlanToggle, record = getRecord(key); if (record) bridge.put(key, { done: target.checked }); }
      else if (target.dataset.hubField === 'timer-duration') setTimer('duration', target.value);
      else if (target.dataset.hubField === 'timer-subject') setTimer('subject', target.value);
      else captureField(target);
    });
    document.addEventListener('submit', onSubmit);
    document.addEventListener('compositionstart', function (event) { if (event.target.closest('.learning-hub')) composing = true; });
    document.addEventListener('compositionend', function (event) { if (event.target.closest('.learning-hub')) { composing = false; if (renderQueued) { renderQueued = false; render(); } } });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) updateClock(); });
    window.addEventListener('pagehide', saveTimer);
    tickHandle = setInterval(updateClock, 1000); render();
  }
  function reset() {
    if (!bridge) return;
    state.planDraft = newPlan(); state.noteDraft = newNote(); state.settingsDraft = null;
    state.noteSearch = ''; state.planFilter = 'today'; state.planSubject = 'all'; state.noteFilter = 'all'; state.noteSubject = 'all';
    state.timer = defaultTimer(); composing = false; renderQueued = false;
    try { sessionStorage.removeItem('study-hub-focus-v1'); } catch (error) { /* In-memory fallback. */ }
    render();
  }
  window.LearningHub = { init: init, render: render, reset: reset };
}());
