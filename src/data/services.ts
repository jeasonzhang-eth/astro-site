export type ServiceLocale = "en" | "zh";

type ServiceContent = {
  title: string;
  summary: string;
  bestFor: string;
  deliverables: string[];
  process: string[];
  evidence: string;
  boundaries: string;
};

type ServicesPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lede: string;
  bestForLabel: string;
  deliverablesLabel: string;
  processLabel: string;
  evidenceLabel: string;
  boundariesLabel: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
};

export const servicesPages: Record<ServiceLocale, ServicesPageContent> = {
  en: {
    title: "Services",
    description: "Practical software, enterprise AI, GEO, workflow automation, and deployment services from Jeason Zhang and Multiple Engine.",
    eyebrow: "Services",
    headline: "Build the working loop, then make it maintainable.",
    lede:
      "The work starts with a concrete operating problem. Each engagement aims to produce an inspectable result: software, a workflow, a structured content system, or a deployment that can be run and maintained.",
    bestForLabel: "Best for",
    deliverablesLabel: "Possible deliverables",
    processLabel: "How we move",
    evidenceLabel: "Relevant evidence",
    boundariesLabel: "Boundaries",
    ctaTitle: "Have a problem that belongs in a working system?",
    ctaText: "Describe the current workflow and the result that needs to become reliable.",
    ctaLabel: "Contact us",
  },
  zh: {
    title: "服务",
    description: "Jeason Zhang 与倍数引擎提供软件研发、企业 AI 落地、GEO、工作流自动化和部署服务。",
    eyebrow: "服务",
    headline: "先把闭环跑起来，再让它可以长期维护。",
    lede:
      "工作从一个具体的运行问题开始。每次合作都应产生可检查的结果：软件、工作流、结构化内容系统，或能够持续运行和维护的部署。",
    bestForLabel: "适合什么问题",
    deliverablesLabel: "可能交付什么",
    processLabel: "如何推进",
    evidenceLabel: "相关能力证据",
    boundariesLabel: "合作边界",
    ctaTitle: "有一个应该进入系统的问题？",
    ctaText: "请先描述当前流程，以及哪个结果必须变得可靠。",
    ctaLabel: "联系合作",
  },
};

export const services: Array<{ slug: string; en: ServiceContent; zh: ServiceContent }> = [
  {
    slug: "product-development",
    en: {
      title: "Software and product development",
      summary: "Turn a defined workflow or product idea into a working web, desktop, browser, or backend surface.",
      bestFor: "Teams that need a focused internal tool, product prototype, customer-facing interface, browser extension, API, or desktop workflow.",
      deliverables: ["Product and technical scope", "Working application or prototype", "Deployment and operating notes", "Source code and maintainable handoff"],
      process: ["Define the user and acceptance condition", "Build the smallest complete loop", "Verify behavior with real inputs", "Document and harden the useful path"],
      evidence: "Capty, Twitter Translator, Routescope, Apple Price, and WeCom KF AI Agent cover desktop, browser, data, and service surfaces.",
      boundaries: "We do not turn an undefined wish list into a fixed-price promise. The first scope must have a testable outcome.",
    },
    zh: {
      title: "软件与产品研发",
      summary: "把定义清楚的流程或产品想法，做成可运行的 Web、桌面端、浏览器或后端界面。",
      bestFor: "需要内部工具、产品原型、客户界面、浏览器扩展、API 或桌面工作流的团队。",
      deliverables: ["产品与技术范围", "可运行应用或原型", "部署和运行说明", "源代码与可维护交接"],
      process: ["明确用户和验收条件", "完成最小闭环", "用真实输入验证", "沉淀并加固有效路径"],
      evidence: "Capty、Twitter Translator、Routescope、Apple Price 和 WeCom KF AI Agent 覆盖桌面端、浏览器、数据与服务端场景。",
      boundaries: "不会把未定义的愿望清单直接包装成固定价格承诺，首个范围必须拥有可测试结果。",
    },
  },
  {
    slug: "enterprise-ai",
    en: {
      title: "Enterprise AI implementation",
      summary: "Connect language and multimodal models to a real workflow, with human review and visible operating state.",
      bestFor: "Customer service, content processing, document extraction, research, internal knowledge, and repetitive decision-support workflows.",
      deliverables: ["Workflow and risk map", "Model and provider integration", "Human review and fallback path", "Evaluation inputs and operating documentation"],
      process: ["Map the existing human workflow", "Choose where AI helps and where it must not decide", "Implement a measurable loop", "Evaluate failures before expanding"],
      evidence: "WeCom KF AI Agent, Capty, translation workflows, and content-processing systems show model integration close to real work.",
      boundaries: "We do not promise fully autonomous replacement when the process still needs judgment, permission, or accountable review.",
    },
    zh: {
      title: "企业 AI 应用与落地",
      summary: "把语言或多模态模型接入真实流程，同时保留人工复核和可见的运行状态。",
      bestFor: "客服、内容处理、文档提取、研究、内部知识和重复决策辅助流程。",
      deliverables: ["流程与风险地图", "模型和供应商接入", "人工复核与降级路径", "评测输入和运行文档"],
      process: ["还原现有人工流程", "明确 AI 能做什么、不能决定什么", "实现可度量闭环", "先评估失败再扩大"],
      evidence: "WeCom KF AI Agent、Capty、翻译工作流和内容处理系统展示了模型如何靠近真实工作。",
      boundaries: "当流程仍需要判断、权限或责任复核时，不承诺用全自动系统完全替代人员。",
    },
  },
  {
    slug: "geo-visibility",
    en: {
      title: "GEO and AI search visibility",
      summary: "Make company facts, expertise, services, and evidence easier for search engines and generative systems to understand and cite.",
      bestFor: "Companies with valuable knowledge and delivery experience that are scattered across pages, documents, sales material, and private workflows.",
      deliverables: ["Visibility and fact audit", "Entity and content architecture", "Structured service and evidence pages", "Monitoring and iteration priorities"],
      process: ["Separate verified facts from claims", "Map entities, questions, and source assets", "Publish durable structured pages", "Monitor visibility and refine evidence"],
      evidence: "This site itself uses bilingual entity pages, project evidence, llms.txt, Sitemap, canonical URLs, and structured data as an inspectable implementation.",
      boundaries: "GEO cannot guarantee a model citation or ranking. The deliverable is a stronger evidence and information system, not a fabricated result.",
    },
    zh: {
      title: "GEO 与 AI 搜索可见度",
      summary: "让公司的事实、能力、服务与证据更容易被搜索引擎和生成式系统理解与引用。",
      bestFor: "拥有专业知识和交付经验，但信息散落在网页、文档、销售材料和内部流程里的企业。",
      deliverables: ["可见度与事实审计", "实体和内容架构", "结构化服务与证据页面", "监控与迭代优先级"],
      process: ["区分已验证事实和宣传主张", "梳理实体、问题和来源资产", "发布稳定的结构化页面", "监控可见度并补强证据"],
      evidence: "这个网站本身使用双语实体页、项目证据、llms.txt、Sitemap、canonical 和结构化数据，形成可检查的实施案例。",
      boundaries: "GEO 不能保证模型引用或排名，交付的是更强的证据和信息系统，而不是编造确定结果。",
    },
  },
  {
    slug: "workflow-automation",
    en: {
      title: "Workflow automation",
      summary: "Reduce repeated copying, sorting, reporting, and handoff work without hiding the process inside a black box.",
      bestFor: "Teams moving information between chats, documents, spreadsheets, browsers, APIs, and recurring reports.",
      deliverables: ["Current-state workflow map", "Automation scripts or service", "Failure and retry handling", "Runbook and ownership boundaries"],
      process: ["Measure repeated friction", "Choose the smallest valuable handoff", "Automate with visible checkpoints", "Add monitoring and recovery"],
      evidence: "Archiving, transcription, translation, reporting, and data-extraction workflows demonstrate repeatable cross-tool automation.",
      boundaries: "Automation should not silently transmit sensitive data or perform irreversible actions without explicit permission and recovery paths.",
    },
    zh: {
      title: "自动化与数字化工作流",
      summary: "减少重复复制、整理、汇报和交接，同时避免把流程藏进不可检查的黑盒。",
      bestFor: "需要在聊天、文档、表格、浏览器、API 和周期报告之间搬运信息的团队。",
      deliverables: ["现状流程图", "自动化脚本或服务", "失败与重试机制", "运行手册与责任边界"],
      process: ["测量重复摩擦", "选择最有价值的最小交接点", "在可见检查点上自动化", "增加监控与恢复"],
      evidence: "归档、转写、翻译、报告和数据提取工作流展示了可重复的跨工具自动化。",
      boundaries: "自动化不应在缺少明确权限和恢复路径时，静默传输敏感数据或执行不可逆操作。",
    },
  },
  {
    slug: "cloud-infrastructure",
    en: {
      title: "Cloud deployment and infrastructure",
      summary: "Ship static sites, APIs, containers, and supporting services with a clear deployment and rollback path.",
      bestFor: "Small teams that need a service moved from a local prototype to a stable, inspectable server environment.",
      deliverables: ["Deployment layout", "Nginx, container, or process configuration", "Health and log checks", "Versioned release and rollback notes"],
      process: ["Inspect the actual host and constraints", "Deploy beside the current version", "Verify locally and publicly", "Switch traffic with a rollback path"],
      evidence: "The deployment of this Astro site uses versioned releases, Nginx configuration tests, public route checks, and preserved rollback state.",
      boundaries: "Availability and response-time commitments require an explicit support agreement; they are not implied by a one-time deployment.",
    },
    zh: {
      title: "云端部署与基础设施",
      summary: "部署静态站点、API、容器和配套服务，并保留清晰的发布与回滚路径。",
      bestFor: "需要把本地原型迁移到稳定、可检查服务器环境的小型团队。",
      deliverables: ["部署结构", "Nginx、容器或进程配置", "健康与日志检查", "版本化发布和回滚说明"],
      process: ["检查真实主机与约束", "在现有版本旁部署", "完成本机和公网验证", "带回滚路径切换流量"],
      evidence: "这个 Astro 站点的部署使用版本化 release、Nginx 配置测试、公网路由检查和保留的回滚状态。",
      boundaries: "可用性和响应时间承诺需要单独的支持协议，不由一次性部署自动产生。",
    },
  },
];
