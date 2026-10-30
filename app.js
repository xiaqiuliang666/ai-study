/* AI 学习路线 · 前端逻辑（无依赖，纯浏览器 JS） */
(function () {
  "use strict";

  const CUR = window.CURRICULUM;
  const GL = window.GLOSSARY || { cats: [], terms: [], updated: "" };
  const MG = window.MODEL_GRAPH || { cats: [], items: [], live: [], updated: "" };
  const STATE_KEY = "aiStudy.state.v1";
  const UI_KEY = "aiStudy.ui.v1";
  const THEME_KEY = "aiStudy.theme.v1";
  const SYNC_KEY = "aiStudy.sync.v1";
  const API_URL = "api/state";
  const GIST_FILE = "ai-study-state.json";
  const GIST_STUDY_FILE = "ai-study-hub.json";

  /* ---------- 扁平化任务表 ---------- */
  const ALL_TASKS = [];
  const CORE_TASKS = [];
  const PHASE_OF_TASK = {};
  CUR.phases.forEach(function (phase) {
    phase.tasks.forEach(function (task) {
      ALL_TASKS.push(task);
      if (!phase.optional) CORE_TASKS.push(task);
      PHASE_OF_TASK[task.id] = phase.id;
    });
  });
  const TOTAL_MINUTES = CORE_TASKS.reduce(function (sum, t) { return sum + (t.minutes || 0); }, 0);

  /* ---------- 工具函数 ---------- */
  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function nowISO() { return new Date().toISOString(); }

  function esc(value) {
    return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, function (ch) {
      if (ch === "&") return "&amp;";
      if (ch === "<") return "&lt;";
      if (ch === ">") return "&gt;";
      if (ch === '"') return "&quot;";
      return "&#39;";
    });
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatMinutes(minutes) {
    const m = Number(minutes) || 0;
    if (m <= 0) return "未估时";
    if (m < 60) return "约 " + m + " 分钟";
    const h = m / 60;
    if (h < 10) return "约 " + (Math.round(h * 10) / 10) + " 小时";
    return "约 " + Math.round(h) + " 小时";
  }

  function shortDate(iso) {
    if (!iso) return "";
    const parts = String(iso).split("-");
    if (parts.length !== 3) return String(iso);
    return Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function dateToTime(iso) {
    const t = Date.parse(iso);
    return isNaN(t) ? 0 : t;
  }

  function addDays(iso, delta) {
    const parts = String(iso).split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + delta);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function $(id) { return document.getElementById(id); }

  /* ---------- 状态 ---------- */
  function emptyState() {
    return {
      version: 1,
      updatedAt: nowISO(),
      profile: { name: "", start: todayISO(), updatedAt: nowISO() },
      tasks: {},
      log: [],
      logDeleted: {},
      study: {}
    };
  }

  function normalizeState(raw) {
    const base = emptyState();
    if (!raw || typeof raw !== "object") return base;
    const profile = raw.profile && typeof raw.profile === "object" ? raw.profile : {};
    return {
      version: 1,
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : base.updatedAt,
      profile: {
        name: typeof profile.name === "string" ? profile.name : "",
        start: typeof profile.start === "string" ? profile.start : base.profile.start,
        updatedAt: typeof profile.updatedAt === "string" ? profile.updatedAt : base.profile.updatedAt
      },
      tasks: raw.tasks && typeof raw.tasks === "object" ? raw.tasks : {},
      log: Array.isArray(raw.log) ? raw.log : [],
      logDeleted: raw.logDeleted && typeof raw.logDeleted === "object" ? raw.logDeleted : {},
      study: normalizeStudy(raw.study)
    };
  }

  function normalizeStudy(raw) {
    const clean = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return clean;
    Object.keys(raw).forEach(function (key) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") return;
      const entry = raw[key];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
      clean[key] = Object.assign({}, entry, { updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "" });
    });
    return clean;
  }

  function mergeStudy(left, right) {
    const merged = normalizeStudy(left);
    const incoming = normalizeStudy(right);
    Object.keys(incoming).forEach(function (key) {
      const current = merged[key];
      const next = incoming[key];
      if (!current) { merged[key] = next; return; }
      const currentTime = dateToTime(current.updatedAt);
      const nextTime = dateToTime(next.updatedAt);
      if (nextTime > currentTime || (nextTime === currentTime && (next.deleted === true || current.deleted !== true))) merged[key] = next;
    });
    return merged;
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : emptyState();
    } catch (err) {
      return emptyState();
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      showToast("本地保存失败，可能是浏览器隐私模式限制");
      return false;
    }
  }

  function loadUI() {
    const fallback = {
      filter: "all",
      query: "",
      open: {},
      openNotes: {},
      gCat: "all",
      gQuery: "",
      gOpen: {},
      mCat: "all"
    };
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Object.assign(fallback, parsed || {});
    } catch (err) {
      return fallback;
    }
  }

  function saveUI() {
    try {
      localStorage.setItem(UI_KEY, JSON.stringify({
        filter: ui.filter,
        query: ui.query,
        open: ui.open,
        openNotes: ui.openNotes,
        gCat: ui.gCat,
        gQuery: ui.gQuery,
        gOpen: ui.gOpen,
        mCat: ui.mCat
      }));
    } catch (err) { /* 忽略：UI 状态丢了不影响数据 */ }
  }

  let state = loadLocalState();
  const ui = loadUI();

  /* ---------- 数据计算 ---------- */
  function isDone(taskId) {
    const entry = state.tasks[taskId];
    return !!(entry && entry.done);
  }

  function doneCount() {
    return ALL_TASKS.reduce(function (n, t) { return n + (isDone(t.id) ? 1 : 0); }, 0);
  }

  function coreDoneCount() {
    return CORE_TASKS.reduce(function (n, t) { return n + (isDone(t.id) ? 1 : 0); }, 0);
  }

  function remainingMinutes() {
    return CORE_TASKS.reduce(function (sum, t) { return sum + (isDone(t.id) ? 0 : (t.minutes || 0)); }, 0);
  }

  function dateFromStamp(stamp) {
    const value = new Date(stamp);
    if (!isFinite(value.getTime())) return "";
    return value.getFullYear() + "-" + pad2(value.getMonth() + 1) + "-" + pad2(value.getDate());
  }

  function studyActivities() {
    const items = [];
    Object.keys(state.study).forEach(function (key) {
      const item = state.study[key];
      if (!item || item.deleted) return;
      const kind = key.split(":")[0];
      if (["checkin", "plan", "note", "focus", "practice", "word", "cet4-task", "cet4-writing", "cet4-translation", "knowledge", "research-step", "paper", "research"].indexOf(kind) === -1) return;
      if ((kind === "plan" || kind === "cet4-task" || kind === "knowledge" || kind === "research-step") && !item.done) return;
      let date = dateFromStamp(item.updatedAt);
      if (kind === "checkin" || kind === "focus" || kind === "practice") date = item.date || date;
      else if (kind === "word") date = item.lastReviewedDate || date;
      else if (item.doneAt) date = item.doneAt;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const titles = { checkin: "完成每日打卡", plan: "完成计划", note: "整理学习笔记", focus: "完成专注学习", practice: "完成四级练习", word: "复习四级单词", "cet4-task": "完成四级阶段任务", "cet4-writing": "练习四级写作", "cet4-translation": "练习四级翻译", knowledge: "学习知识指南", "research-step": "完成科研步骤", paper: "整理文献阅读卡", research: "更新研究计划" };
      const minutes = kind === "focus" || kind === "practice" ? Math.max(0, Math.min(1440, Number(item.minutes) || 0)) : 0;
      items.push({ date: date, sort: String(item.updatedAt || date), title: titles[kind] + (item.title ? "：" + item.title : ""), minutes: minutes });
    });
    return items;
  }

  function activityOn(date) {
    let n = 0;
    ALL_TASKS.forEach(function (t) {
      const entry = state.tasks[t.id];
      if (entry && entry.done && entry.doneAt === date) n += 1;
    });
    studyActivities().forEach(function (item) { if (item.date === date) n += 1; });
    return n;
  }

  function activityDates() {
    const set = {};
    ALL_TASKS.forEach(function (t) {
      const entry = state.tasks[t.id];
      if (entry && entry.done && entry.doneAt) set[entry.doneAt] = true;
    });
    studyActivities().forEach(function (item) { set[item.date] = true; });
    return Object.keys(set).sort();
  }

  function totalLoggedMinutes() {
    return studyActivities().reduce(function (sum, item) { return sum + item.minutes; }, 0);
  }

  function computeStreak() {
    const dates = activityDates();
    if (!dates.length) return { current: 0, best: 0 };
    const set = {};
    dates.forEach(function (d) { set[d] = true; });

    let best = 1;
    let run = 1;
    for (let i = 1; i < dates.length; i += 1) {
      if (addDays(dates[i - 1], 1) === dates[i]) {
        run += 1;
      } else {
        run = 1;
      }
      if (run > best) best = run;
    }

    let cursor = todayISO();
    if (!set[cursor]) cursor = addDays(cursor, -1);
    let current = 0;
    while (set[cursor]) {
      current += 1;
      cursor = addDays(cursor, -1);
    }
    return { current: current, best: best };
  }

  function nextTask() {
    for (let i = 0; i < CORE_TASKS.length; i += 1) {
      if (!isDone(CORE_TASKS[i].id)) return CORE_TASKS[i];
    }
    return null;
  }

  function phaseProgress(phase) {
    let done = 0;
    phase.tasks.forEach(function (t) { if (isDone(t.id)) done += 1; });
    const total = phase.tasks.length;
    return { done: done, total: total, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------- 提示 ---------- */
  let toastTimer = null;
  function showToast(message) {
    const el = $("toast");
    el.textContent = message;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  /* ---------- 同步配置（只存在本设备，不进入备份） ---------- */
  function defaultSyncCfg() {
    return { mode: "auto", gistToken: "", gistId: "", endpoint: "" };
  }

  function loadSyncCfg() {
    const fallback = defaultSyncCfg();
    try {
      const raw = localStorage.getItem(SYNC_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        mode: typeof parsed.mode === "string" ? parsed.mode : fallback.mode,
        gistToken: typeof parsed.gistToken === "string" ? parsed.gistToken : "",
        gistId: typeof parsed.gistId === "string" ? parsed.gistId : "",
        endpoint: typeof parsed.endpoint === "string" ? parsed.endpoint : ""
      };
    } catch (err) {
      return fallback;
    }
  }

  function saveSyncCfg() {
    try {
      localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg));
    } catch (err) { /* 忽略 */ }
  }

  const syncCfg = loadSyncCfg();

  /* ---------- 合并两份数据（和 server.py 里同一套规则） ---------- */
  function mergeDocs(a, b) {
    const left = normalizeState(a);
    const right = normalizeState(b);
    const merged = emptyState();

    const leftNamed = !!left.profile.name;
    const rightNamed = !!right.profile.name;
    if (leftNamed && !rightNamed) {
      merged.profile = left.profile;
    } else if (rightNamed && !leftNamed) {
      merged.profile = right.profile;
    } else {
      merged.profile = dateToTime(right.profile.updatedAt) > dateToTime(left.profile.updatedAt) ? right.profile : left.profile;
    }

    const taskIds = {};
    Object.keys(left.tasks).forEach(function (id) { taskIds[id] = true; });
    Object.keys(right.tasks).forEach(function (id) { taskIds[id] = true; });
    Object.keys(taskIds).forEach(function (id) {
      const l = left.tasks[id];
      const r = right.tasks[id];
      if (!l) merged.tasks[id] = r;
      else if (!r) merged.tasks[id] = l;
      else merged.tasks[id] = dateToTime(r.updatedAt) >= dateToTime(l.updatedAt) ? r : l;
    });

    [left.logDeleted, right.logDeleted].forEach(function (source) {
      Object.keys(source).forEach(function (id) {
        if (String(source[id]) > String(merged.logDeleted[id] || "")) merged.logDeleted[id] = source[id];
      });
    });

    const logById = {};
    [left.log, right.log].forEach(function (list) {
      list.forEach(function (item) {
        if (!item || !item.id) return;
        const current = logById[item.id];
        if (!current || dateToTime(item.updatedAt) >= dateToTime(current.updatedAt)) logById[item.id] = item;
      });
    });
    merged.log = Object.keys(logById)
      .map(function (id) { return logById[id]; })
      .filter(function (item) { return String(merged.logDeleted[item.id] || "") <= String(item.updatedAt || ""); });

    merged.study = mergeStudy(left.study, right.study);

    merged.updatedAt = dateToTime(left.updatedAt) > dateToTime(right.updatedAt) ? left.updatedAt : right.updatedAt;
    return merged;
  }

  /* ---------- 网络小工具 ---------- */
  async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = null; }
    return { ok: res.ok, status: res.status, data: data, text: text };
  }

  function withCacheBuster(url) {
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "t=" + Date.now();
  }

  /* ---------- 三种后端：本机服务器 / GitHub Gist / 自定义接口 ---------- */
  async function serverProbe() {
    const r = await fetchJSON(withCacheBuster(API_URL), { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    if (!r.data || typeof r.data !== "object" || !("state" in r.data)) throw new Error("接口格式不符");
    return true;
  }

  async function serverPull() {
    const r = await fetchJSON(withCacheBuster(API_URL), { cache: "no-store" });
    if (!r.ok) throw new Error("服务器返回 HTTP " + r.status);
    return r.data && r.data.state ? normalizeState(r.data.state) : null;
  }

  async function serverPush(doc) {
    const r = await fetchJSON(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: doc })
    });
    if (!r.ok) throw new Error("服务器返回 HTTP " + r.status);
    return r.data && r.data.state ? normalizeState(r.data.state) : doc;
  }

  function gistHeaders() {
    return {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + syncCfg.gistToken.trim(),
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    };
  }

  function gistError(r) {
    if (r.status === 401) return "HTTP 401：Token 无效或已过期";
    if (r.status === 403) return "HTTP 403：Token 权限不够（需要 Gist 读写）或已被限流";
    if (r.status === 404) return "HTTP 404：Gist 不存在，检查 ID 是否正确";
    if (r.status === 422) return "HTTP 422：请求被拒绝，检查 Token 权限";
    const tail = r.data && r.data.message ? "：" + r.data.message : "";
    return "HTTP " + r.status + tail;
  }

  async function gistPull() {
    if (!syncCfg.gistId) return null;
    const r = await fetchJSON("https://api.github.com/gists/" + encodeURIComponent(syncCfg.gistId), {
      headers: gistHeaders(),
      cache: "no-store"
    });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(gistError(r));
    const files = r.data && r.data.files ? r.data.files : {};
    const file = files[GIST_FILE];
    const hubFile = files[GIST_STUDY_FILE];
    if (!file && !hubFile) return null;
    if ((file && file.truncated) || (hubFile && hubFile.truncated)) throw new Error("云端数据被截断，请先导出备份并检查 Gist 文件大小");
    try {
      const parsed = file ? JSON.parse(file.content || "{}") : {};
      const doc = normalizeState(parsed && parsed.state ? parsed.state : parsed);
      if (hubFile) {
        const extra = JSON.parse(hubFile.content || "{}");
        doc.study = mergeStudy(doc.study, extra.study);
      }
      return doc;
    } catch (err) {
      throw new Error("云端学习数据格式无效，已停止同步以保护本机记录");
    }
  }

  async function gistPush(doc) {
    const files = {};
    files[GIST_FILE] = { content: JSON.stringify({ app: "ai-study-tracker", savedAt: nowISO(), state: doc }, null, 2) };
    // 独立文件保留扩展记录；旧版设备只更新原来的文件时不会丢失这些数据。
    files[GIST_STUDY_FILE] = { content: JSON.stringify({ app: "ai-study-hub", schema: 1, study: normalizeStudy(doc.study) }, null, 2) };

    if (!syncCfg.gistId) {
      const r = await fetchJSON("https://api.github.com/gists", {
        method: "POST",
        headers: gistHeaders(),
        body: JSON.stringify({
          description: "学习中心 · AI、四级与日常学习记录",
          public: false,
          files: files
        })
      });
      if (!r.ok) throw new Error(gistError(r));
      syncCfg.gistId = (r.data && r.data.id) || "";
      saveSyncCfg();
      const input = $("gistId");
      if (input) input.value = syncCfg.gistId;
      return doc;
    }

    const r = await fetchJSON("https://api.github.com/gists/" + encodeURIComponent(syncCfg.gistId), {
      method: "PATCH",
      headers: gistHeaders(),
      body: JSON.stringify({ files: files })
    });
    if (!r.ok) throw new Error(gistError(r));
    return doc;
  }

  async function customPull() {
    if (!syncCfg.endpoint) return null;
    const r = await fetchJSON(withCacheBuster(syncCfg.endpoint), { cache: "no-store" });
    if (!r.ok) throw new Error("接口返回 HTTP " + r.status);
    if (!r.data) return null;
    return normalizeState(r.data.state ? r.data.state : r.data);
  }

  async function customPush(doc) {
    const r = await fetchJSON(syncCfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: doc })
    });
    if (!r.ok) throw new Error("接口返回 HTTP " + r.status);
    return r.data && r.data.state ? normalizeState(r.data.state) : doc;
  }

  /* ---------- 同步引擎 ---------- */
  const sync = { mode: "off", status: "idle", message: "", lastAt: null, lastPullAt: 0, busy: false, nextAllowedAt: 0 };
  let syncTimer = null;

  function markChanged() {
    state.updatedAt = new Date(Math.max(Date.now(), dateToTime(state.updatedAt) + 1)).toISOString();
    saveLocalState();
    scheduleSync();
  }

  function scheduleSync() {
    if (sync.mode === "off") return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { syncOnce("change", false); }, 1400);
  }

  function isEditingField() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  function clockTime(iso) {
    const d = new Date(iso);
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function modeLabel() {
    if (sync.mode === "server") return "本机服务器";
    if (sync.mode === "gist") return "GitHub Gist";
    if (sync.mode === "custom") return "自定义接口";
    return "未启用";
  }

  async function resolveMode() {
    const wanted = syncCfg.mode;
    if (wanted === "off") return "off";
    if (wanted === "gist") return syncCfg.gistToken.trim() ? "gist" : "off";
    if (wanted === "custom") return syncCfg.endpoint.trim() ? "custom" : "off";
    if (wanted === "server") {
      try { await serverProbe(); return "server"; } catch (err) { return "off"; }
    }
    try {
      await serverProbe();
      return "server";
    } catch (err) { /* 没有本机服务器，继续找云端 */ }
    if (syncCfg.gistToken.trim()) return "gist";
    if (syncCfg.endpoint.trim()) return "custom";
    return "off";
  }

  async function pullByMode() {
    if (sync.mode === "server") return serverPull();
    if (sync.mode === "gist") return gistPull();
    if (sync.mode === "custom") return customPull();
    return null;
  }

  async function pushByMode(doc) {
    if (sync.mode === "server") return serverPush(doc);
    if (sync.mode === "gist") return gistPush(doc);
    if (sync.mode === "custom") return customPush(doc);
    return doc;
  }

  async function syncOnce(reason, manual) {
    if (sync.mode === "off") return false;
    if (sync.busy) return false;
    if (!manual && Date.now() < sync.nextAllowedAt) return false;

    sync.busy = true;
    let changedDuringPush = false;
    setSyncButtonsDisabled(true);
    setSyncStatus("正在同步…", "");

    try {
      const remote = await pullByMode();
      sync.lastPullAt = Date.now();

      const localBefore = JSON.stringify(normalizeState(state));
      const merged = remote ? mergeDocs(state, remote) : normalizeState(state);
      state = merged;
      const localAfter = JSON.stringify(state);

      if (JSON.stringify(remote) !== localAfter) {
        const outgoing = JSON.parse(JSON.stringify(state));
        const sentState = JSON.stringify(outgoing);
        const pushed = await pushByMode(outgoing);
        changedDuringPush = JSON.stringify(state) !== sentState;
        if (pushed) {
          state = mergeDocs(state, pushed);
          saveLocalState();
        }
      } else {
        saveLocalState();
      }

      if (localBefore !== JSON.stringify(state) && !isEditingField()) renderAll();

      sync.status = "ok";
      sync.message = "";
      sync.lastAt = nowISO();
      sync.nextAllowedAt = 0;
      setSyncStatus("已同步 · " + modeLabel() + " " + clockTime(sync.lastAt), "");
    } catch (err) {
      sync.status = "error";
      sync.message = String(err && err.message ? err.message : err);
      sync.nextAllowedAt = Date.now() + 60000;
      setSyncStatus("同步失败，已保存在本机", "is-error");
    } finally {
      sync.busy = false;
      setSyncButtonsDisabled(false);
      renderSyncPanel();
      if (changedDuringPush && sync.status === "ok") scheduleSync();
    }
    return sync.status === "ok";
  }

  function setSyncStatus(text, extraClass) {
    const el = $("syncStatus");
    if (!el) return;
    el.textContent = text;
    el.className = "sync-status" + (extraClass ? " " + extraClass : "");
  }

  function setSyncButtonsDisabled(disabled) {
    ["syncSave", "syncNow"].forEach(function (id) {
      const el = $(id);
      if (el) el.disabled = disabled;
    });
  }

  function renderSyncFields() {
    const mode = syncCfg.mode;
    $("gistFields").hidden = !(mode === "gist" || mode === "auto");
    $("customFields").hidden = !(mode === "custom" || mode === "auto");
    const hasCloud = !!(syncCfg.gistToken.trim() || syncCfg.endpoint.trim());
    $("syncForget").hidden = !hasCloud;
  }

  function syncHint() {
    if (sync.mode === "gist") {
      return "数据存在你 GitHub 账号的一个私密 Gist 里，和电脑开不开机无关。所有设备填同一个 Gist ID 即可；每台设备可使用各自的 Token。页面打开且处于前台时约每 30 秒检查一次新数据。Token 只保存在本设备浏览器里。";
    }
    if (sync.mode === "custom") {
      return "数据存在你自己的接口上。接口需要支持 GET 读取、POST 写入 {state: ...}，规则和本机服务器的 /api/state 相同。";
    }
    if (sync.mode === "server") {
      return "数据存在运行服务器的这台电脑上，电脑关机后手机就打不开了。想彻底摆脱电脑，把同步方式改成 GitHub Gist。";
    }
    if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) {
      return "还没有填入 Token。若另一台设备已经创建 Gist，请填入它的 Gist ID；首次设置的设备可以留空，网页会创建 Gist 并显示 ID。Token 需要 Gists 写入权限。";
    }
    if (syncCfg.mode === "server") {
      return "没找到本机服务器。要么先运行 start-server.bat，要么把同步方式改成 GitHub Gist，这样电脑关机也能用。";
    }
    return "当前数据只存在这台设备的浏览器里。想让手机和电脑共用一份、且电脑不用开机，选「GitHub Gist」并填入 Token。";
  }

  function renderSyncPanel() {
    const detail = $("syncDetail");
    const help = $("syncHelp");
    if (!detail || !help) return;

    if (sync.status === "error") {
      detail.textContent = modeLabel() + " 同步失败：" + sync.message;
      detail.className = "sync-line is-error";
    } else if (sync.mode === "off") {
      if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) {
        detail.textContent = "尚未连接 GitHub Gist：请填写 Token；当前进度仍保存在本机";
      } else if (syncCfg.mode === "off") {
        detail.textContent = "同步已关闭：数据只在这台设备的浏览器里";
      } else {
        detail.textContent = "尚未配置可用的同步方式：当前进度只保存在本机";
      }
      detail.className = "sync-line is-off";
    } else {
      detail.textContent = "已连接 " + modeLabel() + (sync.lastAt ? " · 上次同步 " + clockTime(sync.lastAt) : "");
      detail.className = "sync-line is-ok";
    }
    help.textContent = syncHint();
    renderSyncFields();
  }

  async function startSync() {
    sync.mode = await resolveMode();
    renderSyncPanel();
    if (sync.mode === "off") {
      if (syncCfg.mode === "off") setSyncStatus("同步已关闭", "");
      else if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) setSyncStatus("等待 GitHub Token", "");
      else setSyncStatus("本地模式（仅此设备）", "");
      return;
    }
    await syncOnce("start", true);
  }

  /* ---------- 渲染：热词百科 ---------- */
  function catInfo(id) {
    return GL.cats.find(function (c) { return c.id === id; }) || { name: "其他", color: "#6d8bff" };
  }

  function renderGlossaryCats() {
    const cats = [{ id: "all", name: "全部", color: "" }].concat(GL.cats);
    const host = $("glossaryCats");
    host.innerHTML = cats.map(function (c) {
      const count = c.id === "all"
        ? GL.terms.length
        : GL.terms.filter(function (t) { return t.cat === c.id; }).length;
      const dot = c.id === "all" ? "" : '<i class="dot" style="background:' + esc(c.color) + '"></i>';
      return '<button class="chip-btn' + (ui.gCat === c.id ? " is-active" : "") + '" type="button" data-gcat="' + esc(c.id) + '">' +
        dot + esc(c.name) + ' <span class="muted">' + count + "</span></button>";
    }).join("");
  }

  function glossaryMatches(term, query) {
    if (!query) return true;
    const hay = [term.term, term.en, term.def, term.why, term.vs].join(" ").toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  function renderGlossaryList() {
    const query = ui.gQuery.trim().toLowerCase();
    const list = GL.terms.filter(function (t) {
      if (ui.gCat !== "all" && t.cat !== ui.gCat) return false;
      return glossaryMatches(t, query);
    });

    $("glossaryCount").textContent = "共 " + list.length + " 个词条" + (query ? "（关键词：" + ui.gQuery.trim() + "）" : "");

    const host = $("glossaryList");
    if (!list.length) {
      host.innerHTML = '<div class="empty">没找到这个词。换个关键词，或者直接翻分类看看。</div>';
      return;
    }

    host.innerHTML = list.map(function (t) {
      const cat = catInfo(t.cat);
      const open = ui.gOpen[t.id] === true;
      let html = '<article class="term" id="term-' + esc(t.id) + '" data-open="' + (open ? "true" : "false") + '">';
      html += '<button class="term-head" type="button" data-term-toggle="' + esc(t.id) + '" aria-expanded="' + (open ? "true" : "false") + '">';
      html += '<span class="term-main">';
      html += '<span class="term-name">' + esc(t.term) + '<span class="term-en">' + esc(t.en) + "</span></span>";
      html += '<span class="term-def">' + esc(t.def) + "</span>";
      html += "</span>";
      html += '<span class="cat-tag" style="color:' + esc(cat.color) + '">' + esc(cat.name) + "</span>";
      html += '<svg class="term-caret" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      html += "</button>";

      html += '<div class="term-more"' + (open ? "" : " hidden") + ">";
      if (t.why) {
        html += '<div class="term-block"><span class="tag">为什么重要</span><span class="val">' + esc(t.why) + "</span></div>";
      }
      if (t.vs) {
        html += '<div class="term-block"><span class="tag">区别在哪</span><span class="val">' + esc(t.vs) + "</span></div>";
      }
      const rel = (t.rel || []).filter(function (id) { return GL.terms.some(function (x) { return x.id === id; }); });
      if (rel.length) {
        html += '<div class="term-block"><span class="tag">相关词</span><span class="related">';
        html += rel.map(function (id) {
          const target = GL.terms.find(function (x) { return x.id === id; });
          return '<button type="button" data-goto-term="' + esc(id) + '">' + esc(target.term) + "</button>";
        }).join("");
        html += "</span></div>";
      }
      html += "</div></article>";
      return html;
    }).join("");
  }

  function renderGlossary() {
    renderGlossaryCats();
    renderGlossaryList();
  }

  function gotoTerm(id) {
    const target = GL.terms.find(function (t) { return t.id === id; });
    if (!target) return;
    if (ui.gCat !== "all" && ui.gCat !== target.cat) ui.gCat = target.cat;
    if (ui.gQuery && !glossaryMatches(target, ui.gQuery.trim().toLowerCase())) {
      ui.gQuery = "";
      const input = $("glossarySearch");
      if (input) input.value = "";
    }
    ui.gOpen[id] = true;
    saveUI();
    renderGlossary();
    const el = document.getElementById("term-" + id);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- 渲染：模型图谱 ---------- */
  function renderGraphCats() {
    const cats = [{ id: "all", name: "全部" }, { id: "hot", name: "只看热门 🔥" }].concat(MG.cats);
    $("graphCats").innerHTML = cats.map(function (c) {
      const count = c.id === "all"
        ? MG.items.length
        : (c.id === "hot" ? MG.items.filter(function (x) { return x.hot; }).length
          : MG.items.filter(function (x) { return x.cat === c.id; }).length);
      return '<button class="chip-btn' + (ui.mCat === c.id ? " is-active" : "") + '" type="button" data-mcat="' + esc(c.id) + '" title="' + esc(c.desc || "") + '">' +
        esc(c.name) + ' <span class="muted">' + count + "</span></button>";
    }).join("");
  }

  function renderGraphList() {
    const list = MG.items.filter(function (x) {
      if (ui.mCat === "all") return true;
      if (ui.mCat === "hot") return !!x.hot;
      return x.cat === ui.mCat;
    });
    const cat = MG.cats.find(function (c) { return c.id === ui.mCat; });
    $("graphCount").textContent = (cat ? cat.desc + " · " : "") + list.length + " 个条目";

    const host = $("graphList");
    if (!list.length) {
      host.innerHTML = '<div class="empty">这个分类下暂时没有条目。</div>';
      return;
    }

    host.innerHTML = list.map(function (x) {
      const c = MG.cats.find(function (y) { return y.id === x.cat; });
      let html = '<article class="node' + (x.hot ? " is-hot" : "") + '">';
      html += '<div class="node-top">';
      html += "<div>";
      html += '<div class="node-name">' + esc(x.name) + (x.hot ? ' <span class="flame" title="当前热门">🔥</span>' : "") + "</div>";
      html += '<div class="node-org">' + esc(x.org) + (c ? " · " + esc(c.name) : "") + "</div>";
      html += "</div>";
      html += '<span class="badge">' + esc(x.access) + "</span>";
      html += "</div>";
      html += '<p class="node-tagline">' + esc(x.tagline) + "</p>";
      if (x.good && x.good.length) {
        html += '<div class="node-good">' + x.good.map(function (g) { return "<span>" + esc(g) + "</span>"; }).join("") + "</div>";
      }
      if (x.vs) {
        html += '<div class="node-block"><span class="label vs">和别人比，区别在哪</span><p>' + esc(x.vs) + "</p></div>";
      }
      if (x.pick) {
        html += '<div class="node-block"><span class="label pick">什么时候选它</span><p>' + esc(x.pick) + "</p></div>";
      }
      html += '<div class="node-foot">';
      html += x.link
        ? '<a class="node-link" href="' + esc(x.link) + '" target="_blank" rel="noopener noreferrer">打开官网 ↗</a>'
        : '<span class="muted small">还没有官网链接</span>';
      html += "</div></article>";
      return html;
    }).join("");
  }

  function renderLive() {
    $("graphLive").innerHTML = MG.live.map(function (l) {
      return '<a class="live-item" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        "<strong>" + esc(l.label) + "</strong><span>" + esc(l.note) + "</span></a>";
    }).join("");
  }

  function renderGraph() {
    $("graphDisclaimer").textContent = MG.disclaimer + "（本页整理时间：" + (MG.updated || "未知") + "）";
    renderGraphCats();
    renderGraphList();
    renderLive();
  }

  /* ---------- 渲染：顶部进度 ---------- */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 52;

  function renderHero() {
    const total = CORE_TASKS.length;
    const done = coreDoneCount();
    const percent = total ? Math.round((done / total) * 100) : 0;

    $("heroPercent").textContent = percent + "%";
    $("heroCount").textContent = done + " / " + total;

    const ring = $("ringValue");
    const filled = (RING_CIRCUMFERENCE * percent) / 100;
    ring.setAttribute("stroke-dasharray", filled.toFixed(1) + " " + RING_CIRCUMFERENCE.toFixed(1));

    const next = nextTask();
    if (next) {
      const phase = CUR.phases.find(function (p) { return p.id === PHASE_OF_TASK[next.id]; });
      $("heroKicker").textContent = "下一步 · " + (phase ? phase.title.replace(/^阶段\s*\d+\s*·\s*/, "") : "");
      $("heroNext").textContent = next.title;
      const remainH = Math.round(remainingMinutes() / 60);
      $("heroMeta").textContent = "还剩 " + Math.round(remainH) + " 小时的内容 · 已完成 " + done + "/" + total + " 个任务";
    } else {
      $("heroKicker").textContent = "全部完成";
      $("heroNext").textContent = "这条路线你走完了，去更新自己的下一版路线图吧";
      $("heroMeta").textContent = "总计 " + Math.round(TOTAL_MINUTES / 60) + " 小时的路线，共 " + total + " 个任务";
    }
  }

  /* ---------- 渲染：路线 ---------- */
  function matches(task, phase, query) {
    if (!query) return true;
    const hay = (phase.title + " " + phase.goal + " " + task.title + " " + task.detail + " " + (task.tip || "")).toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  function renderPhases() {
    const query = ui.query.trim().toLowerCase();
    const filtering = ui.filter !== "all" || !!query;
    const host = $("phaseList");
    let html = "";
    let visibleTotal = 0;

    CUR.phases.forEach(function (phase, index) {
      const visible = phase.tasks.filter(function (task) {
        if (ui.filter === "todo" && isDone(task.id)) return false;
        if (ui.filter === "done" && !isDone(task.id)) return false;
        return matches(task, phase, query);
      });
      if (!visible.length) return;
      visibleTotal += visible.length;

      const progress = phaseProgress(phase);
      const complete = progress.done === progress.total;
      const isOpen = filtering || ui.open[phase.id] === true;

      html += '<article class="phase' + (complete ? " is-complete" : "") + '" data-phase="' + esc(phase.id) + '">';
      html += '<button class="phase-head" type="button" data-toggle-phase="' + esc(phase.id) + '" aria-expanded="' + (isOpen ? "true" : "false") + '" aria-controls="phase-body-' + esc(phase.id) + '">';
      html += '<span class="phase-index">' + (index + 1) + "</span>";
      html += '<span class="phase-head-main">';
      html += '<span class="phase-title">' + esc(phase.title) + "</span>";
      html += '<span class="phase-goal">' + esc(phase.goal) + "</span>";
      html += "</span>";
      html += '<span class="phase-count">' + progress.done + "/" + progress.total + "</span>";
      html += '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      html += "</button>";
      html += '<div class="phase-bar"><i style="width:' + progress.percent + '%"></i></div>';
      html += '<div class="phase-body" id="phase-body-' + esc(phase.id) + '"' + (isOpen ? "" : " hidden") + ">";

      visible.forEach(function (task) { html += taskHTML(task, phase); });

      html += "</div></article>";
    });

    host.innerHTML = html || '<div class="empty">没有符合筛选条件的任务，换个关键词试试。</div>';

    const hint = $("filterHint");
    if (filtering) {
      hint.hidden = false;
      hint.textContent = "筛选出 " + visibleTotal + " 个任务" + (query ? "（关键词：" + ui.query.trim() + "）" : "");
    } else {
      hint.hidden = true;
    }
  }

  function taskHTML(task, phase) {
    const entry = state.tasks[task.id] || {};
    const done = !!entry.done;
    const note = typeof entry.note === "string" ? entry.note : "";
    const noteOpen = ui.openNotes[task.id] === true;
    const checkId = "chk-" + task.id;

    let html = '<article class="task' + (done ? " is-done" : "") + '" data-task-row="' + esc(task.id) + '">';
    html += '<input class="task-check" type="checkbox" id="' + esc(checkId) + '" data-toggle-task="' + esc(task.id) + '"' + (done ? " checked" : "") + ' aria-label="标记完成：' + esc(task.title) + '">';
    html += '<div class="task-main">';
    html += '<label class="task-title" for="' + esc(checkId) + '">' + esc(task.title) + "</label>";
    html += '<p class="task-detail">' + esc(task.detail) + "</p>";

    if (task.resources && task.resources.length) {
      html += '<div class="task-links">';
      task.resources.forEach(function (res) {
        html += '<a class="res-link" href="' + esc(res.url) + '" target="_blank" rel="noopener noreferrer">' + esc(res.label) + " ↗</a>";
      });
      html += "</div>";
    }

    html += '<div class="task-meta">';
    html += '<span class="chip">' + esc(formatMinutes(task.minutes)) + "</span>";
    if (task.tip) html += '<span class="chip">💡 ' + esc(task.tip) + "</span>";
    if (done && entry.doneAt) html += '<span class="chip">完成于 ' + esc(shortDate(entry.doneAt)) + "</span>";
    html += '<button class="note-btn' + (note ? " has-note" : "") + '" type="button" data-toggle-note="' + esc(task.id) + '" aria-expanded="' + (noteOpen ? "true" : "false") + '">' + (note ? "查看笔记" : "写笔记") + "</button>";
    html += "</div>";

    html += '<div class="note-box" id="note-' + esc(task.id) + '"' + (noteOpen ? "" : " hidden") + ">";
    html += '<textarea data-note-field="' + esc(task.id) + '" rows="3" placeholder="写下你的理解、报错、想不通的地方…">' + esc(note) + "</textarea>";
    html += '<p class="muted small">边写边自动保存，手机和电脑都能看到。</p>';
    html += "</div>";

    html += "</div></article>";
    return html;
  }

  /* ---------- 渲染：日志 ---------- */

  /* ---------- 渲染：统计 ---------- */
  function renderStats() {
    const total = CORE_TASKS.length;
    const done = coreDoneCount();
    const percent = total ? Math.round((done / total) * 100) : 0;
    const streak = computeStreak();
    const dates = activityDates();

    $("statPercent").textContent = percent + "%";
    $("statTasks").textContent = done + " / " + total + " 个任务";
    $("statStreak").textContent = streak.current;
    $("statStreakBest").textContent = streak.best;
    $("statHours").textContent = Math.round(totalLoggedMinutes() / 60);
    $("statLogCount").textContent = "专注 + 专项练习";
    $("statDays").textContent = dates.length;
    $("statStart").textContent = state.profile.start ? "开始于 " + shortDate(state.profile.start) : "还没设置开始日期";

    let html = "";
    CUR.phases.forEach(function (phase) {
      const p = phaseProgress(phase);
      html += '<div class="stat-row">';
      html += '<div class="stat-row-head"><span class="stat-row-title">' + esc(phase.title) + '</span>';
      html += '<span class="stat-row-value">' + p.done + "/" + p.total + " · " + p.percent + "%</span></div>";
      html += '<div class="bar"><i class="' + (p.percent === 100 ? "is-complete" : "") + '" style="width:' + p.percent + '%"></i></div>';
      html += "</div>";
    });
    $("phaseStats").innerHTML = html;

    renderSubjectDist();
    renderActivity();
    renderTimeline();
  }

  function renderActivity() {
    const days = [];
    const today = todayISO();
    for (let i = 13; i >= 0; i -= 1) days.push(addDays(today, -i));
    const counts = days.map(function (d) { return activityOn(d); });
    const max = Math.max(1, Math.max.apply(null, counts));

    let html = '<div class="activity-bars">';
    days.forEach(function (day, index) {
      const count = counts[index];
      const h = count === 0 ? 3 : Math.max(6, Math.round((count / max) * 74));
      const label = index % 2 === 0 || index === days.length - 1 ? String(Number(day.split("-")[2])) : "";
      html += '<div class="activity-col" title="' + esc(day + " · " + count + " 项") + '">';
      html += '<div class="activity-stack"><i class="' + (count === 0 ? "is-empty" : "") + '" style="height:' + h + 'px"></i></div>';
      html += '<span class="activity-label">' + esc(label) + "</span>";
      html += "</div>";
    });
    html += "</div>";
    html += '<p class="muted small" style="margin-top:10px">包含任务、打卡、复习与练习等学习活动，最高 ' + max + " 项。</p>";
    $("activityChart").innerHTML = html;
  }

  function renderTimeline() {
    const events = [];
    ALL_TASKS.forEach(function (task) {
      const entry = state.tasks[task.id];
      if (entry && entry.done && entry.doneAt) {
        events.push({ date: entry.doneAt, sort: entry.doneAt + (entry.updatedAt || ""), text: "完成任务：" + task.title });
      }
    });
    studyActivities().forEach(function (item) { events.push({ date: item.date, sort: item.date + item.sort, text: item.title }); });
    events.sort(function (a, b) { return String(b.sort).localeCompare(String(a.sort)); });

    const host = $("timeline");
    if (!events.length) {
      host.innerHTML = '<div class="empty">完成任务后，这里会按时间倒序列出你的记录。</div>';
      return;
    }
    let html = "";
    events.slice(0, 15).forEach(function (ev) {
      html += '<div class="timeline-item"><span class="timeline-date">' + esc(shortDate(ev.date)) + '</span>';
      html += '<span class="timeline-text">' + esc(ev.text) + "</span></div>";
    });
    host.innerHTML = html;
  }

  /* ---------- 渲染：学科投入分布 ---------- */
  function renderSubjectDist() {
    const host = $("subjectDist");
    if (!host) return;
    const buckets = { ai: 0, cet4: 0, research: 0, general: 0 };
    const meta = { ai: { label: "AI / 编程", icon: "🤖", color: "#079bda" }, cet4: { label: "英语四级", icon: "🔤", color: "#f2a03d" }, research: { label: "科研学术", icon: "🎓", color: "#8f6bd8" }, general: { label: "其他学习", icon: "📚", color: "#5bbf8a" } };
    studyActivities().forEach(function (item) {
      const minutes = item.minutes || 0;
      if (!minutes) return;
      // 根据 title 判断学科：含"四级"归 cet4，含"科研/研究/文献"归 research，否则按专注记录 subject
      if (item.title.indexOf("四级") !== -1 || item.title.indexOf("单词") !== -1) buckets.cet4 += minutes;
      else if (item.title.indexOf("科研") !== -1 || item.title.indexOf("文献") !== -1 || item.title.indexOf("研究") !== -1) buckets.research += minutes;
      else if (item.title.indexOf("专注") !== -1) buckets.ai += minutes;
      else buckets.general += minutes;
    });
    const max = Math.max(1, Math.max.apply(null, Object.keys(buckets).map(function (k) { return buckets[k]; })));
    const total = Object.keys(buckets).reduce(function (s, k) { return s + buckets[k]; }, 0);
    let html = "";
    Object.keys(meta).forEach(function (k) {
      const m = meta[k], val = buckets[k];
      const pct = Math.round(val / max * 100);
      html += '<div class="subject-row"><div class="subject-row-head"><span>' + m.icon + ' ' + m.label + '</span><strong>' + val + ' 分钟</strong></div><div class="bar"><i style="width:' + pct + '%;background:' + m.color + '"></i></div></div>';
    });
    html += '<p class="muted small" style="margin-top:12px">累计专注与练习时长按学科划分，共 ' + total + ' 分钟。</p>';
    host.innerHTML = html;
  }

  /* ---------- 渲染：设置 ---------- */
  function syncFormFromCfg() {
    $("syncMode").value = syncCfg.mode;
    $("gistToken").value = syncCfg.gistToken;
    $("gistId").value = syncCfg.gistId;
    $("syncEndpoint").value = syncCfg.endpoint;
    renderSyncFields();
  }

  function renderSettings() {
    $("profileName").value = state.profile.name || "";
    $("profileStart").value = state.profile.start || "";
    renderSyncPanel();
    const itemCount = doneCount() + Object.keys(state.study).filter(function (key) { return !state.study[key].deleted; }).length;
    $("aboutLine").textContent = "学习任意门 · AI 路线 " + ALL_TASKS.length + " 个任务 · 学术研究 / 文献与知识资料 / 英语四级 / 计划专注 · 热词 " +
      GL.terms.length + " 条 · 模型图谱 " + MG.items.length + " 条 · 已保存 " + itemCount + " 项记录";
  }

  /* ---------- 总渲染 ---------- */
  function studyModules() {
    return [window.LearningHub, window.CET4Learning, window.KnowledgeLibrary, window.ResearchWorkspace, window.Profile].filter(function (module) { return module && typeof module.render === "function"; });
  }

  function createStudyBridge() {
    function validKey(key) {
      return typeof key === "string" && key.length > 0 && key.length <= 240 && ["__proto__", "constructor", "prototype"].indexOf(key) === -1;
    }
    return {
      read: function () { return JSON.parse(JSON.stringify(state)); },
      put: function (key, fields) {
        if (!validKey(key) || !fields || typeof fields !== "object" || Array.isArray(fields)) throw new Error("学习记录格式无效");
        const updatedAt = new Date(Math.max(Date.now(), dateToTime(state.study[key] && state.study[key].updatedAt) + 1)).toISOString();
        state.study[key] = Object.assign({}, state.study[key] || {}, JSON.parse(JSON.stringify(fields)), { deleted: false, updatedAt: updatedAt });
        markChanged();
        renderAll();
        return JSON.parse(JSON.stringify(state.study[key]));
      },
      remove: function (key) {
        if (!validKey(key)) return;
        const updatedAt = new Date(Math.max(Date.now(), dateToTime(state.study[key] && state.study[key].updatedAt) + 1)).toISOString();
        state.study[key] = Object.assign({}, state.study[key] || {}, { deleted: true, updatedAt: updatedAt });
        markChanged();
        renderAll();
      },
      toast: showToast,
      navigate: function (name) { if (TABS.indexOf(name) !== -1) switchTab(name); },
      today: todayISO,
      uid: uid,
      plans: function () {
        const today = todayISO();
        const list = [];
        Object.keys(state.study).forEach(function (key) {
          if (key.indexOf("plan:") !== 0) return;
          const r = state.study[key];
          if (!r || r.deleted) return;
          list.push({ key: key, title: r.title || "", date: r.date || "", subject: r.subject || "general", done: r.done === true });
        });
        return list;
      },
      roadmapTasks: function () {
        const list = [];
        CUR.phases.forEach(function (phase) {
          phase.tasks.forEach(function (task) {
            list.push({ id: task.id, title: task.title, phase: phase.id, phaseTitle: phase.title, done: isDone(task.id), minutes: task.minutes || 0 });
          });
        });
        return list;
      }
    };
  }

  function renderAll() {
    renderHero();
    renderPhases();
    renderGlossary();
    renderGraph();
    renderStats();
    renderSettings();
    studyModules().forEach(function (module) { module.render(); });
  }

  /* ---------- 任务操作 ---------- */
  function toggleTask(taskId, done) {
    const entry = state.tasks[taskId] || {};
    const next = {
      done: !!done,
      doneAt: done ? todayISO() : null,
      note: typeof entry.note === "string" ? entry.note : "",
      updatedAt: nowISO()
    };
    state.tasks[taskId] = next;
    markChanged();
    renderAll();
  }

  let noteTimer = null;
  function updateNote(taskId, value) {
    const entry = state.tasks[taskId] || { done: false, doneAt: null };
    state.tasks[taskId] = {
      done: !!entry.done,
      doneAt: entry.doneAt || null,
      note: value,
      updatedAt: nowISO()
    };
    state.updatedAt = nowISO();
        if (noteTimer) clearTimeout(noteTimer);
        noteTimer = setTimeout(function () {
          saveLocalState();
          scheduleSync();
        }, 700);
  }


  /* ---------- 导入导出 ---------- */
  function exportJSON() {
    const payload = {
      exportedAt: nowISO(),
      app: "ai-study-tracker",
      state: state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-study-backup-" + todayISO() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast("已导出备份文件");
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = parsed && parsed.state ? parsed.state : parsed;
        if (!incoming || typeof incoming !== "object" || (!incoming.tasks && !incoming.log)) {
          throw new Error("格式不对");
        }
        if (!window.confirm("导入后会按更新时间合并备份和当前记录。不同条目会保留，同一条记录取较新版本。继续吗？")) return;
        state = mergeDocs(state, incoming);
        state.updatedAt = nowISO();
        markChanged();
        renderAll();
        showToast("导入成功");
      } catch (err) {
        showToast("导入失败：不是有效的备份文件");
      }
    };
    reader.readAsText(file);
  }

  async function resetAll() {
    if (!window.confirm("确定清空任务进度、打卡、计划、四级练习？已连接同步时，会同步清空当前云端记录。学习档案会保留。")) return;
    if (!window.confirm("再确认一次：此操作不可撤销。建议先导出 JSON 备份。真的清空吗？")) return;
    if (sync.busy) { showToast("正在同步，请稍后再清空"); return; }
    if (sync.mode !== "off") {
      try {
        const remote = await pullByMode();
        if (remote) state = mergeDocs(state, remote);
      } catch (err) {
        showToast("无法读取云端，暂未清空。请检查同步连接后重试");
        return;
      }
    }
    const previous = state;
    let latest = Math.max(Date.now(), dateToTime(previous.updatedAt));
    [previous.tasks, previous.study].forEach(function (map) { Object.keys(map).forEach(function (key) { latest = Math.max(latest, dateToTime(map[key] && map[key].updatedAt)); }); });
    previous.log.forEach(function (item) { latest = Math.max(latest, dateToTime(item.updatedAt)); });
    Object.keys(previous.logDeleted).forEach(function (key) { latest = Math.max(latest, dateToTime(previous.logDeleted[key])); });
    const stamp = new Date(latest + 1).toISOString();
    state = emptyState();
    state.profile = previous.profile;
    state.updatedAt = stamp;
    Object.keys(previous.tasks).forEach(function (key) { state.tasks[key] = { done: false, doneAt: null, note: "", updatedAt: stamp }; });
    state.logDeleted = Object.assign({}, previous.logDeleted);
    previous.log.forEach(function (item) { state.logDeleted[item.id] = stamp; });
    Object.keys(previous.study).forEach(function (key) { state.study[key] = { deleted: true, updatedAt: stamp }; });
    ui.openNotes = {};
    studyModules().forEach(function (module) { if (typeof module.reset === "function") module.reset(); });
    markChanged();
    renderAll();
    showToast("已清空，重新开始");
  }

  /* ---------- 标签页 ---------- */
  const TABS = ["home", "research", "planner", "cet4", "roadmap", "library", "glossary", "graph", "profile", "stats", "settings", "more"];

  function navigationButtons() {
    return document.querySelectorAll(".tabs-desktop [data-tab], .tabbar [data-tab], #view-more [data-tab]");
  }

  function switchTab(name) {
    TABS.forEach(function (key) {
      const view = $("view-" + key);
      if (!view) return;
      const active = key === name;
      view.classList.toggle("is-active", active);
      if (active) {
        view.removeAttribute("hidden");
      } else {
        view.setAttribute("hidden", "");
      }
    });
    navigationButtons().forEach(function (btn) {
      const active = btn.dataset.tab === name || (btn.dataset.tab === "more" && ["research", "roadmap", "library", "glossary", "graph", "profile", "stats", "settings"].indexOf(name) !== -1);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------- 主题 ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
    $("themeToggle").setAttribute("aria-label", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#102a40" : "#eaf8ff");
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (err) { saved = null; }
    applyTheme(saved || "light");
  }

  /* ---------- 事件绑定 ---------- */
  function bindEvents() {
    $("themeToggle").addEventListener("click", function () {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* 忽略 */ }
    });

    navigationButtons().forEach(function (btn) {
      btn.addEventListener("click", function () { switchTab(btn.dataset.tab); });
    });

    $("glossaryCats").addEventListener("click", function (event) {
      const btn = event.target.closest("[data-gcat]");
      if (!btn) return;
      ui.gCat = btn.dataset.gcat;
      saveUI();
      renderGlossary();
    });

    $("glossaryList").addEventListener("click", function (event) {
      const toggle = event.target.closest("[data-term-toggle]");
      if (toggle) {
        const id = toggle.dataset.termToggle;
        ui.gOpen[id] = !(ui.gOpen[id] === true);
        saveUI();
        renderGlossary();
        return;
      }
      const jump = event.target.closest("[data-goto-term]");
      if (jump) gotoTerm(jump.dataset.gotoTerm);
    });

    let glossaryTimer = null;
    $("glossarySearch").addEventListener("input", function (event) {
      if (glossaryTimer) clearTimeout(glossaryTimer);
      const value = event.target.value;
      glossaryTimer = setTimeout(function () {
        ui.gQuery = value;
        saveUI();
        renderGlossary();
      }, 180);
    });

    $("graphCats").addEventListener("click", function (event) {
      const btn = event.target.closest("[data-mcat]");
      if (!btn) return;
      ui.mCat = btn.dataset.mcat;
      saveUI();
      renderGraphCats();
      renderGraphList();
    });

    document.querySelectorAll(".seg").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".seg").forEach(function (other) { other.classList.remove("is-active"); });
        btn.classList.add("is-active");
        ui.filter = btn.dataset.filter;
        saveUI();
        renderPhases();
      });
    });

    let searchTimer = null;
    $("searchInput").addEventListener("input", function (event) {
      if (searchTimer) clearTimeout(searchTimer);
      const value = event.target.value;
      searchTimer = setTimeout(function () {
        ui.query = value;
        saveUI();
        renderPhases();
      }, 180);
    });

    $("phaseList").addEventListener("click", function (event) {
      const toggle = event.target.closest("[data-toggle-phase]");
      if (toggle) {
        const id = toggle.dataset.togglePhase;
        ui.open[id] = !(ui.open[id] === true);
        saveUI();
        renderPhases();
        return;
      }

      const noteBtn = event.target.closest("[data-toggle-note]");
      if (noteBtn) {
        const id = noteBtn.dataset.toggleNote;
        ui.openNotes[id] = !(ui.openNotes[id] === true);
        saveUI();
        renderPhases();
        if (ui.openNotes[id]) {
          const field = document.querySelector('[data-note-field="' + id + '"]');
          if (field) field.focus();
        }
      }
    });

    $("phaseList").addEventListener("change", function (event) {
      const check = event.target.closest("[data-toggle-task]");
      if (!check) return;
      toggleTask(check.dataset.toggleTask, check.checked);
    });

    $("phaseList").addEventListener("input", function (event) {
      const field = event.target.closest("[data-note-field]");
      if (!field) return;
      const id = field.dataset.noteField;
      updateNote(id, field.value);
      const btn = document.querySelector('[data-toggle-note="' + id + '"]');
      if (btn) {
        btn.classList.toggle("has-note", field.value.trim().length > 0);
        btn.textContent = field.value.trim() ? "查看笔记" : "写笔记";
      }
    });

    $("phaseList").addEventListener("focusout", function (event) {
      const field = event.target.closest("[data-note-field]");
      if (!field) return;
          if (noteTimer) clearTimeout(noteTimer);
          saveLocalState();
      scheduleSync();
    });

    $("profileForm").addEventListener("submit", function (event) {
      event.preventDefault();
      state.profile.name = $("profileName").value.trim();
      state.profile.start = $("profileStart").value || "";
      state.profile.updatedAt = nowISO();
      markChanged();
      renderAll();
      showToast("已保存");
    });

    $("toggleGistToken").addEventListener("click", function () {
      const input = $("gistToken");
      const button = $("toggleGistToken");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "隐藏" : "显示";
      button.setAttribute("aria-pressed", show ? "true" : "false");
      button.setAttribute("aria-label", show ? "隐藏 Token" : "显示 Token");
    });

    $("syncMode").addEventListener("change", async function (event) {
      syncCfg.mode = event.target.value;
      saveSyncCfg();
      renderSyncFields();
      if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) {
        sync.mode = "off";
        sync.status = "idle";
        renderSyncPanel();
        setSyncStatus("等待 GitHub Token", "");
        showToast("已选择 GitHub Gist；填入 Token 后点「保存并同步」");
        return;
      }
      await startSync();
      showToast(sync.mode === "off" ? "当前是本地模式" : "已切换到 " + modeLabel());
    });

    $("syncSave").addEventListener("click", async function () {
      syncCfg.gistToken = $("gistToken").value.trim();
      syncCfg.gistId = $("gistId").value.trim();
      syncCfg.endpoint = $("syncEndpoint").value.trim();
      saveSyncCfg();
      renderSyncFields();
      await startSync();
      if (sync.status === "ok") {
        showToast("同步成功");
      } else if (sync.mode === "off") {
        if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) {
          showToast("请先粘贴 GitHub Token；进度仍保存在本机");
        } else if (syncCfg.mode === "custom" && !syncCfg.endpoint.trim()) {
          showToast("请先填写接口地址；进度仍保存在本机");
        } else {
          showToast("没找到可用同步方式；进度仍保存在本机");
        }
      } else {
        showToast("同步失败：" + sync.message);
      }
    });

    $("syncNow").addEventListener("click", async function () {
      if (sync.mode === "off") {
        await startSync();
      } else {
        await syncOnce("manual", true);
      }
      if (sync.status === "ok") showToast("同步完成");
      else if (sync.mode === "off") {
        if (syncCfg.mode === "gist" && !syncCfg.gistToken.trim()) showToast("请先粘贴 GitHub Token");
        else showToast("没有可用的同步方式；进度仍保存在本机");
      }
      else showToast("同步失败：" + sync.message);
    });

    $("syncForget").addEventListener("click", async function () {
      if (!window.confirm("清除这台设备上保存的云端配置（Token、Gist ID、接口地址）？\n\n云端的数据不会被删除。")) return;
      syncCfg.gistToken = "";
      syncCfg.gistId = "";
      syncCfg.endpoint = "";
      syncCfg.mode = "auto";
      saveSyncCfg();
      sync.mode = "off";
      sync.status = "idle";
      syncFormFromCfg();
      renderSyncPanel();
      await startSync();
      showToast("云端配置已清除");
    });

    $("exportBtn").addEventListener("click", exportJSON);
    $("importBtn").addEventListener("click", function () { $("importFile").click(); });
    $("importFile").addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0];
      if (file) importJSON(file);
      event.target.value = "";
    });
    $("resetBtn").addEventListener("click", resetAll);
  }

  /* ---------- 启动 ---------- */
  function boot() {
    initTheme();
    if (!state.profile.start) state.profile.start = todayISO();

    $("searchInput").value = ui.query || "";
    $("glossarySearch").value = ui.gQuery || "";
    syncFormFromCfg();
    document.querySelectorAll(".seg").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.filter === ui.filter);
    });

    window.STUDY_STORE = createStudyBridge();
    studyModules().forEach(function (module) { if (typeof module.init === "function") module.init(window.STUDY_STORE); });
    bindEvents();
    const requestedTab = window.location && new URLSearchParams(window.location.search).get("tab");
    switchTab(TABS.indexOf(requestedTab) !== -1 ? requestedTab : "home");
    renderAll();

    window.addEventListener("beforeunload", function () { saveLocalState(); });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        saveLocalState();
        return;
      }
      // 从别的设备切回来时顺手拉一次，免得看到旧数据
      if (sync.mode !== "off" && Date.now() - sync.lastPullAt > 20000 && !isEditingField()) {
        syncOnce("visible", false);
      }
    });

    if (typeof window.setInterval === "function") {
      window.setInterval(function () {
        if (document.hidden || sync.mode === "off" || sync.busy || isEditingField()) return;
        if (Date.now() - sync.lastPullAt >= 25000) syncOnce("poll", false);
      }, 30000);
    }

    startSync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
