/* 原创四级学习指南。教学要点参考公开的一手资料；例句和练习为本站原创，非真题。 */
(function () {
  "use strict";
  const articles = [
    {
      id: "cet4-guide-grammar", subject: "cet4", title: "常用语法：先把句子写完整，再写准确", summary: "从主谓、时态、冠词和连接词入手，建立听读写译都能复用的检查顺序。", level: "beginner", minutes: 20, tags: ["语法", "时态", "冠词", "改错"],
      sections: [
        { heading: "一、先找到句子的发动机", body: ["看到一个句子，先问“谁做什么”或“什么是什么”。主语通常由名词、代词或相当于名词的结构承担；谓语需要体现时态。不要把看到的每一个动词形式都当成独立谓语，例如 to study、studying 在很多位置只是句子的组成部分。写句子时，先保证有完整的主谓骨架，再加时间、地点和原因。", "常见错误是只写名词加形容词，例如 The plan useful. 缺少系动词；应写 The plan is useful. 另一个问题是主谓间隔太远后忘了单复数。The list of useful websites is on my phone. 中主语核心是 list，不是 websites，所以用 is。"], code: "The plan is useful.\nThe list of useful websites is on my phone." },
        { heading: "二、时态表达的是时间关系", body: ["一般现在时常用来谈习惯、规律和当前状态；一般过去时把事情放在已经结束的过去时间里。现在完成时由 have / has 加过去分词构成，常把过去的动作、经历或状态与现在联系起来。判断时不要只背一个中文词，而要看整句在交代昨天的事实，还是在说明到现在的积累。", "比较 I finished the exercise yesterday. 与 I have finished three exercises this week. 前者指定已经结束的昨天，后者从当前这周回看已完成的数量。不要机械写成 I have finished it yesterday. 练习时把时间线画出来，再决定动词形式。"], code: "I finished the exercise yesterday.\nI have finished three exercises this week." },
        { heading: "三、名词前面也要检查", body: ["单数可数名词在普通表达中通常需要限定词，例如 a、the、my 或 this。a / an 的选择依据后面紧接的发音，而不只是字母：an hour 和 a useful tool 的差异就来自首音。the 常用于上下文已经能确定的对象；泛指复数或不可数概念时则常不用冠词。遇到不确定的用法，去词典查整个短语。", "另外留意 information、advice 等常见不可数名词，不要写 an advice。可以表达为 a piece of advice。给名词加形容词不会改变它的可数性，错误也不会因为句子变长而消失。"], bullets: ["先检查名词是否可数，再看单复数。", "再判断是首次泛指，还是双方能确定的特指。"] },
        { heading: "四、连接关系要写清楚", body: ["because 引导原因，although 引导让步；连接两个完整意思时，确认它们的逻辑关系。中文习惯中的“因为……所以……”不宜逐词变成 because 和 so 同时套在同一组从句上。可以写 Because the room was noisy, we moved outside.，也可以拆成两个句子。复习时每天只选两句自己的表达，按主谓、时态、名词、连接四步改一遍，效果比只抄规则更容易观察。"], code: "Because the room was noisy, we moved outside.\nAlthough the task was difficult, we finished it on time." }
      ],
      exercise: { task: "改正下面三句，并说明理由：① The students in our group studies every evening. ② I have visited the library yesterday. ③ She gave me an useful suggestion.", answer: "① studies 改为 study，主语 students 为复数。② 可改为 I visited the library yesterday.，明确的已结束过去时间通常用一般过去时。③ an 改为 a，useful 的起始发音为辅音 /j/。这些是原创改错练习；实际语境仍可能影响时态与冠词选择。" },
      resources: [
        { title: "British Council：现在完成时", url: "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect", kind: "练习", language: "英文", note: "免费语法说明与互动练习，重点理解过去与现在的联系。" },
        { title: "Cambridge：a / an 与 the", url: "https://dictionary.cambridge.org/grammar/british-grammar/the", kind: "文档", language: "英文", note: "查冠词含义、可数名词与常见错误；不用记本站例句的固定答案来代替语境判断。" }
      ]
    },
    {
      id: "cet4-guide-sentences", subject: "cet4", title: "长难句拆解：先找主干，再把信息装回去", summary: "用主句、修饰语和逻辑关系三个层次，读懂让人容易迷路的英文句子。", level: "intermediate", minutes: 20, tags: ["长难句", "从句", "阅读", "翻译"],
      sections: [
        { heading: "一、句子长，不等于主干复杂", body: ["长句经常只是给一个简单主干加了多层说明。第一遍先圈出可能的谓语，再判断哪些属于从句。把介词短语、插入说明和明显的修饰语暂时放进括号，剩下的部分通常更容易看清。这个动作只是临时分层，不是把细节永久删掉；题目若问时间、对象或限制条件，那些信息仍然重要。", "例如 The students who joined the workshop shared their notes after class. 先读 The students shared their notes，再把 who joined the workshop 放回 students 后面，确定说的是参加工作坊的那一组学生。这样比从左到右逐词译成中文更不容易漏掉真正的动作。"], code: "The students [who joined the workshop] shared their notes [after class].\n主干：The students shared their notes." },
        { heading: "二、识别从句在回答什么", body: ["定语从句为前面的名词提供信息。指人常见 who，指物常见 which；that 在不少限定性定语从句中也能使用。关键不是一看到 that 就宣布答案，而是检查它前面的词、它在从句里担当的成分，以及整个从句修饰的对象。that 还可能引导宾语从句等其他结构。", "对比 I know that the room is quiet. 和 The room that we booked is quiet.。第一句 that 后面的内容是 know 的宾语；第二句 that we booked 帮助确定是哪间房。第二句从句里已有 we 作主语，that 对应 booked 的宾语，在这种限定性结构中常可省略；担当从句主语时通常不能照搬这个省略方法。"], code: "I know [that the room is quiet].\nThe room [that we booked] is quiet." },
        { heading: "三、留住转折、原因与限定", body: ["读出主干以后，第二遍专门找 although、because、while、however 等信号。它们往往说明两个意思的关系。Although the service is free, some students rarely use it. 表达的是“虽然免费，却少用”，不能只记住 free 就推出人人都经常使用。注意 some、most、may、only 等范围和语气词，它们看起来短，却会改变结论。", "遇到 it、they、this change 等指代词，应回到前文找可能的对象，再检查单复数与意思是否吻合。不要总默认它指最近的那个名词；有时 this 指的是前面整件事。把“谁、做了什么、对谁、在何种条件下”写成一行，往往就能检查理解是否完整。"], bullets: ["主干：核心人物或事物，以及动作或状态。", "修饰：范围、时间、地点、对象和补充解释。", "关系：因果、转折、让步、并列或条件。"] },
        { heading: "四、用复述检查，而不只看译文", body: ["练习时先不看参考解释，自己用简单英文或一两句中文复述。然后对照原文，检查是否把推测说成事实、把部分说成全部、把结果误当原因。每天拆两句比一次抄十句更容易发现规律。记录时保留原句、主干、卡点和正确理解，下次复习只看卡点是否还会阻碍阅读，不必把每个修饰语都背下来。"], code: "Although the service is free, some students rarely use it.\n复述：免费并未让所有学生经常使用这项服务。" }
      ],
      exercise: { task: "拆解原创句子：The books that the volunteers collected last month are now available to students who live far from the library. 写出主干，指出两个定语从句各修饰什么，并用中文复述。", answer: "主干：The books are now available to students.；that the volunteers collected last month 修饰 books，说明这些书由志愿者上个月收集；who live far from the library 修饰 students，说明服务对象住得离图书馆较远。可复述为：志愿者上个月收集的那些书，现在可供住得离图书馆较远的学生使用。不要把 last month 错当成 are available 的时间。" },
      resources: [
        { title: "British Council：限定性定语从句", url: "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/relative-clauses-defining-relative-clauses", kind: "练习", language: "英文", note: "免费讲解关系词、从句用途与可省略情况，并有两轮练习。" },
        { title: "British Council：B1 阅读", url: "https://learnenglish.britishcouncil.org/free-resources/reading/b1", kind: "练习", language: "英文", note: "从分级材料中选两句练拆解，再回到整段理解。" }
      ]
    },
    {
      id: "cet4-guide-listening", subject: "cet4", title: "听力精听：把“没听懂”变成可修复的问题", summary: "用短材料完成盲听、核对、跟读和再听，记录词汇、声音与信息处理三类卡点。", level: "beginner", minutes: 15, tags: ["听力", "精听", "跟读", "复盘"],
      sections: [
        { heading: "一、先选能完成的小材料", body: ["精听不需要从很长的节目开始。可以选一段一到三分钟、带可靠文本的材料；若一开始几乎每句话都陌生，就降低难度。British Council 的分级听力有音频、准备活动与理解任务，可以根据自己的实际表现选材料。它的等级与四级分数并不是直接换算关系，不必把某一个等级当成过线承诺。", "第一次不看文本，只回答三个问题：谁在说、发生在什么场景、主要在解决什么问题。听到细节先记短词或符号，不要求完整抄句。若第一次只听出大意也很正常，目标是为下一轮建立框架，而不是当场记住全部信息。"], bullets: ["材料控制在能重复听完的长度。", "先抓人物、场景、目的，再补数字和条件。"] },
        { heading: "二、给卡点分类，才知道练什么", body: ["第二遍挑最影响理解的两三处，暂停写下你以为听到的词，再对照文本。第一类是词本来就不认识：查词义与发音，并联系整句。第二类是词认识但声音没认出：注意重音、弱读、连读和词尾。第三类是单词听清了，信息关系没跟上：重点找转折、因果、改口和代词指向。", "例如原创句子 I wanted to take the bus, but the last one had already left. 如果只记住 bus，很可能误判实际交通方式。but 后面的信息推翻了原计划；这句话也没有告诉我们后来一定坐了出租车。听力复盘要区分录音确实说了什么，以及自己补出了什么。"], code: "I wanted to take the bus, but the last one had already left.\n已知：想坐公交；末班车已走。\n未知：后来具体怎样出行。" },
        { heading: "三、跟读要服务于辨音", body: ["核对之后，选一两句模仿重音和停顿。先听原音，再跟读；必要时短暂降速，但最后回到正常速度检查。目的不是追求口音完全一样，而是让耳朵知道某个熟词在句子里可能怎样出现。遇到数字、时间和地点，把它们写成简短表格，留心说话者是否更正了早先的信息。", "合上文本再听一遍，尝试用一句话复述内容。若能解释自己这次多听出来了什么，这一轮练习就有了可观察的结果。不要把看着文本觉得懂了，直接当成已经能独立听懂。"], bullets: ["先原速盲听，再按卡点短暂停顿。", "跟读一两句后，合上文本回到原速。"] },
        { heading: "四、把复盘接到下一次练习", body: ["保存记录时写材料标题、实际分钟和一个明确卡点，例如“没识别出时间改口”“听到了词但没注意否定”。下次先复听上次最难的一句，再换新材料，避免每天都只打开新内容。四级正式听力包含新闻、长对话和篇章，训练中可以逐步覆盖不同形式，但不必把任意英语音频称为四级真题。答题时仍以录音与题目提供的证据为准。"], code: "材料：某段学生访谈\n卡点：把 but 后的更正漏掉了\n下次行动：复听更正句，再练一段带时间安排的对话" }
      ],
      exercise: { task: "先读下面原创脚本，再不看脚本请同伴朗读或使用浏览器朗读练习：The talk was planned for Tuesday, but the speaker is busy that day, so it will be held on Thursday afternoon. 问：原计划哪天？最终哪天？为什么变更？这只是文字转语音练习，不是真实听力考试。", answer: "原计划 Tuesday；最终 Thursday afternoon；原因是说话者所提到的演讲者周二没有时间。转折词 but 和结果词 so 连接了变更原因与最终安排。只记录第一个日期会答错；也不能从这段话推断具体钟点。" },
      resources: [
        { title: "British Council：B1 听力", url: "https://learnenglish.britishcouncil.org/free-resources/listening/b1", kind: "练习", language: "英文", note: "免费分级音频、准备任务与理解练习，适合短时精听。" },
        { title: "Cambridge Dictionary 发音入口", url: "https://dictionary.cambridge.org/pronunciation/", kind: "工具", language: "英文", note: "核对单词发音，再回原音频观察它在句子里的实际读法。" },
        { title: "CET 官方笔试结构", url: "https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm", kind: "文档", language: "中文", note: "核对四级听力题型与时间，具体考试安排以学校及官方通知为准。" }
      ]
    },
    {
      id: "cet4-guide-reading", subject: "cet4", title: "阅读定位：找到证据，再比较选项", summary: "把题干转成检索线索，识别同义改写、范围限制与常见的无依据推断。", level: "intermediate", minutes: 20, tags: ["阅读", "定位", "同义替换", "错题"],
      sections: [
        { heading: "一、先判断要找哪一种信息", body: ["做细节题时，先看题干在问人物、原因、结果、态度还是某个变化。圈出专有名词、数字、时间和比较关系等线索，再回文中寻找对应段落。定位不是只找完全相同的词；文章可能写 spend less，题目却用 reduce costs。看到一个关键词也不能立即停下，应读完整句与必要的前后文。", "主旨题与细节题的路径不同。主旨需要结合各段作用和作者反复讨论的问题；不能因为某段举了图书馆的例子，就把全文都概括成图书馆管理。先用一行中文写“这段主要做什么”，可以帮助自己看清介绍问题、举例、解释原因或提出建议的顺序。"], bullets: ["细节：谁、何时、为什么、怎样变化。", "主旨：全文围绕什么问题，作者最终想说明什么。"] },
        { heading: "二、把原文证据与选项对齐", body: ["找到证据后，把题干和选项里的关键含义对应回原文。正确的同义改写应保留人物、动作、对象、范围和语气，不能只是共享几个单词。例如原文说 Some students preferred the quieter room.，可以推出“部分学生更喜欢较安静的房间”，不能推出“所有学生只愿意在那里学习”。", "常见干扰包括把 some 换成 all，把 may 换成 must，把先后顺序写成因果，把作者转述的他人观点当作作者态度。绝对词不一定必错，但需要足够强的原文证据。排除选项时写清哪一个词越界，比只记 A、B、C、D 更能帮助下次做题。"], code: "原文：Some students preferred the quieter room.\n可支持：A group of students liked the quieter room better.\n不可直接支持：Every student refused to study elsewhere." },
        { heading: "三、按题型分配阅读动作", body: ["四级阅读有选词填空、长篇匹配和仔细阅读，不能对每种题都使用完全相同的方法。选词填空先看空格需要的词性与语法结构，再判断词义和搭配；长篇匹配要记录段落主题与题干信息的对应；仔细阅读则更强调完整理解局部证据和选项差异。遇到生词时先判断它是否阻碍当前问题，不必每次都中断查词。", "练习限时时记录自己在哪里花了过多时间，再按具体原因调整。本站小阅读主要练主旨、细节和推断边界，不代替完整真题训练，也不根据这几道题预测正式成绩。"], bullets: ["选词填空：结构和搭配一起看。", "长篇匹配：主题、事实与同义表达一起定位。", "仔细阅读：证据句、上下文与选项限制一起比较。"] },
        { heading: "四、用一张错因卡完成复盘", body: ["一道错题至少保留三样东西：你原来选择的理由、正确证据所在的位置、两者的关键差异。若是句子没读懂，回到长难句拆解；若是同义词不熟，把短语加入词汇记录；若是越界推断，下次专门圈范围和语气。第二天先遮住答案重做，再说一遍证据。能解释为什么另外几个选项不合适，才比只认得正确答案更接近真正理解。"], code: "错因：把部分学生理解成所有学生\n证据：Some students...\n下次动作：比较选项时圈范围词，并回原文核对" }
      ],
      exercise: { task: "阅读原创文本：A small survey found that 18 of 30 students used the new study room at least once. Several said they liked the quiet space, but the survey did not ask whether their grades improved. 判断：①多数受访学生至少用过一次；②使用者的成绩都提高了；③部分学生喜欢安静空间。哪些有证据？", answer: "①有证据，18/30 超过一半，但范围仅限这次受访者，不能直接代表全校。②没有证据，文本明确说没有询问成绩是否提高。③有证据，Several said... 支持部分学生表达了这种偏好。注意“没调查”不等于“成绩没有提高”，也不等于“成绩一定提高”。" },
      resources: [
        { title: "British Council：B1 阅读练习", url: "https://learnenglish.britishcouncil.org/free-resources/reading/b1", kind: "练习", language: "英文", note: "免费短文与理解任务，适合练定位、复述和证据核对。" },
        { title: "CET 官方阅读题型说明", url: "https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm", kind: "文档", language: "中文", note: "核对选词填空、长篇阅读与仔细阅读在四级中的构成。" }
      ]
    },
    {
      id: "cet4-guide-writing", subject: "cet4", title: "写作展开与检查：让观点后面真的有内容", summary: "从审题、段落展开到四轮检查，写出有具体例子而非只堆连接词的英文短文。", level: "intermediate", minutes: 25, tags: ["写作", "段落", "举例", "自查"],
      sections: [
        { heading: "一、先回答题目真正要求的事", body: ["动笔前先写下对象、目的与必须覆盖的内容。题目若要求提出一个改善校园生活的建议，就应说明问题、提出可执行的做法并解释好处；仅泛泛讨论校园很重要，会偏离任务。书信、建议、议论或描述各有不同的交流目的，不能把背过的整篇开头无条件放进去。本站写作题是原创练习，正式考试应以当次题目指令为准。", "列提纲时每段只写一句核心意思，再补一条证据或例子。可先用中文确定内容，但写英文时优先选择熟悉的句式，不必先写一段复杂中文再逐字翻译。给检查留出时间，是写作安排的一部分。"], bullets: ["对象：我在对谁说？", "目的：解释、建议、比较还是表达观点？", "覆盖：题目列出的要求是否逐项回应？"] },
        { heading: "二、用原因和例子让段落站稳", body: ["一个实用的展开顺序是“观点—原因—具体例子—回到观点”。例如观点是固定短复习有帮助，原因可以是它让学习任务更容易开始，例子则写自己如何每天晚饭后用十分钟复习。例子不必宏大，但人物、动作与结果应具体。不要编造研究数据来让文章显得权威，自己的合理经历或明确的假设例子就可以承担说明作用。", "原创段落可以从 A short daily review makes a large task feel manageable. 开始，接着解释原因。然后用 For example 引出一次实际做法，最后说明这个例子怎样支持中心意思。连接词的作用是显示已有的关系，不能替代内容本身。"], code: "A short daily review makes a large task feel manageable.\nFor example, I review five words after dinner instead of waiting for a free weekend.\nThis routine helps me begin even on a busy day." },
        { heading: "三、清楚表达比盲目换高级词更可靠", body: ["修改时先看一个句子是否只有一个清楚的中心。若长句里堆了好几层 because、which、although，可以拆成两句，再检查关系。选词不只是避免重复，还要看搭配和词性；不确定的表达去词典核实。比如 discuss the problem 后面通常不额外加 about；suggest a change 与 advise someone to do something 的结构不同，不能把动词随意互换。", "词汇量有限时，用准确的普通词也能说明观点。反复出现主题关键词有时是必要的，不必为了“多样”把意思改掉。写完先朗读一遍，能帮助发现缺词、句子未结束和主语突然变化等问题。"], code: "较清楚：We discussed the problem and suggested a small change.\n需改正：We discussed about the problem." },
        { heading: "四、按四轮检查，不在一处反复打磨", body: ["第一轮检查任务：有没有回应问题、遗漏要求或明显跑题。第二轮检查段落：每段中心是否清楚，例子是否真正支持它。第三轮检查句子：主谓一致、时态、单复数、冠词、拼写与标点。第四轮看表达是否重复、连接是否自然、字数是否符合当前任务。本站字数工具只统计文本，不等于评分；保存草稿后留下一个本次最该改进的问题，下篇优先修复它。"], bullets: ["任务完整。", "观点有展开。", "基本语言准确。", "表达、篇幅与格式符合要求。"] }
      ],
      exercise: { task: "为观点 Daily reading is useful. 补写一个原因和一个具体例子，再改正：My friend suggest me to read ten minute every day. 尝试保留原意而不套用整段模板。", answer: "一种展开：Daily reading is useful because it brings learners into contact with words in context. For example, I noticed how the word available was used in a short campus notice. 改错可写：My friend advises me to read for ten minutes every day. 或 My friend suggests reading for ten minutes every day.；注意第三人称、动词结构、for 表持续时间，以及 minutes 的复数。答案不唯一，关键是原因与例子支持观点。" },
      resources: [
        { title: "British Council：B1 写作", url: "https://learnenglish.britishcouncil.org/free-resources/writing/b1", kind: "练习", language: "英文", note: "免费范文、写作提示与任务；观察结构后写自己的内容，不照抄范文。" },
        { title: "Cambridge Dictionary", url: "https://dictionary.cambridge.org/", kind: "工具", language: "英文", note: "查词性、结构和搭配，确认表达是否适合上下文。" },
        { title: "CET 官方笔试说明", url: "https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm", kind: "文档", language: "中文", note: "核对四级写作板块时长；实际写作要求以当次题目为准。" }
      ]
    },
    {
      id: "cet4-guide-translation", subject: "cet4", title: "翻译训练：先保留信息，再组织自然英文", summary: "把中文段落拆成信息单元，补齐主语与时态，用熟悉表达写完整并检查遗漏。", level: "beginner", minutes: 20, tags: ["翻译", "汉译英", "信息拆分", "检查"],
      sections: [
        { heading: "一、先列信息，不急着逐词搬运", body: ["汉译英的第一步不是给每个汉字找英文，而是确认谁、做什么、何时何地、为什么以及有什么结果。把一段中文划成几个信息单元，再决定哪些适合合句、哪些需要拆句。中文里省略的主语，英文中常需要补出来；连续出现几个动作时，也要确定它们共享主语还是各有执行者。", "例如“为了方便居民借书，社区延长了阅读室的开放时间。”可以先列为目的：方便居民借书；行动者：社区；行动：延长开放时间。译成英文时先写清主句，再添加目的。这样比按中文顺序堆很多词，更容易检查信息有没有缺失。"], code: "The community extended the reading room's opening hours to make it easier for residents to borrow books." },
        { heading: "二、用句法处理关系，而不复制中文顺序", body: ["确定主句后，再处理原因、让步、目的和定语。翻译“近年来”之类时间信息时，时态仍要看具体的时间关系。描述一般习惯或客观现状，可以用一般现在时；叙述明确结束的过去事件，则通常用一般过去时。连词应与实际含义对应，不能为了长句而随意添加因果。", "遇到“有很多人参加”这类表达，可直接让 people 作主语；遇到无法确定执行者的句子，才考虑是否适合被动语态。简单、完整、信息准确的句子，比结构复杂却主语混乱的句子更可靠。"], code: "Many residents take part in the activity.\nThe activity is held in the community center every Saturday." },
        { heading: "三、不会的词，先换一种准确说法", body: ["翻译中遇到陌生文化词或抽象表达，先判断题目真正需要传达的概念，再用熟悉词汇解释。不要把中文词拆成字面英文而不检查含义。练习阶段可以查词典，看英文释义、词性和常见结构，再决定候选词是否适合。", "同一个中文词在不同场景可能需要不同译法，例如“参加讨论”与“参加考试”的动词结构就未必一样。为常见话题建立短语小本时，把搭配连同原创例句一起记录，比分散抄一列中英对应更容易迁移到新段落。"], bullets: ["先确认概念，再查候选表达。", "记录词性、搭配和一个自己的句子。", "允许多种合理译法，不把参考译文当成唯一顺序。"] },
        { heading: "四、用对照表检查三种损失", body: ["完成后逐项对照中文，检查信息遗漏、意义改变和语言错误。遗漏包括时间、程度、对象与转折；意义改变包括把“可以”译成“必须”，把“越来越多”写成“所有”；语言错误则包括主谓、时态、单复数和冠词。先修会改变意思的问题，再处理表达流畅度。本站参考译文提供一种可行写法，不进行自动评分，也不把原创练习当作官方真题。", "复盘时保留自己的第一稿，再写一版修改稿，并用一句话说明修改原因。第二天重新翻译同一信息，看自己能否独立补出主语、保持逻辑和正确搭配。"], code: "检查表：\n□ 时间、人物、动作与对象齐全\n□ 程度、否定和逻辑关系没有改变\n□ 主谓、时态、单复数和冠词正确\n□ 译文读起来是完整句子" }
      ],
      exercise: { task: "翻译原创短段：为了帮助新生了解校园，志愿者每周组织一次步行活动。参加者不仅能熟悉图书馆和教学楼，还能认识来自不同专业的同学。先列信息单元，再写英文并检查 not only ... but also ... 两边结构。", answer: "一种参考表达：To help new students get to know the campus, volunteers organize a walking activity once a week. Participants can not only become familiar with the library and teaching buildings but also meet students from different majors. 信息包括目的、执行者、频率和两项益处；并列部分都是动词短语。也可拆成三个完整句子，或用 first-year students 等合适表达；不要漏掉 once a week，也不要把“不同专业”误作“不同学校”。" },
      resources: [
        { title: "CET 官方考试大纲目录", url: "https://cet.neea.edu.cn/html1/folder/16113/1588-1.htm", kind: "文档", language: "中文", note: "免费查看英语四、六级大纲入口，了解翻译考核要求。" },
        { title: "Cambridge：冠词与名词", url: "https://dictionary.cambridge.org/grammar/british-grammar/the", kind: "文档", language: "英文", note: "检查译文中的名词限定与常见冠词错误。" },
        { title: "British Council：B1 写作", url: "https://learnenglish.britishcouncil.org/free-resources/writing/b1", kind: "练习", language: "英文", note: "通过简单连贯的英文表达练习，辅助组织译文，不是四级官方翻译题库。" }
      ]
    }
  ];
  window.STUDY_KNOWLEDGE_PARTS = window.STUDY_KNOWLEDGE_PARTS || [];
  window.STUDY_KNOWLEDGE_PARTS.push({ id: "english", articles: articles });
}());
