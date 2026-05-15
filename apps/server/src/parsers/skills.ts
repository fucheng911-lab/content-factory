import matter from "gray-matter";
import type { Skill } from "../types.js";

const SKILL_NAME_RE = /^[A-Za-z0-9_-]+$/;

export function parseSkillMarkdown(markdown: string, now = new Date().toISOString()): Skill {
  const parsed = matter(markdown);
  const name = String(parsed.data.name || "").trim();
  const description = String(parsed.data.description || "").trim();

  if (!name) throw new Error("Skill 必须包含 name");
  if (!SKILL_NAME_RE.test(name)) throw new Error("name 只能包含英文、数字、横线、下划线");
  if (!description) throw new Error("Skill 必须包含 description");

  return {
    id: name,
    name,
    displayName: String(parsed.data.displayName || name).trim(),
    description,
    type: String(parsed.data.type || "script-writing").trim(),
    version: String(parsed.data.version || "1.0.0").trim(),
    filePath: `data/skills/${name}.md`,
    content: parsed.content.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

export function assertMarkdownFilename(filename: string) {
  if (!filename.toLowerCase().endsWith(".md")) {
    throw new Error("只支持上传 .md Skill 文件");
  }
}
