/* Public facts checked on 2026-10-21. Stage plans and application examples are original study guidance. */
(function () {
  "use strict";
  window.RESEARCH_CONTENT = {
    checkedAt: "2026-10-21",
    supervisor: {
      name: "郭峰林",
      school: "武汉轻工大学",
      college: "数学与计算机学院",
      roles: ["教授", "博士", "硕士生导师", "广东省科技特派员（官网简介所列）"],
      directions: ["嵌入式地理信息系统", "数字图像处理", "智能控制"],
      summary: "以上身份与方向来自数计学院教师主页。公开论文还提供了图像配准、机器视觉目标检测的具体阅读线索。边坡监测、雨量桶是你提到的未来可能横向场景，可用来练习提问与读文献；目前不能据此认定它们就是导师已确定的纵向课题或你的正式选题。先按导师要求学好课程，再用阅读卡与小实验积累可讨论的问题。",
      projectStatus: "官网概括提到主持或参与国家自然科学基金、湖北省自然科学基金、湖北省教育厅及广东产学研等项目，但未逐项公开足以确认当前名称、负责人角色、起止时间的清单。本次无法确认截至核验日期的具体在研纵向项目；公开查不到不等于没有。论文标注某基金资助，也不能单独证明某位合作者是该项目负责人。",
      profileUrl: "https://sjxy.whpu.edu.cn/info/1134/3017.htm",
      papers: [
        {
          title: "基于改进YOLOv5s的水面垃圾检测方法",
          year: 2023,
          url: "https://whsp.cbpt.cnki.net/portal/journal/portal/client/paper/12b5ace2d6cd303d7efb7ceb400e2ae1",
          note: "杜艾卿、郭峰林、张正林、李雅琴；作者单位为武汉轻工大学数学与计算机学院。原页可核对摘要与元数据，全文可能需要机构访问。可从检测任务、轻量化改进、精度与速度如何比较开始读；公开成果不构成当前项目分工的证明。"
        },
        {
          title: "基于AOI的印刷电路图像对准算法研究",
          year: 2012,
          url: "https://www.engineering.org.cn/sscae/CN/PDF/1160098180509524398",
          note: "郭峰林、管庶安、孔岩；原刊为《中国工程科学》2012年第14卷第11期。适合练习理解图像对准、边缘特征和工程约束。这是历史研究线索；不能把网页迁移或更新时间当成论文发表年份。"
        }
      ],
      questions: [
        "我目前以课程和文献理解为主，您建议先精读哪两三篇论文？读完后希望我提交怎样的阅读材料？",
        "目前哪些纵向或横向任务适合研一参与？我可以先负责数据整理、设备测试、算法基线还是文献对比？",
        "如果用边坡监测或雨量桶作为练习，是否已有可使用的数据、设备说明、测量单位和评价要求？哪些资料不能公开？",
        "对于第一篇小论文，您更希望我先复查已有方法，还是从一个具体测量或数据问题开始？怎样的证据才足以继续？",
        "多久向您汇报一次比较合适？我准备一页进展、一个可核对结果和三个具体问题，这种方式是否方便？"
      ]
    },
    stages: [
      {
        id: "early",
        title: "前期 · 从读懂文献到提出可验证问题",
        goal: "交付一页问题说明、一组可核对阅读卡和最小实验设计，再与导师确认是否值得进入实验。阶段按产物推进，不要求几天内一定完成。",
        steps: [
          {
            id: "early-question",
            title: "把兴趣缩成一句可以检查的问题",
            how: "从课程或导师给的材料里选一个对象，写出输入是什么、要判断什么、怎样算完成。例如“在一份已获许可的雨量时序上，不同缺测处理会怎样影响指定误差指标”只是本站示例，须先确认是否有合适数据。把测量、预测、分类、预警分清；不知道的条件写待确认。",
            deliverable: "一张问题卡：研究对象、具体问题、已有条件、缺少条件、拟向导师确认的事项。"
          },
          {
            id: "early-search",
            title: "用两组检索词建立一个小文献集合",
            how: "为问题写中文词和对应英文词，记录检索日期、平台与关键词。先挑一篇基础方法、一篇直接应用和一篇评估或局限相关材料；从原页核对题名、作者、年份及版本，再沿参考文献补背景。每篇写一句纳入或暂缓原因，不把热门程度当成相关性。",
            deliverable: "检索日志与三至五篇候选表，包含稳定链接、版本、相关性及阅读优先级。"
          },
          {
            id: "early-reading",
            title: "精读关键文献，完成证据阅读卡",
            how: "先泛读判断相关性，再围绕流程图、实验条件和结果表精读。每篇填研究问题、方法、数据、指标、局限五栏，所有关键数字与结论标页码或章节。看不懂的公式先标出变量和作用，补一个必要背景后再读；AI 的解释须回原文核对。",
            deliverable: "两至三张完整阅读卡、一张方法流程图、一个带出处的术语表和未理解问题清单。"
          },
          {
            id: "early-compare",
            title: "比较条件，找出值得验证的缺口",
            how: "把几篇文章放入同一文献矩阵，比较任务、数据来源、采样或图像条件、划分方式、基线与指标。条件不一致的分数不能直接排名。将“作者已证明”“我根据证据推测”“原文未说明”分开记录，挑出一个可用现有条件检查的小问题。",
            deliverable: "一张对比矩阵与一段候选问题说明，指出证据、条件差异和目前不能下的结论。"
          },
          {
            id: "early-design",
            title: "先写最小实验方案，再请导师把关",
            how: "限定一份可用数据、一个简单基线、一个拟改变的因素和一至两个评价指标。事先写好数据划分、资源需求、失败时如何记录以及停止扩大实验的条件。资料不够时，可以交阅读与复查计划；不要为凑一篇论文临时编出创新点、数据或预计提升数值。",
            deliverable: "一页实验方案和导师反馈记录：问题、数据许可、对照、指标、资源、风险及下一步。"
          }
        ],
        gate: [
          "能够用自己的话解释至少两篇关键文献，并指出各自结论的原文位置。",
          "研究问题、可用数据和评价口径已经说清；不具备的条件已列明并向导师确认。",
          "有最小对照方案，知道它能回答什么、不能回答什么。文献整理不能直接冒充实验论文。"
        ]
      },
      {
        id: "middle",
        title: "中期 · 把数据、基线与实验做扎实",
        goal: "形成从原始数据到汇总结果可追溯的一条路径，保留失败样本与条件差异。先跑通，再检查，再扩大。",
        steps: [
          {
            id: "middle-data",
            title: "建立数据说明，先检查单位与质量",
            how: "记录来源、使用许可、时间范围、站点或设备、字段含义、单位、采样间隔、缺测和异常。原始数据只读保留，处理结果另存。时序按任务设计划分并检查未来信息泄漏；图像注意相同场景或同一对象的近重复样本，避免跨训练测试泄漏。",
            deliverable: "数据说明卡、字段字典、质量检查结果及固定的数据划分文件。"
          },
          {
            id: "middle-baseline",
            title: "先建立能解释的简单基线",
            how: "依据前期方案实现或运行一个简单、合适的对照，先用少量样本核对输入输出与指标计算。使用作者代码时记录具体提交与配置；改了数据或参数就说明差异。不要一开始同时换模型、改数据、换指标，否则无法解释结果来自哪处变化。",
            deliverable: "可重复运行的基线、环境说明、配置文件和一份原始输出样例。"
          },
          {
            id: "middle-experiment",
            title: "按实验表逐项改变因素",
            how: "给每次运行分配编号，记录数据版本、代码版本、配置、随机设置与耗时。保持对照条件一致，逐项验证自己提出的改变。需要重复运行时事先说明次数与汇总方式。没有执行的格子写待运行；报错、未收敛与不支持假设的结果都保留。",
            deliverable: "实验台账、原始结果目录与可由原始结果重新生成的汇总表。"
          },
          {
            id: "middle-error",
            title: "检查误差来自哪里，再讨论改进",
            how: "挑选典型成功与失败样本，按条件分组检查。例如时序可按不同缺测情况比较，图像可按光照、遮挡或目标大小检查；这些是本站排错建议，分组应服从实际任务。核对单位、标签、对齐与计算代码，再分析模型，避免把数据错误解释成算法发现。",
            deliverable: "带样本编号的误差分析表、关键可视化与需要追加验证的假设。"
          },
          {
            id: "middle-review",
            title: "用证据决定继续、收窄或暂停",
            how: "将现象与前期问题对应：基线是否可信，拟改变因素是否产生稳定影响，有没有其他解释。先向导师展示实际结果和失败，再讨论是否补实验或收窄问题。小样本跑通只能说明流程可执行；不能据此声称具备真实现场预警能力或普遍有效。",
            deliverable: "一页中期汇报：已完成、证据、局限、导师意见及下一轮任务。"
          }
        ],
        gate: [
          "原始数据、处理版本、代码与配置能相互对应，指标计算已核对。",
          "基线和拟比较方法使用可解释的相同条件；差异、失败和资源代价已记录。",
          "至少能解释典型失败案例；结论限定在实际验证范围内，尚未完成的实验没有被写成结果。"
        ]
      },
      {
        id: "late",
        title: "后期 · 把证据写清，反复复查后再投稿",
        goal: "交付可审阅的稿件、完整结果依据与运行说明。投稿和发表由导师协商及期刊评审决定，本板块不承诺录用。",
        steps: [
          {
            id: "late-outline",
            title: "先列论证骨架，再写完整段落",
            how: "把每条拟写结论对应到一张图表、一组实验或一条已核文献。先写方法与实际结果，再解释意义及局限，最后回写引言和摘要，防止摘要许诺实验没有完成的事情。具体标题与章节以目标期刊要求为准，不把一种论文结构当成所有刊物的硬性规定。",
            deliverable: "论文提纲与主张—证据对照表，明确每一节要回答的问题。"
          },
          {
            id: "late-citation",
            title: "逐条检查引用、图表和归属",
            how: "从自己实际阅读的原文核对作者、题名、年份、版本、页码及 DOI；工具生成引用后也要检查。直接引语、转述、借用方法、数据与图表各自标明来源。综述写清检索与比较过程，研究论文写清数据与实验；不能把别人的结果或 AI 编造内容写成自己的发现。",
            deliverable: "已核参考文献库、图表来源清单与未解决引用问题表。"
          },
          {
            id: "late-rerun",
            title: "从干净环境复跑核心流程",
            how: "按 README 从依赖与示例数据开始，重跑核心实验及制图步骤，检查稿件中的数字是否能追溯到输出。数据不宜公开时先确认权限，写清可提供的条件与限制；可用经过说明的示例展示流程，但不能拿示例替代正式证据。固定种子也不保证跨环境完全一致。",
            deliverable: "复跑记录、版本清单、运行命令、允许分享的代码或示例及差异说明。"
          },
          {
            id: "late-feedback",
            title: "把导师反馈变成逐项修改单",
            how: "提交稿件时附一页说明：研究问题、主要证据、尚存局限，以及最希望导师帮助判断的三点。收到意见后逐条记录原意见、修改位置、补充证据和处理状态。需要补实验的地方回到中期；不理解的意见先确认含义，不只做表面润色。",
            deliverable: "带版本号的稿件与意见—回应—修改位置对照表。"
          },
          {
            id: "late-submit",
            title: "确认匹配与费用，再按规范提交",
            how: "与导师共同检查期刊范围、稿件类型、原创性要求、作者贡献、署名、数据声明及实际费用安排。按正式投稿页面核对要求，保留提交版本和回执。审稿后依据意见回应或补证据；拒稿时分析匹配和证据问题再调整，不用保证录用的宣传代替正常评审。",
            deliverable: "投稿前核对清单、导师确认记录、最终稿与提交或审稿追踪表。"
          }
        ],
        gate: [
          "每个主要结论都有可定位证据，摘要、正文、图表与实际结果一致。",
          "引用、数据来源、署名与分享权限已核对；局限没有被隐藏或夸大为普遍结论。",
          "导师已审阅拟投稿版本，期刊匹配、要求及费用安排清楚。满足本阶段清单不等于保证发表。"
        ]
      }
    ],
    methods: [
      {
        id: "three-pass",
        title: "三遍阅读 · 按相关性逐步加深",
        purpose: "来源方法：Keshav 将阅读区分为快速了解、理解内容和深入重建等层次。本站建议：不必把每篇都读到最深，用产物决定何时继续。",
        steps: [
          "第一遍看题目、摘要、结构和结论，写一句研究问题及是否继续的理由；不急于逐句翻译。",
          "第二遍看流程与图表，补齐数据、指标、对照和限制；把关键结论定位到原文。",
          "第三遍尝试不看正文重画方法，手算或实现最小例子，再回原文找缺口。",
          "本站应用例：读导师的 AOI 历史论文，先说清为什么需要对准，再解释边缘点如何参与评价，最后设计一个小范围核对任务。不能把本文预计阅读时间当作精读原论文的固定时限。"
        ],
        output: "一段概括、一张流程图、一份带原文位置的疑问清单；精读时再附最小重建例子。",
        source: { title: "S. Keshav · How to Read a Paper（高校课程公开副本）", url: "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf" }
      },
      {
        id: "synthesis-matrix",
        title: "文献综合矩阵 · 横向比较条件与主题",
        purpose: "来源方法：JHU 图书馆建议通过主题或变量组织文献，观察来源之间的联系。本站的五项证据列是用于电子信息初学者的应用模板，不是来源强制规定。",
        steps: [
          "每行放一篇论文，每列放研究问题、方法、数据、指标、局限，并在单元格附页码或章节。",
          "先填写原文确实写出的信息；未公开就写未说明，个人推断另加标记。",
          "按同一个问题比较多行，找一致、矛盾与条件差异，再决定是否需要补读。",
          "本站应用例：比较两篇降雨或位移时序文章时，先看站点、单位、采样和数据划分是否一致；不直接把不同数据集上的误差值排成优劣榜。"
        ],
        output: "可筛选的文献矩阵，以及按主题组织的一段比较结论；文献少时称阅读比较，不冒充系统综述。",
        source: { title: "Johns Hopkins University Libraries · Synthesize", url: "https://guides.library.jhu.edu/lit-review/synthesize" }
      },
      {
        id: "critical-evidence",
        title: "批判性阅读 · 追问结论怎样得到",
        purpose: "来源原则：Monash 强调理解作者主张、证据、假设及解释的局限。批判阅读是依据标准作判断；本站将这些问题整理成适合科研起步的核对顺序。",
        steps: [
          "先准确转述作者主张，再列出支撑主张的图表、数据或推导，不先急着赞同或反对。",
          "检查比较是否公平、证据是否足够、是否存在其他解释；区分原文限制和自己的猜测。",
          "问结论适用于哪些对象和条件。原文未测的场景标记待验证，不自行扩大范围。",
          "本站应用例：文章报告检测精度改善时，查数据划分、对照配置及运行设备；不能直接推成所有现场都更准确、更快。"
        ],
        output: "一张主张—证据—条件—局限表，附两个可以继续向导师讨论的问题。",
        source: { title: "Monash University · Read critically", url: "https://www.monash.edu/student-academic-success/study-effectively/develop-strategies-for-reading-and-note-making/read-critically" }
      },
      {
        id: "zotero-annotations",
        title: "Zotero 注释笔记 · 保留回到原文的路径",
        purpose: "来源功能：Zotero 可将 PDF 注释加入笔记并保留页位置链接与引用。本站建议在摘录旁写自己的解释与下一步，不把高亮数量当作理解程度。",
        steps: [
          "从论文原页建立条目并核对元数据，将实际阅读 PDF 附到对应条目。",
          "选少量关键证据做注释，写清它支持什么问题，再把相关注释加入笔记。",
          "将摘录与个人理解分开，保留来源页位置；用自己的例子解释一次，并检查是否改动了原文条件。",
          "本站应用例：雨量计文章的单位、采样条件与误差定义分别注释，再写一句“我如何检查自己数据是否可比较”。本站学习笔记不会自动与 Zotero 互传。"
        ],
        output: "带来源位置的文献子笔记与一张跨论文问题卡，之后可以回原文复查。",
        source: { title: "Zotero · PDF Reader and Note Editor", url: "https://www.zotero.org/support/pdf_reader" }
      },
      {
        id: "paper-structure",
        title: "按论文结构追踪论证 · 每节回答一个问题",
        purpose: "来源原则：IEEE 作者中心说明典型期刊文章的组织及各部分作用。本站将它改成读写对照练习；具体稿件结构须服从目标期刊和文章类型。",
        steps: [
          "读引言时找问题与已有工作之间的关系；读方法时画出实际操作，不只记模型名称。",
          "把结果中的图表与讨论中的解释一一对应，辨认哪些结论超出了实际证据。",
          "自己写作时先按每节一个核心问题列提纲，再把已有证据放进去；尚缺证据的论断标待补。",
          "本站应用例：方法写数据如何处理，结果写实际观察，讨论解释可能原因与限制。摘要最后核对，不预写未完成实验的提升数字。"
        ],
        output: "章节—问题—证据提纲，以及需要补实验或补引用的位置清单。",
        source: { title: "IEEE Author Center · Structure Your Article", url: "https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/create-the-text-of-your-article/structure-your-article/" }
      },
      {
        id: "reproducible-record",
        title: "可复查实验记录 · 让另一人能够核对流程",
        purpose: "来源原则：IEEE 鼓励详细描述方法并按条件分享数据、代码等研究产物以支持复现。本站的运行台账是应用建议，分享范围必须先确认数据许可与课题约定。",
        steps: [
          "记录数据版本与划分、代码提交、依赖、模型配置、设备及随机设置，给运行结果分配编号。",
          "保留原始输出与失败日志，用明确脚本生成图表，避免手工挑选最好结果。",
          "按运行说明从最小输入复跑，核对图表和稿件数字；环境不一致引起的差异如实记录。",
          "本站应用例：监测数据不能公开时先与导师确认可共享内容，提供不含敏感信息的示例说明流程。示例或合成数据不替代真实研究证据。"
        ],
        output: "运行说明、配置与结果台账、复跑记录、可分享内容及限制说明。",
        source: { title: "IEEE Author Center · Research Reproducibility", url: "https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/research-reproducibility/" }
      }
    ],
    sources: [
      { title: "武汉轻工大学数计学院 · 郭峰林", url: "https://sjxy.whpu.edu.cn/info/1134/3017.htm", note: "导师身份与公开方向的主要依据；简介未给出可确认当前在研情况的逐项清单。" },
      { title: "2023 · 基于改进YOLOv5s的水面垃圾检测方法", url: "https://whsp.cbpt.cnki.net/portal/journal/portal/client/paper/12b5ace2d6cd303d7efb7ceb400e2ae1", note: "原页可看摘要与元数据，全文可能需机构访问。作者与数计学院单位明确，不据基金标注推断负责人。" },
      { title: "2012 · 基于AOI的印刷电路图像对准算法研究", url: "https://www.engineering.org.cn/sscae/CN/PDF/1160098180509524398", note: "原刊 PDF 供核对年份和方法；属于历史成果，不能据网站更新时间称为近期项目。" },
      { title: "S. Keshav · How to Read a Paper", url: "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf", note: "三遍阅读原文的高校课程公开副本。" },
      { title: "JHU Libraries · Synthesize", url: "https://guides.library.jhu.edu/lit-review/synthesize", note: "大学图书馆关于主题综合与文献矩阵的方法说明。" },
      { title: "Monash University · Read critically", url: "https://www.monash.edu/student-academic-success/study-effectively/develop-strategies-for-reading-and-note-making/read-critically", note: "大学学习支持资料，围绕主张、证据、假设与解释提出审读问题。" },
      { title: "Zotero · PDF Reader and Note Editor", url: "https://www.zotero.org/support/pdf_reader", note: "官方注释、笔记与回到原文位置的功能说明。" },
      { title: "IEEE Author Center · Structure Your Article", url: "https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/create-the-text-of-your-article/structure-your-article/", note: "典型 IEEE 期刊文章的结构原则；具体要求以目标刊物为准。" },
      { title: "IEEE Author Center · Research Reproducibility", url: "https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/research-reproducibility/", note: "研究方法、数据与代码等产物如何支持结果复查。" },
      { title: "IEEE Author Center · Ethical Requirements", url: "https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/ethical-requirements/", note: "引用、原创性及准确报告数据的正式要求；不得编造或歪曲结果。" },
      { title: "arXiv · Search for articles", url: "https://info.arxiv.org/help/find.html", note: "关键词与标识符检索的官方帮助，便于回到原始论文页面核验。" },
      { title: "PLOS · Ten simple rules for reading a scientific paper", url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1008032", note: "开放获取的研究者原文，可延伸阅读目的导向、主动提问与阅读习惯。" }
    ]
  };
}());
