# 哆啦 A 梦学习冒险

参考资料：

- [Duolingo 的形状与插画设计](https://blog.duolingo.com/shape-language-duolingos-art-style/)：圆润形状、鲜明色彩、可读的角色插画。
- [Duolingo 学习路径](https://blog.duolingo.com/new-duolingo-home-screen-design/)：有明确下一步的学习路线与关卡反馈。
- [Code.org 学生学习入口](https://code.org/en-US/students)：以课程卡片组织入口。

本次实现：电脑侧边导航、手机卡通底部导航、带按压反馈的按钮、彩色阶段卡片、插画首页、蓝天背景。保留原有任务 ID 与数据结构。`cartoon.css` 提供完整主题，原有样式继续提供基础布局。

## 多科目学习中心

在原有主题上扩展学习总览、计划与专注、四级备考和笔记错题，电脑使用十项侧栏，手机使用总览 / 四级 / 计划 / 笔记 / 更多五项入口。新增内容采用白色圆角卡片、柔和学科配色和按压反馈，首页保留哆啦 A 梦插画。

功能参考：

- [Duolingo 的连续学习习惯](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)：每日打卡、明确的每日目标和日历反馈。
- [Quizlet 的学习方式](https://help.quizlet.com/hc/en-us/articles/360030841732-Studying-on-Quizlet)：词卡、翻面回忆和自我检查。
- [Duolingo 的间隔复习](https://blog.duolingo.com/spaced-repetition-for-learning/)：根据掌握反馈安排下次词卡复习。
- [British Council B1 听力](https://learnenglish.britishcouncil.org/free-resources/listening/b1)：听前准备、音频理解和练后检查的学习流程。

本站词卡、短阅读、写作和翻译练习为原创，官方考试结构参考[中国教育考试网 CET 笔试说明](https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm)。四级考试为 125 分钟：写作 30、听力 25、阅读 40、翻译 30 分钟。学习日期由用户自行设置，不默认猜测。

持久化沿用原有本地存储，在 `study` 映射里按条目记录修改时间及删除标记，通过同一同步入口保存；GitHub Gist 使用额外的 `ai-study-hub.json` 文件兼容旧版设备。专注计时运行态仅保存在当前标签页的 sessionStorage，完成后的时长进入同步记录。

## 插画

使用内置 image_gen 生成。原始图保存于 `assets/doraemon-sky-original.png`；网站加载压缩版 `assets/doraemon-sky.jpg`（1536 × 1024，约 229 KB）。原图未随网页上传。

完整生成提示词：

```text
Use case: illustration-story. Create one polished landscape background illustration for a playful Chinese AI learning dashboard, wide composition about 3:2. Feature the recognizable Doraemon character, the blue robot cat with white face and round belly, red nose, whiskers, red collar and golden bell, joyfully flying with his small bamboo-copter and waving, positioned prominently in the RIGHT THIRD of the canvas. Soft sky blue background, fluffy creamy-white clouds, a few small golden stars and tiny floating books; an iconic pink Anywhere Door near bottom right as a charming secondary prop. Cheerful Japanese 2D animation artwork with gently textured gouache finish, clean bold navy outlines, rounded shapes, pastel cyan and sunny yellow accents, beautiful professional educational website illustration. The LEFT HALF and center-left must remain spacious with mostly light blue sky and sparse clouds for readable interface text overlays. Keep Doraemon's face and whole head clearly visible, hands and feet anatomically consistent. No text, no lettering, no watermark, no UI or frames, no other characters. Make the sky and clouds extend to every edge, with no border.
```
