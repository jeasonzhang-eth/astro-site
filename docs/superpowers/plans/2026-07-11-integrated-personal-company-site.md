# Jeason × 倍数引擎一体化网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Jeason 双语 Astro 个人站扩展为“个人品牌 + 真实项目 + 倍数引擎商业服务”的统一网站，并以可回滚方式替换 `beishuyinqing.cn` 旧单页官网。

**Architecture:** 保留 Astro 静态站和当前无框架客户端脚本结构，以 `site.ts` 继续承载既有项目与笔记，在独立的 `company.ts` 和 `services.ts` 中维护公司事实与服务内容。新增三组双语静态路由，扩展共享布局、页脚、SEO 路径和结构化数据；以构建产物合同测试、浏览器交互检查和版本化服务器 release 共同完成验收。

**Tech Stack:** Astro 7、TypeScript 6、原生 CSS、Node.js 内置测试运行器、Nginx、SSH/rsync 或 tar/scp。

## Global Constraints

- 保留当前 Astro 设计系统，不引入 UI 框架、CSS 框架或额外客户端依赖。
- 保留中英文和日夜主题切换。
- 生产主域名固定为 `https://beishuyinqing.cn`，`www` 归一到主域名。
- 公司事实必须使用已验证内容：公司全称、电话 `185 9314 1894`、地址和 `粤ICP备2026080071号`。
- 不创建虚构客户案例、客户 Logo、邮箱、微信二维码、业绩数字或“7×24”等无条件承诺。
- 现有项目必须被描述为真实产品、自建工具或实验，不伪装成客户案例。
- 旧 `/var/www/html` 和历史 release 在验证稳定前不得删除。
- 每次实现提交都同步更新 `CHANGELOG.md`。
- 所有点击交互具有可见焦点；响应式覆盖至少 390px 和桌面宽度；尊重 `prefers-reduced-motion`。

---

## File Structure

**Create:**

- `src/data/company.ts`：公司主体、联系信息、公司页和联系页双语内容。
- `src/data/services.ts`：五项服务及服务页双语内容。
- `src/pages/[lang]/services.astro`：服务页。
- `src/pages/[lang]/company.astro`：公司页。
- `src/pages/[lang]/contact.astro`：联系页。
- `tests/integrated-site.test.mjs`：生产构建产物合同测试。
- `public/WW_verify_Xs9oqr5SLRAcpl58.txt`：旧站验证文件。

**Modify:**

- `package.json`：增加 `test` 和 `verify` 脚本。
- `astro.config.mjs`：更新生产域名。
- `src/data/site.ts`：站点 URL、导航标签、首页与作者文案、SEO 路径。
- `src/layouts/BaseLayout.astro`：扩展导航、移动端导航、全站页脚和公司事实。
- `src/pages/[lang]/index.astro`：统一首页叙事、服务摘要、工作方式和公司 CTA。
- `src/pages/[lang]/about.astro`：补充创始人与工程经历。
- `src/pages/llms.txt.ts`：加入服务、公司、联系入口。
- `src/pages/sitemap.xml.ts`：继续从完整 SEO 路径生成 Sitemap。
- `src/styles/global.css`：新增服务、公司、联系、页脚与响应式样式。
- `CHANGELOG.md`：记录测试、内容、路由、SEO 和部署变化。

## Task 1: 建立生产构建合同测试

**Files:**
- Create: `tests/integrated-site.test.mjs`
- Modify: `package.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: `npm run build` 生成的 `dist/`。
- Produces: `npm test`，验证所有新页面、公司事实、生产域名、结构化数据、Sitemap、llms 和验证文件。

- [ ] **Step 1: 编写失败测试**

测试使用 `node:test`、`node:assert/strict`、`node:fs/promises`，至少包含以下断言：

```js
const requiredFiles = [
  "dist/en/services/index.html",
  "dist/zh/services/index.html",
  "dist/en/company/index.html",
  "dist/zh/company/index.html",
  "dist/en/contact/index.html",
  "dist/zh/contact/index.html",
  "dist/WW_verify_Xs9oqr5SLRAcpl58.txt",
];
```

并检查：

- 中文首页包含“把真实业务问题，做成可以运行的工具与系统”。
- 英文首页包含对应英文主标题。
- 公司页包含公司全称、电话、地址和 ICP。
- 首页 HTML 包含 `Person` 和 `Organization` JSON-LD。
- 服务页包含五项服务标题。
- canonical 使用 `https://beishuyinqing.cn`。
- `sitemap.xml`、`llms.txt` 包含新增路由。
- 验证文件内容等于旧站的 16 字节原始内容。

`package.json` 增加：

```json
"test": "npm run build && node --test tests/*.test.mjs",
"verify": "npm run astro -- check && npm test"
```

- [ ] **Step 2: 运行红灯测试**

Run: `npm test`

Expected: FAIL，至少报告缺少 `/services/`、`/company/` 或 `/contact/` 构建文件。

- [ ] **Step 3: 提交测试合同**

```bash
git add package.json tests/integrated-site.test.mjs CHANGELOG.md
git commit -m "test: define integrated site contract"
```

## Task 2: 建立公司与服务内容真源

**Files:**
- Create: `src/data/company.ts`
- Create: `src/data/services.ts`
- Modify: `src/data/site.ts`
- Create: `public/WW_verify_Xs9oqr5SLRAcpl58.txt`
- Modify: `astro.config.mjs`
- Modify: `CHANGELOG.md`
- Test: `tests/integrated-site.test.mjs`

**Interfaces:**
- Produces: `company`, `companyPages`, `contactPages`，以及 `services`, `servicesPages` 双语数据对象。
- Produces: `site.url === "https://beishuyinqing.cn"`。
- Produces: `allSeoPaths()` 包含 `services`、`company`、`contact`。

- [ ] **Step 1: 添加公司事实模型**

`company.ts` 包含稳定事实：

- legalNameZh
- legalNameEn
- phoneDisplay
- phoneHref
- addressZh
- addressEn
- icpNumber
- icpUrl
- verificationFile

并包含公司页、联系页的双语标题、描述、使命、原则和 CTA 文案。

- [ ] **Step 2: 添加服务模型**

五项服务 slug 固定为：

- `product-development`
- `enterprise-ai`
- `geo-visibility`
- `workflow-automation`
- `cloud-infrastructure`

每项服务双语字段包括：title、summary、bestFor、deliverables、process、evidence、boundaries。

- [ ] **Step 3: 更新站点全局内容**

- 将 `site.url` 与 `astro.config.mjs` 更新为生产域名。
- 新增导航标签、页脚标签、合作 CTA 标签。
- 首页文案改为已批准的统一定位。
- 作者页增加创始人关系和工程经历。
- `allSeoPaths()` 加入三组新路由。

- [ ] **Step 4: 加入验证文件**

从服务器原文件复制到 `public/WW_verify_Xs9oqr5SLRAcpl58.txt`，不得手写猜测内容。

- [ ] **Step 5: 运行类型检查**

Run: `npm run astro -- check`

Expected: PASS，0 errors、0 warnings。

- [ ] **Step 6: 提交内容真源**

```bash
git add astro.config.mjs public src/data CHANGELOG.md
git commit -m "feat: add company and service content"
```

## Task 3: 扩展共享导航与全站页脚

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `CHANGELOG.md`
- Test: `tests/integrated-site.test.mjs`

**Interfaces:**
- Consumes: `company` 和 `labels`。
- Produces: 所有页面一致的服务、公司、作者、联系导航及公司页脚。

- [ ] **Step 1: 扩展导航**

导航必须包含 Project、Note、Services、Company、About、Contact；中文显示对应中文标签。语言切换在新增路由上必须跳转到相同语义页面。

- [ ] **Step 2: 添加页脚**

页脚显示：个人名、公司名、电话、地址精简版、备案链接和版权信息。电话使用 `tel:`，备案链接使用外部安全属性。

- [ ] **Step 3: 改善移动端导航**

在窄屏使用可换行的紧凑导航带，不新增复杂抽屉脚本。确保 390px 下没有水平溢出。

- [ ] **Step 4: 运行检查**

Run: `npm run astro -- check`

Expected: PASS。

- [ ] **Step 5: 提交共享框架**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css CHANGELOG.md
git commit -m "feat: add company navigation and footer"
```

## Task 4: 实现服务、公司和联系页面

**Files:**
- Create: `src/pages/[lang]/services.astro`
- Create: `src/pages/[lang]/company.astro`
- Create: `src/pages/[lang]/contact.astro`
- Modify: `src/styles/global.css`
- Modify: `CHANGELOG.md`
- Test: `tests/integrated-site.test.mjs`

**Interfaces:**
- Consumes: `services`, `servicesPages`, `companyPages`, `contactPages`。
- Produces: 六个静态双语页面和 `Service`、`Organization` JSON-LD。

- [ ] **Step 1: 实现服务页**

页面结构：标题与说明、五项服务目录、每项服务的适用问题/交付物/过程/能力证据/边界、联系 CTA。

- [ ] **Step 2: 实现公司页**

页面结构：公司定位、与 Jeason 的关系、业务领域、工程原则、使命、联系 CTA。加入 `Organization` JSON-LD。

- [ ] **Step 3: 实现联系页**

展示电话、地址、公司全称、ICP，并提供明显可点击电话按钮。首版不增加表单。

- [ ] **Step 4: 运行合同测试**

Run: `npm test`

Expected: 部分断言转绿；首页与 SEO 相关断言仍可能失败。

- [ ] **Step 5: 提交新增页面**

```bash
git add src/pages src/styles/global.css CHANGELOG.md
git commit -m "feat: add services company and contact pages"
```

## Task 5: 重构首页和作者页叙事

**Files:**
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/pages/[lang]/about.astro`
- Modify: `src/styles/global.css`
- Modify: `CHANGELOG.md`
- Test: `tests/integrated-site.test.mjs`

**Interfaces:**
- Consumes: 统一首页数据、服务数据、公司数据、项目数据。
- Produces: “个人身份 → 项目证据 → 服务能力 → 工作方式 → 公司合作”的完整首页路径。

- [ ] **Step 1: 更新首页 JSON-LD**

首页同时输出 `Person`、`Organization` 和 `WebSite`；明确 founder/worksFor 关系，URL 全部来自 `site.url`。

- [ ] **Step 2: 更新首屏**

使用批准的标题、身份说明和两个 CTA。保留当前站点克制的编辑型布局，不增加通用 hero badge 或装饰性统计数字。

- [ ] **Step 3: 保留并重新解释项目区**

项目继续作为真实能力证据，卡片进入现有项目详情，不标记为客户案例。

- [ ] **Step 4: 增加服务摘要与工作方式**

首页展示五项服务摘要和四步工作方式；每项服务链接到服务页对应锚点。

- [ ] **Step 5: 增加公司合作区**

使用公司全称、简短定位和联系 CTA 收尾。

- [ ] **Step 6: 更新作者页**

补充约八年工程经历、倍数引擎创始人身份、当前 AI 落地和 GEO 重点。

- [ ] **Step 7: 运行类型和合同测试**

Run: `npm run verify`

Expected: PASS。

- [ ] **Step 8: 提交首页整合**

```bash
git add src/pages src/styles/global.css CHANGELOG.md
git commit -m "feat: integrate personal brand and company story"
```

## Task 6: 完成 SEO、GEO 与生成文件

**Files:**
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/sitemap.xml.ts`（仅在需要时）
- Modify: `src/components/Seo.astro`（仅在 hreflang 或 canonical 需要修正时）
- Modify: `CHANGELOG.md`
- Test: `tests/integrated-site.test.mjs`

**Interfaces:**
- Produces: 新路由的 canonical、hreflang、Sitemap、llms、Organization/Service JSON-LD。

- [ ] **Step 1: 更新 llms.txt**

加入中英文首页、项目、笔记、服务、公司、作者和联系入口，并描述个人与公司的关系。

- [ ] **Step 2: 验证 Sitemap**

确认 `allSeoPaths()` 输出全部新增路径，XML 使用生产域名。

- [ ] **Step 3: 验证页面元数据**

构建后检查新增页面 title、description、canonical、hreflang 和 JSON-LD。

- [ ] **Step 4: 运行完整验证**

Run: `npm run verify`

Expected: PASS，所有 Node 合同测试通过。

- [ ] **Step 5: 提交 SEO/GEO**

```bash
git add src/components src/pages CHANGELOG.md
git commit -m "feat: publish company seo and geo metadata"
```

## Task 7: 浏览器与响应式验收

**Files:**
- Modify: 仅修改验收中发现问题的 Astro/CSS 文件
- Modify: `CHANGELOG.md`（若发生修复）

**Interfaces:**
- Consumes: 本地生产或开发服务器。
- Produces: 桌面和 390px 宽度的浏览器验收证据。

- [ ] **Step 1: 启动独立本地服务器**

Run: `npm run dev -- --host 127.0.0.1 --port 4324`

- [ ] **Step 2: 桌面流程**

验证：中文首页加载 → 日夜切换 → English → Services → Company → Contact → 电话链接存在 → 无控制台错误。

- [ ] **Step 3: 移动端流程**

将视口设为 390×844，验证导航无溢出、卡片单列、CTA 可见、电话可点击。

- [ ] **Step 4: 视觉自审**

检查层级、间距、阅读长度、公司与个人身份是否清楚；只保留一个“倍数信号”视觉签名，删除无功能装饰。

- [ ] **Step 5: 修复并复测**

每次修改后 reload，重复原失败流程并运行 `npm run verify`。

- [ ] **Step 6: 提交 QA 修复**

如有修改：

```bash
git add src CHANGELOG.md
git commit -m "fix: polish integrated site experience"
```

## Task 8: 版本化部署和正式域名替换

**Files:**
- Server create: `/var/www/astro-site/releases/<release>/`
- Server modify: `/var/www/astro-site/current`
- Server modify: `/etc/nginx/sites-available/beishuyinqing.cn`
- Preserve: `/var/www/html`

**Interfaces:**
- Consumes: 已通过验证的 `dist/`。
- Produces: `https://beishuyinqing.cn` 上的新 Astro 站和一次 reload 可完成的回滚路径。

- [ ] **Step 1: 记录旧配置和旧站校验值**

保存 Nginx 配置副本，记录 `/var/www/html/index.html` SHA-256 和当前 `current` release。

- [ ] **Step 2: 上传新 release**

使用新目录，不覆盖现有 release；解压后设置只读静态文件权限。

- [ ] **Step 3: IP 预验证**

通过 `http://81.71.118.36` 检查首页、新路由、CSS、Sitemap、llms 和验证文件。

- [ ] **Step 4: 切换域名 root**

仅将 HTTPS server 的 `root` 从 `/var/www/html` 改为 `/var/www/astro-site/current`；保留 SSL、HTTP 跳转和 server_name。

- [ ] **Step 5: 测试并 reload**

Run remotely: `sudo nginx -t && sudo systemctl reload nginx`

Expected: configuration successful，Nginx active。

- [ ] **Step 6: 公网验收**

验证：

- `https://beishuyinqing.cn/zh/`
- `https://beishuyinqing.cn/en/`
- `/services/`、`/company/`、`/contact/`
- `/sitemap.xml`、`/llms.txt`
- `/WW_verify_Xs9oqr5SLRAcpl58.txt`
- `www` 行为
- 页面标题、正文和控制台

- [ ] **Step 7: 回滚演练检查**

不执行破坏性回滚，但确认备份配置存在、旧 `/var/www/html` 完整、回滚命令可用。

## Task 9: 完成分支和仓库同步

**Files:**
- Modify: `CHANGELOG.md`（最终部署记录）

- [ ] **Step 1: 最终验证**

Run: `npm run verify`

Run: `git diff --check`

Run: `git status --short`

- [ ] **Step 2: 提交部署记录**

```bash
git add CHANGELOG.md
git commit -m "docs: record integrated site deployment"
```

- [ ] **Step 3: 推送功能分支**

```bash
git push -u origin codex/integrate-multiple-engine-site
```

- [ ] **Step 4: 按 finishing-a-development-branch 流程完成**

在所有测试和公网验证成功后，决定 fast-forward 到 `master`、创建 PR 或保留分支。由于用户已授权直接完成，推荐验证后 fast-forward `master`、推送并更新父仓库 submodule 指针。
