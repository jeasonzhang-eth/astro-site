export type Locale = "en" | "zh";

type CompanyPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lede: string;
  relationshipTitle: string;
  relationship: string;
  fieldsTitle: string;
  fields: string[];
  principlesTitle: string;
  principles: string[];
  missionTitle: string;
  mission: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
};

type ContactPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lede: string;
  companyLabel: string;
  phoneLabel: string;
  addressLabel: string;
  icpLabel: string;
  callAction: string;
  callDescription: string;
  cooperationTitle: string;
  cooperationText: string;
};

export const company = {
  legalNameZh: "深圳市倍数引擎软件技术有限责任公司",
  legalNameEn: "Shenzhen Multiple Engine Software Technology Co., Ltd.",
  shortNameZh: "倍数引擎",
  shortNameEn: "Multiple Engine",
  phoneDisplay: "185 9314 1894",
  phoneHref: "tel:18593141894",
  addressZh: "深圳市龙岗区龙城街道黄阁坑社区腾飞路 9 号龙岗创投大厦 1 号楼 B509",
  addressEn: "Room B509, Building 1, Longgang Venture Capital Building, No. 9 Tengfei Road, Longcheng Subdistrict, Longgang District, Shenzhen, China",
  icpNumber: "粤ICP备2026080071号",
  icpUrl: "https://beian.miit.gov.cn",
  verificationFile: "WW_verify_Xs9oqr5SLRAcpl58.txt",
};

export const companyPages: Record<Locale, CompanyPageContent> = {
  en: {
    title: "Company",
    description: "Multiple Engine is the company behind Jeason Zhang's software, enterprise AI, GEO, automation, and deployment work.",
    eyebrow: "Multiple Engine",
    headline: "A small software company built around inspectable work.",
    lede:
      "Shenzhen Multiple Engine Software Technology Co., Ltd. is the delivery and cooperation entity behind this site. We turn defined business problems into software, AI workflows, and durable operating systems.",
    relationshipTitle: "How the company and Jeason connect",
    relationship:
      "Jeason Zhang is the founder and primary builder. His public projects show the engineering approach; Multiple Engine provides the formal company structure for client cooperation, delivery, and long-term maintenance.",
    fieldsTitle: "Fields of work",
    fields: [
      "Software and product development across web, desktop, browser, and backend surfaces.",
      "Enterprise AI applications that connect models to real business workflows.",
      "GEO and AI search visibility based on factual, structured content assets.",
      "Workflow automation, data processing, deployment, and operating documentation.",
    ],
    principlesTitle: "Engineering principles",
    principles: [
      "Define the problem and acceptance conditions before expanding scope.",
      "Build the smallest useful loop and verify it in a real operating environment.",
      "Keep state visible through files, routes, data, logs, and clear handoff documents.",
      "Prefer maintainable systems and honest evidence over inflated capability claims.",
    ],
    missionTitle: "Mission",
    mission:
      "Use technology to amplify effective work and become a dependable partner for practical software and AI implementation.",
    ctaTitle: "Bring us a real operating problem.",
    ctaText: "Start with the workflow, constraint, or outcome you need to make reliable.",
    ctaLabel: "Contact us",
  },
  zh: {
    title: "公司",
    description: "倍数引擎是 Jeason Zhang 开展软件研发、企业 AI 落地、GEO、自动化和部署服务的公司主体。",
    eyebrow: "倍数引擎",
    headline: "一家围绕真实问题和可检查交付建立的软件公司。",
    lede:
      "深圳市倍数引擎软件技术有限责任公司是这个网站背后的合作与交付主体。我们把定义清楚的业务问题推进成软件、AI 工作流和可以长期运行的系统。",
    relationshipTitle: "公司与 Jeason 的关系",
    relationship:
      "Jeason Zhang 是倍数引擎创始人和主要构建者。公开项目呈现工程方法，倍数引擎则负责正式合作、项目交付和长期维护。",
    fieldsTitle: "业务领域",
    fields: [
      "覆盖 Web、桌面端、浏览器扩展和后端服务的软件与产品研发。",
      "把模型能力接入真实业务流程的企业 AI 应用与落地。",
      "围绕事实资产和结构化内容开展 GEO 与 AI 搜索可见度建设。",
      "工作流自动化、数据处理、云端部署和可维护的交付文档。",
    ],
    principlesTitle: "工程原则",
    principles: [
      "先明确问题和验收条件，再决定是否扩大范围。",
      "先建立最小可用闭环，再在真实运行环境里验证。",
      "通过文件、路径、数据、日志和清晰文档让状态可检查。",
      "优先交付可维护系统和真实证据，不做夸大的能力承诺。",
    ],
    missionTitle: "我们的使命",
    mission: "用技术放大有效工作的价值，成为企业软件与 AI 落地过程中值得信赖的合作方。",
    ctaTitle: "把一个真实的业务问题交给我们。",
    ctaText: "可以从需要稳定下来的流程、约束或结果开始。",
    ctaLabel: "联系合作",
  },
};

export const contactPages: Record<Locale, ContactPageContent> = {
  en: {
    title: "Contact",
    description: "Contact Jeason Zhang and Multiple Engine about software, enterprise AI, GEO, workflow automation, or deployment work.",
    eyebrow: "Contact",
    headline: "Start with the problem that needs to work reliably.",
    lede:
      "A useful first conversation describes the current workflow, what is failing or too expensive, and what a successful outcome would look like.",
    companyLabel: "Company",
    phoneLabel: "Phone",
    addressLabel: "Office",
    icpLabel: "ICP registration",
    callAction: "Call now",
    callDescription: "Use a short first call to confirm the problem, boundaries, and next step.",
    cooperationTitle: "Good starting points",
    cooperationText:
      "Software delivery, enterprise AI implementation, GEO visibility, automation, data workflows, and cloud deployment are all suitable starting points when the desired result can be made concrete.",
  },
  zh: {
    title: "联系合作",
    description: "联系 Jeason Zhang 与倍数引擎，沟通软件研发、企业 AI 落地、GEO、自动化或部署工作。",
    eyebrow: "联系合作",
    headline: "从那个必须稳定运行的问题开始。",
    lede: "一次有效的初次沟通，应当说明当前流程、哪里正在失效或成本过高，以及什么结果可以被视为成功。",
    companyLabel: "公司主体",
    phoneLabel: "联系电话",
    addressLabel: "办公地址",
    icpLabel: "ICP备案",
    callAction: "立即拨打",
    callDescription: "先用一次短沟通确认问题、边界和下一步。",
    cooperationTitle: "适合从这些问题开始",
    cooperationText:
      "软件交付、企业 AI 落地、GEO 可见度、自动化、数据工作流和云端部署都可以成为合作入口，前提是目标能够被说清楚并被验证。",
  },
};
