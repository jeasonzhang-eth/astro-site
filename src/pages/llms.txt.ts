import { home, notes, projects, site } from "../data/site";

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${home.en.description}`,
    "",
    "This site collects Jeason Zhang's projects, AI workflow notes, desktop automation experiments, and market research references.",
    "",
    "## Primary pages",
    `- English home: ${site.url}/en/`,
    `- Chinese home: ${site.url}/zh/`,
    "",
    "## Projects",
    `- Project directory: ${site.url}/en/projects/`,
    ...projects.map((project) => `- ${project.en.title}: ${site.url}/en/projects/${project.slug}/`),
    "",
    "## Notes",
    `- Notes directory: ${site.url}/en/notes/`,
    ...notes.map((note) => `- ${note.en.title}: ${site.url}/en/notes/${note.slug}/`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
