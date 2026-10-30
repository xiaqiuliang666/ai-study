# 哆啦 A 梦学习冒险

参考资料：

- [Duolingo 的形状与插画设计](https://blog.duolingo.com/shape-language-duolingos-art-style/)：圆润形状、鲜明色彩、可读的角色插画。
- [Duolingo 学习路径](https://blog.duolingo.com/new-duolingo-home-screen-design/)：有明确下一步的学习路线与关卡反馈。
- [Code.org 学生学习入口](https://code.org/en-US/students)：以课程卡片组织入口。

本次实现：电脑侧边导航、手机卡通底部导航、带按压反馈的按钮、彩色阶段卡片、插画首页、蓝天背景。保留原有任务 ID 与数据结构。`cartoon.css` 提供完整主题，原有样式继续提供基础布局。

## 多科目学习中心

在原有主题上扩展学习总览、计划与专注、四级备考，电脑使用侧栏导航，手机使用总览 / 四级 / 计划 / 更多四项入口。新增内容采用白色圆角卡片、柔和学科配色和按压反馈，首页保留哆啦 A 梦插画。

功能参考：

- [Duolingo 的连续学习习惯](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)：每日打卡、明确的每日目标和日历反馈。
- [Quizlet 的学习方式](https://help.quizlet.com/hc/en-us/articles/360030841732-Studying-on-Quizlet)：词卡、翻面回忆和自我检查。
- [Duolingo 的间隔复习](https://blog.duolingo.com/spaced-repetition-for-learning/)：根据掌握反馈安排下次词卡复习。
- [British Council B1 听力](https://learnenglish.britishcouncil.org/free-resources/listening/b1)：听前准备、音频理解和练后检查的学习流程。

本站词卡、短阅读、写作和翻译练习为原创，官方考试结构参考[中国教育考试网 CET 笔试说明](https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm)。四级考试为 125 分钟：写作 30、听力 25、阅读 40、翻译 30 分钟。学习日期由用户自行设置，不默认猜测。

持久化沿用原有本地存储，在 `study` 映射里按条目记录修改时间及删除标记，通过同一同步入口保存；GitHub Gist 使用额外的 `ai-study-hub.json` 文件兼容旧版设备。专注计时运行态仅保存在当前标签页的 sessionStorage，完成后的时长进入同步记录。

## 知识与科研资料库

新增 39 篇站内原创中文指南，使用六类学科书架、全文搜索和来源导航组织内容。阅读页包含目录、代码或例子、动手练习、参考思路与延伸资料。收藏和已学保存到原有同步记录，计划使用既有模块。已学操作记录活动，不虚增学习时长。

根据研一电子信息的学习背景，首页突出文献阅读、数据小实验和科研写作，加入边坡监测、雨量测量的入门案例。四周安排为可调整的学习建议，候选问题以与导师讨论及实际数据条件为前提。WMO 资料明确标注历史版本；合成示例、教学参数、待完成实验和已验证结果分别写清。

新领域资料使用 [USGS 监测案例](https://www.usgs.gov/programs/landslide-hazards/science/real-time-monitoring-potential-landslides)、[NOAA 托管 WMO 2008 历史版](https://www.weather.gov/media/epz/mesonet/CWOP-WMO8.pdf)、[IEEE 写作结构](https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/create-the-text-of-your-article/structure-your-article/)及[可复现性指导](https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/research-reproducibility/)。其余每篇保留 Git、GitHub、Python、Zotero、Hugging Face、MCP、LangGraph、原论文和英语教学机构的一手入口。

## 学术研究工作台

侧栏新增独立「学术研究」，手机从「更多」或首页科研卡进入，支持 `?tab=research` 直达。保留既有卡通主题，使用较安静的阅读卡和阶段清单展示研究材料。工作台含研究总览、小论文路线、文献工作台和阅读方法。

导师资料使用[数学与计算机学院官方主页](https://sjxy.whpu.edu.cn/info/1134/3017.htm)核实身份与研究方向；2023 水面垃圾检测和 2012 PCB 图像对准两条论文线索来自期刊原页。当前在研纵向项目未获完整公开证据，页面明确提示向导师确认；论文的资助编号不被解释为特定作者的主持项目。

前、中、后期围绕检索阅读、问题与实验设计、数据与基线、分析、写作、引用和反馈组织，每步提供实际操作及产物。阶段勾选和文献卡记录保存到 `study`，沿用既有同步与备份。新建研究记录和阅读卡均由用户操作触发，不预填虚构成果。

## 插画

使用内置 image_gen 生成。原始图保存于 `assets/doraemon-sky-original.png`；网站加载压缩版 `assets/doraemon-sky.jpg`（1536 × 1024，约 229 KB）。原图未随网页上传。

完整生成提示词：

```text
Use case: illustration-story. Create one polished landscape background illustration for a playful Chinese AI learning dashboard, wide composition about 3:2. Feature the recognizable Doraemon character, the blue robot cat with white face and round belly, red nose, whiskers, red collar and golden bell, joyfully flying with his small bamboo-copter and waving, positioned prominently in the RIGHT THIRD of the canvas. Soft sky blue background, fluffy creamy-white clouds, a few small golden stars and tiny floating books; an iconic pink Anywhere Door near bottom right as a charming secondary prop. Cheerful Japanese 2D animation artwork with gently textured gouache finish, clean bold navy outlines, rounded shapes, pastel cyan and sunny yellow accents, beautiful professional educational website illustration. The LEFT HALF and center-left must remain spacious with mostly light blue sky and sparse clouds for readable interface text overlays. Keep Doraemon's face and whole head clearly visible, hands and feet anatomically consistent. No text, no lettering, no watermark, no UI or frames, no other characters. Make the sky and clouds extend to every edge, with no border.
```
