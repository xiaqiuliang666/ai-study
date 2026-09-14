/*
 * AI 热词百科。
 * cat 分类：base 基础概念 / train 训练与调优 / infer 推理与能力 / app 应用与工程 / eco 生态与趋势
 * 字段：term 中文名、en 英文名、def 一句话定义、why 为什么重要、vs 和相近概念的区别、rel 相关词 id
 * 想加词就照着往下写，id 唯一即可。
 */
window.GLOSSARY = {
  updated: "2026-09",
  cats: [
    { id: "base", name: "基础概念", color: "#6d8bff" },
    { id: "train", name: "训练与调优", color: "#a06bff" },
    { id: "infer", name: "推理与能力", color: "#4dd4e8" },
    { id: "app", name: "应用与工程", color: "#3ddc97" },
    { id: "eco", name: "生态与趋势", color: "#ffb457" }
  ],
  terms: [
    {
      id: "llm",
      term: "大语言模型",
      en: "LLM / Large Language Model",
      cat: "base",
      def: "用海量文本训练出来的神经网络，核心任务只有一个：预测下一个字（token）该是什么。所有「智能」表现都是这个动作反复发生的结果。",
      why: "它是现在几乎所有 AI 产品的底座：聊天、写代码、做 Agent、做搜索，下面都是它。",
      vs: "和以前的「机器学习模型」不同：以前的模型一个模型只干一件事，LLM 靠提示词就能换任务，不用重新训练。",
      rel: ["token", "context-window", "hallucination", "param"]
    },
    {
      id: "token",
      term: "词元",
      en: "Token",
      cat: "base",
      def: "模型处理文字的最小单位。英文大约 1 token ≈ 0.75 个单词，中文通常 1 个汉字 1～2 个 token。",
      why: "API 按 token 收费、上下文长度按 token 计算、输出速度也按 token/秒衡量。看账单时会一直遇到它。",
      vs: "它不等于「字」也不等于「词」：同一个意思，中文通常比英文更贵，就是因为切出来的 token 更多。",
      rel: ["llm", "context-window", "cost"]
    },
    {
      id: "context-window",
      term: "上下文窗口",
      en: "Context Window",
      cat: "base",
      def: "一次对话里模型能同时「看见」的 token 上限，比如 128K、200K、1M。超出部分会被丢掉或报错。",
      why: "它决定了你能一次喂多少资料：整本书、整个代码库、还是只能一段一段来。",
      vs: "它不等于模型的长期记忆。窗口关掉就清空，下次对话它并不记得你；所谓「记忆」都是在外面替你存好再塞回来。",
      rel: ["token", "long-context", "memory", "context-engineering"]
    },
    {
      id: "param",
      term: "参数",
      en: "Parameters",
      cat: "base",
      def: "模型内部可调的数值，通常按亿/十亿计。7B 就是 70 亿参数。",
      why: "参数量大致决定模型能装下多少知识、以及跑起来需要多少显存。",
      vs: "参数多不等于更强：训练数据质量、训练方法和后训练，往往比参数更能拉开差距。小模型在专一任务上常打败大模型。",
      rel: ["weights", "moe", "quantization"]
    },
    {
      id: "weights",
      term: "权重 / 开放权重",
      en: "Weights / Open Weights",
      cat: "base",
      def: "模型训练完成后留下的参数文件，也就是「模型本体」。开放权重指厂商把这份文件放出来给你下载。",
      why: "只有拿到权重，你才能在自己电脑上跑、才能自己微调、才能真正私有化。",
      vs: "「开放权重」不等于「开源」：数据、训练代码、许可证往往不一起给。下载前先看许可证允不允许商用。",
      rel: ["open-vs-closed", "local-deploy", "finetune"]
    },
    {
      id: "hallucination",
      term: "幻觉",
      en: "Hallucination",
      cat: "base",
      def: "模型一本正经地说出不存在的事实、编造的引用或错误的代码，而且语气和正确答案一样自信。",
      why: "这是 LLM 最本质的坑：它优化的是「像不像人写的」，不是「对不对」。",
      vs: "和「模型不知道」不同：不知道它会说不知道或者胡编，你很难从语气上分辨，只能去核对来源。",
      rel: ["rag", "eval", "benchmark"]
    },
    {
      id: "multimodal",
      term: "多模态",
      en: "Multimodal",
      cat: "base",
      def: "同一个模型能同时处理文字、图片、音频、视频，甚至直接产出这些内容。",
      why: "现实世界的资料不只有文字：截图、扫描件、录音、会议视频都需要它。",
      vs: "和「很多个小模型拼起来」不同：真正的多模态是在同一套参数里理解多种信息，所以能把图里的表格和文字一起推理。",
      rel: ["llm", "computer-use", "world-model"]
    },
    {
      id: "temperature",
      term: "温度",
      en: "Temperature",
      cat: "base",
      def: "控制输出随机性的参数：调低更稳更死板，调高更发散更有创意。",
      why: "同一段提示词跑十次结果不一样，往往就是这个参数在起作用。",
      vs: "和「模型好坏」无关，它只是采样策略。要格式稳定就把温度调低，要头脑风暴才调高。",
      rel: ["prompt-engineering", "hallucination"]
    },
    {
      id: "pretrain",
      term: "预训练",
      en: "Pre-training",
      cat: "train",
      def: "在海量通用文本上从零学习语言规律，是整条链路里最贵的一步，动辄上千张显卡跑几个月。",
      why: "它决定了模型的「底子」：知识面、语言能力、推理上限都在这一步定下来。",
      vs: "和微调的区别：预训练是学会说话，微调是学会按你的要求说话。个人和企业绝大多数情况只需要微调。",
      rel: ["finetune", "sft", "scaling-law"]
    },
    {
      id: "finetune",
      term: "微调",
      en: "Fine-tuning",
      cat: "train",
      def: "在已有的模型上，用你自己的数据继续训练，让它的输出更贴合你的场景和风格。",
      why: "当提示词怎么写都不稳定、或者格式要求非常严时，微调是正解。",
      vs: "和 RAG 的核心区别：微调改的是「模型怎么回答」，RAG 改的是「它看到了什么资料」。知识经常变就用 RAG，风格和格式固定不了才微调。",
      rel: ["lora", "sft", "rag", "pretrain"]
    },
    {
      id: "sft",
      term: "指令微调",
      en: "SFT / Supervised Fine-Tuning",
      cat: "train",
      def: "用「问题 + 标准答案」的成对数据训练模型，让它学会听懂指令、按格式回答。",
      why: "一个只会续写文本的预训练模型没什么用，SFT 之后才变成能聊天的助手。",
      vs: "和 RLHF 的区别：SFT 是模仿标准答案，RLHF 是给多个答案打分再让它学会偏好。通常先 SFT，再对齐。",
      rel: ["finetune", "rlhf", "dpo"]
    },
    {
      id: "rlhf",
      term: "人类反馈强化学习",
      en: "RLHF",
      cat: "train",
      def: "让人类对模型的多个回答排序打分，训练一个奖励模型，再据此优化模型行为。",
      why: "它是让模型「有用、无害、诚实」的关键手段，也是 ChatGPT 当年真正出圈的原因。",
      vs: "和 SFT 的区别：SFT 教它「照着写」，RLHF 教它「哪样更好」。代价是实现复杂、成本高。",
      rel: ["sft", "dpo", "alignment"]
    },
    {
      id: "dpo",
      term: "直接偏好优化",
      en: "DPO / Direct Preference Optimization",
      cat: "train",
      def: "跳过奖励模型，直接用「这个回答比那个好」的成对数据优化模型，是 RLHF 的简化替代。",
      why: "个人和小团队也能做偏好对齐，不用搭一整套强化学习流水线。",
      vs: "效果接近 RLHF 但更好实现，是现在很多开源模型微调的首选。",
      rel: ["rlhf", "finetune"]
    },
    {
      id: "lora",
      term: "低秩适配",
      en: "LoRA / QLoRA",
      cat: "train",
      def: "不改动原模型权重，只训练一小块额外参数，用几十分之一的显存就能微调大模型。",
      why: "它让「一个人 + 一张显卡」也能做微调，是目前最实用的微调方式。",
      vs: "和全量微调的区别：LoRA 便宜、快、可插拔；全量微调效果上限更高但成本和风险都大得多。",
      rel: ["finetune", "quantization"]
    },
    {
      id: "quantization",
      term: "量化",
      en: "Quantization",
      cat: "train",
      def: "把模型权重的精度从 16 位压缩到 8 位、4 位，显存需求能直接砍掉一半到四分之三。",
      why: "这是普通电脑能跑本地大模型的前提，也是推理成本下降的主要手段之一。",
      vs: "和蒸馏的区别：量化是「把同一个模型压小」，蒸馏是「让小模型学大模型」。量化通常损失很小，比想象中划算。",
      rel: ["distill", "local-deploy", "param"]
    },
    {
      id: "distill",
      term: "蒸馏",
      en: "Distillation",
      cat: "train",
      def: "让一个小模型去模仿大模型的输出，把大模型的能力压缩进更小的模型里。",
      why: "这是小模型这两年进步飞快的原因之一，也是低成本部署的常见路线。",
      vs: "和量化的区别：蒸馏换了模型本体，量化只是降低了精度。蒸馏后的小模型推理更快，但能力上限受大模型限制。",
      rel: ["quantization", "param"]
    },
    {
      id: "moe",
      term: "混合专家",
      en: "MoE / Mixture of Experts",
      cat: "train",
      def: "模型内部由很多个「专家」子网络组成，每次输入只激活其中一小部分。",
      why: "它让模型总参数可以很大（知识装得多），但每次真正计算的部分很小（跑得快、便宜）。",
      vs: "和稠密模型的区别：稠密模型每次都用全部参数。所以看模型大小时要分清「总参数」和「激活参数」，后者才决定成本。",
      rel: ["param", "cost"]
    },
    {
      id: "scaling-law",
      term: "缩放定律",
      en: "Scaling Law",
      cat: "train",
      def: "描述模型效果与参数量、数据量、算力之间关系的经验规律：投入更多，效果按可预测的方式变好。",
      why: "它是这几年各家拼命堆算力的理论依据，也是判断「砸钱还有没有用」的参考。",
      vs: "新版定律更强调数据质量和后训练，所以现在不是单纯比谁参数大。",
      rel: ["pretrain", "test-time-compute"]
    },
    {
      id: "alignment",
      term: "对齐",
      en: "Alignment",
      cat: "train",
      def: "让模型的行为符合人类意图和价值观：有用、诚实、不危险、不乱来。",
      why: "能力越强，跑偏的代价越大。对齐是模型能不能真正交给人用的门槛。",
      vs: "和「安全过滤」不同：对齐是从训练阶段塑造倾向，过滤是输出阶段的最后一道关卡，两者互补。",
      rel: ["rlhf", "guardrails", "jailbreak"]
    },
    {
      id: "synthetic-data",
      term: "合成数据",
      en: "Synthetic Data",
      cat: "train",
      def: "用模型自己生成、或用模型加工出来的训练数据，用来补足人工标注不够的部分。",
      why: "高质量人工数据是稀缺品，合成数据是继续提升模型的重要来源。",
      vs: "和真实数据的区别：便宜、量大、可控，但用不好会让模型「近亲繁殖」、错误被放大。",
      rel: ["pretrain", "sft"]
    },
    {
      id: "reasoning-model",
      term: "推理模型",
      en: "Reasoning Model",
      cat: "infer",
      def: "回答前先在心里「想一遍」的模型：先生成一段推理过程，再给结论，所以更慢也更贵，但难题正确率高得多。",
      why: "数学、代码、复杂规划这类任务，推理模型和普通模型差距非常明显。",
      vs: "和普通聊天模型的区别不是大小，而是「愿不愿意花时间想」。写文案、闲聊用它反而浪费钱。",
      rel: ["cot", "test-time-compute", "llm"]
    },
    {
      id: "cot",
      term: "思维链",
      en: "Chain of Thought / CoT",
      cat: "infer",
      def: "让模型把中间推理步骤一步步写出来，再给答案，正确率通常明显提升。",
      why: "这是提示词里最有效的一招，也是推理模型的内部机制。",
      vs: "对推理模型来说你不需要再手动要求「一步步思考」，它自己会做，你强行要求反而可能干扰它。",
      rel: ["reasoning-model", "prompt-engineering"]
    },
    {
      id: "test-time-compute",
      term: "测试时计算",
      en: "Test-time Compute",
      cat: "infer",
      def: "在推理阶段多花算力换效果：多想一会儿、多采样几条再挑最好的，而不是只把模型训练得更大。",
      why: "它提供了「不重新训练、也能变强」的另一条路，是推理模型背后的核心思想。",
      vs: "和加大模型的区别：一个在用时花钱，一个在训练时花钱，前者更灵活。",
      rel: ["reasoning-model", "scaling-law", "cost"]
    },
    {
      id: "long-context",
      term: "长上下文",
      en: "Long Context",
      cat: "infer",
      def: "一次能处理的文本量非常长，几十万到上百万 token，可以整本书、整个代码库直接丢进去。",
      why: "很多「以前必须做 RAG」的场景，现在直接塞进去就行，工程量大减。",
      vs: "和 RAG 的区别：长上下文简单但有上限、且越到后面越容易「注意力涣散」；RAG 要先搭检索，但对超大规模资料更省更准。资料超过几十万字还是 RAG 更靠谱。",
      rel: ["context-window", "rag", "context-engineering"]
    },
    {
      id: "tool-calling",
      term: "工具调用",
      en: "Tool Calling / Function Calling",
      cat: "infer",
      def: "模型不只是回话，而是按约定格式吐出「请帮我调用这个函数、参数是这些」，由你的程序去执行。",
      why: "这是模型从「会说」变成「会做」的关键一步：查数据库、算数、发消息全靠它。",
      vs: "和 MCP 的区别：工具调用是模型的能力，MCP 是把工具接进来的统一插座。没有 MCP 时，每个工具都要单独写一套对接代码。",
      rel: ["agent", "mcp", "structured-output"]
    },
    {
      id: "structured-output",
      term: "结构化输出",
      en: "Structured Output",
      cat: "infer",
      def: "强制模型按照固定的 JSON 结构（schema）输出，而不是自由发挥。",
      why: "程序要读模型结果就必须格式稳定，这是把模型接进业务流程的前提。",
      vs: "靠「请输出 JSON」的提示词不保险，真正的结构化输出是接口层面的约束，能保证格式合法。",
      rel: ["tool-calling", "prompt-engineering"]
    },
    {
      id: "transformer",
      term: "Transformer 与注意力机制",
      en: "Transformer / Attention",
      cat: "infer",
      def: "2017 年提出的网络结构，靠「注意力」让每个字去衡量其他字的重要性，是现在所有主流大模型的基础。",
      why: "理解注意力就理解了大模型的一半：它为什么能处理长距离依赖、为什么会 O(n²) 吃算力，都在这。",
      vs: "和之前的 RNN 区别：RNN 只能一个词一个词往后传，Transformer 可以并行处理整段文本，所以能规模化训练。",
      rel: ["llm", "context-window", "pretrain"]
    },
    {
      id: "cost",
      term: "推理成本",
      en: "Inference Cost",
      cat: "infer",
      def: "模型每次回答要花的钱和算力，主要由输入 token、输出 token、模型大小和是否推理模式决定。",
      why: "做产品能不能赚钱，往往就卡在这一项上。",
      vs: "输入和输出通常不同价，输出往往贵好几倍。做 Agent 时要特别注意：多轮调用会让成本成倍上涨。",
      rel: ["token", "moe", "quantization", "agent"]
    },
    {
      id: "prompt-engineering",
      term: "提示工程",
      en: "Prompt Engineering",
      cat: "app",
      def: "通过设计指令、示例和约束，让模型稳定产出你要的结果。",
      why: "同一件事，提示词写得好不好，效果可以差出几个档次，而且这是零成本的手段。",
      vs: "和上下文工程的区别：提示工程管「怎么说」，上下文工程管「整个上下文里到底放了什么」，后者范围更大。",
      rel: ["context-engineering", "few-shot", "cot"]
    },
    {
      id: "few-shot",
      term: "少样本提示",
      en: "Few-shot / Zero-shot",
      cat: "app",
      def: "在提问前先给模型几个「输入→输出」的样例，让它照着模仿。不给样例叫零样本。",
      why: "当你要的格式很特别、又不想写长篇说明时，给两三个例子最省事也最有效。",
      vs: "和微调的区别：样例只影响这一次对话，微调是把这种行为写进模型权重。样例能把效果拉到八成，剩下两成再考虑微调。",
      rel: ["prompt-engineering", "finetune"]
    },
    {
      id: "context-engineering",
      term: "上下文工程",
      en: "Context Engineering",
      cat: "app",
      def: "系统性地设计模型每一步「看到什么」：系统提示词、检索到的资料、历史对话、工具返回结果，全都在内。",
      why: "在 Agent 时代这是比提示工程更关键的能力：模型再强，看不到对的信息也白搭。",
      vs: "提示工程是它的一个子集。上下文工程还要处理取舍：放不下就删、压缩、分段，以及决定什么该放什么不该放。",
      rel: ["prompt-engineering", "rag", "memory", "agent"]
    },
    {
      id: "rag",
      term: "检索增强生成",
      en: "RAG / Retrieval-Augmented Generation",
      cat: "app",
      def: "先去你的资料库里检索出相关片段，再把片段连同问题一起交给模型回答，答案可以带出处。",
      why: "它解决了模型不知道你的私有资料、以及知识过时的问题，是落地最广的 LLM 应用形态。",
      vs: "和微调的区别：RAG 改输入、知识好更新、成本低、能溯源；微调改模型、能定型风格但不擅长记事实。要「知道」用 RAG，要「更像」才微调。",
      rel: ["embedding", "vector-db", "chunking", "rerank", "hallucination"]
    },
    {
      id: "embedding",
      term: "向量化 / 嵌入",
      en: "Embedding",
      cat: "app",
      def: "把一段文字变成一串数字（向量），意思相近的文字在这个空间里距离也近。",
      why: "它是「按意思搜索」的基础：搜「怎么省钱」也能命中写着「降低成本」的段落。",
      vs: "和关键词搜索的区别：关键词匹配字面，向量匹配语义。实际系统通常两者一起用，叫混合检索。",
      rel: ["vector-db", "rag", "rerank"]
    },
    {
      id: "vector-db",
      term: "向量数据库",
      en: "Vector Database",
      cat: "app",
      def: "专门存放和检索向量的数据库，能在几百万条里毫秒级找出最相近的若干条。",
      why: "资料超过几千段以后，用文件遍历就不行了，必须有它。",
      vs: "和传统数据库的区别：传统数据库按条件精确匹配，向量库按相似度排序。小规模时用 FAISS 之类的本地库就够了，不必上服务。",
      rel: ["embedding", "rag"]
    },
    {
      id: "chunking",
      term: "分块",
      en: "Chunking",
      cat: "app",
      def: "把长文档切成一段一段再向量化，块的大小和切法直接影响检索质量。",
      why: "RAG 效果差，十有八九问题出在这一步，而不是模型不够好。",
      vs: "和「随便按字数切」不同：好的切法会按标题、段落、语义边界来切，并保留上下文信息。",
      rel: ["rag", "embedding"]
    },
    {
      id: "rerank",
      term: "重排",
      en: "Rerank",
      cat: "app",
      def: "先粗筛出几十条候选，再用更精确的模型给它们重新排序，挑出最相关的几条。",
      why: "它是投入产出比最高的优化之一：只加一步，检索准确率通常明显提升。",
      vs: "和向量检索的区别：向量检索快但粗，重排慢但准，两者是先后配合的关系。",
      rel: ["rag", "embedding"]
    },
    {
      id: "agent",
      term: "智能体",
      en: "Agent",
      cat: "app",
      def: "能自己决定下一步做什么的 AI 程序：它会拆解任务、调用工具、看结果、再决定要不要继续，直到完成目标。",
      why: "这是 AI 从「回答问题」走向「替你干活」的分界线，也是现在最热的方向。",
      vs: "和聊天机器人的区别是「谁做决定」：聊天机器人等你问一句答一句，Agent 自己规划多步并动手（改文件、跑代码、发请求）。和固定工作流的区别见「工作流 vs 智能体」。",
      rel: ["tool-calling", "mcp", "multi-agent", "workflow-vs-agent", "memory"]
    },
    {
      id: "multi-agent",
      term: "多智能体",
      en: "Multi-Agent",
      cat: "app",
      def: "让多个各有所长的 Agent 分工协作：一个规划、一个写代码、一个审查，互相传结果。",
      why: "复杂任务拆开做往往比一个 Agent 硬扛效果好，也更容易调试。",
      vs: "不是越多越好：每多一个 Agent 就多一次沟通成本和出错机会。任务简单时单 Agent 反而更稳。",
      rel: ["agent", "workflow-vs-agent"]
    },
    {
      id: "workflow-vs-agent",
      term: "工作流与智能体的区别",
      en: "Workflow vs Agent",
      cat: "app",
      def: "工作流是你把步骤写死（先做 A 再做 B），模型只在固定环节出力；智能体是模型自己决定走哪几步。",
      why: "这是落地时最该先想清楚的一个选择，直接决定成本、可控性和效果上限。",
      vs: "流程固定、要求稳定可预测，就用工作流；步骤不确定、需要随机应变，才用智能体。能用工作流解决的，别上智能体。",
      rel: ["agent", "multi-agent"]
    },
    {
      id: "memory",
      term: "记忆",
      en: "Memory",
      cat: "app",
      def: "让 AI 记住你的偏好和历史：把重要信息存到外部（文件、数据库），下次对话再取回来放进上下文。",
      why: "模型的上下文窗口是有限的，也没有跨会话记忆，想让它「记得你」必须在外面做。",
      vs: "和上下文窗口的区别：窗口是工作台，记忆是档案柜。窗口再大，也不会自动记住上周聊过什么。",
      rel: ["context-window", "rag", "context-engineering"]
    },
    {
      id: "mcp",
      term: "模型上下文协议",
      en: "MCP / Model Context Protocol",
      cat: "app",
      def: "一个开放协议，统一了「AI 应用怎么连接外部工具和数据源」这件事。工具方按协议写一次，各种 AI 客户端都能直接接上。",
      why: "以前每接一个新工具都要单独写适配代码，MCP 把这件事变成了插拔式的。它是现在 Agent 生态的基础设施。",
      vs: "和函数调用的区别：函数调用是模型的能力，MCP 是工具的接口标准。前者是「会打电话」，后者是「电话线统一了插头」。",
      rel: ["agent", "tool-calling"]
    },
    {
      id: "computer-use",
      term: "电脑操作",
      en: "Computer Use",
      cat: "app",
      def: "让 AI 直接看屏幕截图、移动鼠标、点击和输键盘，像人一样操作软件，而不依赖软件提供接口。",
      why: "大量老软件根本没有 API，能操作界面就等于什么都能自动化。",
      vs: "和 API 调用的区别：API 稳定、快、准；看屏幕操作通用但慢、容易点错。有 API 就别用这套。",
      rel: ["agent", "multimodal"]
    },
    {
      id: "eval",
      term: "评估",
      en: "Eval",
      cat: "app",
      def: "准备一套有标准答案的测试题，每次改动都自动跑一遍打分，用数字判断改动是变好还是变坏。",
      why: "没有评估，优化全靠感觉，很容易「修好一个、弄坏三个」。这是从玩票到工程的分水岭。",
      vs: "和模型榜单的区别：公开榜单比的是通用能力，你自己的评估集比的是「在我的场景里到底行不行」，后者才决定产品能不能用。",
      rel: ["hallucination", "benchmark"]
    },
    {
      id: "guardrails",
      term: "护栏",
      en: "Guardrails",
      cat: "app",
      def: "在输入和输出两端加检查：过滤敏感内容、拦截不合规请求、校验输出格式、限制能调用的工具。",
      why: "把模型接给真实用户，就不能只靠模型自己自觉。",
      vs: "和对齐的区别：对齐在训练阶段塑造倾向，护栏在运行时兜底，两者必须同时有。",
      rel: ["alignment", "prompt-injection"]
    },
    {
      id: "prompt-injection",
      term: "提示注入",
      en: "Prompt Injection",
      cat: "app",
      def: "攻击者在数据里埋一句话（比如网页、文档、邮件里），诱使 AI 忽略原本的指令去做别的事。",
      why: "只要你的 Agent 会读外部内容，就有这个风险，这是目前 Agent 最大的安全坑。",
      vs: "和传统漏洞的区别：它利用的是模型分不清「指令」和「资料」，所以不能靠打补丁彻底解决，只能靠权限隔离和人工确认。",
      rel: ["agent", "guardrails", "sandbox"]
    },
    {
      id: "sandbox",
      term: "沙箱",
      en: "Sandbox",
      cat: "app",
      def: "给 AI 一块受限的运行环境：能跑代码、改文件，但碰不到你的真实系统和隐私数据。",
      why: "让 Agent 执行代码就必须隔离，否则一次误操作就能删库。",
      vs: "和权限管理的区别：沙箱限制「能碰到什么」，权限管理限制「能做什么」，好的 Agent 产品两者都有。",
      rel: ["agent", "prompt-injection"]
    },
    {
      id: "copilot",
      term: "副驾驶",
      en: "Copilot",
      cat: "app",
      def: "半自动助手：它给建议、写草稿，但每一步都要你确认，最终决定权在人手里。",
      why: "风险可控又能提效，是现在企业里最容易落地的一种形态。",
      vs: "和 Agent 的区别就是「谁按回车」：Copilot 每一步问你，Agent 你给个目标它自己跑完。风险越高的场景越该用 Copilot。",
      rel: ["agent", "coding-agent"]
    },
    {
      id: "coding-agent",
      term: "编程智能体",
      en: "Coding Agent",
      cat: "app",
      def: "能读写整个项目、跑测试、看报错、反复修改直到跑通的 AI 编程工具，而不只是补全一行代码。",
      why: "这是目前 Agent 落地最成功的场景，也是很多人第一次真切感受到 AI 在「干活」。",
      vs: "和代码补全的区别：补全猜你下一行，编程 Agent 能改多个文件、自己验证结果，所以对项目理解和工具链要求高得多。",
      rel: ["agent", "vibe-coding", "sandbox"]
    },
    {
      id: "vibe-coding",
      term: "氛围编程",
      en: "Vibe Coding",
      cat: "app",
      def: "用自然语言描述想要什么，让 AI 写代码，自己不逐行细看，跑起来能用的就继续。",
      why: "它极大降低了做原型的门槛，适合做小工具和自己的项目。",
      vs: "和正式工程的区别：不追求可维护性和正确性，适合快速验证想法。要做给别人长期用的东西，还是得看懂关键代码。",
      rel: ["coding-agent", "copilot"]
    },
    {
      id: "deep-research",
      term: "深度研究",
      en: "Deep Research",
      cat: "app",
      def: "给 AI 一个题目，它自己上网搜几十个页面、交叉核对、最后交一份带引用的报告。",
      why: "把「查资料」这件耗时的活儿交出去，是目前最实用的一类 Agent 产品。",
      vs: "和普通搜索的区别：搜索给你链接，深度研究给你结论和证据链，但需要更长时间，也可能引用到不可靠的内容。",
      rel: ["agent", "rag", "hallucination"]
    },
    {
      id: "open-vs-closed",
      term: "开源与闭源模型",
      en: "Open vs Closed",
      cat: "eco",
      def: "闭源：只能通过厂商的接口调用，看不到也拿不到模型本体。开放权重：可以把模型下载到自己机器上跑。",
      why: "这决定了三件事：数据能不能出你的服务器、成本结构、以及能不能自己改。",
      vs: "闭源通常能力上限更高、更省心；开源胜在可控、可私有化、长期成本可控。做敏感数据或强合规场景，开源往往是硬要求。",
      rel: ["weights", "local-deploy", "cost"]
    },
    {
      id: "local-deploy",
      term: "本地部署",
      en: "Local / On-premise Deployment",
      cat: "eco",
      def: "把模型跑在自己的电脑或公司服务器上，数据不出内网。",
      why: "隐私、合规、离线可用，以及长期不按次付费——这是很多企业选它的理由。",
      vs: "和调 API 的区别：本地部署前期麻烦、能力通常弱一档，但没有调用费、没有网络依赖、数据不出门。先用 API 验证想法，再考虑本地化。",
      rel: ["open-vs-closed", "quantization", "cost"]
    },
    {
      id: "benchmark",
      term: "榜单与基准测试",
      en: "Benchmark / Leaderboard",
      cat: "eco",
      def: "用一套标准化题目给模型打分排名，比如人类偏好评测、数学竞赛题、代码题、真实任务集。",
      why: "它是选模型时最省事的参考，但也是被「刷分」最严重的地方。",
      vs: "和真实体验的区别：榜单高不代表适合你的场景。而且题目可能已经进过训练数据。看榜单，更要拿自己的十个真实任务试一遍。",
      rel: ["eval", "deep-research"]
    },
    {
      id: "jailbreak",
      term: "越狱",
      en: "Jailbreak",
      cat: "eco",
      def: "用巧妙的说法绕过模型的安全限制，让它输出本不该输出的内容。",
      why: "了解它才能知道护栏该做到什么程度，也才知道「模型自带的限制」不能当作唯一防线。",
      vs: "和提示注入的区别：越狱是攻击者直接跟模型说话，提示注入是把指令藏在模型会读到的资料里。",
      rel: ["guardrails", "prompt-injection", "alignment"]
    },
    {
      id: "world-model",
      term: "世界模型",
      en: "World Model",
      cat: "eco",
      def: "在内部建立起对物理世界规律的模拟：知道东西会怎么动、动作会导致什么后果。",
      why: "它是让 AI 从「会说话」走向「能预测和行动」的关键，也是视频生成、机器人、自动驾驶共同的基础。",
      vs: "和语言模型的区别：语言模型学的是文字统计规律，世界模型要学的是因果和物理直觉。",
      rel: ["embodied-ai", "multimodal"]
    },
    {
      id: "embodied-ai",
      term: "具身智能",
      en: "Embodied AI",
      cat: "eco",
      def: "给 AI 一副身体（机器人、机械臂、车），让它在真实世界里感知和行动。",
      why: "这是 AI 从屏幕里走出来、真正替代体力和重复劳动的方向。",
      vs: "和纯软件 Agent 的区别：软件里错了可以重试，物理世界里错了会摔坏东西、伤到人，所以对可靠性要求完全不同。",
      rel: ["world-model", "agent"]
    },
    {
      id: "agi",
      term: "通用人工智能",
      en: "AGI",
      cat: "eco",
      def: "能在绝大多数人类任务上达到或超过人类水平的 AI，而不是只在某个领域很强。",
      why: "它是整个行业在讨论的终局目标，也是各种宣传里最常被滥用的词。",
      vs: "和现在的模型区别：现在的是「窄而强」，在自己擅长的任务上很厉害，换个需要长期规划和真实世界反馈的任务就明显不行。",
      rel: ["world-model", "benchmark"]
    }
  ]
};
