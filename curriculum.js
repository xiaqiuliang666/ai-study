/*
 * AI 学习路线内容表。
 * 想改内容，直接编辑下面的 phases 即可：每个阶段有唯一 id，每个任务也有唯一 id。
 * 注意：任务 id 是进度的钥匙，改 id 等于把那条任务变成"未完成的新任务"。
 */
window.CURRICULUM = {
  title: "AI 学习路线",
  subtitle: "从 Python 基础一路走到能自己做 LLM 应用",
  phases: [
    {
      id: "p0",
      title: "阶段 0 · 环境和工具准备",
      goal: "先把「用什么学、怎么问」定下来，避免一开始就卡在工具上。",
      tasks: [
        {
          id: "p0-1",
          title: "确认本机开发环境可用",
          detail: "Python、Node 能正常打印版本号，装好一个顺手的编辑器（VS Code 或 Trae）。之后所有练习都在这台电脑上跑。",
          minutes: 60,
          tip: "命令行里依次执行 python --version、node --version、git --version",
          resources: []
        },
        {
          id: "p0-2",
          title: "把 DeepSeek V4 Pro 练成「随叫随到的老师」",
          detail: "固定一套提问三段式：先让它用大白话解释概念 → 再让它给一个生活化的例子 → 最后让它出 3 道题考你。这套流程后面每个阶段都能用。",
          minutes: 60,
          tip: "在你常用的对话工具里直接练，不用写代码",
          resources: [
            { label: "DeepSeek 开放平台文档", url: "https://api-docs.deepseek.com/zh-cn/" }
          ]
        },
        {
          id: "p0-3",
          title: "搞清楚三个 agent 的分工",
          detail: "GPT、WorkBuddy、Trae 各拿一个小任务试一次（比如：让 Trae 改一个本地文件、让 GPT 帮你梳理学习计划）。摸清每个工具擅长什么，之后按活儿派工。",
          minutes: 90,
          tip: "重点体验「能读你本地文件/项目」这类能力，这是 agent 和聊天框的本质区别",
          resources: []
        },
        {
          id: "p0-4",
          title: "建立每天记一条日志的习惯",
          detail: "学的当天就在这个网页的「日志」里写 3 行：学了什么、卡在哪、明天干什么。这一条比任何课程都重要。",
          minutes: 20,
          tip: "现在就去日志页写第一条，日期选今天",
          resources: []
        },
        {
          id: "p0-5",
          title: "选定一条主线课程，写进这里",
          detail: "不要同时开三门课。挑一门主线（推荐动手学深度学习 / Kaggle Learn / Karpathy 视频，任选一个）+ 一门辅助答疑（DeepSeek）。选定后写在笔记里。",
          minutes: 40,
          tip: "把课程名字和链接写在这个任务的笔记里，以后不用再纠结",
          resources: [
            { label: "动手学深度学习（中文）", url: "https://zh.d2l.ai/" },
            { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
            { label: "Karpathy: Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html" }
          ]
        }
      ]
    },
    {
      id: "p1",
      title: "阶段 1 · Python 与数据处理",
      goal: "能读懂、能改、能独立写出 50 行左右的数据处理脚本。",
      tasks: [
        {
          id: "p1-1",
          title: "Python 基础语法过关",
          detail: "变量、列表/字典、if/for、函数定义、字符串格式化。判断标准：不看资料能写出「统计一段文本里每个词出现的次数」。",
          minutes: 600,
          tip: "遇到不懂的语法，让 DeepSeek 用「对比表格」解释，比自己翻文档快",
          resources: [{ label: "Python 官方教程（中文）", url: "https://docs.python.org/zh-cn/3/tutorial/" }]
        },
        {
          id: "p1-2",
          title: "文件读写、异常处理、虚拟环境",
          detail: "会读写 txt/csv/json，会 try/except 兜住报错，会给每个项目建独立虚拟环境并 pip install 依赖。",
          minutes: 180,
          tip: "养成习惯：每个练习文件夹里都建 venv，别让环境互相打架",
          resources: [{ label: "venv 官方文档", url: "https://docs.python.org/zh-cn/3/library/venv.html" }]
        },
        {
          id: "p1-3",
          title: "NumPy：数组与向量化运算",
          detail: "理解 shape、广播、索引切片、矩阵乘法、聚合函数。这一步是后面所有数学和深度学习的地基。",
          minutes: 300,
          tip: "同一件事分别用 for 循环和 numpy 写一遍，感受向量化的差距",
          resources: [{ label: "NumPy 快速入门", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" }]
        },
        {
          id: "p1-4",
          title: "pandas：读数据、筛数据、聚合",
          detail: "read_csv、行列筛选、缺失值处理、groupby 分组统计、merge 合并表。真实数据 90% 的时间花在这一步。",
          minutes: 420,
          tip: "找一份你真正关心的数据（账单、游戏记录、天气），不是教程里的示例数据",
          resources: [{ label: "pandas 10 分钟入门", url: "https://pandas.pydata.org/docs/user_guide/10min.html" }]
        },
        {
          id: "p1-5",
          title: "matplotlib：把数据画出来",
          detail: "折线图、柱状图、散点图、直方图，会加标题和轴标签。能画图才看得见规律。",
          minutes: 240,
          tip: "中文字体显示成方框时，直接把报错和代码丢给 agent 让它修",
          resources: [{ label: "Matplotlib 教程", url: "https://matplotlib.org/stable/tutorials/index.html" }]
        },
        {
          id: "p1-6",
          title: "小项目：一份真实 CSV 的完整分析",
          detail: "从下载数据到输出结论：清洗 → 计算 3 个指标 → 画 3 张图 → 写 200 字结论。做完这个，阶段 1 才算真的过。",
          minutes: 360,
          tip: "让 Trae 或 GPT 帮你搭骨架，但每一行代码你都要能解释它干嘛",
          resources: []
        }
      ]
    },
    {
      id: "p2",
      title: "阶段 2 · 数学基础（够用就行）",
      goal: "不用学完整本教材，只要能在公式里看出「这是在算什么」。",
      tasks: [
        {
          id: "p2-1",
          title: "线性代数：向量、矩阵乘法、点积",
          detail: "重点是矩阵乘法、转置、点积的几何含义。神经网络的一层，本质就是矩阵乘法加一个非线性函数。",
          minutes: 420,
          tip: "看 3Blue1Brown 系列建立直觉，公式推导放到第二位",
          resources: [{ label: "3Blue1Brown 线性代数的本质", url: "https://www.bilibili.com/video/BV1ys411472E" }]
        },
        {
          id: "p2-2",
          title: "微积分：导数、偏导、链式法则、梯度",
          detail: "只要掌握「梯度指向函数上升最快的方向」，以及链式法则为什么是反向传播的核心。",
          minutes: 420,
          tip: "每个概念都让 DeepSeek 出一道能口算的小例子，算完再往下走",
          resources: [{ label: "3Blue1Brown 微积分的本质", url: "https://www.bilibili.com/video/BV1qW411N7FU" }]
        },
        {
          id: "p2-3",
          title: "概率统计：分布、期望方差、条件概率",
          detail: "正态分布、期望与方差、条件概率、贝叶斯思想。模型输出的「概率」和评估指标都建立在这上面。",
          minutes: 420,
          tip: "用 numpy 生成随机数，亲手算一遍期望和方差，比看定义清楚得多",
          resources: [{ label: "可汗学院：概率与统计", url: "https://zh.khanacademy.org/math/statistics-probability" }]
        },
        {
          id: "p2-4",
          title: "动手实现：矩阵乘法 + 梯度下降",
          detail: "用纯 numpy（不调用现成模型）实现：矩阵乘法、一个线性回归的梯度下降，看着 loss 一路下降。这个练习会一次性串起前面所有知识。",
          minutes: 360,
          tip: "先自己写，卡住了再让 agent 指出错在哪一行，不要直接要答案",
          resources: []
        }
      ]
    },
    {
      id: "p3",
      title: "阶段 3 · 机器学习入门",
      goal: "会用 scikit-learn 完整跑通一次「训练 → 评估 → 改进」。",
      tasks: [
        {
          id: "p3-1",
          title: "sklearn 标准流程跑通一遍",
          detail: "train_test_split 划分数据 → fit 训练 → predict 预测 → score 评估。把这条流水线背下来，后面所有项目都是它的变体。",
          minutes: 240,
          tip: "第一次跑通时，让 agent 逐行解释这一步为什么这么写",
          resources: [{ label: "scikit-learn 入门教程", url: "https://scikit-learn.org/stable/getting_started.html" }]
        },
        {
          id: "p3-2",
          title: "线性回归与逻辑回归",
          detail: "一个做预测数值，一个做二分类。理解损失函数、特征标准化、以及系数代表什么。",
          minutes: 300,
          tip: "在真实数据上对比「标准化前 / 标准化后」的效果差别",
          resources: []
        },
        {
          id: "p3-3",
          title: "决策树与随机森林",
          detail: "树是怎么分裂的、随机森林为什么更稳、特征重要性怎么看。表格数据上它们经常比神经网络还好用。",
          minutes: 300,
          tip: "用特征重要性回答一个真实问题，比如「哪些因素最影响结果」",
          resources: []
        },
        {
          id: "p3-4",
          title: "评估指标与过拟合",
          detail: "准确率、精确率、召回率、F1、混淆矩阵、交叉验证，以及过拟合的判断和应对（正则化、更多数据、更简单模型）。",
          minutes: 360,
          tip: "重点问自己：如果两类样本数量差 100 倍，准确率高还有意义吗？",
          resources: [{ label: "sklearn 模型评估指南", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" }]
        },
        {
          id: "p3-5",
          title: "无监督：KMeans 聚类与 PCA 降维",
          detail: "没有标签时怎么找结构：聚类分组、降维可视化。以后给文本做向量检索时还会再见到它们。",
          minutes: 240,
          tip: "把高维数据降到 2 维画出来，直观感受「结构」是什么样",
          resources: []
        },
        {
          id: "p3-6",
          title: "完成一次 Kaggle 入门赛提交",
          detail: "推荐 Titanic 或 House Prices：下载数据、训练模型、生成提交文件、拿到排行榜分数。有分数反馈，学习动力完全不同。",
          minutes: 420,
          tip: "第一次提交不追求排名，追求「流程走通」",
          resources: [{ label: "Kaggle 竞赛列表", url: "https://www.kaggle.com/competitions" }]
        }
      ]
    },
    {
      id: "p4",
      title: "阶段 4 · 深度学习与 PyTorch",
      goal: "能自己写出训练循环，能把模型跑起来并解释结果。",
      tasks: [
        {
          id: "p4-1",
          title: "张量与自动求导",
          detail: "理解 tensor、requires_grad、backward()、梯度清零。自动求导是深度学习框架唯一的魔法，必须亲手验证一次。",
          minutes: 240,
          tip: "手算一个 y = x² 的导数，再用 backward() 验证是否一致",
          resources: [{ label: "PyTorch 60 分钟入门", url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" }]
        },
        {
          id: "p4-2",
          title: "从零手写一个神经网络",
          detail: "不调 nn.Linear，只用 numpy 或纯 tensor 实现一层全连接 + 激活函数 + 反向传播，在 MNIST 上跑到 90% 以上。这一步做通，深度学习对你就不再是黑箱。",
          minutes: 480,
          tip: "让 DeepSeek 帮你检查梯度公式，但要自己先推导一遍",
          resources: []
        },
        {
          id: "p4-3",
          title: "掌握 PyTorch 训练循环",
          detail: "Dataset / DataLoader、loss、optimizer、train/eval 切换、保存与加载模型权重。这段模板以后每个项目都会重复用。",
          minutes: 300,
          tip: "把这一套写成自己的模板文件，之后每个项目直接复制",
          resources: []
        },
        {
          id: "p4-4",
          title: "CNN 与图像分类",
          detail: "卷积、池化、通道的作用，在 CIFAR-10 上训练一个卷积网络并可视化几张预测结果。",
          minutes: 420,
          tip: "故意让模型过拟合 100 张图，能加深对「过拟合」的体感",
          resources: []
        },
        {
          id: "p4-5",
          title: "训练技巧：学习率、批大小、早停",
          detail: "学习率太大 loss 乱跳、太小收敛慢；批大小影响显存和稳定性；早停和保存最优权重防止白练。",
          minutes: 300,
          tip: "固定其他条件，只改学习率跑 3 次，把曲线画在一起对比",
          resources: []
        },
        {
          id: "p4-6",
          title: "微调一个预训练模型",
          detail: "不从头训练，拿一个预训练模型改最后一层，用自己的小数据集微调。这就是后面用 LLM 的主流思路。",
          minutes: 420,
          tip: "数据集可以自己拍 50 张照片做分类，成就感很直接",
          resources: [{ label: "Hugging Face 中文课程", url: "https://huggingface.co/learn/nlp-course/zh-CN/chapter1/1" }]
        }
      ]
    },
    {
      id: "p5",
      title: "阶段 5 · Transformer 与 LLM 原理",
      goal: "知道大模型内部在干什么，而不是只会调 API。",
      tasks: [
        {
          id: "p5-1",
          title: "读懂 Transformer 架构",
          detail: "读《Attention Is All You Need》配合图解文章，把 encoder、decoder、多头注意力、位置编码的作用讲清楚。目标：能给别人画一张结构图。",
          minutes: 420,
          tip: "读完让 DeepSeek 扮演面试官，问你这篇论文的 10 个问题",
          resources: [
            { label: "Attention Is All You Need（论文）", url: "https://arxiv.org/abs/1706.03762" },
            { label: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
          ]
        },
        {
          id: "p5-2",
          title: "手写 self-attention",
          detail: "用几十行代码实现 Q、K、V 和缩放点积注意力，输入两个句子看注意力权重。亲手写过一次，概念才会真正落地。",
          minutes: 360,
          tip: "先照着公式写，再用矩阵运算重写一遍，对比两种写法",
          resources: []
        },
        {
          id: "p5-3",
          title: "分词与 Embedding",
          detail: "为什么模型不按字而是按 token 算钱、中文为什么更贵、embedding 怎么把词变成向量、相似度怎么算。",
          minutes: 240,
          tip: "拿一段中文和一段英文分别数 token，直观感受差异",
          resources: [{ label: "Hugging Face Tokenizers 文档", url: "https://huggingface.co/docs/tokenizers/index" }]
        },
        {
          id: "p5-4",
          title: "从零训练一个小 GPT",
          detail: "跟着 Karpathy 的 nanoGPT / Zero to Hero，用一小段文本训练自己的字符级 GPT，看着它从乱码变成能说通顺的话。这是整个学习路线里最有冲击力的一步。",
          minutes: 600,
          tip: "模型小、文本少，CPU 也能跑；重点是把流程跑通",
          resources: [
            { label: "nanoGPT 仓库", url: "https://github.com/karpathy/nanoGPT" },
            { label: "Karpathy: Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html" }
          ]
        },
        {
          id: "p5-5",
          title: "LoRA 微调实践",
          detail: "理解全量微调、LoRA、指令微调的区别和成本差异，用一份自己的小数据集（比如几百条问答）微调一次并对比效果。",
          minutes: 540,
          tip: "先问清楚：这个任务用提示词能不能解决？不能，才值得微调",
          resources: [{ label: "Hugging Face PEFT", url: "https://huggingface.co/docs/peft/index" }]
        },
        {
          id: "p5-6",
          title: "在本机跑一个开源模型",
          detail: "用 Ollama 或 llama.cpp 在本机跑 7B 级模型，了解量化（Q4/Q8）对显存和效果的影响。你会立刻明白为什么 DeepSeek V4 Pro 这种远程模型更省心。",
          minutes: 300,
          tip: "对比同一个问题在本机模型和 DeepSeek V4 Pro 上的回答质量",
          resources: [{ label: "Ollama 官网", url: "https://ollama.com/" }]
        }
      ]
    },
    {
      id: "p6",
      title: "阶段 6 · LLM 应用开发",
      goal: "能做出真正有用的 LLM 应用，而不只是聊天窗口。",
      tasks: [
        {
          id: "p6-1",
          title: "第一次调用大模型 API",
          detail: "用 Python 调用 DeepSeek API 完成一次问答，理解 API key 怎么保管、token 怎么计费、超时和重试怎么处理。",
          minutes: 240,
          tip: "API key 只放在环境变量里，绝不写进代码或提交到 GitHub",
          resources: [{ label: "DeepSeek API 文档", url: "https://api-docs.deepseek.com/zh-cn/" }]
        },
        {
          id: "p6-2",
          title: "Prompt 工程：让输出稳定可用",
          detail: "系统提示词、few-shot 示例、要求输出 JSON、明确角色和约束。目标：同一个提示词连续跑 10 次，结果格式都一致。",
          minutes: 300,
          tip: "写完提示词后，用你的 agent 帮你挑毛病，再改一版对比",
          resources: [{ label: "Prompt Engineering Guide（中文）", url: "https://www.promptingguide.ai/zh" }]
        },
        {
          id: "p6-3",
          title: "流式输出与工具调用",
          detail: "流式输出让界面边生成边显示；函数调用让模型能查数据库、算数、发请求。这是从「聊天」走向「应用」的分水岭。",
          minutes: 360,
          tip: "先让它算一道它算不准的数学题，再给它一个计算器工具，对比差别",
          resources: []
        },
        {
          id: "p6-4",
          title: "做一套 RAG 问答（检索增强）",
          detail: "文档切分 → 生成 embedding → 存入向量库 → 检索相关片段 → 拼进提示词回答，并且标出答案出处。用你自己的笔记或资料当知识库。",
          minutes: 600,
          tip: "先搞清「检索不准」和「模型不听话」是两类问题，调法完全不同",
          resources: [
            { label: "LangChain 文档", url: "https://python.langchain.com/docs/introduction/" },
            { label: "LlamaIndex 文档", url: "https://docs.llamaindex.ai/" }
          ]
        },
        {
          id: "p6-5",
          title: "给应用搭一个评估集",
          detail: "准备 20 条有标准答案的测试问题，每次改完提示词或换模型就自动跑一遍打分。没有评估，优化全靠感觉。",
          minutes: 300,
          tip: "哪怕只有 20 条，也能挡住大部分「改了这里坏了那里」的问题",
          resources: []
        },
        {
          id: "p6-6",
          title: "从问答升级到 Agent",
          detail: "让模型自己决定调用哪些工具、分几步完成任务，并处理中间失败。这里正好对照你在用的 GPT / WorkBuddy / Trae，看它们是怎么做决策的。",
          minutes: 540,
          tip: "给你的 agent 写 3 个工具函数，让它完成一个需要两步以上推理的任务",
          resources: [{ label: "Model Context Protocol", url: "https://modelcontextprotocol.io/" }]
        }
      ]
    },
    {
      id: "p7",
      title: "阶段 7 · 项目实战与作品集",
      goal: "把学过的东西变成一个别人能点开看的东西。",
      tasks: [
        {
          id: "p7-1",
          title: "项目 A：个人知识库问答",
          detail: "把阶段 6 的 RAG 做成能长期用的工具：导入自己的文档、可以更新知识库、答案带出处。这是最能体现你学习成果的项目。",
          minutes: 900,
          tip: "先做一个只能问 10 个问题的糙版本，跑通再加功能",
          resources: []
        },
        {
          id: "p7-2",
          title: "项目 B：一个自动化小助手",
          detail: "选一件你每周都要重复做的事（整理文件、汇总信息、生成周报），做成一条自动化流程，用 agent 串起来。",
          minutes: 720,
          tip: "衡量标准很简单：这个工具你下周还会继续用吗？",
          resources: []
        },
        {
          id: "p7-3",
          title: "项目 C：把完整代码整理上 GitHub",
          detail: "建仓库、写 README（项目做什么、怎么跑起来、截图）、清理密钥和无关文件。能跑起来的代码才叫作品。",
          minutes: 300,
          tip: "README 里写清「我遇到什么问题、怎么解决的」，这是面试和展示的关键",
          resources: [{ label: "GitHub 新手文档", url: "https://docs.github.com/zh/get-started" }]
        },
        {
          id: "p7-4",
          title: "写 3 篇技术总结",
          detail: "每篇讲清一个你真正踩过的坑（比如：为什么我的 RAG 检索总是不准）。输出是最好的检验，也能让别人看到你。",
          minutes: 480,
          tip: "先让 DeepSeek 帮你列提纲，正文必须自己写",
          resources: []
        },
        {
          id: "p7-5",
          title: "复盘并更新自己的路线图",
          detail: "回看全部日志和笔记：哪部分学得最快、哪部分最痛苦、下三个月主攻什么。然后回来修改这份路线，把它变成你自己的版本。",
          minutes: 180,
          tip: "把结论写进设置页的档案里，或者新建一条日志记下来",
          resources: []
        }
      ]
    }
  ]
};
