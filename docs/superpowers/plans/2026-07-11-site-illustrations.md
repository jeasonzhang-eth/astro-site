# Site Illustrations Implementation Plan

**Goal:** 生成一套无文字三联画技术插画，并以一个可复用 Astro 组件嵌入首页、服务页和公司页。

**Architecture:** 单一图片资源通过三个 CSS viewport 裁切复用。组件负责语义、加载策略和变体类，页面只提供双语 alt 与 caption。

**Tech Stack:** GPT Image、Astro、原生 CSS、Node build-contract tests。

## Tasks

1. 生成 3:1 无文字三联画并复制到 `public/images/integrated-work-triptych.png`。
2. 先扩展合同测试，断言资源、组件和三个页面集成，确认红灯。
3. 新增 `src/components/EditorialArtwork.astro`。
4. 在首页、服务页、公司页插入对应 variant 与双语文本。
5. 添加固定 aspect-ratio、CSS 裁切、响应式和 reduced-motion 样式。
6. 运行 `npm run verify` 和桌面/移动浏览器验收。
7. 生成版本化 release，部署并验证正式域名。
8. 合并到 master、推送并更新父仓库 submodule 指针。
