/* 四级学习口袋：词汇、例句与练习为本站原创练习素材，并非历年真题。 */
(function () {
  "use strict";
  const vocabulary = [
    ["achieve", "v.", "实现；达到", "Keep a small record of what you achieve each week.", "学习成长"],
    ["approach", "n./v.", "方法；接近", "A different approach may make the problem easier.", "学习成长"],
    ["assess", "v.", "评估", "The short quiz helps you assess your progress.", "学习成长"],
    ["benefit", "n./v.", "益处；使受益", "Daily reading has a clear benefit for language learners.", "学习成长"],
    ["challenge", "n./v.", "挑战；质疑", "Listening to a new accent can be a useful challenge.", "学习成长"],
    ["concentrate", "v.", "集中注意力", "I put my phone away so that I can concentrate.", "学习成长"],
    ["confidence", "n.", "信心", "A little preparation gave her more confidence.", "学习成长"],
    ["develop", "v.", "发展；培养", "You can develop good habits through regular practice.", "学习成长"],
    ["efficient", "adj.", "高效的", "An efficient plan leaves enough time for rest.", "学习成长"],
    ["evaluate", "v.", "评价；评估", "We evaluate the project by looking at its actual results.", "学习成长"],
    ["improve", "v.", "改善；提高", "Reading aloud can improve your sense of rhythm.", "学习成长"],
    ["maintain", "v.", "维持；保养", "It is easier to maintain a habit with a simple daily goal.", "学习成长"],
    ["method", "n.", "方法", "The teacher showed us a method for taking better notes.", "学习成长"],
    ["opportunity", "n.", "机会", "The workshop offers an opportunity to meet other learners.", "学习成长"],
    ["progress", "n./v.", "进步；进展", "Progress is sometimes easier to see in a learning diary.", "学习成长"],
    ["academic", "adj.", "学术的；学习上的", "The library provides support for academic writing.", "校园研究"],
    ["assignment", "n.", "作业；任务", "Our assignment is to compare two ways of saving energy.", "校园研究"],
    ["available", "adj.", "可获得的；有空的", "The study room is available after lunch.", "校园研究"],
    ["campus", "n.", "校园", "Students planted trees on the north side of the campus.", "校园研究"],
    ["conduct", "v./n.", "进行；行为", "The team will conduct a survey about reading habits.", "校园研究"],
    ["evidence", "n.", "证据", "We need more evidence before accepting the conclusion.", "校园研究"],
    ["experiment", "n./v.", "实验；试验", "The experiment tested how light affects plant growth.", "校园研究"],
    ["identify", "v.", "识别；确定", "First, identify the main idea of each paragraph.", "校园研究"],
    ["independent", "adj.", "独立的", "Independent learning does not mean studying alone all the time.", "校园研究"],
    ["lecture", "n./v.", "讲座；讲课", "The lecture introduced a new way to study city traffic.", "校园研究"],
    ["participate", "v.", "参与", "Everyone can participate in the class discussion.", "校园研究"],
    ["research", "n./v.", "研究", "Her research focuses on how people learn new words.", "校园研究"],
    ["resource", "n.", "资源", "A clear dictionary is a useful resource for beginners.", "校园研究"],
    ["schedule", "n./v.", "日程；安排", "I leave a free hour in my schedule for review.", "校园研究"],
    ["solution", "n.", "解决办法", "The students worked together to find a practical solution.", "校园研究"],
    ["access", "n./v.", "使用机会；获取", "The new bus route gives more people access to the library.", "社会科技"],
    ["adapt", "v.", "适应；改编", "Small businesses must adapt to changes in local demand.", "社会科技"],
    ["affect", "v.", "影响", "A lack of sleep can affect your ability to make decisions.", "社会科技"],
    ["community", "n.", "社区；群体", "The community opened a shared garden beside the school.", "社会科技"],
    ["consume", "v.", "消耗；消费", "Old lights often consume more electricity than new ones.", "社会科技"],
    ["contribute", "v.", "贡献；促成", "Small daily choices contribute to a cleaner neighborhood.", "社会科技"],
    ["digital", "adj.", "数字的", "A digital map can help visitors explore the museum.", "社会科技"],
    ["environment", "n.", "环境", "Quiet spaces create a better environment for study.", "社会科技"],
    ["essential", "adj.", "必不可少的", "Clear instructions are essential for safe use of the tool.", "社会科技"],
    ["impact", "n./v.", "影响；冲击", "The report describes the impact of the new transport policy.", "社会科技"],
    ["innovation", "n.", "创新", "Useful innovation often begins with an ordinary problem.", "社会科技"],
    ["potential", "adj./n.", "潜在的；潜力", "The new material has potential uses in building design.", "社会科技"],
    ["reduce", "v.", "减少", "Sharing books can reduce waste and save money.", "社会科技"],
    ["sustainable", "adj.", "可持续的", "The city is looking for more sustainable ways to travel.", "社会科技"],
    ["technology", "n.", "技术", "Technology is most helpful when it solves a real need.", "社会科技"],
    ["balance", "n./v.", "平衡", "A short walk helps me keep a balance between work and rest.", "生活表达"],
    ["compare", "v.", "比较", "Compare the two options before making your choice.", "生活表达"],
    ["consider", "v.", "考虑；认为", "Consider how much time each task will take.", "生活表达"],
    ["convenient", "adj.", "方便的", "The train is a convenient way to visit the next town.", "生活表达"],
    ["decision", "n.", "决定", "We made the decision after hearing everyone's ideas.", "生活表达"],
    ["encourage", "v.", "鼓励", "My friend encouraged me to speak even when I made mistakes.", "生活表达"],
    ["experience", "n./v.", "经历；体验", "Volunteering was an experience that changed her plans.", "生活表达"],
    ["flexible", "adj.", "灵活的", "A flexible routine is easier to follow during a busy week.", "生活表达"],
    ["hesitate", "v.", "犹豫", "Do not hesitate to ask when an instruction is unclear.", "生活表达"],
    ["instead", "adv.", "代替；反而", "It was raining, so we studied in the library instead.", "生活表达"],
    ["notice", "v./n.", "注意到；通知", "You may notice new details when you read a second time.", "生活表达"],
    ["prefer", "v.", "更喜欢", "I prefer a short daily review to a long weekly session.", "生活表达"],
    ["recommend", "v.", "推荐；建议", "Can you recommend a clear introduction to this subject?", "生活表达"],
    ["responsible", "adj.", "负责的", "Each group member is responsible for one small task.", "生活表达"],
    ["support", "n./v.", "支持", "A study partner can support you when motivation is low.", "生活表达"]
  ].map(function (w) { return { id: w[0], word: w[0], pos: w[1], meaning: w[2], example: w[3], category: w[4] }; });

  /* 追加学习包：保留首批 60 个 ID 与内容，旧设备的复习记录继续有效。 */
  [
    ["acquire", "v.", "获得；习得", "You acquire useful expressions by meeting them in different contexts.", "学习成长"],
    ["allocate", "v.", "分配", "I allocate ten minutes at the end of each session to review.", "学习成长"],
    ["analyze", "v.", "分析", "Analyze one mistake carefully before starting another exercise.", "学习成长"],
    ["aware", "adj.", "意识到的；知晓的", "She became aware of a pattern in her spelling mistakes.", "学习成长"],
    ["capable", "adj.", "有能力的", "With clear instructions, the group is capable of finishing the task.", "学习成长"],
    ["consistent", "adj.", "持续一致的；稳定的", "Consistent practice matters more than a perfect study notebook.", "学习成长"],
    ["demonstrate", "v.", "展示；证明", "A simple example can demonstrate how the method works.", "学习成长"],
    ["determine", "v.", "确定；决定", "The first exercise will help you determine what to study next.", "学习成长"],
    ["emphasize", "v.", "强调", "The tutor used a real example to emphasize the main point.", "学习成长"],
    ["establish", "v.", "建立；确立", "We hope to establish a routine that leaves room for rest.", "学习成长"],
    ["gradual", "adj.", "逐渐的", "The learner noticed a gradual improvement in reading speed.", "学习成长"],
    ["motivate", "v.", "激励；促使", "A clear and realistic goal can motivate you to continue.", "学习成长"],
    ["reflect", "v.", "反思；反映", "Take a moment to reflect on what made today's task difficult.", "学习成长"],
    ["retain", "v.", "记住；保留", "Writing an original sentence helps me retain a new phrase.", "学习成长"],
    ["strategy", "n.", "策略", "My reading strategy changes when I need a detail rather than the main idea.", "学习成长"],
    ["abstract", "n./adj.", "摘要；抽象的", "Read the abstract to decide whether the paper matches your question.", "校园研究"],
    ["accurate", "adj.", "准确的", "Accurate measurements help the team compare the two sensors.", "校园研究"],
    ["cite", "v.", "引用", "Remember to cite the report when you use its figures.", "校园研究"],
    ["conclusion", "n.", "结论", "The conclusion answers the question introduced at the beginning.", "校园研究"],
    ["data", "n.", "数据；资料", "The team used a small sensor to collect temperature data throughout the week.", "校园研究"],
    ["define", "v.", "定义；明确", "Before the discussion, define what you mean by success.", "校园研究"],
    ["distinguish", "v.", "区分", "The activity helps students distinguish facts from suggestions.", "校园研究"],
    ["factor", "n.", "因素", "Travel time was an important factor in choosing the course.", "校园研究"],
    ["hypothesis", "n.", "假设", "The class designed a small experiment to test its hypothesis.", "校园研究"],
    ["interpret", "v.", "理解；解释", "Students discussed how to interpret the chart without ignoring its limits.", "校园研究"],
    ["relevant", "adj.", "相关的", "Choose the details that are relevant to the question.", "校园研究"],
    ["revise", "v.", "修改；复习", "I revise the first paragraph after I finish the whole essay.", "校园研究"],
    ["significant", "adj.", "重要的；显著的", "Opening the library on Sundays was a significant change for commuters.", "校园研究"],
    ["survey", "n./v.", "调查", "The survey asked students how they used the new study space.", "校园研究"],
    ["valid", "adj.", "有效的；合理的", "A valid argument needs reasons that support its conclusion.", "校园研究"],
    ["alternative", "n./adj.", "替代选择；可供替代的", "Cycling is a useful alternative when the bus service is limited.", "社会科技"],
    ["application", "n.", "应用；申请", "The application lets residents report damaged street lights.", "社会科技"],
    ["consequence", "n.", "结果；后果", "The report considers an unexpected consequence of the new policy.", "社会科技"],
    ["cooperate", "v.", "合作", "Several local schools cooperate to share sports facilities.", "社会科技"],
    ["demand", "n./v.", "需求；要求", "Demand for quiet study rooms increases before examinations.", "社会科技"],
    ["diverse", "adj.", "多样的", "The exhibition presents the experiences of a diverse community.", "社会科技"],
    ["expand", "v.", "扩大；扩展", "The city plans to expand its network of bicycle paths.", "社会科技"],
    ["generate", "v.", "产生", "The workshop helped the team generate ideas for reducing waste.", "社会科技"],
    ["individual", "n./adj.", "个人；个体的", "The project balances individual needs with shared goals.", "社会科技"],
    ["influence", "n./v.", "影响", "Access to public transport can influence where people choose to live.", "社会科技"],
    ["privacy", "n.", "隐私", "A useful service should explain how it protects users' privacy.", "社会科技"],
    ["reliable", "adj.", "可靠的", "A reliable source makes it clear where its information comes from.", "社会科技"],
    ["replace", "v.", "替换；取代", "The school will replace the broken chairs instead of repairing them again.", "社会科技"],
    ["require", "v.", "需要；要求", "Some public services require an appointment in advance.", "社会科技"],
    ["volunteer", "n./v.", "志愿者；自愿做", "Each volunteer helped visitors find the correct classroom.", "社会科技"],
    ["although", "conj.", "虽然；尽管", "Although the task was short, it required careful attention.", "生活表达"],
    ["annoy", "v.", "使烦恼", "Constant message alerts annoy me when I am trying to read.", "生活表达"],
    ["avoid", "v.", "避免", "We avoid making important decisions when we are very tired.", "生活表达"],
    ["budget", "n./v.", "预算；安排开支", "A simple budget helps me plan for travel and books.", "生活表达"],
    ["communicate", "v.", "交流；传达", "A clear diagram can communicate an idea with very little text.", "生活表达"],
    ["confirm", "v.", "确认", "Please confirm the meeting time before you leave home.", "生活表达"],
    ["despite", "prep.", "尽管", "Despite the rain, the outdoor reading event attracted several families.", "生活表达"],
    ["eventually", "adv.", "最终", "After trying several routes, we eventually found the entrance.", "生活表达"],
    ["familiar", "adj.", "熟悉的", "A familiar topic makes it easier to follow a new speaker.", "生活表达"],
    ["meanwhile", "adv.", "与此同时", "One student checked the figures; meanwhile, another prepared the slides.", "生活表达"],
    ["obtain", "v.", "获得", "You can obtain a campus map at the information desk.", "生活表达"],
    ["previous", "adj.", "先前的", "I compared today's recording with the one from the previous week.", "生活表达"],
    ["respond", "v.", "回答；作出反应", "The organizer promised to respond to questions by Friday.", "生活表达"],
    ["tend", "v.", "往往会；倾向于", "I tend to understand a passage better after identifying its main question.", "生活表达"],
    ["therefore", "adv.", "因此", "The room was already full; therefore, we moved the discussion outside.", "生活表达"]
  ].forEach(function (w) { vocabulary.push({ id: w[0], word: w[0], pos: w[1], meaning: w[2], example: w[3], category: w[4] }); });

  const roadmap = [
    { id: "start", icon: "🌱", title: "第一站 · 建立节奏", subtitle: "先认识题型，再找到适合自己的每天一小步", tasks: [
      { id: "exam-map", title: "读懂四级笔试结构", detail: "查看本页题型地图，记住四个板块的时间与顺序。", target: "resources" },
      { id: "baseline", title: "记录一次起点练习", detail: "用一套合法获得的真题了解薄弱项，记录错因而非只看分数。", target: "practice", practice: "mock" },
      { id: "vocab-start", title: "完成第一轮 15 个词", detail: "先回忆中文，再看例句；不会的词点“再练一次”。", target: "vocabulary" },
      { id: "listening-start", title: "精听一段 1–3 分钟材料", detail: "盲听 → 对照文本 → 跟读 → 再次盲听，记下一个听不出的原因。", target: "practice", practice: "listening" }
    ] },
    { id: "build", icon: "🧭", title: "第二站 · 分项积累", subtitle: "词汇、听力、阅读每天碰一碰，输出练习轮换做", tasks: [
      { id: "vocab-review", title: "完成一轮到期词复习", detail: "把能认出来的词放进自己的句子里，连续记住三次会进入“已掌握”。", target: "vocabulary" },
      { id: "listen-detail", title: "复盘听力关键词与转折", detail: "标出数字、人物、原因和 but / however 等信号词。", target: "practice", practice: "listening" },
      { id: "reading-detail", title: "完成原创短阅读并解释错因", detail: "先看题干再回原文定位，不用逐词翻译整篇文章。", target: "practice", practice: "reading" },
      { id: "write-first", title: "写完并修改一篇短文", detail: "先列观点与例子，再检查主谓一致、时态、拼写和衔接。", target: "practice", practice: "writing" },
      { id: "translate-first", title: "完成一段汉译英", detail: "先拆分中文信息，再用熟悉的句式清楚表达。", target: "practice", practice: "translation" }
    ] },
    { id: "review", icon: "🚀", title: "第三站 · 限时与复盘", subtitle: "按照自己的考试日期安排最后阶段", tasks: [
      { id: "mock-timed", title: "按正式时长完成一次模拟", detail: "笔试总时长 125 分钟；参考官方说明与准考证安排完成练习。", target: "practice", practice: "mock" },
      { id: "mistake-review", title: "整理三类反复出现的错误", detail: "把错因写进学习记录，并安排下一次复习。", target: "notes" },
      { id: "write-toolkit", title: "准备自己的表达口袋", detail: "积累能灵活使用的开头、转折、举例和结尾，不机械套用整篇模板。", target: "practice", practice: "writing" },
      { id: "exam-ready", title: "核对考试通知与证件要求", detail: "以教育考试院和学校通知为准，确认报名、准考证及考试用品。", target: "resources" }
    ] }
  ];

  const readings = [
    { id: "library", title: "The quiet corner that became a meeting place", topic: "校园生活", minutes: 8,
      text: "Last term, a university library turned an unused corner into a place where students could exchange skills. Every Wednesday, one student offered a short lesson: repairing a bicycle, making a simple budget, or designing a poster. No teacher decided the topics. Students suggested what they wanted to learn. At first, the library expected the space to attract people who already knew each other. Instead, many visitors arrived alone. They found that asking a practical question was an easy way to start a conversation. The sessions were not always crowded, but the organizers did not measure success only by attendance. One student, who had avoided group activities for months, began helping with the schedule. For the library, that change mattered as much as a full room.",
      questions: [
        { question: "Who chose the topics for the sessions?", options: ["University teachers", "The participating students", "Local business owners", "The library manager alone"], answer: 1, explanation: "原文 Students suggested what they wanted to learn 直接说明主题由学生提出。" },
        { question: "What surprised the library?", options: ["Many visitors came by themselves", "Every session was full", "Teachers refused to join", "Students only wanted bicycle lessons"], answer: 0, explanation: "预期是熟人一起参加，Instead 后说明实际有许多人独自来。" },
        { question: "What is the main point of the final example?", options: ["A schedule needs professional designers", "Attendance is the only useful measure", "Small personal changes can show success", "Group activities should be compulsory"], answer: 2, explanation: "学生开始协助组织体现个人参与的变化，呼应成功不只由人数衡量。" }
      ] },
    { id: "repair", title: "A second life for everyday things", topic: "社会环保", minutes: 8,
      text: "When a community center opened a repair café, its first goal was to keep broken objects out of the rubbish. Once a month, volunteers helped neighbors fix small items such as lamps and bags. Visitors brought their own objects and stayed to watch the work. The volunteers did not promise that everything could be repaired. Some parts were too expensive, and some products were difficult to open safely. Yet even an unsuccessful repair could teach a useful lesson. People learned which designs made maintenance easy and which did not. Over time, the organizers noticed another effect: visitors began asking different questions before buying something new. Instead of considering only price and appearance, they also asked whether spare parts were available. The café had changed how some people made choices, even beyond the objects on its tables.",
      questions: [
        { question: "What was the café's initial aim?", options: ["To sell new lamps", "To reduce waste by repairing objects", "To train paid shop assistants", "To design expensive products"], answer: 1, explanation: "首句指出 keep broken objects out of the rubbish，即通过修理减少废弃。" },
        { question: "Why could an unsuccessful repair still be useful?", options: ["It always produced free spare parts", "It helped people understand repair-friendly design", "It made all new products cheaper", "It meant volunteers could leave early"], answer: 1, explanation: "即使修不好，人们也能了解哪些设计便于维护。" },
        { question: "Which buying question reflects the café's wider influence?", options: ["Is it the brightest color?", "Can it be delivered today?", "Are replacement parts available?", "Does my neighbor own one?"], answer: 2, explanation: "后半段说明购买时开始关注 spare parts（备用零件）是否可获得。" }
      ] },
    { id: "notifications", title: "Choosing when to check", topic: "数字生活", minutes: 8,
      text: "A small student project explored a simple question: could changing notification settings make study time feel less interrupted? The volunteers first recorded how often they checked their phones during a normal afternoon. The following week, they switched off non-essential alerts and chose two times to check messages. Most reported fewer interruptions, but not everyone found the plan helpful. Students who were caring for relatives needed to receive certain messages immediately. The project team therefore suggested allowing alerts from a small group of important contacts. They also warned against treating one short project as proof that a single method would work for everyone. The useful result was not a perfect rule. It was a way to notice which interruptions could be controlled and to choose a routine that matched real responsibilities.",
      questions: [
        { question: "What change did volunteers make in the second week?", options: ["They stopped using phones permanently", "They bought new devices", "They removed every contact", "They limited alerts and chose message-checking times"], answer: 3, explanation: "第二周关闭非必要提醒，并选定两个查看消息的时间。" },
        { question: "Why did the team suggest exceptions for important contacts?", options: ["Some students had urgent family responsibilities", "The project needed more advertisements", "All messages were equally urgent", "The phones had broken speakers"], answer: 0, explanation: "照顾亲属的学生需要及时接收特定消息，体现方案要适应真实责任。" },
        { question: "What attitude does the project team show?", options: ["Certain that their method fits everyone", "Careful about generalizing from limited evidence", "Uninterested in individual needs", "Opposed to all digital communication"], answer: 1, explanation: "团队提醒不要把短期小项目当作适用于所有人的证明，态度谨慎。" }
      ] }
  ];

  const writing = [
    { id: "habit", title: "A small habit that made a difference", prompt: "Write a short essay about a small study habit that helped you. Explain what you changed, give a specific example, and discuss why it worked.", guide: "建议练习 120–180 词。先说明习惯，再举一个具体例子，最后总结它如何帮助你。", outline: ["Introduce the habit and your reason for trying it.", "Describe one experience and the result.", "Explain what you learned and your next step."] },
    { id: "campus", title: "A more welcoming campus", prompt: "Your university is collecting ideas for making campus life more welcoming. Write a short proposal with one practical suggestion and explain how it could help students.", guide: "建议练习 120–180 词。选择一条可落实的建议，写清对象、做法和理由。", outline: ["Describe a specific need on campus.", "Present one realistic suggestion with details.", "Explain the expected benefit and possible support."] },
    { id: "technology", title: "Using technology with purpose", prompt: "Write a short essay about how students can use digital tools effectively while avoiding unnecessary distractions. Support your ideas with an example.", guide: "建议练习 120–180 词。观点与例子要对应，避免只堆砌连接词。", outline: ["State your view about purposeful technology use.", "Give one benefit and one practical boundary.", "Use an example and finish with a clear conclusion."] }
  ];

  const translation = [
    { id: "reading", title: "城市阅读空间", text: "近年来，一些城市在社区里开设了小型阅读空间。居民可以在那里借书、参加讨论，或者安静地学习。这些空间离家较近，让阅读更容易融入日常生活。", reference: "In recent years, some cities have opened small reading spaces in their communities. Residents can borrow books, join discussions, or study quietly there. Located close to people's homes, these spaces make it easier to include reading in everyday life.", tips: "“近年来”可用 in recent years；先写清主语和动作，再处理“离家较近”这类补充信息。参考译文只是可行表达之一。" },
    { id: "bicycle", title: "骑行与城市生活", text: "越来越多的大学生选择骑自行车出行。骑行不仅可以节省交通费用，还能让人们有机会观察周围的环境。为了保障安全，学校也在改善校园里的骑行设施。", reference: "More and more university students choose to travel by bicycle. Cycling can not only save travel costs but also give people a chance to observe their surroundings. To improve safety, universities are also upgrading cycling facilities on campus.", tips: "注意 not only ... but also ... 两边结构一致；“设施”可用 facilities。优先保证意思完整、句子正确。" },
    { id: "festival", title: "节日与手工艺", text: "在传统节日期间，许多家庭会一起制作食物和装饰品。年轻人通过这些活动了解当地的文化，老人也有机会分享自己的经历。简单的手工活动能够把不同年龄的人联系起来。", reference: "During traditional festivals, many families make food and decorations together. Through these activities, young people learn about local culture, while older people have an opportunity to share their experiences. Simple craft activities can bring people of different ages together.", tips: "同一段里注意时态一致；“把……联系起来”可用 bring ... together，无需逐字翻译中文。" }
  ];

  const listening = [
    { id: "bc-b1", level: "B1 · 循序渐进", title: "British Council · 生活与校园听力", url: "https://learnenglish.britishcouncil.org/free-resources/listening/b1", description: "有音频、准备任务与理解练习；从电话、学生讨论等熟悉话题开始。", minutes: 15 },
    { id: "bc-b2", level: "B2 · 提升理解", title: "British Council · 访谈与短讲", url: "https://learnenglish.britishcouncil.org/free-resources/listening/b2", description: "用演讲、新闻与访谈练习主旨和细节；难时先回到 B1。", minutes: 20 },
    { id: "bbc", level: "话题拓展", title: "BBC · 6 Minute English", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", description: "围绕生活话题听英语与积累表达；访问情况取决于所在地网络。", minutes: 15 }
  ];

  const resources = [
    { icon: "🏛️", type: "官方考试", title: "四级笔试题型与时间", description: "教育部教育考试院：核对 CET4 的测试内容、分值比例与时长。", url: "https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm" },
    { icon: "📋", type: "官方考试", title: "四、六级考试大纲", description: "从官方目录查看英语四、六级大纲与样题信息。", url: "https://cet.neea.edu.cn/html1/folder/16113/1588-1.htm" },
    { icon: "📢", type: "官方考试", title: "考试动态与通知", description: "具体考试日期和安排请以考试院及学校通知为准。", url: "https://cet.neea.edu.cn/" },
    { icon: "🎧", type: "免费英语练习", title: "British Council 听力", description: "按等级选择音频与理解练习，适合精听和跟读。", url: "https://learnenglish.britishcouncil.org/free-resources/listening" },
    { icon: "📖", type: "免费英语练习", title: "British Council 阅读", description: "分级文本与理解练习，积累不同题材的阅读经验。", url: "https://learnenglish.britishcouncil.org/skills/reading" },
    { icon: "✍️", type: "免费英语练习", title: "British Council 写作", description: "学习写作结构与常用表达，配合本站写作口袋练习。", url: "https://learnenglish.britishcouncil.org/skills/writing" },
    { icon: "🔎", type: "工具", title: "Cambridge Dictionary", description: "查英文释义、词性、发音与用法，核实自己的表达。", url: "https://dictionary.cambridge.org/" },
    { icon: "📻", type: "免费英语练习", title: "BBC Learning English", description: "话题音频和英语学习内容，作为额外听读输入。", url: "https://www.bbc.co.uk/learningenglish/" }
  ];

  window.CET4_CONTENT = { vocabulary: vocabulary, roadmap: roadmap, readings: readings, writing: writing, translation: translation, listening: listening, resources: resources };
}());
