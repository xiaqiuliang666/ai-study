/* 个人学习档案：聚合所有模块的学习数据，提供复盘日记。纯前端，经主站 bridge 读写。 */
(function () {
  "use strict";
  let bridge;
  const ui = { reflectDraft: "", reflectFilter: "all" };

  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function read() { return bridge ? bridge.read() : {}; }
  function today() { return bridge ? bridge.today() : ""; }
  function study() { return read().study || {}; }

  // 学科分组：把 study 里的记录归到 ai / cet4 / research / general
  function subjectOf(record, key) {
    const s = record.subject;
    if (s === "cet4") return "cet4";
    if (s === "ai" || s === "general") return s;
    if (s === "research" || /^research/.test(key)) return "research";
    if (key.indexOf("cet4") === 0 || key.indexOf("practice") === 0 || key.indexOf("word") === 0) return "cet4";
    return "general";
  }

  function isActivityRecord(key, record) {
    if (!record || record.deleted) return false;
    const kind = key.split(":")[0];
    return ["focus", "practice", "checkin", "plan", "cet4-task", "cet4-writing", "cet4-translation", "word", "knowledge", "research-step", "paper", "research"].indexOf(kind) !== -1;
  }

  // 聚合核心指标
  function aggregate() {
    const st = study();
    const result = {
      totalMinutes: 0, pomodoros: 0, checkins: 0, plansDone: 0, wordsMastered: 0, tasksDone: 0,
      subjects: { ai: 0, cet4: 0, research: 0, general: 0 },
      days: {}, // 活跃日期 -> 分钟
      activities: []
    };
    Object.keys(st).forEach(function (key) {
      const r = st[key];
      if (!isActivityRecord(key, r)) return;
      const kind = key.split(":")[0];
      const subject = subjectOf(r, key);
      const minutes = (kind === "focus" || kind === "practice") ? (Number(r.minutes) || 0) : 0;
      let date = (r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) ? r.date : String(r.updatedAt || "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) date = String(r.updatedAt || "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;

      if (kind === "focus") result.pomodoros += 1;
      if (kind === "checkin") result.checkins += 1;
      if (kind === "plan" && r.done) result.plansDone += 1;
      if (kind === "word" && (Number(r.level) || 0) >= 3) result.wordsMastered += 1;
      if ((kind === "cet4-task" || kind === "knowledge" || kind === "research-step") && r.done) result.tasksDone += 1;

      result.totalMinutes += minutes;
      result.subjects[subject] += minutes;
      result.days[date] = (result.days[date] || 0) + minutes;

      const titles = { focus: "完成专注学习", practice: "完成四级练习", checkin: "每日打卡", plan: "完成计划", word: "复习单词", "cet4-task": "完成四级任务", "cet4-writing": "练习写作", "cet4-translation": "练习翻译", knowledge: "学习知识指南", "research-step": "完成科研步骤", paper: "整理文献卡", research: "更新研究" };
      result.activities.push({ date: date, at: String(r.updatedAt || date), title: titles[kind] + (r.title ? "：" + r.title : ""), minutes: minutes, subject: subject });
    });
    result.activities.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
    return result;
  }

  // 复盘日记：存储在 reflect: 前缀
  function reflections() {
    return Object.keys(study()).filter(function (key) { return key.indexOf("reflect:") === 0 && study()[key] && !study()[key].deleted; }).map(function (key) { const r = study()[key]; return { key: key, date: r.date, text: r.text, mood: r.mood }; }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }

  function render() {
    const mount = document.getElementById("profileMount");
    if (!mount || !bridge) return;
    const a = aggregate();
    const refls = reflections();
    const profile = read().profile || {};
    const hours = Math.round(a.totalMinutes / 60 * 10) / 10;

    // 学科分布条形图
    const subjectMeta = { ai: { label: "AI / 编程", icon: "🤖", color: "#079bda" }, cet4: { label: "英语四级", icon: "🔤", color: "#f2a03d" }, research: { label: "科研学术", icon: "🎓", color: "#8f6bd8" }, general: { label: "其他学习", icon: "📚", color: "#5bbf8a" } };
    const maxSubject = Math.max(1, Math.max.apply(null, Object.values(a.subjects)));
    let subjectBars = "";
    Object.keys(subjectMeta).forEach(function (k) {
      const m = subjectMeta[k], val = a.subjects[k] || 0;
      const pct = Math.round(val / maxSubject * 100);
      subjectBars += '<div class="pf-subject"><div class="pf-subject-head"><span>' + m.icon + ' ' + m.label + '</span><strong>' + val + ' 分钟</strong></div><div class="pf-bar"><i style="width:' + pct + '%;background:' + m.color + '"></i></div></div>';
    });

    // 活跃日热力（近 14 天）
    let daysHtml = "";
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(today() + "T12:00:00"); d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      const mins = a.days[ds] || 0;
      daysHtml += '<span class="pf-day' + (mins > 0 ? " is-active" : "") + '" title="' + ds + " · " + mins + ' 分钟"><b>' + Number(ds.slice(-2)) + "</b></span>";
    }

    const recent = a.activities.slice(0, 6).map(function (x) { return '<li><span class="pf-act-icon">' + (subjectMeta[x.subject] ? subjectMeta[x.subject].icon : "📚") + '</span><div><strong>' + esc(x.title) + '</strong><span>' + esc(x.date) + (x.minutes ? " · " + x.minutes + " 分钟" : "") + "</span></div></li>"; }).join("");

    mount.innerHTML =
      '<div class="pf-app">' +
      '<header class="pf-hero"><span class="pf-eyebrow">MY LEARNING PROFILE</span><h1>我的学习档案 <span aria-hidden="true">🗂️</span></h1><p>' + (profile.name ? esc(profile.name) + "，把每一天的积累都看在这里。" : "把每一天的积累，都看在这里。") + '</p></header>' +
      '<div class="pf-stats">' +
      '<div class="pf-stat"><span class="pf-stat-icon">⏱️</span><div><strong>' + hours + '<small> 小时</small></strong><span>累计专注与练习</span></div></div>' +
      '<div class="pf-stat"><span class="pf-stat-icon">🍅</span><div><strong>' + a.pomodoros + '<small> 个</small></strong><span>完成的番茄</span></div></div>' +
      '<div class="pf-stat"><span class="pf-stat-icon">🔥</span><div><strong>' + a.checkins + '<small> 天</small></strong><span>累计打卡</span></div></div>' +
      '<div class="pf-stat"><span class="pf-stat-icon">✅</span><div><strong>' + (a.plansDone + a.tasksDone) + '<small> 项</small></strong><span>完成计划与任务</span></div></div>' +
      '<div class="pf-stat"><span class="pf-stat-icon">🧠</span><div><strong>' + a.wordsMastered + '<small> 词</small></strong><span>掌握的四级单词</span></div></div>' +
      '</div>' +
      '<div class="pf-two-col">' +
      '<section class="pf-card"><div class="pf-card-head"><h2>📊 学科投入分布</h2></div>' + subjectBars + '</section>' +
      '<section class="pf-card"><div class="pf-card-head"><h2>📅 近 14 天学习足迹</h2></div><div class="pf-days">' + daysHtml + '</div></section>' +
      '</div>' +
      '<section class="pf-card"><div class="pf-card-head"><h2>✨ 最近学习记录</h2></div>' + (recent ? '<ul class="pf-activity">' + recent + '</ul>' : '<p class="pf-empty">还没有学习记录，去完成一次专注或练习吧。</p>') + '</section>' +
      '<section class="pf-card"><div class="pf-card-head"><h2>📝 学习复盘日记</h2><span class="pf-count">' + refls.length + ' 篇</span></div>' +
      '<form class="pf-reflect-form" data-pf-form="reflect"><textarea name="text" rows="3" placeholder="今天学了什么？哪里卡住了？明天想改进什么？" maxlength="4000">' + esc(ui.reflectDraft) + '</textarea><div class="pf-reflect-row"><label class="pf-mood"><select name="mood"><option value="🌱">🌱 平淡</option><option value="😊">😊 有收获</option><option value="💪">💪 很充实</option><option value="🤯">🤯 有点难</option></select></label><button class="hub-btn hub-btn-primary" type="submit">保存复盘</button></div></form>' +
      (refls.length ? '<div class="pf-reflect-list">' + refls.slice(0, 10).map(function (r) { return '<article class="pf-reflect"><div class="pf-reflect-meta"><span>' + (r.mood || "🌱") + '</span><time>' + esc(r.date) + '</time></div><p>' + esc(r.text) + '</p></article>'; }).join("") + '</div>' : '<p class="pf-empty">写下第一篇复盘，见证自己的成长。</p>') +
      '</section>' +
      '</div>';
  }

  function handleSubmit(event) {
    const form = event.target.closest("[data-pf-form]"); if (!form) return;
    event.preventDefault();
    const kind = form.dataset.pfForm;
    if (kind === "reflect") {
      const values = new FormData(form);
      const text = String(values.get("text") || "").trim();
      if (!text) { bridge.toast("先写点复盘内容吧"); return; }
      const mood = String(values.get("mood") || "🌱");
      bridge.put("reflect:" + bridge.uid(), { date: today(), text: text.slice(0, 4000), mood: mood });
      ui.reflectDraft = "";
      bridge.toast("复盘已保存，继续加油！");
      render();
    }
  }

  function handleInput(event) {
    const t = event.target;
    if (t.name === "text" && t.closest("[data-pf-form=reflect]")) ui.reflectDraft = t.value;
  }

  function init(api) {
    bridge = api;
    const mount = document.getElementById("profileMount");
    if (mount && !mount.dataset.pfBound) {
      mount.dataset.pfBound = "true";
      mount.addEventListener("submit", handleSubmit);
      mount.addEventListener("input", handleInput);
    }
    render();
  }
  function reset() { ui.reflectDraft = ""; ui.reflectFilter = "all"; }
  window.Profile = { init: init, render: render, reset: reset };
}());
