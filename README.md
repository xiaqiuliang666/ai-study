# AI 学习站

一个自己用的 AI 学习网页，四块内容：

1. **学习路线** —— 分阶段的任务清单，可勾选、可写笔记，有进度和统计。
2. **热词百科** —— 57 个 AI 高频名词，每个都有一句人话解释 + 和相近概念的区别 + 相关词跳转。
3. **模型图谱** —— 42 个主流大模型 / 编程 Agent / Agent 产品 / 搭建平台，标注强项、差异、适用场景，附实时榜单入口。
4. **学习日志** —— 按天记录学了什么、花了多久，带连续天数和投入统计。

纯静态页面（零依赖）+ 可选的同步后端，不需要构建工具。手机和电脑可以共用同一份数据。

当前主线按 **Git/GitHub → 文献检索、阅读与引用 → Python → AI Agent → 项目实践** 排列。数学、机器学习、深度学习和 Transformer 原理放在后面的选修专题；顶部进度只统计主线任务。

---

## 一、先选一种用法

| 用法 | 需要什么 | 电脑关机能用吗 | 手机和电脑同一份数据吗 |
| --- | --- | --- | --- |
| **A. 公网 + GitHub Gist**（推荐） | 一个 GitHub 账号 | 能 | 是 |
| B. 公网 + 不同步 | 一个托管账号 | 能 | 各存各的，靠导出/导入搬 |
| C. 本机服务器 | 什么都不用 | 不能 | 是（在家 Wi-Fi 下） |

想随时随地用手机打开、电脑不用开机，就用 A。下面是 A 的完整步骤。

---

## 二、A 方案：公网 + GitHub Gist

分两件事：把**网页**放到公网（谁都能打开），把**数据**放到你的 GitHub 账号（只有你有钥匙）。

### 第 1 步：把网页传上 GitHub

1. 打开 https://github.com/new ，仓库名填 `ai-study`，可见性选 **Public**（免费账号开 Pages 需要公开仓库；代码公开没关系，你的学习数据不在这里），不要勾任何初始化文件。
2. 在本文件夹里执行（把用户名换成你的）：

   ```bash
   git add .
   git commit -m "AI 学习路线"
   git branch -M main
   git remote add origin https://github.com/xiaqiuliang666/ai-study.git
   git push -u origin main
   ```

3. 打开仓库页面 → **Settings → Pages** → Source 选 `Deploy from a branch`，Branch 选 `main` + `/ (root)` → Save。
4. 等 1 分钟，访问 `https://xiaqiuliang666.github.io/ai-study/`，能看到页面就成了。这个网址手机、平板、任何电脑都能打开。

> 不想碰 git：把整个文件夹拖到 https://app.netlify.com/drop 也能立刻拿到一个网址，效果一样，国内访问通常比 GitHub Pages 更稳。

### 第 2 步：创建一个只有 gist 权限的 Token

推荐细粒度 Token（权限最小）：

1. 打开 https://github.com/settings/personal-access-tokens/new
2. Token name 随便填，比如 `ai-study-sync`；Expiration 建议 1 年。
3. 往下找到 **Account permissions → Gists**，改成 **Read and write**。别的权限一律不用给。
4. 点 Generate token，**立刻复制**那串 `github_pat_...`（关掉页面就再也看不到了）。

嫌麻烦也可以用经典 Token：https://github.com/settings/tokens/new?scopes=gist ，只要勾 `gist` 这一项。

### 第 3 步：在网页里开启同步

1. 打开你的公网网址 → 底部**设置** → 数据同步 → 同步方式选 **GitHub Gist**。
2. 把 Token 粘进第一个框，Gist ID 留空。
3. 点**保存并同步**。第一次会自动创建一个私密 Gist，并把 ID 自动填上——看到绿色的「已连接 GitHub Gist」就好了。
4. 在第一台设备记下网页自动填入的 **Gist ID**。手机、平板等其他设备打开同一个网址后，选择 GitHub Gist，填入同一个 Token **和同一个 Gist ID**，再点「保存并同步」。如果把 Gist ID 留空，网页会新建另一份 Gist，设备间就不会共享进度。

之后进度改动会自动上传。其他已打开的设备约 30 秒内更新；也可以点「立即同步」。

---

## 三、同步是怎么工作的

- **本地优先**：所有操作先写进浏览器本地，断网也能用，联网后照常同步。
- **按条合并，不是整份覆盖**：手机改任务 A、电脑改任务 B，合并后两条都在。
- **同一条冲突**：以时间戳更晚的那次为准。
- **设备间更新**：勾选、笔记、日志等数据改动约 1.5 秒后上传；其他打开着且处于前台的设备约每 30 秒检查并显示更新，切回页面时也会拉取。后台标签页受浏览器限制，回到前台后会再同步。
- **网站内容更新**：学习路线、百科和页面代码发布到 GitHub Pages 后由托管端更新，其他设备刷新页面即可看到；这些文件本身不通过 Gist 同步。
- **删日志**：会留下"墓碑"记录，避免另一台设备把它同步回来。
- **Token 存在哪**：只存在这台设备的浏览器里，不会写进导出文件、也不会进 Gist。
- **云端文件长什么样**：Gist 里一个 `ai-study-state.json`，内容是你的全部进度和笔记。

同步方式随时可以换：设置页里选「本机服务器」（在家用）、「GitHub Gist」（在外用）、「关闭同步」（只用本设备）。

---

## 四、C 方案：本机服务器（在家 Wi-Fi 下用）

1. 双击 **`start-server.bat`**（或在本文件夹执行 `python server.py`）。
2. 窗口会打印两行地址：

   ```
   本机访问：   http://localhost:8000
   手机访问：   http://192.168.1.23:8000
   ```

3. 手机连**同一个 Wi-Fi**，浏览器打开那个 `http://192.168...` 地址。

第一次启动 Windows 会弹防火墙提示，要勾选"专用网络"并允许。

---

## 五、文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 页面结构（路线 / 日志 / 统计 / 设置） |
| `styles.css` | 样式，手机优先，自动适配深色模式 |
| `curriculum.js` | **学习路线内容**，所有阶段和任务都写在这里 |
| `glossary.js` | **热词百科内容**，每个词的定义、区别、相关词 |
| `models.js` | **模型与 Agent 图谱内容**，条目、对比、榜单链接 |
| `app.js` | 交互逻辑：进度、笔记、日志、统计、同步 |
| `server.py` | 可选的本机服务器 + 数据接口 |
| `start-server.bat` | Windows 上一键启动本机服务器 |
| `manifest.webmanifest` / `icon.svg` | 添加到手机主屏幕时用的图标和名称 |
| `data/state.json` | 用本机服务器时生成的数据文件（已被 git 忽略） |
| `tests/test_server.py` | 服务器合并逻辑测试：`python -m unittest discover -s tests` |
| `tests/smoke-dom.js` | 前端冒烟测试（29 项）：`node tests/smoke-dom.js` |

---

## 六、改内容

**热词和模型**：分别编辑 `glossary.js` 和 `models.js`，照着已有格式加条目即可，保存后刷新页面就能看到。
`models.js` 顶部的 `updated` 字段建议每次更新后改一下，页面上会显示整理时间。

**学习路线**：编辑 `curriculum.js`，格式如下：

```js
{
  id: "p1",                              // 阶段 id，唯一
  title: "阶段 3 · Python 基础",
  goal: "这一阶段要达成什么",
  tasks: [
    {
      id: "p1-1",                        // 任务 id，唯一；改了 id 等于新增一条任务
      title: "Python 基础语法过关",
      detail: "做到什么程度算过关",
      minutes: 600,                      // 预计投入（分钟）
      tip: "一句话提示",                 // 可省略
      resources: [
        { label: "链接文字", url: "https://example.com" }
      ]
    }
  ]
}
```

改完推送到 GitHub，手机刷新就能看到。**别改已经勾过的任务 id**，否则那条会变回未完成。

---

## 七、常见问题

**私密 Gist 是别人看不到的吗？**
不是"只有你能看"，而是"不公开列出、搜不到"——任何拿到链接的人能看到内容。别把密码、API key 写进笔记和日志就行。

**Token 填错了会怎样？**
设置页会明确告诉你 `HTTP 401：Token 无效或已过期` 之类的原因，本地数据不会丢，也不会被覆盖。

**换手机 / 换浏览器怎么办？**
重新填一次 Token。如果 Gist ID 没自动带上，就打开 https://gist.github.com/ 找到那个文件，网址最后那串就是 ID，粘进去即可。

**提示 403 或限流**
Token 权限不对（需要 Gist 读写），或者请求太频繁。等一会儿再点「立即同步」。

**数据会不会丢？**
三份保险：浏览器本地一份、Gist 云端一份、设置页能随时导出 JSON。用本机服务器时 `data/` 里还有一份 `state.backup.json`。

**手机上打不开本机服务器的地址**
确认手机和电脑在同一个 Wi-Fi（不是流量），确认防火墙允许了"专用网络"。

