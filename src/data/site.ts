export type Language = "en" | "zh";

type FAQ = {
  question: string;
  answer: string;
};

type ProjectContent = {
  title: string;
  kind: string;
  summary: string;
  definition: string;
  audience: string;
  overview: string;
  why: string;
  outcomes: string[];
  workflow: string[];
  next: string;
  faq: FAQ[];
};

type NoteContent = {
  title: string;
  tag: string;
  summary: string;
  definition: string;
  overview: string;
  principles: string[];
  checklist: string[];
  examples: string[];
  next: string;
  faq: FAQ[];
};

type AboutContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lede: string;
  experienceTitle: string;
  experience: string[];
  focusTitle: string;
  focus: string[];
  workTitle: string;
  work: string[];
  contactTitle: string;
  contact: string;
};

type HomeContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lede: string;
  identity: string;
  servicesTitle: string;
  servicesIntro: string;
  methodEyebrow: string;
  methodTitle: string;
  methodSteps: string[];
  companyEyebrow: string;
  companyTitle: string;
  companyText: string;
};

export const site = {
  name: "Jeason Zhang",
  url: "https://beishuyinqing.cn",
  author: "Jeason Zhang",
  defaultLanguage: "zh" as Language,
  languages: ["en", "zh"] as Language[],
};

export const labels = {
  en: {
    languageName: "English",
    alternateLanguage: "中文",
    themeLight: "Light",
    themeDark: "Dark",
    viewWork: "View projects",
    readNotes: "Read notes",
    contactAction: "Discuss a project",
    selectedWork: "Evidence in working software",
    currentNotes: "Current notes",
    workspace: "connected practice",
    activeThreads: "person · products · company",
    projectsTitle: "Projects with a working surface.",
    notesTitle: "Notes that keep the reasoning visible.",
    projectLabel: "Projects",
    noteLabel: "Notes",
    servicesLabel: "Services",
    companyLabel: "Company",
    aboutLabel: "About",
    contactLabel: "Contact",
    allProjectsTitle: "All projects",
    allProjectsDescription: "A directory of the products, systems, and interface experiments behind this site.",
    allNotesTitle: "All notes",
    allNotesDescription: "A directory of reusable notes on AI workflows, desktop automation, creator tools, and market research.",
    definition: "Definition",
    bestFor: "Best for",
    overview: "Overview",
    whyItMatters: "Why it matters",
    outcomes: "What it produces",
    workflow: "Workflow",
    principles: "Principles",
    checklist: "Checklist",
    examples: "Examples",
    nextSteps: "Next steps",
    faq: "FAQ",
    footerCompany: "Delivery company",
    footerContact: "Contact",
    footerOffice: "Office",
  },
  zh: {
    languageName: "中文",
    alternateLanguage: "EN",
    themeLight: "日间",
    themeDark: "夜间",
    viewWork: "查看项目",
    readNotes: "阅读笔记",
    contactAction: "沟通合作",
    selectedWork: "运行中的能力证据",
    currentNotes: "当前笔记",
    workspace: "一体化工作面",
    activeThreads: "个人 · 产品 · 公司",
    projectsTitle: "有真实工作面的项目。",
    notesTitle: "把判断过程保留下来的笔记。",
    projectLabel: "项目",
    noteLabel: "笔记",
    servicesLabel: "服务",
    companyLabel: "公司",
    aboutLabel: "作者",
    contactLabel: "联系",
    allProjectsTitle: "所有项目",
    allProjectsDescription: "这个网站背后的产品、系统和界面实验目录。",
    allNotesTitle: "所有笔记",
    allNotesDescription: "关于 AI 工作流、桌面自动化、创作者工具和市场研究的可复用笔记目录。",
    definition: "一句话定义",
    bestFor: "适合谁",
    overview: "概览",
    whyItMatters: "为什么重要",
    outcomes: "产出什么",
    workflow: "工作流",
    principles: "原则",
    checklist: "检查清单",
    examples: "例子",
    nextSteps: "下一步",
    faq: "常见问题",
    footerCompany: "交付公司",
    footerContact: "联系",
    footerOffice: "办公地址",
  },
} satisfies Record<Language, Record<string, string>>;

export const home: Record<Language, HomeContent> = {
  en: {
    title: "Jeason Zhang × Multiple Engine",
    description: "Jeason Zhang and Multiple Engine build practical software, enterprise AI workflows, GEO systems, automation, and deployable tools.",
    eyebrow: "Jeason Zhang · Founder of Multiple Engine",
    headline: "Turn real business problems into working tools and systems.",
    lede: "I build software, enterprise AI workflows, GEO systems, and automation around work that needs to become reliable. Multiple Engine is the company that carries cooperation and delivery.",
    identity: "Software engineer · AI product builder · company founder",
    servicesTitle: "Five ways to move a real workflow forward.",
    servicesIntro: "The service is not a slide deck. It is a working loop with visible inputs, outputs, limits, and ownership.",
    methodEyebrow: "Working method",
    methodTitle: "Make the result inspectable from the first useful loop.",
    methodSteps: [
      "Define the real problem and acceptance condition.",
      "Build the smallest end-to-end loop that can be used.",
      "Verify it with code, data, and operating evidence.",
      "Turn the useful path into a maintainable system and handoff.",
    ],
    companyEyebrow: "Multiple Engine",
    companyTitle: "Personal accountability, formal company delivery.",
    companyText: "Shenzhen Multiple Engine Software Technology Co., Ltd. is the cooperation and delivery entity behind this work.",
  },
  zh: {
    title: "Jeason Zhang × 倍数引擎",
    description: "Jeason Zhang 与倍数引擎围绕真实业务问题构建软件、企业 AI 工作流、GEO 系统、自动化和可部署工具。",
    eyebrow: "Jeason Zhang · 倍数引擎创始人",
    headline: "把真实业务问题，做成可以运行的工具与系统。",
    lede: "我围绕那些必须变得可靠的工作，构建软件、企业 AI 工作流、GEO 系统和自动化。倍数引擎负责承接正式合作与交付。",
    identity: "软件工程师 · AI 产品构建者 · 公司创始人",
    servicesTitle: "用五种能力，把一个真实流程向前推进。",
    servicesIntro: "服务不是一份演示文稿，而是输入、输出、边界和责任都清楚的可运行闭环。",
    methodEyebrow: "工作方式",
    methodTitle: "从第一个有用闭环开始，让结果可以被检查。",
    methodSteps: [
      "明确真实问题和验收条件。",
      "完成能够使用的最小端到端闭环。",
      "用代码、数据和运行证据验证。",
      "把有效路径沉淀为可维护系统和交付文档。",
    ],
    companyEyebrow: "倍数引擎",
    companyTitle: "个人负责到底，公司正式承接。",
    companyText: "深圳市倍数引擎软件技术有限责任公司是这些工作的合作与交付主体。",
  },
};

export const about: Record<Language, AboutContent> = {
  en: {
    title: "About",
    description: "About Jeason Zhang, founder of Multiple Engine and a software engineer building practical AI, desktop, browser, data, and workflow systems.",
    eyebrow: "Author and founder",
    headline: "I build small systems that keep useful work from disappearing.",
    lede: "I use this site as a public workbench for software products, enterprise AI workflows, GEO, desktop automation, and research. The common thread is simple: capture real work, make it inspectable, then turn it into a tool or durable operating surface.",
    experienceTitle: "Engineering path",
    experience: [
      "About eight years of software engineering and product delivery experience.",
      "Early work in Java HMI and quadruped robotics, followed by Qt interface development.",
      "Hands-on work across JavaScript, HTML, CSS, C/C++, Python crawling, and data processing.",
      "Current focus on enterprise AI implementation, GEO, and tools that connect models to real workflows.",
    ],
    focusTitle: "Current focus",
    focus: [
      "Mac OS desktop tools for capture, transcription, and local workflows.",
      "Browser extensions and lightweight interfaces that keep context close to the page.",
      "AI-assisted publishing and evidence systems for SEO and GEO.",
      "Small company delivery systems that join code, documentation, and operating evidence.",
    ],
    workTitle: "How I work",
    work: [
      "Build the smallest working loop first, then document what the loop teaches.",
      "Prefer tools that expose state clearly: files, routes, transcripts, diffs, and dashboards.",
      "Treat writing as part of the product surface, not as a separate marketing layer.",
      "Keep project pages honest by tying them to real repositories, notes, and changelogs.",
    ],
    contactTitle: "Company relationship",
    contact: "I founded Multiple Engine to provide a clear company structure for cooperation, delivery, and long-term maintenance around this work.",
  },
  zh: {
    title: "关于作者",
    description: "关于 Jeason Zhang：倍数引擎创始人，构建实用 AI、桌面端、浏览器、数据与工作流系统的软件工程师。",
    eyebrow: "作者与创始人",
    headline: "我做一些小系统，让有价值的工作不再消失。",
    lede: "我把这个网站当作公开工作台，用来整理软件产品、企业 AI 工作流、GEO、桌面自动化和研究。背后的共同线索很简单：捕捉真实工作，让它可检查，再把它变成工具或可以长期运行的工作面。",
    experienceTitle: "工程经历",
    experience: [
      "约八年软件工程与产品交付经验。",
      "早期从事 Java 人机交互并参与四足机器人项目，随后使用 Qt 开发界面软件。",
      "持续实践 JavaScript、HTML、CSS、C/C++、Python 爬虫与数据处理。",
      "当前聚焦企业 AI 落地、GEO，以及把模型接入真实工作流的工具。",
    ],
    focusTitle: "当前关注",
    focus: [
      "用于捕捉、转写和本地工作流的 Mac OS 桌面工具。",
      "让上下文留在页面里的浏览器扩展和轻量界面。",
      "面向 SEO 与 GEO 的 AI 辅助发布和证据系统。",
      "把代码、文档和运行证据连接起来的小型公司交付系统。",
    ],
    workTitle: "我的工作方式",
    work: [
      "先做最小可用闭环，再记录这个闭环教会了什么。",
      "偏好能清楚暴露状态的工具：文件、路径、转写稿、diff 和 dashboard。",
      "把写作当作产品界面的一部分，而不是单独的营销层。",
      "让项目页尽量诚实：连接真实仓库、笔记和 changelog。",
    ],
    contactTitle: "与公司的关系",
    contact: "我创办倍数引擎，为这些工作提供清晰的合作、交付和长期维护主体。",
  },
};

export const projects: Array<{ slug: string; en: ProjectContent; zh: ProjectContent }> = [
  {
    slug: "capty",
    en: {
      title: "Capty",
      kind: "Mac OS tool",
      summary: "A Mac-first capture workspace for turning speech and desktop context into reusable notes.",
      definition: "Capty is a local-first Mac OS tool for recording, transcribing, organizing, and reusing spoken work.",
      audience: "Founders, researchers, operators, and builders who think out loud and need their spoken context to become searchable project material.",
      overview:
        "Capty turns voice capture into a working surface. Instead of treating transcripts as one-off files, it keeps recordings close to projects, notes, and follow-up actions so the material can be reused after the meeting, call, or thinking session ends.",
      why:
        "A lot of valuable work happens before it becomes a document: calls, rough explanations, decisions, and half-formed product thinking. Capty gives that raw material a place to land, which makes it a strong product story for personal AI, desktop workflows, and knowledge capture.",
      outcomes: [
        "Structured transcripts that can be reused in notes, specs, briefs, and follow-up tasks.",
        "A repeatable capture loop for meetings, solo thinking, interviews, and product research.",
        "A Mac OS product surface for experimenting with speech-to-text and local workflow automation.",
      ],
      workflow: [
        "Capture audio from a meeting, file, or thinking session.",
        "Transcribe and preserve useful context instead of losing it in a raw recording.",
        "Turn the transcript into notes, action items, or source material for a project page.",
        "Review the output and feed the useful pieces back into the next workflow.",
      ],
      next: "Add product screenshots, release notes, short demos, and specific examples of transcript-to-document workflows.",
      faq: [
        {
          question: "Is Capty a transcription app or a workflow app?",
          answer: "It starts with transcription, but the long-term value is workflow: capturing spoken context and turning it into reusable project material.",
        },
        {
          question: "Why is this on a personal site?",
          answer: "It is one of the concrete products behind the site's themes: desktop AI, capture loops, and practical automation.",
        },
      ],
    },
    zh: {
      title: "Capty",
      kind: "Mac OS 工具",
      summary: "一个 Mac 优先的捕捉工作台，把语音和桌面上下文转成可复用的笔记。",
      definition: "Capty 是一个本地优先的 Mac OS 工具，用来录音、转写、整理并复用口头工作内容。",
      audience: "适合经常通过说话思考的创业者、研究者、运营者和产品构建者，把语音上下文沉淀成可搜索的项目素材。",
      overview:
        "Capty 把语音捕捉变成一个工作面。它不把转写稿当成一次性文件，而是让录音、项目、笔记和后续行动靠在一起，让会议、访谈或独立思考结束后的素材还能继续被使用。",
      why:
        "很多重要工作发生在正式文档之前：会议、解释、决策、产品想法和访谈片段。Capty 给这些原始材料一个落点，所以它很适合作为个人 AI、桌面工作流和知识捕捉的产品案例。",
      outcomes: [
        "可复用到笔记、规格文档、简报和待办里的结构化转写稿。",
        "适用于会议、独立思考、访谈和产品研究的固定捕捉循环。",
        "一个 Mac OS 产品界面，用来实验语音转文字和本地自动化。",
      ],
      workflow: [
        "从会议、音频文件或独立思考中捕捉声音。",
        "转写并保留有价值的上下文，而不是把内容留在原始录音里。",
        "把转写稿整理成笔记、行动项或项目页面的素材。",
        "复盘输出，把有用片段喂回下一个工作流。",
      ],
      next: "补充产品截图、版本记录、短演示，以及从转写稿到文档的具体案例。",
      faq: [
        {
          question: "Capty 是转写工具还是工作流工具？",
          answer: "它从转写开始，但长期价值是工作流：把口头上下文捕捉下来，并转成可复用的项目材料。",
        },
        {
          question: "为什么这个项目放在个人网站上？",
          answer: "它是这个网站主题背后的真实产品之一：桌面 AI、捕捉循环和实用自动化。",
        },
      ],
    },
  },
  {
    slug: "twitter-translator",
    en: {
      title: "Twitter Translator",
      kind: "browser extension",
      summary: "A Chrome extension for translating X posts and long articles with your own LLM provider.",
      definition: "Twitter Translator is a Manifest V3 browser extension that adds translation controls directly inside X timelines, detail pages, and article pages.",
      audience: "Researchers, investors, builders, and multilingual readers who use X as a source of market, technical, or creator signal.",
      overview:
        "Twitter Translator keeps translation close to the reading surface. Instead of copying posts into a separate tool, it injects a translation action where the user is already reading and sends the content to an OpenAI-compatible provider configured by the user.",
      why:
        "X is noisy, fast, and multilingual. A practical translator helps preserve context while scanning foreign-language posts, following overseas builders, or reading long-form X articles without breaking flow.",
      outcomes: [
        "Inline translation buttons for timeline posts and detail pages.",
        "Automatic translation support for X Articles and longer reading surfaces.",
        "A user-controlled provider setup so translation can run through the user's preferred LLM endpoint.",
      ],
      workflow: [
        "Open X and read the timeline as usual.",
        "Click Translate under a post or open a detail page with translation enabled.",
        "Send the content to the configured LLM provider.",
        "Read the translated result inline without leaving the original context.",
      ],
      next: "Add screenshots, setup instructions, privacy notes, and examples for common multilingual research workflows.",
      faq: [
        {
          question: "Does Twitter Translator require a hosted backend?",
          answer: "The project is designed around user-provided OpenAI-compatible LLM settings, so translation does not need a separate product backend.",
        },
        {
          question: "Why translate inside X instead of using a separate app?",
          answer: "Inline translation keeps the original post, author, thread, and surrounding context visible while reading.",
        },
      ],
    },
    zh: {
      title: "Twitter Translator",
      kind: "浏览器扩展",
      summary: "一个用自有 LLM 服务翻译 X 推文和长文章的 Chrome 扩展。",
      definition: "Twitter Translator 是一个 Manifest V3 浏览器扩展，把翻译按钮直接加到 X 的时间线、详情页和文章页里。",
      audience: "适合把 X 当作市场、技术或创作者信号来源的研究者、投资者、构建者和多语言读者。",
      overview:
        "Twitter Translator 把翻译留在阅读现场。用户不用把推文复制到另一个工具里，而是在正在阅读的位置直接触发翻译，并把内容发送到自己配置的 OpenAI 兼容服务。",
      why:
        "X 信息快、噪声大、语言混杂。一个贴在原页面里的翻译工具，可以在阅读海外开发者、市场讨论和长文时保留上下文，不打断信息流。",
      outcomes: [
        "时间线和详情页里的内联翻译按钮。",
        "对 X Articles 和长阅读页面的自动翻译支持。",
        "用户可控的 LLM provider 设置，可以接入自己的模型服务。",
      ],
      workflow: [
        "照常打开 X 并阅读时间线。",
        "在推文下方点击 Translate，或进入详情页触发翻译。",
        "把内容发送到已配置的 LLM provider。",
        "在原始上下文旁边读取翻译结果。",
      ],
      next: "补充截图、设置说明、隐私说明，以及常见多语言研究场景示例。",
      faq: [
        {
          question: "Twitter Translator 需要独立后端吗？",
          answer: "项目围绕用户自有的 OpenAI 兼容 LLM 配置设计，因此翻译本身不需要单独的产品后端。",
        },
        {
          question: "为什么不直接用独立翻译 App？",
          answer: "内联翻译能让原推文、作者、线程和周围上下文保持可见，阅读时不需要来回切换。",
        },
      ],
    },
  },
  {
    slug: "routescope",
    en: {
      title: "Routescope",
      kind: "desktop app",
      summary: "A route-focused interface for inspecting, organizing, and shipping local workflows.",
      definition: "Routescope is a desktop interface concept for making local workflows visible, navigable, and easier to repeat.",
      audience: "Power users, developers, and agent-heavy operators who move between scripts, browser sessions, local files, and project tasks.",
      overview:
        "Routescope treats a workflow as a route: a sequence of context, tools, decisions, and outputs. The goal is to make repeated work easier to inspect, resume, and improve instead of leaving it scattered across terminal history and browser tabs.",
      why:
        "AI-assisted work often fails at the handoff layer. The model may produce output, but the human still needs to understand what happened, where files changed, and what should happen next. Routescope explores the interface for that layer.",
      outcomes: [
        "A map of the steps, files, commands, and decisions behind a local workflow.",
        "A way to resume repeated tasks without reconstructing context from memory.",
        "A product direction for bridging agent output and human operational control.",
      ],
      workflow: [
        "Start with a recurring task such as publishing, research, QA, or content cleanup.",
        "Represent the task as a route with inputs, tools, checkpoints, and outputs.",
        "Inspect each step for friction, missing context, or manual repetition.",
        "Turn the stable parts into templates, scripts, or agent instructions.",
      ],
      next: "Document the route model, add prototype screenshots, and publish examples from real local workflows.",
      faq: [
        {
          question: "Is Routescope a task manager?",
          answer: "Not exactly. It is closer to a workflow inspection surface: what happened, what changed, and how to repeat or improve the route.",
        },
        {
          question: "Why focus on desktop workflows?",
          answer: "The desktop is where many useful tools meet: files, terminals, browsers, local apps, and AI agents. That makes it the natural surface for workflow visibility.",
        },
      ],
    },
    zh: {
      title: "Routescope",
      kind: "桌面应用",
      summary: "围绕路径、流程和本地工作台构建的检查与组织界面。",
      definition: "Routescope 是一个桌面界面概念，让本地工作流变得可见、可导航、可复用。",
      audience: "适合在脚本、浏览器、本地文件和项目任务之间频繁切换的高级用户、开发者和智能体重度使用者。",
      overview:
        "Routescope 把工作流看成一条路线：由上下文、工具、决策和产出组成。目标是让重复工作更容易检查、恢复和改进，而不是散落在终端历史和浏览器标签页里。",
      why:
        "AI 辅助工作经常卡在交接层。模型可能产出了结果，但人仍然要理解发生了什么、哪些文件变了、下一步该做什么。Routescope 探索的就是这个界面层。",
      outcomes: [
        "一张记录本地工作流步骤、文件、命令和决策的路线图。",
        "一种不用靠记忆重建上下文就能恢复重复任务的方式。",
        "一个连接智能体输出和人类操作控制的产品方向。",
      ],
      workflow: [
        "从发布、研究、QA 或内容清理这类重复任务开始。",
        "把任务表示成包含输入、工具、检查点和输出的路线。",
        "检查每一步的摩擦、缺失上下文和手工重复。",
        "把稳定部分沉淀成模板、脚本或智能体指令。",
      ],
      next: "补充路线模型、原型截图，并发布来自真实本地工作流的例子。",
      faq: [
        {
          question: "Routescope 是任务管理器吗？",
          answer: "不完全是。它更像一个工作流检查界面：发生了什么、改了什么、如何复用或改进这条路线。",
        },
        {
          question: "为什么关注桌面工作流？",
          answer: "桌面是文件、终端、浏览器、本地应用和 AI 智能体交汇的地方，因此天然适合做工作流可见性。",
        },
      ],
    },
  },
  {
    slug: "apple-price",
    en: {
      title: "Apple Price",
      kind: "price tool",
      summary: "A cross-country Apple product price comparison tool with currency conversion.",
      definition: "Apple Price compares official Apple Store prices across countries and converts them into a common currency for quick purchase decisions.",
      audience: "Travelers, Apple buyers, resellers, and anyone deciding where a product is actually cheaper after exchange rates.",
      overview:
        "Apple Price gathers product prices from multiple Apple regional stores and normalizes them through exchange rates. It turns scattered country pages into a simple comparison surface.",
      why:
        "Apple prices vary by region, tax, currency, and release timing. A lightweight comparison tool makes the real purchase difference easier to see before buying or asking someone to bring a device back.",
      outcomes: [
        "A searchable comparison of Apple product prices across regions.",
        "Currency-normalized prices for easier country-by-country decisions.",
        "A small data product that can grow into alerts, history, and buying guides.",
      ],
      workflow: [
        "Collect official Apple Store prices from target countries.",
        "Normalize product names and variants.",
        "Convert prices with current exchange-rate data.",
        "Present the results in a simple table for comparison.",
      ],
      next: "Add product history, tax notes, update timestamps, and country-specific buying caveats.",
      faq: [
        {
          question: "Does Apple Price include taxes and import duties?",
          answer: "The current project is best treated as a price comparison baseline. Taxes, duties, and local promotions should be documented per country.",
        },
        {
          question: "Why is this useful?",
          answer: "It turns a messy manual check across many Apple regional stores into one repeatable comparison workflow.",
        },
      ],
    },
    zh: {
      title: "Apple Price",
      kind: "价格工具",
      summary: "一个带汇率换算的 Apple 产品跨国家价格比较工具。",
      definition: "Apple Price 比较不同国家 Apple Store 官方价格，并换算到统一货币，帮助快速判断哪里买更划算。",
      audience: "适合旅行者、Apple 买家、代购/转售者，以及需要根据汇率判断购买地的人。",
      overview:
        "Apple Price 从多个国家和地区的 Apple 官网收集产品价格，再通过汇率归一化展示。它把分散的区域页面变成一个简单的比较界面。",
      why:
        "Apple 产品价格会受地区、税费、汇率和发布时间影响。轻量的比较工具能让真实购买差异更容易被看见。",
      outcomes: [
        "跨地区 Apple 产品价格的可搜索比较表。",
        "经过汇率归一化的价格，方便按国家做购买决策。",
        "一个可以继续扩展到价格提醒、历史记录和购买指南的小型数据产品。",
      ],
      workflow: [
        "收集目标国家 Apple Store 官方价格。",
        "归一化产品名称和规格型号。",
        "用当前汇率换算价格。",
        "用简单表格展示比较结果。",
      ],
      next: "补充价格历史、税费说明、更新时间和各国购买注意事项。",
      faq: [
        {
          question: "Apple Price 包含税费和关税吗？",
          answer: "当前更适合作为价格比较基线。税费、关税和本地促销需要按国家单独补充说明。",
        },
        {
          question: "这个工具有什么用？",
          answer: "它把手动打开多个 Apple 区域官网比价的流程，变成一个可重复的比较工作流。",
        },
      ],
    },
  },
  {
    slug: "usd-liquidity",
    en: {
      title: "USD Liquidity",
      kind: "finance dashboard",
      summary: "A personal dashboard for tracking US dollar liquidity indicators.",
      definition: "USD Liquidity is a finance dashboard that tracks monetary liquidity signals such as Fed assets, Treasury cash, and reverse repo balances.",
      audience: "Macro investors, crypto market watchers, and builders who want a simple view of dollar liquidity conditions.",
      overview:
        "USD Liquidity turns several public macro indicators into a focused dashboard. The goal is not to predict markets mechanically, but to keep liquidity context visible when reading risk assets and policy changes.",
      why:
        "Dollar liquidity affects risk appetite, market stress, and the background conditions for many asset classes. A personal dashboard makes the signal easier to revisit than scattered data links.",
      outcomes: [
        "A consolidated view of key dollar liquidity indicators.",
        "A reusable charting surface for macro notes and market observations.",
        "A foundation for adding annotations, source links, and update cadence.",
      ],
      workflow: [
        "Pull public macro indicator data.",
        "Compute or display liquidity-related series.",
        "Render the dashboard for quick reading.",
        "Use the chart context when writing market notes.",
      ],
      next: "Add source citations, update dates, explanatory notes, and a short methodology page.",
      faq: [
        {
          question: "Is USD Liquidity an investment signal?",
          answer: "It is context, not a trading system. The dashboard helps make liquidity conditions visible, but decisions need broader analysis.",
        },
        {
          question: "Why make a personal dashboard?",
          answer: "A personal dashboard keeps the exact indicators and formulas you care about in one stable place.",
        },
      ],
    },
    zh: {
      title: "USD Liquidity",
      kind: "金融仪表盘",
      summary: "一个追踪美元流动性指标的个人 dashboard。",
      definition: "USD Liquidity 是一个金融仪表盘，用来追踪 Fed 资产、TGA、逆回购等美元流动性相关指标。",
      audience: "适合宏观投资者、加密市场观察者，以及需要快速理解美元流动性背景的人。",
      overview:
        "USD Liquidity 把多个公开宏观指标整理成一个聚焦 dashboard。它不是机械预测市场，而是在阅读风险资产和政策变化时保留流动性背景。",
      why:
        "美元流动性会影响风险偏好、市场压力和多类资产的背景条件。个人 dashboard 比分散的数据链接更容易持续复盘。",
      outcomes: [
        "关键美元流动性指标的集中视图。",
        "可复用到宏观笔记和市场观察里的图表界面。",
        "继续添加注释、来源链接和更新时间的基础。",
      ],
      workflow: [
        "拉取公开宏观指标数据。",
        "计算或展示流动性相关序列。",
        "渲染 dashboard 供快速阅读。",
        "在写市场笔记时引用图表上下文。",
      ],
      next: "补充数据来源、更新时间、解释说明和简短方法论页面。",
      faq: [
        {
          question: "USD Liquidity 是投资信号吗？",
          answer: "它是上下文，不是交易系统。仪表盘帮助看见流动性环境，但决策仍需要更完整的分析。",
        },
        {
          question: "为什么要做个人 dashboard？",
          answer: "个人 dashboard 可以把你关心的指标和公式固定在一个稳定位置。",
        },
      ],
    },
  },
  {
    slug: "wecom-kf-ai-agent",
    en: {
      title: "WeCom KF AI\u00A0Agent",
      kind: "customer service agent",
      summary: "A minimal WeCom customer-service AI agent demo with callback handling and reply logic.",
      definition: "WeCom KF AI Agent is a backend demo for receiving WeCom customer-service messages and routing them through a replaceable reply function.",
      audience: "Builders who need a minimal WeCom customer-service integration before adding a real LLM or business workflow.",
      overview:
        "The project keeps the first integration loop intentionally small: receive callbacks, parse events, generate a reply, and send it back. That makes it a good starting point before introducing complex agent memory or production support logic.",
      why:
        "Customer-service integrations often fail because the first callback and message loop is harder than expected. This project isolates that loop and leaves the reply logic easy to replace.",
      outcomes: [
        "A working callback path for WeCom customer-service messages.",
        "A simple reply function that can later be replaced with an LLM.",
        "A testable backend skeleton for future customer-service automation.",
      ],
      workflow: [
        "Configure WeCom callback credentials.",
        "Receive and parse incoming customer-service events.",
        "Generate a reply through a small replaceable function.",
        "Send the reply back through the WeCom API.",
      ],
      next: "Add deployment notes, security checklist, LLM integration examples, and production limitations.",
      faq: [
        {
          question: "Is this a production customer-service system?",
          answer: "No. It is a minimal integration demo that proves the callback and reply loop before a fuller system is added.",
        },
        {
          question: "Where does the AI logic live?",
          answer: "The reply generation is intentionally isolated so it can be replaced with an LLM or business-specific agent later.",
        },
      ],
    },
    zh: {
      title: "WeCom KF AI\u00A0Agent",
      kind: "客服智能体",
      summary: "一个处理企业微信客服回调和回复逻辑的最简 AI Agent demo。",
      definition: "WeCom KF AI Agent 是一个后端 demo，用来接收企业微信客服消息，并通过可替换的回复函数生成响应。",
      audience: "适合想先跑通企业微信客服接入，再逐步加入真实 LLM 或业务工作流的开发者。",
      overview:
        "这个项目把第一条集成闭环刻意保持得很小：接收回调、解析事件、生成回复、发送回去。它适合作为加入复杂智能体记忆或生产客服逻辑之前的起点。",
      why:
        "客服集成常常卡在第一条回调和消息闭环。这个项目把这件事单独拆出来，并让回复逻辑保持容易替换。",
      outcomes: [
        "一条可工作的企业微信客服消息回调路径。",
        "一个后续可替换成 LLM 的简单回复函数。",
        "一个可测试的客服自动化后端骨架。",
      ],
      workflow: [
        "配置企业微信客服回调凭据。",
        "接收并解析进来的客服事件。",
        "通过小型可替换函数生成回复。",
        "调用企业微信 API 把回复发回去。",
      ],
      next: "补充部署说明、安全检查清单、LLM 接入示例和生产限制。",
      faq: [
        {
          question: "这是生产级客服系统吗？",
          answer: "不是。它是一个最小集成 demo，用来先验证回调和回复闭环。",
        },
        {
          question: "AI 逻辑在哪里？",
          answer: "回复生成被刻意隔离，后续可以替换成 LLM 或业务专属智能体。",
        },
      ],
    },
  },
];

export const notes: Array<{ slug: string; en: NoteContent; zh: NoteContent }> = [
  {
    slug: "ai-agent-workflow",
    en: {
      title: "AI agent workflow",
      tag: "AI agents",
      summary: "How to turn agent sessions into reusable project memory, checklists, and shipping habits.",
      definition: "An AI agent workflow is a repeatable way to move from intent to inspected output with memory, checkpoints, and human review.",
      overview:
        "The useful unit is not a single prompt. It is a loop: give the agent context, let it act, inspect the result, preserve what matters, and turn the learning into the next run.",
      principles: [
        "Start from the repository or workspace reality, not from an abstract prompt.",
        "Make the agent show its work through files, tests, diffs, and small status updates.",
        "Save reusable decisions in project docs, changelogs, or structured data.",
        "Keep the human in charge of taste, risk, and final judgment.",
      ],
      checklist: [
        "Define the concrete output before starting.",
        "Read the existing project instructions and current git state.",
        "Work in small verified steps rather than one giant generation.",
        "Run checks that match the risk: typecheck, build, tests, or visual review.",
        "Record the useful learning where the next session can find it.",
      ],
      examples: [
        "Turning a website feature request into code, build verification, and a changelog entry.",
        "Converting a research question into a structured page with FAQ and internal links.",
        "Using an agent to inspect a local workflow and produce repeatable steps.",
      ],
      next: "Add concrete case studies from this site build: language routing, SEO structure, and content expansion.",
      faq: [
        {
          question: "What makes an agent workflow different from prompting?",
          answer: "Prompting asks for an answer. A workflow defines context, actions, checks, memory, and what counts as done.",
        },
        {
          question: "Where should project memory live?",
          answer: "Close to the work: AGENTS.md, changelogs, data files, specs, or wiki pages that future sessions will actually read.",
        },
      ],
    },
    zh: {
      title: "AI 智能体工作流",
      tag: "AI 智能体",
      summary: "如何把智能体会话沉淀成项目记忆、检查清单和交付习惯。",
      definition: "AI 智能体工作流，是一套从意图到可检查产出的重复方法，包含记忆、检查点和人的复核。",
      overview:
        "有用的单位不是单条 prompt，而是一个循环：给智能体上下文，让它行动，检查结果，保留重要信息，再把学习结果带入下一轮。",
      principles: [
        "从仓库或工作区的真实状态出发，而不是从抽象提示词出发。",
        "让智能体通过文件、测试、diff 和短状态更新展示工作过程。",
        "把可复用决策保存到项目文档、changelog 或结构化数据里。",
        "让人保留品味、风险和最终判断权。",
      ],
      checklist: [
        "开始前定义清楚具体产出。",
        "读取现有项目指令和当前 git 状态。",
        "用小步验证推进，而不是一次性生成一大坨。",
        "根据风险运行检查：类型检查、构建、测试或视觉 review。",
        "把有用学习记录到下次会话能找到的位置。",
      ],
      examples: [
        "把网站功能请求变成代码、构建验证和 changelog 记录。",
        "把研究问题整理成带 FAQ 和内链的结构化页面。",
        "用智能体检查本地工作流，并产出可重复步骤。",
      ],
      next: "补充这个网站搭建过程中的真实案例：多语言路由、SEO 结构和内容扩展。",
      faq: [
        {
          question: "智能体工作流和提示词有什么区别？",
          answer: "提示词是在要答案；工作流是在定义上下文、行动、检查、记忆和完成标准。",
        },
        {
          question: "项目记忆应该放在哪里？",
          answer: "放在离工作最近的地方：AGENTS.md、changelog、数据文件、规格文档或未来会话真的会读取的 wiki 页面。",
        },
      ],
    },
  },
  {
    slug: "desktop-automation",
    en: {
      title: "Desktop automation",
      tag: "desktop automation",
      summary: "Notes on local tools, scripts, capture loops, and Mac-first automation.",
      definition: "Desktop automation is the practice of connecting local files, apps, browsers, scripts, and AI tools into repeatable personal workflows.",
      overview:
        "The desktop is still the control room for a lot of real work. Automation here is not only about saving clicks. It is about preserving context across apps and turning repeated manual routines into inspected systems.",
      principles: [
        "Automate the boring middle, not the judgment at the end.",
        "Prefer visible, reversible steps before hiding everything behind a button.",
        "Keep local files and generated outputs organized enough for future agents to inspect.",
        "Treat screenshots, clipboard content, browser state, and terminal output as workflow inputs.",
      ],
      checklist: [
        "Identify a routine that repeats at least weekly.",
        "Write down its inputs, tools, decisions, and final output.",
        "Script the stable parts first.",
        "Keep a manual escape hatch for risky or ambiguous steps.",
        "Document the workflow where it can be reused.",
      ],
      examples: [
        "Capturing an audio note, transcribing it, and turning it into a project brief.",
        "Opening a local dev server, checking the browser, and committing verified UI changes.",
        "Collecting source material into a structured content page.",
      ],
      next: "Add diagrams and step-by-step recipes for the desktop workflows behind this site.",
      faq: [
        {
          question: "Should everything be automated?",
          answer: "No. Automate repeated mechanical steps. Keep high-risk decisions visible and reviewed.",
        },
        {
          question: "Why Mac-first?",
          answer: "This workspace currently uses Mac OS tools, local files, browser sessions, and desktop apps as the main operating surface.",
        },
      ],
    },
    zh: {
      title: "桌面自动化",
      tag: "桌面自动化",
      summary: "关于本地工具、脚本、捕捉循环和 Mac 优先自动化的记录。",
      definition: "桌面自动化，是把本地文件、应用、浏览器、脚本和 AI 工具连接成可重复个人工作流的实践。",
      overview:
        "桌面仍然是很多真实工作的控制室。这里的自动化不只是少点几下，而是在应用之间保留上下文，把重复手工流程变成可检查的系统。",
      principles: [
        "自动化无聊的中间步骤，而不是替代最后的判断。",
        "在把一切藏进按钮之前，先保留可见、可回退的步骤。",
        "让本地文件和生成物足够有序，未来智能体能检查。",
        "把截图、剪贴板、浏览器状态和终端输出都视为工作流输入。",
      ],
      checklist: [
        "找出至少每周重复一次的流程。",
        "写下它的输入、工具、决策和最终产出。",
        "优先脚本化稳定部分。",
        "为高风险或模糊步骤保留人工出口。",
        "把流程记录到可以复用的位置。",
      ],
      examples: [
        "捕捉一段语音笔记，转写后整理成项目 brief。",
        "启动本地开发服务，检查浏览器，再提交通过验证的 UI 改动。",
        "把源材料整理成结构化内容页面。",
      ],
      next: "补充这个网站背后的桌面工作流图和分步骤操作配方。",
      faq: [
        {
          question: "所有东西都应该自动化吗？",
          answer: "不。自动化重复机械步骤，把高风险决策保持可见并复核。",
        },
        {
          question: "为什么是 Mac 优先？",
          answer: "当前工作区主要以 Mac OS 工具、本地文件、浏览器会话和桌面应用作为操作界面。",
        },
      ],
    },
  },
  {
    slug: "creator-tools",
    en: {
      title: "Creator tools",
      tag: "creator tools",
      summary: "Tools and habits for turning raw material into publishable work.",
      definition: "Creator tools are the capture, editing, packaging, and publishing systems that turn scattered raw material into finished artifacts.",
      overview:
        "Publishing consistently is less about inspiration than throughput. The toolchain needs to move ideas from capture to outline, draft, review, visual packaging, and distribution without losing the original signal.",
      principles: [
        "Capture raw material before trying to polish it.",
        "Separate thinking, drafting, editing, and packaging into different passes.",
        "Keep source material linked so claims can be traced back.",
        "Design repeatable formats for notes, landing pages, screenshots, and social posts.",
      ],
      checklist: [
        "Collect the raw source and write down why it matters.",
        "Extract the core claim or useful lesson.",
        "Choose the output shape: note, guide, project page, image card, or thread.",
        "Edit for clarity before adding style.",
        "Publish with metadata, links, and an obvious next step.",
      ],
      examples: [
        "Turning a product build session into a short project update.",
        "Turning research notes into a searchable evergreen page.",
        "Turning a workflow lesson into a checklist and visual card.",
      ],
      next: "Add the actual publishing templates used for this site and related content channels.",
      faq: [
        {
          question: "What is the most important creator tool?",
          answer: "A reliable capture system. If the raw material is lost, the editing stack does not matter.",
        },
        {
          question: "How does this relate to GEO?",
          answer: "Clear creator workflows produce pages with better structure, stronger evidence, and more quotable answers.",
        },
      ],
    },
    zh: {
      title: "创作者工具",
      tag: "创作者工具",
      summary: "把原始素材变成可发布作品所需的工具和习惯。",
      definition: "创作者工具，是把零散原始材料转成成品的捕捉、编辑、包装和发布系统。",
      overview:
        "稳定发布靠的不是灵感，而是吞吐。工具链需要把想法从捕捉、提纲、草稿、复核、视觉包装一路推到分发，同时不丢掉原始信号。",
      principles: [
        "先捕捉原材料，再尝试打磨。",
        "把思考、起草、编辑和包装拆成不同轮次。",
        "保留源材料链接，让观点能追溯。",
        "为笔记、落地页、截图和社交内容设计可复用格式。",
      ],
      checklist: [
        "收集原始来源，并写下它为什么重要。",
        "提取核心观点或有用经验。",
        "选择输出形态：笔记、指南、项目页、图文卡片或 thread。",
        "先编辑清晰度，再加风格。",
        "发布时带上元信息、链接和明确下一步。",
      ],
      examples: [
        "把一次产品构建会话变成短项目更新。",
        "把研究笔记变成可搜索的长期页面。",
        "把工作流经验变成检查清单和视觉卡片。",
      ],
      next: "补充这个网站和相关内容渠道实际使用的发布模板。",
      faq: [
        {
          question: "最重要的创作者工具是什么？",
          answer: "可靠的捕捉系统。原材料丢了，后面的编辑工具再好也没意义。",
        },
        {
          question: "这和 GEO 有什么关系？",
          answer: "清晰的创作工作流会产出结构更好、证据更强、更容易被引用的页面。",
        },
      ],
    },
  },
  {
    slug: "market-research",
    en: {
      title: "Market research",
      tag: "market research",
      summary: "Research patterns for products, channels, competitors, and user demand.",
      definition: "Market research is the practice of reducing uncertainty about users, demand, channels, alternatives, and willingness to pay.",
      overview:
        "Good research does not try to look impressive. It tries to improve decisions. The useful output is a sharper view of who the user is, what they already do, what they compare against, and where distribution might actually work.",
      principles: [
        "Start with a decision the research should improve.",
        "Separate user language from founder language.",
        "Look for existing behavior before asking for stated preference.",
        "Compare alternatives, not just direct competitors.",
        "Turn findings into content, product, and distribution experiments.",
      ],
      checklist: [
        "Define the target user and the decision to make.",
        "Collect search queries, communities, reviews, competitor pages, and sales notes.",
        "Extract repeated pains, desired outcomes, objections, and buying triggers.",
        "Map alternatives users already choose.",
        "Convert the research into pages, experiments, and product changes.",
      ],
      examples: [
        "Using competitor pages to identify missing comparison content.",
        "Using community discussions to discover the language users use for a problem.",
        "Using sales objections to write FAQ sections that also help search visibility.",
      ],
      next: "Add research templates for competitor scans, user language maps, and SEO/GEO content briefs.",
      faq: [
        {
          question: "When is market research useful?",
          answer: "When it changes a decision: what to build, who to serve, what to say, or where to distribute.",
        },
        {
          question: "How does research become SEO content?",
          answer: "Repeated user questions become pages. Objections become FAQ. Comparisons become structured explainers.",
        },
      ],
    },
    zh: {
      title: "市场研究",
      tag: "市场研究",
      summary: "围绕产品、渠道、竞品和用户需求的研究方法。",
      definition: "市场研究，是降低用户、需求、渠道、替代方案和付费意愿不确定性的实践。",
      overview:
        "好的研究不是为了显得专业，而是为了改善决策。有用产出是更清楚地知道用户是谁、他们现在怎么做、拿你和谁比较，以及哪里可能真的有分发机会。",
      principles: [
        "从一个需要改善的决策开始。",
        "区分用户语言和创始人语言。",
        "先看已有行为，再问口头偏好。",
        "比较替代方案，而不只是直接竞品。",
        "把发现转成内容、产品和分发实验。",
      ],
      checklist: [
        "定义目标用户和要做的决策。",
        "收集搜索词、社区讨论、评论、竞品页面和销售记录。",
        "提取重复痛点、期望结果、反对意见和购买触发点。",
        "画出用户已经在选择的替代方案。",
        "把研究转成页面、实验和产品改动。",
      ],
      examples: [
        "用竞品页面发现缺失的对比内容。",
        "用社区讨论发现用户描述问题时真正使用的语言。",
        "用销售异议写 FAQ，同时提升搜索可见性。",
      ],
      next: "补充竞品扫描、用户语言地图和 SEO/GEO 内容 brief 的研究模板。",
      faq: [
        {
          question: "市场研究什么时候有用？",
          answer: "当它能改变决策时：做什么、服务谁、怎么说、在哪里分发。",
        },
        {
          question: "研究如何变成 SEO 内容？",
          answer: "重复用户问题变成页面，异议变成 FAQ，对比变成结构化解释页。",
        },
      ],
    },
  },
];

export function localizePath(language: Language, path = "") {
  const cleanPath = path.replace(/^\/|\/$/g, "");
  return cleanPath ? `/${language}/${cleanPath}/` : `/${language}/`;
}

export function alternateLanguage(language: Language): Language {
  return language === "en" ? "zh" : "en";
}

export function canonicalUrl(pathname: string) {
  return `${site.url}${pathname}`;
}

export function allSeoPaths() {
  const paths = site.languages.flatMap((language) => [
    localizePath(language),
    localizePath(language, "about"),
    localizePath(language, "services"),
    localizePath(language, "company"),
    localizePath(language, "contact"),
    localizePath(language, "projects"),
    ...projects.map((project) => localizePath(language, `projects/${project.slug}`)),
    localizePath(language, "notes"),
    ...notes.map((note) => localizePath(language, `notes/${note.slug}`)),
  ]);
  return ["/", ...paths];
}
