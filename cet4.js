/* 四级备考：所有学习记录经主站 bridge 写入同一份可同步状态。 */
(function () {
  "use strict";
  const C = window.CET4_CONTENT;
  let bridge;
  const ui = { tab: "roadmap", practice: "listening", filter: "due", category: "all", wordId: "", revealed: false, writingId: "habit", translationId: "reading", readingId: "library", quizAnswers: {}, quizEditing: {}, drafts: {}, openTranslations: {}, saving: false };
  function esc(v) { return String(v === undefined || v === null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function snapshot() { return bridge ? bridge.read() : { study: {} }; }
  function records() { return snapshot().study || {}; }
  function record(key) { const r = records()[key]; return r && typeof r === "object" && !Array.isArray(r) && !r.deleted ? r : {}; }
  function today() { return bridge.today(); }
  function addDays(date, n) { const d = new Date(date + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function validDate(date) { return /^\d{4}-\d{2}-\d{2}$/.test(date || "") && !isNaN(new Date(date + "T12:00:00").getTime()); }
  function textDraft(key) { return String(Object.prototype.hasOwnProperty.call(ui.drafts, key) ? ui.drafts[key] : record(key).text || ""); }
  function wordCount(text) { return (String(text).match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length; }
  function level(word) { return Math.max(0, Math.min(5, Number(record("word:" + word.id).level) || 0)); }
  function reviewed(word) { return (Number(record("word:" + word.id).reviews) || 0) > 0; }
  function due(word) { return !record("word:" + word.id).nextReviewDate || record("word:" + word.id).nextReviewDate <= today(); }
  function filteredWords() { return C.vocabulary.filter(function (w) { return (ui.category === "all" || w.category === ui.category) && (ui.filter === "all" || (ui.filter === "due" && due(w)) || (ui.filter === "new" && !reviewed(w)) || (ui.filter === "mastered" && level(w) >= 3)); }); }
  function taskCount() { return C.roadmap.reduce(function (n, stage) { return n + stage.tasks.filter(function (t) { return record("cet4-task:" + t.id).done; }).length; }, 0); }
  function practiceRecords() { return Object.keys(records()).map(function (key) { return Object.assign({ key: key }, records()[key]); }).filter(function (r) { return !r.deleted && r.type === "practice" && r.subject === "cet4"; }).sort(function (a, b) { return String(b.updatedAt || b.date).localeCompare(String(a.updatedAt || a.date)); }); }
  function action(label, name, attrs, primary) { return '<button class="cet-btn' + (primary ? ' cet-btn-primary' : '') + '" type="button" data-cet-action="' + name + '"' + (attrs || '') + '>' + label + '</button>'; }
  function link(url, label, cls) { return '<a class="' + (cls || "cet-resource-link") + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + label + '<span aria-hidden="true">↗</span><span class="sr-only">（新窗口打开）</span></a>'; }
  function dateLabel(date) { if (!validDate(date)) return "未设置考试日期"; const diff = Math.ceil((new Date(date + "T12:00:00") - new Date(today() + "T12:00:00")) / 86400000); return diff > 0 ? '距目标日 <strong>' + diff + '</strong> 天' : diff === 0 ? "今天是你设置的目标日" : "目标日期已过，可调整下一阶段计划"; }

  function header() {
    const settings = record("hub:settings");
    const allTasks = C.roadmap.reduce(function (n, stage) { return n + stage.tasks.length; }, 0);
    const mastered = C.vocabulary.filter(function (w) { return level(w) >= 3; }).length;
    const reviewsToday = C.vocabulary.filter(function (w) { return record("word:" + w.id).lastReviewedDate === today(); }).length;
    const minutes = practiceRecords().filter(function (r) { return r.date === today(); }).reduce(function (sum, r) { return sum + (Number(r.minutes) || 0); }, 0);
    return '<header class="cet-hero"><div class="cet-hero-copy"><span class="cet-eyebrow">ENGLISH POCKET · CET-4</span><h1>把四级，装进口袋 <span aria-hidden="true">🔔</span></h1><p>背词、听读、动笔，再把每一次小进步留下来。</p><div class="cet-hero-tags"><span>🌤️ 按自己的节奏来</span><span>📚 原创练习 + 免费资源</span></div></div><form class="cet-date-card" data-cet-form="exam"><span class="cet-small">我的备考倒计时</span><div class="cet-countdown">' + dateLabel(settings.cet4ExamDate) + '</div><label for="cetExamDate">按学校或官方通知填写</label><div class="cet-inline"><input id="cetExamDate" name="examDate" type="date" value="' + esc(ui.drafts.examDate === undefined ? settings.cet4ExamDate || "" : ui.drafts.examDate) + '"><button class="cet-btn" type="submit">保存</button></div></form></header><div class="cet-stats" aria-label="四级学习概览"><div><span>🧠</span><strong>' + mastered + '<small> / ' + C.vocabulary.length + '</small></strong><p>初始词卡已掌握</p></div><div><span>🔁</span><strong>' + reviewsToday + '</strong><p>今日复习词数</p></div><div><span>🗺️</span><strong>' + taskCount() + '<small> / ' + allTasks + '</small></strong><p>备考路线完成</p></div><div><span>⏱️</span><strong>' + minutes + '<small> 分钟</small></strong><p>今日已记录练习</p></div></div>';
  }
  function roadmap() {
    return '<div class="cet-section-head"><div><span class="cet-small">YOUR NEXT ADVENTURE</span><h2>四级闯关地图</h2><p>阶段是顺序建议，可根据基础自由调整；勾选的是完成记录。</p></div>' + action("从单词热身开始 →", "tab", ' data-tab="vocabulary"', true) + '</div><div class="cet-route">' + C.roadmap.map(function (stage, i) { const done = stage.tasks.filter(function (t) { return record("cet4-task:" + t.id).done; }).length; return '<article class="cet-stage cet-stage-' + i + '"><div class="cet-stage-head"><span class="cet-stage-icon" aria-hidden="true">' + stage.icon + '</span><div><h3>' + stage.title + '</h3><p>' + stage.subtitle + '</p></div><span class="cet-tag">' + done + '/' + stage.tasks.length + '</span></div><div class="cet-stage-tasks">' + stage.tasks.map(function (t) { const checked = !!record("cet4-task:" + t.id).done; return '<div class="cet-route-task' + (checked ? ' is-done' : '') + '"><label><input type="checkbox" data-cet-check="' + t.id + '"' + (checked ? ' checked' : '') + '><span class="cet-check-art" aria-hidden="true">' + (checked ? '✓' : '') + '</span><span><strong>' + t.title + '</strong><small>' + t.detail + '</small></span></label><button type="button" class="cet-task-go" data-cet-action="goto" data-tab="' + t.target + '" data-practice="' + (t.practice || '') + '" aria-label="前往' + esc(t.title) + '">→</button></div>'; }).join("") + '</div></article>'; }).join("") + '</div><aside class="cet-callout"><span aria-hidden="true">🍀</span><div><h3>今天先完成一小轮就很好</h3><p>参考节奏：词汇 15 分钟 · 精听 15 分钟 · 阅读 20 分钟 · 写作或翻译 10 分钟。忙的时候选其中一项，完成后去学习记录写下收获。</p></div>' + action("记录今天", "navigate", ' data-tab="log"') + '</aside>';
  }
  function vocabulary() {
    const words = filteredWords();
    let current = words.find(function (w) { return w.id === ui.wordId; });
    if (!current) { current = words[0]; ui.wordId = current ? current.id : ""; ui.revealed = false; }
    return '<div class="cet-section-head"><div><span class="cet-small">A LITTLE, EVERY DAY</span><h2>单词翻翻口袋</h2><p>60 个精选起步词，覆盖学习、校园、社会与日常。不是完整四级词表。</p></div><span class="cet-pill">到期复习 ' + C.vocabulary.filter(due).length + ' 词</span></div><div class="cet-vocab-layout"><section class="cet-card cet-vocab-card"><div class="cet-filter-row"><label>学习范围<select data-cet-select="wordFilter"><option value="due"' + selected(ui.filter, "due") + '>待复习 / 未学</option><option value="new"' + selected(ui.filter, "new") + '>仅未学</option><option value="mastered"' + selected(ui.filter, "mastered") + '>已掌握</option><option value="all"' + selected(ui.filter, "all") + '>全部词卡</option></select></label><label>主题<select data-cet-select="category">' + ["all", "学习成长", "校园研究", "社会科技", "生活表达"].map(function (cat) { return '<option value="' + cat + '"' + selected(ui.category, cat) + '>' + (cat === "all" ? "全部主题" : cat) + '</option>'; }).join("") + '</select></label></div>' + (current ? wordCard(current, words) : '<div class="cet-empty"><span>🎉</span><h3>' + (ui.filter === "mastered" ? '记住三轮的词会在这里集合' : '这一轮已经完成啦') + '</h3><p>' + (ui.filter === "mastered" ? '继续复习，不用急着一次全记住。' : '可以更换主题或查看全部词卡。') + '</p>' + action("查看全部词卡", "allwords", "", true) + '</div>') + '</section><aside class="cet-vocab-aside"><div class="cet-card"><span class="cet-card-icon">🪄</span><h3>先回忆，再翻面</h3><ol class="cet-steps"><li>看英文，试着说出词义。</li><li>翻开答案，读一遍原创例句。</li><li>记住就延后复习；没记住就明天再见。</li></ol><p class="cet-muted">连续记住后的复习间隔：1、3、7、14、30 天。标记“再练一次”会重新从明天开始。已掌握表示连续记住至少 3 次。</p></div><div class="cet-card cet-mini-progress"><h3>我的词汇拼图</h3>' + ["学习成长", "校园研究", "社会科技", "生活表达"].map(function (cat) { const list = C.vocabulary.filter(function (w) { return w.category === cat; }); const known = list.filter(function (w) { return level(w) >= 3; }).length; return '<div><span>' + cat + '<small>' + known + '/15</small></span><progress max="15" value="' + known + '">' + known + '/15</progress></div>'; }).join("") + '</div></aside></div><details class="cet-word-list cet-card"><summary>展开全部起步词表 <span>60 词</span></summary><div>' + C.vocabulary.map(function (w) { return '<button type="button" data-cet-action="selectword" data-word="' + w.id + '" class="cet-word-chip' + (level(w) >= 3 ? ' is-mastered' : '') + '"><strong>' + w.word + '</strong><span>' + w.meaning + '</span>' + (level(w) >= 3 ? '<small>✓ 已掌握</small>' : '') + '</button>'; }).join("") + '</div></details>';
  }
  function selected(value, expected) { return value === expected ? " selected" : ""; }
  function wordCard(word, queue) {
    const r = record("word:" + word.id);
    return '<div class="cet-flashcard' + (ui.revealed ? ' is-revealed' : '') + '"><div class="cet-flash-top"><span class="cet-tag">' + word.category + '</span><span>' + (queue.indexOf(word) + 1) + ' / ' + queue.length + '</span></div><div class="cet-word" lang="en">' + word.word + '</div><span class="cet-pos">' + word.pos + '</span><button class="cet-pronounce" type="button" data-cet-action="speak" data-word="' + word.id + '" aria-label="朗读 ' + word.word + '">🔊 听发音</button><div class="cet-word-answer" aria-live="polite">' + (ui.revealed ? '<h3>' + word.meaning + '</h3><p lang="en">' + esc(word.example) + '</p>' : '<p>先想一想，它是什么意思？</p>') + '</div><div class="cet-level-dots" aria-label="熟悉度 ' + level(word) + ' / 5">' + [1, 2, 3, 4, 5].map(function (n) { return '<span class="' + (level(word) >= n ? 'is-filled' : '') + '"></span>'; }).join("") + '</div>' + (r.nextReviewDate ? '<p class="cet-small">下次复习 ' + esc(r.nextReviewDate) + '</p>' : '') + '<div class="cet-flash-actions">' + (ui.revealed ? action("↻ 再练一次", "review", ' data-word="' + word.id + '" data-result="again"') + action("✓ 记住了", "review", ' data-word="' + word.id + '" data-result="know"', true) : action("翻开答案 ✦", "reveal", "", true)) + '</div></div>';
  }
  function practice() {
    const tabs = [["listening", "🎧 精听跟读"], ["reading", "📖 阅读小测"], ["writing", "✍️ 写作口袋"], ["translation", "🌏 翻译练习"], ["mock", "🧩 模拟复盘"]];
    return '<div class="cet-section-head"><div><span class="cet-small">PRACTICE MAKES PROGRESS</span><h2>听读写译练习室</h2><p>本站阅读、写作与翻译题为原创训练材料，不是考试真题。</p></div></div><div class="cet-practice-tabs" role="tablist" aria-label="四级练习分类">' + tabs.map(function (t) { return '<button type="button" role="tab" id="cetPractice-' + t[0] + '" aria-controls="cetPracticePanel" aria-selected="' + (ui.practice === t[0]) + '" data-cet-action="practice" data-practice="' + t[0] + '" class="' + (ui.practice === t[0] ? 'is-active' : '') + '">' + t[1] + '</button>'; }).join("") + '</div><div role="tabpanel" id="cetPracticePanel" aria-labelledby="cetPractice-' + ui.practice + '">' + ({ listening: listeningPractice, reading: readingPractice, writing: writingPractice, translation: translationPractice, mock: mockPractice }[ui.practice] || listeningPractice)() + '</div>';
  }
  function listeningPractice() {
    const steps = [["01", "先盲听", "只抓人物、场景和大意，不急着看文本。"], ["02", "定位卡点", "再听一次，记下听不清的关键词或句子。"], ["03", "对照跟读", "核对文本，留意连读、弱读与语速。"], ["04", "合上再听", "用自己的话复述大意，记录一个收获。"]];
    return '<div class="cet-listen-guide">' + steps.map(function (s) { return '<div><span>' + s[0] + '</span><h3>' + s[1] + '</h3><p>' + s[2] + '</p></div>'; }).join("") + '</div><div class="cet-resource-grid">' + C.listening.map(function (r) { return '<article class="cet-card"><span class="cet-tag">' + r.level + '</span><h3>' + r.title + '</h3><p>' + r.description + '</p>' + link(r.url, "打开免费材料", "cet-btn cet-external") + '<button class="cet-listen-record" type="button" data-cet-action="listen-preset" data-listening="' + r.id + '">听完后记录 ↙</button></article>'; }).join("") + '</div><form class="cet-card cet-form" data-cet-form="listening"><div><span class="cet-small">KEEP ONE THING YOU LEARNED</span><h3>记录这一次精听</h3></div><div class="cet-form-row"><label>材料标题<input id="cetListeningTitle" name="title" data-cet-draft="listening-title" value="' + esc(ui.drafts["listening-title"] || "") + '" placeholder="例如：B1 · A student discussion" maxlength="160" required></label><label class="cet-minutes">练习分钟<input name="minutes" type="number" min="1" max="240" value="' + esc(ui.drafts["listening-minutes"] || "15") + '" data-cet-draft="listening-minutes" required></label></div><label>收获 / 卡点<textarea name="note" rows="3" data-cet-draft="listening-note" placeholder="哪一处没听出来？是生词、连读，还是信息太快？" maxlength="4000">' + esc(ui.drafts["listening-note"] || "") + '</textarea></label><button type="submit" class="cet-btn cet-btn-primary">✓ 保存精听记录</button></form>' + history("listening");
  }
  function readingPractice() {
    const item = C.readings.find(function (r) { return r.id === ui.readingId; }) || C.readings[0];
    const saved = record("cet4-quiz:" + item.id);
    const submitted = !!saved.submitted && !ui.quizEditing[item.id];
    const answers = ui.quizAnswers[item.id] || (Array.isArray(saved.answers) ? saved.answers : []);
    return '<div class="cet-reading-layout"><aside class="cet-exercise-pick">' + C.readings.map(function (r, i) { const complete = record("cet4-quiz:" + r.id).submitted; return '<button type="button" data-cet-action="reading-pick" data-reading="' + r.id + '" class="' + (r.id === item.id ? 'is-active' : '') + '"><span>READING 0' + (i + 1) + (complete ? ' ✓' : '') + '</span><strong>' + r.title + '</strong><small>' + r.topic + ' · 约 ' + r.minutes + ' 分钟</small></button>'; }).join("") + '</aside><article class="cet-card cet-reading"><span class="cet-tag">原创短阅读 · ' + item.topic + '</span><h3 lang="en">' + item.title + '</h3><p lang="en" class="cet-passage">' + esc(item.text) + '</p><form data-cet-form="quiz" data-reading="' + item.id + '">' + item.questions.map(function (q, i) { return '<fieldset class="cet-question"><legend>' + (i + 1) + '. ' + esc(q.question) + '</legend>' + q.options.map(function (option, j) { const checked = Number(answers[i]) === j && answers[i] !== undefined; return '<label class="cet-answer' + (submitted && j === q.answer ? ' is-correct' : submitted && checked ? ' is-wrong' : '') + '"><input type="radio" name="q' + i + '" value="' + j + '" data-cet-quiz-answer="' + i + '"' + (checked ? ' checked' : '') + (submitted ? ' disabled' : '') + ' required><span>' + String.fromCharCode(65 + j) + '. ' + esc(option) + '</span></label>'; }).join("") + (submitted ? '<p class="cet-explanation"><strong>答案 ' + String.fromCharCode(65 + q.answer) + '</strong> · ' + q.explanation + '</p>' : '') + '</fieldset>'; }).join("") + '<div class="cet-form-actions">' + (submitted ? '<strong class="cet-quiz-score">本次答对 ' + (Number(saved.score) || 0) + ' / ' + item.questions.length + '</strong>' + action("重新练习", "quiz-reset", ' data-reading="' + item.id + '"') : '<button type="submit" class="cet-btn cet-btn-primary">提交并看解析</button><span class="cet-muted">提交后会记入今日练习，默认 ' + item.minutes + ' 分钟</span>') + '</div></form></article></div>';
  }
  function writingPractice() {
    const item = C.writing.find(function (r) { return r.id === ui.writingId; }) || C.writing[0]; const key = "cet4-writing:" + item.id; const text = textDraft(key);
    return '<div class="cet-two-col"><aside class="cet-card cet-writing-brief"><span class="cet-tag">原创写作练习</span><h3>今天，写点什么？</h3><label class="cet-label" for="cetWritingPrompt">选择题目</label><select id="cetWritingPrompt" data-cet-select="writing">' + C.writing.map(function (r) { return '<option value="' + r.id + '"' + selected(item.id, r.id) + '>' + r.title + '</option>'; }).join("") + '</select><h4 lang="en">' + item.title + '</h4><p lang="en">' + item.prompt + '</p><p class="cet-muted">' + item.guide + '</p><ol class="cet-outline">' + item.outline.map(function (line) { return '<li lang="en">' + line + '</li>'; }).join("") + '</ol><p class="cet-safety-note">本页提供草稿、字数与自查清单，不进行 AI 评分。</p></aside><form class="cet-card cet-form" data-cet-form="writing" data-prompt="' + item.id + '"><div class="cet-editor-heading"><h3>我的英文草稿</h3><span id="cetWritingCount" aria-live="polite">' + wordCount(text) + ' words</span></div><label class="sr-only" for="cetWritingText">英文作文草稿</label><textarea id="cetWritingText" name="text" class="cet-writing-text" lang="en" rows="12" maxlength="12000" data-cet-draft="' + key + '" spellcheck="true" placeholder="Start with one clear idea…">' + esc(text) + '</textarea><p class="cet-muted">输入中的草稿会保留到当前页面会话；点击保存后写入学习数据，随同步一起保存。</p><div class="cet-form-actions"><button class="cet-btn cet-btn-primary" type="submit">保存草稿</button>' + action("✓ 记录一次写作", "writing-log", ' data-prompt="' + item.id + '"') + '</div><div class="cet-self-check"><strong>交稿前看一眼</strong><span>□ 观点与例子对应</span><span>□ 主谓、时态一致</span><span>□ 拼写与标点正确</span><span>□ 衔接自然</span></div></form></div>' + history("writing");
  }
  function translationPractice() {
    const item = C.translation.find(function (r) { return r.id === ui.translationId; }) || C.translation[0]; const key = "cet4-translation:" + item.id;
    return '<div class="cet-two-col"><aside class="cet-card"><span class="cet-tag">原创汉译英练习</span><h3>把意思，清楚地说出来</h3><label class="cet-label" for="cetTranslationPick">选择主题</label><select id="cetTranslationPick" data-cet-select="translation">' + C.translation.map(function (r) { return '<option value="' + r.id + '"' + selected(item.id, r.id) + '>' + r.title + '</option>'; }).join("") + '</select><h4>' + item.title + '</h4><p class="cet-translation-source">' + item.text + '</p><div class="cet-callout-mini">💡 先划分信息，再确认主语、动作和时态。用会用的词，表达完整即可。</div></aside><form class="cet-card cet-form" data-cet-form="translation" data-prompt="' + item.id + '"><h3>我的译文</h3><label class="sr-only" for="cetTranslationText">英文译文</label><textarea id="cetTranslationText" name="text" rows="8" lang="en" maxlength="8000" data-cet-draft="' + key + '" spellcheck="true" placeholder="Try your own translation first…">' + esc(textDraft(key)) + '</textarea><div class="cet-form-actions"><button class="cet-btn cet-btn-primary" type="submit">保存译文</button>' + action(ui.openTranslations[item.id] ? "收起参考表达" : "看看参考表达", "translation-reveal", ' data-prompt="' + item.id + '"') + action("✓ 记录这次练习", "translation-log", ' data-prompt="' + item.id + '"') + '</div>' + (ui.openTranslations[item.id] ? '<div class="cet-reference"><strong>一种参考表达</strong><p lang="en">' + item.reference + '</p><small>' + item.tips + '</small></div>' : '<p class="cet-muted">先独立完成，再比较信息是否遗漏、句子是否正确。参考表达不唯一。</p>') + '</form></div>' + history("translation");
  }
  function examMap() { return '<div class="cet-exam-map">' + [["✍️", "写作", "15%", "30 分钟", "短文写作"], ["🎧", "听力", "35%", "25 分钟", "短篇新闻 · 长对话 · 听力篇章"], ["📖", "阅读", "35%", "40 分钟", "选词填空 · 长篇匹配 · 仔细阅读"], ["🌏", "翻译", "15%", "30 分钟", "汉译英段落翻译"]].map(function (r) { return '<div><span>' + r[0] + '</span><h3>' + r[1] + ' <strong>' + r[2] + '</strong></h3><p>' + r[3] + '</p><small>' + r[4] + '</small></div>'; }).join("") + '</div><p class="cet-source-note">CET4 笔试合计 125 分钟。题型与时长来源：' + link("https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm", "中国教育考试网 · CET 笔试") + '。实际考试流程以官方及学校通知为准。</p>'; }
  function mockPractice() {
    return '<div class="cet-card"><span class="cet-tag">练后复盘，比只看结果更有用</span><h3>一张四级笔试地图</h3>' + examMap() + '</div><form class="cet-card cet-form" data-cet-form="mock"><div><h3>模拟练习复盘</h3><p class="cet-muted">使用自己合法获得的试卷，记录过程；本站不按答对题数预测成绩。</p></div><div class="cet-form-row"><label>试卷 / 练习名称<input name="title" data-cet-draft="mock-title" value="' + esc(ui.drafts["mock-title"] || "") + '" required maxlength="160" placeholder="例如：学校发放的四级模拟卷 A"></label><label class="cet-minutes">实际练习分钟<input type="number" min="1" max="300" name="minutes" data-cet-draft="mock-minutes" value="' + esc(ui.drafts["mock-minutes"] || "125") + '" required></label></div><label>薄弱项与下次行动<textarea name="note" data-cet-draft="mock-note" rows="5" maxlength="6000" placeholder="听力：转折之后的信息漏听。\n阅读：同义替换不熟。\n下次行动：复听错题片段，整理 5 个替换表达。" required>' + esc(ui.drafts["mock-note"] || "") + '</textarea></label><button type="submit" class="cet-btn cet-btn-primary">保存模拟复盘</button></form>' + history("mock");
  }
  function history(category) {
    const list = practiceRecords().filter(function (r) { return r.category === category; }).slice(0, 5);
    return '<section class="cet-history"><h3>最近的练习脚印 <span>' + list.length + '</span></h3>' + (list.length ? list.map(function (r) { return '<article><span aria-hidden="true">✓</span><div><strong>' + esc(r.title) + '</strong><small>' + esc(r.date) + ' · ' + (Number(r.minutes) || 0) + ' 分钟</small>' + (r.note ? '<p>' + esc(r.note) + '</p>' : '') + '</div></article>'; }).join("") : '<p class="cet-muted">完成一小段后保存，这里就会留下你的学习足迹。</p>') + '</section>';
  }
  function resources() { return '<div class="cet-section-head"><div><span class="cet-small">GOOD MATERIALS, CLEAR DIRECTION</span><h2>四级资料口袋</h2><p>官方信息优先，练习从适合自己的难度开始。以下链接都在新窗口打开。</p></div></div><div class="cet-card cet-official-card"><h3>先了解考试，再安排练习</h3>' + examMap() + '</div><div class="cet-resource-grid">' + C.resources.map(function (r) { return '<article class="cet-card cet-resource"><div class="cet-resource-top"><span aria-hidden="true">' + r.icon + '</span><span class="cet-tag">' + r.type + '</span></div><h3>' + r.title + '</h3><p>' + r.description + '</p>' + link(r.url, "前往学习") + '</article>'; }).join("") + '</div><p class="cet-muted cet-footer-note">本站起步词卡与练习免费使用；外部网站可能另有付费课程，本页指向其官方信息或公开学习资源。CET4 与 CEFR 分级并不直接等同，按实际理解程度选择 B1 / B2 材料即可。</p>'; }

  function render() {
    const mount = document.getElementById("cet4Mount"); if (!mount || !bridge || !C) return;
    const active = document.activeElement; const focusId = active && mount.contains(active) ? active.id : ""; let selection;
    if (focusId && typeof active.selectionStart === "number") selection = [active.selectionStart, active.selectionEnd];
    const tabs = [["roadmap", "🗺️ 备考路线"], ["vocabulary", "🧠 单词口袋"], ["practice", "🎧 练习室"], ["resources", "📚 资料库"]];
    mount.className = "cet-app";
    mount.innerHTML = header() + '<nav class="cet-tabs" role="tablist" aria-label="四级学习板块">' + tabs.map(function (t) { return '<button type="button" role="tab" id="cetTab-' + t[0] + '" aria-controls="cetPanel" aria-selected="' + (ui.tab === t[0]) + '" class="' + (ui.tab === t[0] ? 'is-active' : '') + '" data-cet-action="tab" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join("") + '</nav><section class="cet-panel" id="cetPanel" role="tabpanel" aria-labelledby="cetTab-' + ui.tab + '">' + ({ roadmap: roadmap, vocabulary: vocabulary, practice: practice, resources: resources }[ui.tab] || roadmap)() + '</section>';
    if (focusId) { const replacement = document.getElementById(focusId); if (replacement) { replacement.focus({ preventScroll: true }); if (selection && typeof replacement.setSelectionRange === "function") { try { replacement.setSelectionRange(selection[0], selection[1]); } catch (_) {} } } }
  }
  function logPractice(category, title, minutes, note, id) { bridge.put(id || "practice:" + bridge.uid(), { type: "practice", subject: "cet4", category: category, title: title, date: today(), minutes: minutes, note: note || "" }); }
  function saveDraft(key, text, title, category) { bridge.put(key, { type: "cet4-draft", subject: "cet4", category: category, title: title, text: text, date: today() }); delete ui.drafts[key]; }
  function handleClick(event) {
    const button = event.target.closest("[data-cet-action]"); if (!button) return;
    const act = button.dataset.cetAction;
    if (act === "tab") { ui.tab = button.dataset.tab; render(); }
    else if (act === "practice") { ui.practice = button.dataset.practice; render(); }
    else if (act === "goto") { const tab = button.dataset.tab; if (["roadmap", "vocabulary", "practice", "resources"].indexOf(tab) !== -1) { ui.tab = tab; if (button.dataset.practice) ui.practice = button.dataset.practice; render(); } else bridge.navigate(tab); }
    else if (act === "navigate") bridge.navigate(button.dataset.tab);
    else if (act === "allwords") { ui.filter = "all"; render(); }
    else if (act === "reveal") { ui.revealed = true; render(); }
    else if (act === "selectword") { ui.category = "all"; ui.filter = "all"; ui.wordId = button.dataset.word; ui.revealed = false; render(); const card = document.querySelector(".cet-vocab-card"); if (card) card.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (act === "review") {
      const word = C.vocabulary.find(function (w) { return w.id === button.dataset.word; }); if (!word || !ui.revealed) return;
      const queue = filteredWords(); const idx = queue.indexOf(word); const next = queue[(idx + 1) % queue.length]; const current = record("word:" + word.id); const knows = button.dataset.result === "know";
      const nextLevel = knows ? Math.min(5, level(word) + 1) : 0; const intervals = [1, 1, 3, 7, 14, 30];
      ui.wordId = next && next.id !== word.id ? next.id : ""; ui.revealed = false;
      bridge.put("word:" + word.id, { type: "vocabulary", subject: "cet4", wordId: word.id, level: nextLevel, nextReviewDate: addDays(today(), intervals[nextLevel]), lastReviewedDate: today(), reviews: (Number(current.reviews) || 0) + 1 });
      bridge.toast(knows ? "记住啦，已安排下一次复习" : "没关系，明天再见一次"); render();
    }
    else if (act === "speak") {
      const word = C.vocabulary.find(function (w) { return w.id === button.dataset.word; }); if (!word) return;
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { bridge.toast("这个浏览器暂不支持朗读，可去 Cambridge Dictionary 听发音"); return; }
      try { const speech = new window.SpeechSynthesisUtterance(word.word); speech.lang = "en-GB"; speech.rate = 0.85; speech.onerror = function () { bridge.toast("朗读暂不可用，可在词典里听发音"); }; window.speechSynthesis.cancel(); window.speechSynthesis.speak(speech); } catch (_) { bridge.toast("朗读暂不可用，可在词典里听发音"); }
    }
    else if (act === "listen-preset") { const source = C.listening.find(function (r) { return r.id === button.dataset.listening; }); if (source) { ui.drafts["listening-title"] = source.title; ui.drafts["listening-minutes"] = String(source.minutes); render(); const field = document.getElementById("cetListeningTitle"); if (field) field.focus(); } }
    else if (act === "reading-pick") { ui.readingId = button.dataset.reading; render(); }
    else if (act === "quiz-reset") { ui.quizEditing[button.dataset.reading] = true; ui.quizAnswers[button.dataset.reading] = []; render(); }
    else if (act === "translation-reveal") { ui.openTranslations[button.dataset.prompt] = !ui.openTranslations[button.dataset.prompt]; render(); }
    else if (act === "writing-log" || act === "translation-log") {
      const writing = act === "writing-log"; const list = writing ? C.writing : C.translation; const item = list.find(function (r) { return r.id === button.dataset.prompt; }); if (!item) return;
      const key = (writing ? "cet4-writing:" : "cet4-translation:") + item.id; const text = textDraft(key).trim();
      if (!text) { bridge.toast("先写下自己的答案，再留下练习记录吧"); return; }
      saveDraft(key, text, item.title, writing ? "writing" : "translation");
      logPractice(writing ? "writing" : "translation", item.title, writing ? 30 : 15, writing ? wordCount(text) + " words；已保存草稿" : "已保存个人译文", "practice:cet4-" + (writing ? "writing:" : "translation:") + item.id + ":" + today());
      bridge.toast("已保存答案与今日练习记录"); render();
    }
  }
  function handleChange(event) {
    const target = event.target;
    if (target.dataset.cetCheck) { const id = target.dataset.cetCheck; bridge.put("cet4-task:" + id, { type: "cet4-task", subject: "cet4", taskId: id, done: target.checked }); render(); }
    if (target.dataset.cetSelect) { const type = target.dataset.cetSelect; if (type === "wordFilter") ui.filter = target.value; if (type === "category") ui.category = target.value; if (type === "writing") ui.writingId = target.value; if (type === "translation") ui.translationId = target.value; ui.revealed = false; render(); }
    if (target.dataset.cetQuizAnswer !== undefined) { const saved = record("cet4-quiz:" + ui.readingId).answers; const answers = ui.quizAnswers[ui.readingId] || (Array.isArray(saved) ? saved.slice() : []); answers[Number(target.dataset.cetQuizAnswer)] = Number(target.value); ui.quizAnswers[ui.readingId] = answers; }
  }
  function handleKeydown(event) {
    const tab = event.target.closest("[role=tab]"); if (!tab || ["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1) return;
    const isPractice = tab.dataset.cetAction === "practice"; const list = isPractice ? ["listening", "reading", "writing", "translation", "mock"] : ["roadmap", "vocabulary", "practice", "resources"];
    let index = list.indexOf(isPractice ? ui.practice : ui.tab);
    index = event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
    event.preventDefault(); if (isPractice) ui.practice = list[index]; else ui.tab = list[index]; render();
    const target = document.getElementById((isPractice ? "cetPractice-" : "cetTab-") + list[index]); if (target) target.focus();
  }
  function handleInput(event) {
    const field = event.target;
    if (field.dataset.cetDraft) { ui.drafts[field.dataset.cetDraft] = field.value; if (field.id === "cetWritingText") { const count = document.getElementById("cetWritingCount"); if (count) count.textContent = wordCount(field.value) + " words"; } }
    if (field.id === "cetExamDate") ui.drafts.examDate = field.value;
  }
  function handleSubmit(event) {
    const form = event.target; const type = form.dataset.cetForm; if (!type) return; event.preventDefault();
    const values = new FormData(form);
    if (type === "exam") { const date = String(values.get("examDate") || ""); if (date && !validDate(date)) { bridge.toast("请填写有效日期"); return; } bridge.put("hub:settings", Object.assign({}, record("hub:settings"), { cet4ExamDate: date })); delete ui.drafts.examDate; bridge.toast(date ? "备考目标日期已保存" : "已清除目标日期"); }
    if (type === "listening" || type === "mock") {
      const title = String(values.get("title") || "").trim(); const minutes = Number(values.get("minutes")); const note = String(values.get("note") || "").trim();
      if (!title || !Number.isFinite(minutes) || minutes < 1 || minutes > (type === "mock" ? 300 : 240)) { bridge.toast("请填写标题与有效的练习分钟数"); return; }
      ["title", "minutes", "note"].forEach(function (key) { delete ui.drafts[type + "-" + key]; });
      logPractice(type, title, Math.round(minutes), note); bridge.toast(type === "mock" ? "模拟复盘已保存" : "精听记录已保存");
    }
    if (type === "writing" || type === "translation") { const item = (type === "writing" ? C.writing : C.translation).find(function (r) { return r.id === form.dataset.prompt; }); if (item) { saveDraft("cet4-" + type + ":" + item.id, String(values.get("text") || "").slice(0, 12000), item.title, type); bridge.toast("草稿已保存，可随学习数据一起同步"); } }
    if (type === "quiz") {
      const item = C.readings.find(function (r) { return r.id === form.dataset.reading; }); if (!item) return;
      const answers = item.questions.map(function (_, i) { const raw = values.get("q" + i); return raw === null ? -1 : Number(raw); });
      if (answers.some(function (a) { return a < 0 || a > 3; })) { bridge.toast("先把每道题都选好吧"); return; }
      const score = item.questions.reduce(function (sum, q, i) { return sum + (q.answer === answers[i] ? 1 : 0); }, 0); ui.quizEditing[item.id] = false; ui.quizAnswers[item.id] = answers;
      bridge.put("cet4-quiz:" + item.id, { type: "cet4-quiz", subject: "cet4", answers: answers, score: score, submitted: true, date: today() });
      logPractice("reading", item.title, item.minutes, "原创阅读小测：" + score + "/" + item.questions.length + "；查看解析后记下错因", "practice:cet4-reading:" + item.id + ":" + today()); bridge.toast("已保存结果，一起看看解析");
    }
    render();
  }
  function init(api) { bridge = api; const mount = document.getElementById("cet4Mount"); if (mount && !mount.dataset.cetBound) { mount.dataset.cetBound = "true"; mount.addEventListener("click", handleClick); mount.addEventListener("change", handleChange); mount.addEventListener("input", handleInput); mount.addEventListener("submit", handleSubmit); mount.addEventListener("keydown", handleKeydown); } render(); }
  function reset() { ui.tab = "roadmap"; ui.practice = "listening"; ui.filter = "due"; ui.category = "all"; ui.wordId = ""; ui.revealed = false; ui.writingId = "habit"; ui.translationId = "reading"; ui.readingId = "library"; ui.quizAnswers = {}; ui.quizEditing = {}; ui.drafts = {}; ui.openTranslations = {}; }
  window.CET4Learning = { init: init, render: render, reset: reset };
}());
