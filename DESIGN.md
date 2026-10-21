# 哆啦 A 梦学习冒险

参考资料：

- [Duolingo 的形状与插画设计](https://blog.duolingo.com/shape-language-duolingos-art-style/)：圆润形状、鲜明色彩、可读的角色插画。
- [Duolingo 学习路径](https://blog.duolingo.com/new-duolingo-home-screen-design/)：有明确下一步的学习路线与关卡反馈。
- [Code.org 学生学习入口](https://code.org/en-US/students)：以课程卡片组织入口。

本次实现：电脑侧边导航、手机卡通底部导航、带按压反馈的按钮、彩色阶段卡片、插画首页、蓝天背景。保留原有任务 ID 与数据结构。`cartoon.css` 提供完整主题，原有样式继续提供基础布局。

## 插画

使用内置 image_gen 生成。原始图保存于 `assets/doraemon-sky-original.png`；网站加载压缩版 `assets/doraemon-sky.jpg`（1536 × 1024，约 229 KB）。原图未随网页上传。

完整生成提示词：

```text
Use case: illustration-story. Create one polished landscape background illustration for a playful Chinese AI learning dashboard, wide composition about 3:2. Feature the recognizable Doraemon character, the blue robot cat with white face and round belly, red nose, whiskers, red collar and golden bell, joyfully flying with his small bamboo-copter and waving, positioned prominently in the RIGHT THIRD of the canvas. Soft sky blue background, fluffy creamy-white clouds, a few small golden stars and tiny floating books; an iconic pink Anywhere Door near bottom right as a charming secondary prop. Cheerful Japanese 2D animation artwork with gently textured gouache finish, clean bold navy outlines, rounded shapes, pastel cyan and sunny yellow accents, beautiful professional educational website illustration. The LEFT HALF and center-left must remain spacious with mostly light blue sky and sparse clouds for readable interface text overlays. Keep Doraemon's face and whole head clearly visible, hands and feet anatomically consistent. No text, no lettering, no watermark, no UI or frames, no other characters. Make the sky and clouds extend to every edge, with no border.
```
