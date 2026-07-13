import { company } from "../data/company";
import { services } from "../data/services";
import { projects, site } from "../data/site";
import { buildNoteDiscoveryEntries, serializeLlmsNoteLines } from "../lib/discovery/serialize";
import { getAllPublishedNotes } from "../lib/sanity/notes";

export async function GET() {
  const notes = await getAllPublishedNotes();
  const projectLines = projects
    .flatMap((project) => [
      `- ${project.en.title} (EN): ${site.url}/en/projects/${project.slug}/`,
      `- ${project.zh.title} (ZH): ${site.url}/zh/projects/${project.slug}/`,
    ])
    .join("\n");
  const noteLines = serializeLlmsNoteLines(buildNoteDiscoveryEntries(notes), site.url);
  const serviceLines = services
    .map(
      (service) =>
        `- ${service.en.title} / ${service.zh.title}: ${site.url}/en/services/#${service.slug} | ${site.url}/zh/services/#${service.slug}`,
    )
    .join("\n");

  const body = [
    `# ${site.name} × ${company.shortNameEn}`,
    "",
    `> ${site.author} builds practical software, enterprise AI workflows, GEO systems, automation, and deployable tools. ${company.legalNameEn} is the formal cooperation and delivery entity behind the work.`,
    "",
    "## Primary pages",
    `- English home: ${site.url}/en/`,
    `- Chinese home: ${site.url}/zh/`,
    `- Services (EN): ${site.url}/en/services/`,
    `- 服务 (ZH): ${site.url}/zh/services/`,
    `- Company (EN): ${site.url}/en/company/`,
    `- 公司 (ZH): ${site.url}/zh/company/`,
    `- About Jeason (EN): ${site.url}/en/about/`,
    `- 关于 Jeason (ZH): ${site.url}/zh/about/`,
    `- Contact (EN): ${site.url}/en/contact/`,
    `- 联系合作 (ZH): ${site.url}/zh/contact/`,
    "",
    "## Services",
    serviceLines,
    "",
    "## Projects",
    `- Project directory (EN): ${site.url}/en/projects/`,
    `- 项目目录 (ZH): ${site.url}/zh/projects/`,
    projectLines,
    "",
    "## Notes",
    `- Notes directory (EN): ${site.url}/en/notes/`,
    `- 笔记目录 (ZH): ${site.url}/zh/notes/`,
    noteLines,
    "",
    "## Verified company facts",
    `- Legal name: ${company.legalNameZh} / ${company.legalNameEn}`,
    `- Phone: ${company.phoneDisplay}`,
    `- Address: ${company.addressZh}`,
    `- ICP: ${company.icpNumber}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
