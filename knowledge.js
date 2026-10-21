/* Readable guides and primary-source material. Personal records use the shared sync bridge. */
(function () {
  'use strict';
  var bridge, mount, articles = [], resources = [], savedRecords = {}, composing = false, queued = false;
  var subjects = {
    research: { title: '研一科研起步', icon: '🔬', caption: '电子信息 · 监测与测量' },
    papers: { title: '文献阅读', icon: '📑', caption: '检索 · 理解 · 引用' },
    python: { title: 'Python', icon: '🐍', caption: '语法 · 数据 · 工具' },
    git: { title: 'Git / GitHub', icon: '🌿', caption: '版本管理 · 协作' },
    agent: { title: 'AI Agent', icon: '🤖', caption: '工具 · 检索 · 评估' },
    cet4: { title: '英语四级', icon: '🔤', caption: '语法 · 听读 · 写译' }
  };
  var ui = defaults();
  function defaults() { return { mode: 'guides', subject: 'all', level: 'all', language: 'all', kind: 'all', saved: false, unread: false, query: '', selected: '', answers: {} }; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(value) { return typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value) ? value : ''; }
  function label(subject) { return subjects[subject] ? subjects[subject].title : '综合学习'; }
  function studySubject(subject) { return subject === 'cet4' ? 'cet4' : 'ai'; }
  function button(title, action, extra, active) { return '<button type="button" class="kl-button' + (active ? ' is-active' : '') + '" data-knowledge-action="' + action + '"' + (extra || '') + '>' + title + '</button>'; }
  function hash(value) { var n = 2166136261; for (var i = 0; i < value.length; i++) { n ^= value.charCodeAt(i); n = Math.imul(n, 16777619); } return (n >>> 0).toString(36); }
  function record(key) { var item = savedRecords[key]; return item && !item.deleted && typeof item === 'object' ? item : {}; }
  function articleRecord(id) { return record('knowledge:' + id); }
  function findArticle(id) { return articles.find(function (a) { return a.id === id; }); }
  function collect() {
    var seen = new Set(), resourceMap = new Map();
    (window.STUDY_KNOWLEDGE_PARTS || []).forEach(function (part) {
      (Array.isArray(part.articles) ? part.articles : []).forEach(function (a) {
        if (!a || typeof a.id !== 'string' || seen.has(a.id) || !subjects[a.subject] || !Array.isArray(a.sections)) return;
        seen.add(a.id); articles.push(a);
        (a.resources || []).forEach(function (r) {
          var url = safeUrl(r.url); if (!url) return;
          var current = resourceMap.get(url);
          if (!current) { current = Object.assign({}, r, { url: url, key: 'resource:' + hash(url), subjects: [], articles: [] }); resourceMap.set(url, current); }
          if (current.subjects.indexOf(a.subject) === -1) current.subjects.push(a.subject);
          current.articles.push(a.id);
        });
      });
    });
    var order = Object.keys(subjects);
    articles.sort(function (a, b) { return order.indexOf(a.subject) - order.indexOf(b.subject); });
    resources = Array.from(resourceMap.values());
  }
  function options(values, current, allLabel) { return '<option value="all">' + allLabel + '</option>' + values.map(function (v) { return '<option value="' + esc(v) + '"' + (v === current ? ' selected' : '') + '>' + esc(v === 'beginner' ? '入门' : v === 'intermediate' ? '进阶' : v) + '</option>'; }).join(''); }
  function matches(text) { return String(text).toLocaleLowerCase().includes(ui.query.trim().toLocaleLowerCase()); }
  function searchable(a) { return [a.title, a.summary, label(a.subject)].concat(a.tags || [], a.sections.map(function (s) { return [s.heading].concat(s.body || [], s.bullets || [], s.code || '').join(' '); })).join(' '); }
  function guideCards() {
    var list = articles.filter(function (a) { var saved = articleRecord(a.id); return (ui.subject === 'all' || a.subject === ui.subject) && (ui.level === 'all' || a.level === ui.level) && (!ui.saved || saved.favorite === true) && (!ui.unread || !saved.done) && matches(searchable(a)); });
    return '<div class="kl-results" aria-live="polite">找到 ' + list.length + ' 篇指南<span>先读懂一个概念，再完成一道练习</span></div><div class="kl-grid">' + (list.length ? list.map(function (a) {
      var saved = articleRecord(a.id), icon = subjects[a.subject].icon;
      return '<article class="kl-card kl-tone-' + a.subject + '"><div class="kl-card-meta"><span>' + icon + ' ' + esc(label(a.subject)) + '</span><small>' + (a.level === 'intermediate' ? '进阶' : '入门') + ' · ' + esc(a.minutes) + ' 分钟</small></div><h2><button type="button" data-knowledge-action="read" data-id="' + esc(a.id) + '">' + esc(a.title) + '</button></h2><p>' + esc(a.summary) + '</p><div class="kl-tags">' + (a.tags || []).map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join('') + '</div><div class="kl-card-bottom">' + button('开始阅读 →', 'read', ' data-id="' + esc(a.id) + '"', true) + '<button type="button" class="kl-save" data-knowledge-action="favorite" data-id="' + esc(a.id) + '" aria-pressed="' + (saved.favorite === true) + '" aria-label="' + (saved.favorite ? '取消收藏：' : '收藏：') + esc(a.title) + '">' + (saved.favorite ? '★ 已收藏' : '☆ 收藏') + '</button></div>' + (saved.done ? '<span class="kl-done-badge">✓ 已学过</span>' : '') + '</article>';
    }).join('') : empty('没有找到匹配的指南', '试试“长难句”“传感器”“函数”，或清除筛选。')) + '</div>';
  }
  function resourceCards() {
    var list = resources.filter(function (r) { return (ui.subject === 'all' || r.subjects.includes(ui.subject)) && (ui.language === 'all' || r.language === ui.language) && (ui.kind === 'all' || r.kind === ui.kind) && (!ui.saved || record(r.key).favorite === true) && matches([r.title, r.note, r.kind].concat(r.subjects.map(label)).join(' ')); });
    return '<div class="kl-results" aria-live="polite">找到 ' + list.length + ' 个资料入口<span>官方文档、原始论文与免费阅读材料</span></div><div class="kl-resource-grid">' + (list.length ? list.map(function (r) { var saved = record(r.key); return '<article class="kl-resource"><div class="kl-card-meta"><span>' + esc(r.kind) + ' · ' + esc(r.language) + '</span><small>' + esc(r.subjects.map(label).join(' / ')) + '</small></div><h2>' + esc(r.title) + '</h2><p>' + esc(r.note) + '</p><small class="kl-domain">' + esc(r.url.replace(/^https:\/\//, '').split('/')[0]) + '</small><div class="kl-card-bottom"><a class="kl-button is-active" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">打开资料 ↗</a><button type="button" class="kl-save" data-knowledge-action="resource-save" data-key="' + esc(r.key) + '" aria-pressed="' + (saved.favorite === true) + '" aria-label="收藏资料：' + esc(r.title) + '">' + (saved.favorite ? '★ 已收藏' : '☆ 收藏') + '</button></div></article>'; }).join('') : empty('没有找到匹配的资料', '切换学科、语言或资料类型，再试一次。')) + '</div><p class="kl-footnote">入口已按一手来源整理。外站的部分功能可能需要账号；文档阅读不需要购买本站会员。WMO 历史版资料已在卡片中注明版本。</p>';
  }
  function empty(title, description) { return '<div class="kl-empty"><span aria-hidden="true">📭</span><h2>' + title + '</h2><p>' + description + '</p>' + button('清除筛选', 'clear') + '</div>'; }
  function reading(a) {
    var saved = articleRecord(a.id), answerOpen = !!ui.answers[a.id];
    return '<div class="kl-reader-top">' + button('← 返回知识资料库', 'back') + '<span>' + subjects[a.subject].icon + ' ' + esc(label(a.subject)) + ' · 约 ' + esc(a.minutes) + ' 分钟</span></div><article class="kl-reader"><header><span class="kl-eyebrow">READ · THINK · TRY</span><h1>' + esc(a.title) + '</h1><p class="kl-reader-summary">' + esc(a.summary) + '</p><div class="kl-reader-actions">' + button(saved.done ? '✓ 已学过 · 点击撤销' : '✓ 标记已学', 'done', ' data-id="' + esc(a.id) + '" aria-pressed="' + !!saved.done + '"', saved.done) + button(saved.favorite ? '★ 已收藏' : '☆ 收藏指南', 'favorite', ' data-id="' + esc(a.id) + '" aria-pressed="' + !!saved.favorite + '"') + button('＋ 加入今日计划', 'plan', ' data-id="' + esc(a.id) + '"') + button('📝 建立学习笔记', 'note', ' data-id="' + esc(a.id) + '"') + '</div></header><div class="kl-reading-layout"><aside class="kl-toc"><strong>本篇导航</strong>' + a.sections.map(function (s, i) { return '<button type="button" data-knowledge-action="section" data-index="' + i + '">' + (i + 1) + '. ' + esc(s.heading) + '</button>'; }).join('') + '<span>建议：边读边做练习，用自己的话解释。</span></aside><div class="kl-prose">' + a.sections.map(function (s, i) { return '<section id="knowledgeSection' + i + '"><h2><span>' + (i + 1) + '</span>' + esc(s.heading) + '</h2>' + (s.body || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + (s.bullets ? '<ul>' + s.bullets.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '') + (s.code ? '<pre><code>' + esc(s.code) + '</code></pre>' : '') + '</section>'; }).join('') + (a.exercise ? '<section class="kl-exercise"><span class="kl-eyebrow">NOW, YOUR TURN</span><h2>✏️ 动手检验一下</h2><p>' + esc(a.exercise.task) + '</p>' + button(answerOpen ? '收起参考思路 ↑' : '我已尝试，查看参考思路 ↓', 'answer', ' data-id="' + esc(a.id) + '" aria-expanded="' + answerOpen + '"') + (answerOpen ? '<div class="kl-answer">' + esc(a.exercise.answer) + '</div>' : '') + '</section>' : '') + '<section class="kl-source-list"><h2>📚 继续读这些资料</h2>' + (a.resources || []).filter(function (r) { return safeUrl(r.url); }).map(function (r) { return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer"><strong>' + esc(r.title) + ' ↗</strong><span>' + esc(r.kind + ' · ' + r.language + ' · ' + r.note) + '</span></a>'; }).join('') + '</section><p class="kl-footnote">本站正文与练习为原创教学材料；链接用于核对和延伸阅读。资料整理于 2026-10-21，项目要求和软件接口请以原始文档为准。</p></div></div></article>';
  }
  function library() {
    var readCount = articles.filter(function (a) { return articleRecord(a.id).done; }).length;
    return '<header class="kl-hero"><div><span class="kl-eyebrow">YOUR RESEARCH STARTS HERE</span><h1>把知识，装进未来口袋。</h1><p>研一 · 电子信息<br>先把文献读明白，把数据做扎实，再把想法写清楚。</p><div class="kl-hero-stats"><span><b>' + articles.length + '</b> 篇站内指南</span><span><b>' + resources.length + '</b> 个资料入口</span><span><b>' + readCount + '</b> 篇已学</span></div></div><span class="kl-hero-icon" aria-hidden="true">📚<small>每日学一点<br>慢慢看得懂</small></span></header><section class="kl-priority"><div><span>🔬 当前重点</span><h2>文献理解 → 研究问题 → 小实验 → 写作表达</h2><p>课程学习优先安排；边坡监测、雨量桶用作入门阅读案例，积累问题后再和导师讨论方向。</p></div>' + button('先看研一科研起步 →', 'subject', ' data-subject="research"', true) + '</section><div class="kl-topics">' + Object.keys(subjects).map(function (key) { var item = subjects[key]; return '<button type="button" class="kl-topic' + (ui.subject === key ? ' is-active' : '') + '" data-knowledge-action="subject" data-subject="' + key + '" aria-pressed="' + (ui.subject === key) + '"><span>' + item.icon + '</span><strong>' + item.title + '</strong><small>' + item.caption + '</small></button>'; }).join('') + '</div><section class="kl-toolbar"><div class="kl-tabs" role="group" aria-label="知识与资料">' + button('📖 站内知识', 'mode', ' data-mode="guides" aria-pressed="' + (ui.mode === 'guides') + '"', ui.mode === 'guides') + button('🧭 资料导航', 'mode', ' data-mode="resources" aria-pressed="' + (ui.mode === 'resources') + '"', ui.mode === 'resources') + '</div><label class="kl-search"><span aria-hidden="true">⌕</span><input id="knowledgeSearch" type="search" data-knowledge-field="query" placeholder="搜索主题、概念、问题…" aria-label="搜索知识和资料" value="' + esc(ui.query) + '"></label><div class="kl-filters"><label>学科<select id="knowledgeSubject" data-knowledge-field="subject"><option value="all">全部学科</option>' + Object.keys(subjects).map(function (key) { return '<option value="' + key + '"' + (ui.subject === key ? ' selected' : '') + '>' + label(key) + '</option>'; }).join('') + '</select></label>' + (ui.mode === 'guides' ? '<label>程度<select id="knowledgeLevel" data-knowledge-field="level">' + options(['beginner', 'intermediate'], ui.level, '全部程度') + '</select></label>' : '<label>语言<select id="knowledgeLanguage" data-knowledge-field="language">' + options(Array.from(new Set(resources.map(function (r) { return r.language; }))), ui.language, '全部语言') + '</select></label><label>类型<select id="knowledgeKind" data-knowledge-field="kind">' + options(Array.from(new Set(resources.map(function (r) { return r.kind; }))), ui.kind, '全部类型') + '</select></label>') + '<label class="kl-checkbox"><input type="checkbox" data-knowledge-field="saved"' + (ui.saved ? ' checked' : '') + '>只看收藏</label>' + (ui.mode === 'guides' ? '<label class="kl-checkbox"><input type="checkbox" data-knowledge-field="unread"' + (ui.unread ? ' checked' : '') + '>只看未学</label>' : '') + button('重置筛选', 'clear') + '</div></section>' + (ui.mode === 'guides' ? guideCards() : resourceCards());
  }
  function render() {
    if (!bridge || !mount) return;
    if (composing) { queued = true; return; }
    savedRecords = bridge.read().study || {};
    var node = document.activeElement, focus = node && node.id && node.closest('.knowledge-library') ? { id: node.id, start: node.selectionStart, end: node.selectionEnd } : null;
    var article = ui.selected && findArticle(ui.selected);
    mount.innerHTML = '<div class="knowledge-library">' + (article ? reading(article) : library()) + '</div>';
    if (focus) { var fresh = document.getElementById(focus.id); if (fresh) { fresh.focus({ preventScroll: true }); if (typeof focus.start === 'number' && typeof fresh.setSelectionRange === 'function') { try { fresh.setSelectionRange(focus.start, focus.end); } catch (error) {} } } }
  }
  function jumpTop() { var view = document.getElementById('view-library'); if (view && typeof view.scrollIntoView === 'function') view.scrollIntoView({ behavior: 'auto', block: 'start' }); }
  function handleAction(target) {
    savedRecords = bridge.read().study || {};
    var action = target.dataset.knowledgeAction, id = target.dataset.id, a = findArticle(id);
    if (action === 'read' && a) { ui.selected = a.id; render(); jumpTop(); }
    else if (action === 'back') { ui.selected = ''; render(); jumpTop(); }
    else if (action === 'mode') { ui.mode = target.dataset.mode === 'resources' ? 'resources' : 'guides'; ui.saved = false; render(); }
    else if (action === 'subject') { ui.subject = subjects[target.dataset.subject] ? target.dataset.subject : 'all'; ui.saved = false; ui.query = ''; ui.selected = ''; render(); }
    else if (action === 'clear') { var mode = ui.mode; ui = defaults(); ui.mode = mode; render(); }
    else if (action === 'section') { var section = document.getElementById('knowledgeSection' + target.dataset.index); if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (action === 'answer' && a) { ui.answers[id] = !ui.answers[id]; render(); }
    else if ((action === 'favorite' || action === 'done') && a) {
      var entry = articleRecord(id), fields = { type: 'knowledge', articleId: id, title: a.title, subject: studySubject(a.subject) };
      if (action === 'favorite') fields.favorite = !entry.favorite;
      else { fields.done = !entry.done; fields.doneAt = fields.done ? bridge.today() : null; }
      bridge.put('knowledge:' + id, fields);
    } else if (action === 'resource-save') {
      var r = resources.find(function (item) { return item.key === target.dataset.key; }); if (r) bridge.put(r.key, { type: 'resource', title: r.title, url: r.url, favorite: !record(r.key).favorite });
    } else if (action === 'plan' && a) {
      var key = 'plan:knowledge-' + a.id + '-' + bridge.today();
      if (!record(key).title) { bridge.put(key, { title: '阅读：' + a.title, date: bridge.today(), subject: studySubject(a.subject), minutes: a.minutes || 20, done: false, sourceId: a.id }); bridge.toast('已加入今日计划，可在“计划与专注”查看'); }
      else bridge.toast('这篇指南已在今天的计划里');
    } else if (action === 'note' && a) {
      var noteKey = 'note:knowledge-' + a.id;
      if (!record(noteKey).title) bridge.put(noteKey, { title: a.title + ' · 学习笔记', content: '我的理解：\n\n关键证据 / 例子：\n\n动手练习：' + (a.exercise ? a.exercise.task : '') + '\n\n我的解法：\n\n还没想明白的问题：\n', subject: studySubject(a.subject), type: 'note', sourceId: a.id });
      bridge.navigate('notes'); bridge.toast('学习笔记已放入笔记本，可在记录列表中编辑');
    }
  }
  function field(target) {
    var key = target.dataset.knowledgeField;
    if (key === 'query') { ui.query = target.value; if (!composing) render(); }
    else if (['subject', 'level', 'language', 'kind'].includes(key)) { ui[key] = target.value; render(); }
    else if (key === 'saved' || key === 'unread') { ui[key] = target.checked; render(); }
  }
  function init(api) {
    if (bridge) return;
    bridge = api; mount = document.getElementById('knowledgeMount'); collect();
    if (mount) {
      mount.addEventListener('click', function (event) { var target = event.target.closest('[data-knowledge-action]'); if (target) handleAction(target); });
      mount.addEventListener('input', function (event) { if (event.target.dataset.knowledgeField === 'query') field(event.target); });
      mount.addEventListener('change', function (event) { if (event.target.dataset.knowledgeField && event.target.dataset.knowledgeField !== 'query') field(event.target); });
      mount.addEventListener('compositionstart', function () { composing = true; });
      mount.addEventListener('compositionend', function (event) { composing = false; if (event.target.dataset.knowledgeField === 'query') ui.query = event.target.value; queued = false; render(); });
    }
    render();
  }
  function reset() { ui = defaults(); composing = false; queued = false; render(); }
  window.KnowledgeLibrary = { init: init, render: render, reset: reset };
}());
