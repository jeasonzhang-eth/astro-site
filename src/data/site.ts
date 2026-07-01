export type Language = "en" | "zh";

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
    overview: "Overview",
    whyItMatters: "Why it matters",
    nextSteps: "Next steps",
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
    overview: "概览",
    whyItMatters: "为什么重要",
    nextSteps: "下一步",
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

export const projects = [
  {
    slug: "capty",
    en: {
      title: "Capty",
      kind: "macOS tool",
      summary: "Speech, capture, and desktop workflow experiments shaped into a practical app.",
      overview: "Capty is a macOS workspace for turning captured audio and desktop context into reusable notes and workflows.",
      why: "It gives the site a concrete product story for desktop AI, speech tooling, and personal automation.",
      next: "Publish release notes, screenshots, and workflow examples as the app evolves.",
    },
    zh: {
      title: "Capty",
      kind: "macOS 工具",
      summary: "把语音、捕捉和桌面工作流实验打磨成可用的日常应用。",
      overview: "Capty 是一个 macOS 工作台，用来把音频捕捉和桌面上下文转成可复用的笔记与流程。",
      why: "它给这个网站提供了一个关于桌面 AI、语音工具和个人自动化的真实产品案例。",
      next: "后续补充版本记录、截图和具体工作流示例。",
    },
  },
  {
    slug: "geoflow",
    en: {
      title: "GEOFlow",
      kind: "growth system",
      summary: "A working space for AI search visibility, content systems, and market operations.",
      overview: "GEOFlow collects experiments around search visibility, AI answer surfaces, and content operations.",
      why: "It is the natural place to document the GEO and SEO playbook behind this site.",
      next: "Add research notes, content templates, and before/after visibility case studies.",
    },
    zh: {
      title: "GEOFlow",
      kind: "增长系统",
      summary: "面向 AI 搜索可见性、内容系统和市场运营的工作空间。",
      overview: "GEOFlow 汇集围绕搜索可见性、AI 答案入口和内容运营的实验。",
      why: "它正好承载这个网站背后的 GEO/SEO 方法论和实操记录。",
      next: "后续补充调研笔记、内容模板和可见性变化案例。",
    },
  },
  {
    slug: "routescope",
    en: {
      title: "Routescope",
      kind: "desktop app",
      summary: "A route-focused interface for inspecting, organizing, and shipping local workflows.",
      overview: "Routescope is a desktop interface concept for making local workflows inspectable and easier to move through.",
      why: "It shows the practical interface layer behind repeated agent and automation work.",
      next: "Document the route model, prototype screenshots, and target users.",
    },
    zh: {
      title: "Routescope",
      kind: "桌面应用",
      summary: "围绕路径、流程和本地工作台构建的检查与组织界面。",
      overview: "Routescope 是一个桌面界面概念，让本地工作流更容易被检查、组织和推进。",
      why: "它展示了智能体和自动化工作背后的实际界面层。",
      next: "后续补充路径模型、原型截图和目标用户。",
    },
  },
];

export const notes = [
  {
    slug: "ai-agent-workflow",
    en: {
      title: "AI agent workflow",
      tag: "AI agents",
      summary: "How to turn agent sessions into reusable project memory, checklists, and shipping habits.",
      overview: "This note will collect the operating patterns that make AI agents useful in real project work.",
    },
    zh: {
      title: "AI 智能体工作流",
      tag: "AI 智能体",
      summary: "如何把智能体会话沉淀成项目记忆、检查清单和交付习惯。",
      overview: "这篇笔记会整理让 AI 智能体真正进入项目工作的操作模式。",
    },
  },
  {
    slug: "desktop-automation",
    en: {
      title: "Desktop automation",
      tag: "desktop automation",
      summary: "Notes on local tools, scripts, capture loops, and Mac-first automation.",
      overview: "This note is the index for desktop automation experiments and repeatable local workflows.",
    },
    zh: {
      title: "桌面自动化",
      tag: "桌面自动化",
      summary: "关于本地工具、脚本、捕捉循环和 Mac 优先自动化的记录。",
      overview: "这篇笔记是桌面自动化实验和可复用本地流程的索引。",
    },
  },
  {
    slug: "creator-tools",
    en: {
      title: "Creator tools",
      tag: "creator tools",
      summary: "Tools and habits for turning raw material into publishable work.",
      overview: "This note tracks the tooling stack behind collecting, editing, and publishing ideas.",
    },
    zh: {
      title: "创作者工具",
      tag: "创作者工具",
      summary: "把原始素材变成可发布作品所需的工具和习惯。",
      overview: "这篇笔记追踪从收集、编辑到发布想法的工具栈。",
    },
  },
  {
    slug: "market-research",
    en: {
      title: "Market research",
      tag: "market research",
      summary: "Research patterns for products, channels, competitors, and user demand.",
      overview: "This note organizes market research methods that can be reused across projects.",
    },
    zh: {
      title: "市场研究",
      tag: "市场研究",
      summary: "围绕产品、渠道、竞品和用户需求的研究方法。",
      overview: "这篇笔记整理可以跨项目复用的市场研究方法。",
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
    ...projects.map((project) => localizePath(language, `projects/${project.slug}`)),
    ...notes.map((note) => localizePath(language, `notes/${note.slug}`)),
  ]);
  return ["/", ...paths];
}
