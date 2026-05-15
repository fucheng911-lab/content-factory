import JSZip from "jszip";
import { toCsv } from "./csv";
import type { VideoProject } from "./types";

export async function exportProjectZip(project: VideoProject) {
  const zip = new JSZip();
  const root = zip.folder(safeName(project.title))!;

  root.file("00-input/raw-idea.md", `# Raw Idea\n\n${project.input.idea}\n`);
  root.file("01-brief/video-brief.md", createBrief(project));
  root.file("02-script/spoken-script.md", `# Spoken Script\n\n${project.spokenScript}\n`);
  root.file("02-script/subtitle-lines.md", `# Subtitle Lines\n\n${project.subtitleLines}\n`);
  root.file("02-script/script-review.md", `# Script Review\n\n${project.reviewNotes}\n`);
  root.file("02-script/chapter-script.csv", toCsv(project.chapterRows));
  root.file("03-assets/asset-manifest.json", JSON.stringify({ project: project.title, assets: project.assetRows }, null, 2));
  root.file("04-hyperframes/DESIGN.md", project.designDoc);
  root.file("04-hyperframes/storyboard.csv", toCsv(project.storyboardRows));
  root.file("04-hyperframes/timed-storyboard.csv", toCsv(project.timedStoryboardRows));
  root.file("04-hyperframes/production-brief.md", project.productionBrief);
  root.file("project.json", JSON.stringify(project, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeName(project.title)}-hyperframes-package.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function createBrief(project: VideoProject) {
  return `# Video Brief

- Title: ${project.title}
- Platform: ${project.input.platform}
- Duration: ${project.input.duration}s
- Tone: ${project.input.tone}
- Core promise: ${project.corePromise}
`;
}

function safeName(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || "video-project";
}
