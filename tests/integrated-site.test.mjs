import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");

const routeFiles = [
  "dist/en/services/index.html",
  "dist/zh/services/index.html",
  "dist/en/company/index.html",
  "dist/zh/company/index.html",
  "dist/en/contact/index.html",
  "dist/zh/contact/index.html",
];

const serviceNamesZh = [
  "软件与产品研发",
  "企业 AI 应用与落地",
  "GEO 与 AI 搜索可见度",
  "自动化与数字化工作流",
  "云端部署与基础设施",
];

const serviceNamesEn = [
  "Software and product development",
  "Enterprise AI implementation",
  "GEO and AI search visibility",
  "Workflow automation",
  "Cloud deployment and infrastructure",
];

test("build publishes all integrated bilingual routes", async () => {
  for (const file of routeFiles) {
    await assert.doesNotReject(access(file), `missing build output: ${file}`);
  }
});

test("homepages connect the personal brand to the company", async () => {
  const [zh, en] = await Promise.all([read("dist/zh/index.html"), read("dist/en/index.html")]);

  assert.match(zh, /把真实业务问题，做成可以运行的工具与系统/);
  assert.match(en, /Turn real business problems into working tools and systems/);
  assert.match(zh, /深圳市倍数引擎软件技术有限责任公司/);
  assert.match(en, /Multiple Engine Software Technology/);
  assert.match(zh, /"@type":"Person"/);
  assert.match(zh, /"@type":"Organization"/);
  assert.match(zh, /https:\/\/beishuyinqing\.cn\/zh\//);
});

test("service pages publish the five approved services", async () => {
  const [zh, en] = await Promise.all([
    read("dist/zh/services/index.html"),
    read("dist/en/services/index.html"),
  ]);

  for (const name of serviceNamesZh) assert.match(zh, new RegExp(name));
  for (const name of serviceNamesEn) assert.match(en, new RegExp(name));
  assert.match(zh, /"@type":"Service"/);
});

test("company and contact pages preserve verified legal facts", async () => {
  const [companyZh, contactZh] = await Promise.all([
    read("dist/zh/company/index.html"),
    read("dist/zh/contact/index.html"),
  ]);

  const facts = [
    "深圳市倍数引擎软件技术有限责任公司",
    "185 9314 1894",
    "深圳市龙岗区龙城街道黄阁坑社区腾飞路 9 号龙岗创投大厦 1 号楼 B509",
    "粤ICP备2026080071号",
  ];

  for (const fact of facts) {
    assert.match(`${companyZh}\n${contactZh}`, new RegExp(fact));
  }
  assert.match(companyZh, /"@type":"Organization"/);
  assert.match(contactZh, /href="tel:18593141894"/);
});

test("SEO discovery files expose the integrated routes on the production domain", async () => {
  const [sitemap, llms, robots] = await Promise.all([
    read("dist/sitemap.xml"),
    read("dist/llms.txt"),
    read("dist/robots.txt"),
  ]);

  for (const path of [
    "/zh/services/",
    "/en/services/",
    "/zh/company/",
    "/en/company/",
    "/zh/contact/",
    "/en/contact/",
  ]) {
    assert.match(sitemap, new RegExp(`https://beishuyinqing\\.cn${path}`));
    assert.match(llms, new RegExp(path.replaceAll("/", "\\/")));
  }
  assert.match(robots, /https:\/\/beishuyinqing\.cn\/sitemap\.xml/);
});

test("the legacy verification token remains publicly buildable", async () => {
  const token = await read("dist/WW_verify_Xs9oqr5SLRAcpl58.txt");
  assert.equal(token, "Xs9oqr5SLRAcpl58");
});
