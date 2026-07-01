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

export const site = {
  name: "Jeason Zhang",
  url: "https://jeasonzhang-eth.github.io/astro-site",
  author: "Jeason Zhang",
  defaultLanguage: "en" as Language,
  languages: ["en", "zh"] as Language[],
};

export const labels = {
  en: {
    languageName: "English",
    alternateLanguage: "中文",
    themeLight: "Light",
    themeDark: "Dark",
    viewWork: "View work",
    readNotes: "Read notes",
    selectedWork: "Selected work",
    currentNotes: "Current notes",
    workspace: "workspace",
    activeThreads: "04 active threads",
    projectsTitle: "Projects with a working surface.",
    notesTitle: "What the site is tracking.",
    projectLabel: "Project",
    noteLabel: "Note",
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
  },
  zh: {
    languageName: "中文",
    alternateLanguage: "EN",
    themeLight: "日间",
    themeDark: "夜间",
    viewWork: "查看作品",
    readNotes: "阅读笔记",
    selectedWork: "精选项目",
    currentNotes: "当前笔记",
    workspace: "工作台",
    activeThreads: "04 条活跃线索",
    projectsTitle: "有真实工作面的项目。",
    notesTitle: "这个站点正在追踪什么。",
    projectLabel: "项目",
    noteLabel: "笔记",
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
  },
} satisfies Record<Language, Record<string, string>>;

export const home = {
  en: {
    title: "Jeason Zhang",
    description: "A personal Astro site for Jeason's projects, notes, and field work.",
    eyebrow: "Personal field notes",
    headline: "Build useful things, then leave a clear trail.",
    lede: "A compact home for software experiments, AI workflow notes, and projects that turn rough ideas into tools.",
  },
  zh: {
    title: "Jeason Zhang",
    description: "Jeason 的个人 Astro 网站，用来整理项目、笔记和一线工作记录。",
    eyebrow: "个人现场笔记",
    headline: "把东西做出来，也把路径留下来。",
    lede: "这里收纳软件实验、AI 工作流笔记，以及把粗糙想法推进成可用工具的项目记录。",
  },
} satisfies Record<Language, Record<string, string>>;

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
    slug: "geoflow",
    en: {
      title: "GEOFlow",
      kind: "growth system",
      summary: "A working system for AI search visibility, content structure, and market operations.",
      definition: "GEOFlow is a content and research operating system for being understood by search engines and generative answer engines.",
      audience: "Builders and small teams who want their expertise, products, and research to show up clearly in both classic search and AI-generated answers.",
      overview:
        "GEOFlow connects market research, page structure, source material, and publishing rhythm. It treats SEO and GEO as the same underlying discipline: create useful, well-structured, citable pages that answer real questions.",
      why:
        "AI answer engines need clean signals: clear definitions, first-hand context, durable URLs, structured data, and pages that can be quoted without guesswork. GEOFlow is where those practices become reusable templates.",
      outcomes: [
        "A repeatable page model for projects, notes, comparisons, and explainers.",
        "A content backlog driven by user questions, product evidence, and market research.",
        "A technical publishing baseline with sitemap, robots, llms.txt, canonical URLs, hreflang, and JSON-LD.",
      ],
      workflow: [
        "Collect questions from search, sales calls, support, communities, and competitor pages.",
        "Group questions into pages with one clear job: define, compare, explain, or prove.",
        "Publish pages with structured headings, FAQ, sources, and internal links.",
        "Review what gets indexed, cited, or reused, then update pages with stronger evidence.",
      ],
      next: "Turn this page into a public playbook with templates for project pages, comparison pages, and AI-search-ready notes.",
      faq: [
        {
          question: "Is GEO different from SEO?",
          answer: "GEO focuses on how generative engines understand and cite content. In practice, strong GEO starts with strong technical SEO plus clearer structure and better evidence.",
        },
        {
          question: "What should be published first?",
          answer: "Start with pages that answer specific questions about real projects. Thin pages about abstract keywords rarely help.",
        },
      ],
    },
    zh: {
      title: "GEOFlow",
      kind: "增长系统",
      summary: "一个面向 AI 搜索可见性、内容结构和市场运营的工作系统。",
      definition: "GEOFlow 是一个内容与研究操作系统，让搜索引擎和生成式答案引擎更容易理解你。",
      audience: "适合希望自己的专业、产品和研究同时出现在传统搜索与 AI 答案里的构建者和小团队。",
      overview:
        "GEOFlow 把市场研究、页面结构、源材料和发布节奏连起来。它把 SEO 和 GEO 视为同一件事的两面：创造有用、结构清楚、可以被引用的页面，回答真实问题。",
      why:
        "AI 答案引擎需要干净信号：清晰定义、一手上下文、稳定 URL、结构化数据，以及不需要猜测就能引用的页面。GEOFlow 就是把这些实践沉淀成模板的地方。",
      outcomes: [
        "可复用的页面模型，用于项目页、笔记页、对比页和解释页。",
        "由用户问题、产品证据和市场研究驱动的内容 backlog。",
        "包含 sitemap、robots、llms.txt、canonical、hreflang 和 JSON-LD 的技术发布底座。",
      ],
      workflow: [
        "从搜索、销售沟通、客服、社区和竞品页面收集问题。",
        "把问题归类成有明确任务的页面：定义、对比、解释或证明。",
        "用结构化标题、FAQ、来源和内链发布页面。",
        "观察哪些内容被收录、引用或复用，再用更强证据更新页面。",
      ],
      next: "把这个页面扩展成公开 playbook，提供项目页、对比页和 AI 搜索友好笔记的模板。",
      faq: [
        {
          question: "GEO 和 SEO 有什么区别？",
          answer: "GEO 更关注生成式引擎如何理解和引用内容。实际操作上，好的 GEO 通常从扎实的技术 SEO、更清晰的结构和更强证据开始。",
        },
        {
          question: "应该先发布什么内容？",
          answer: "先发布能回答真实项目具体问题的页面。围绕抽象关键词做薄页面，通常帮助不大。",
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
    localizePath(language, "projects"),
    ...projects.map((project) => localizePath(language, `projects/${project.slug}`)),
    localizePath(language, "notes"),
    ...notes.map((note) => localizePath(language, `notes/${note.slug}`)),
  ]);
  return ["/", ...paths];
}
