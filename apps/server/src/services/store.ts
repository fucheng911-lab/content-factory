import fs from "node:fs/promises";
import path from "node:path";
import { parseSkillMarkdown } from "../parsers/skills.js";
import type { CreateProjectData, Project, ScriptVersion, Skill, VersionSource } from "../types.js";
import { ensureDir, listFiles, readJson, writeJsonAtomic } from "../utils/fs.js";

const nowIso = () => new Date().toISOString();

function projectDefaults(data: CreateProjectData): Project {
  const now = nowIso();
  return {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    platform: data.platform,
    contentType: data.contentType,
    audience: data.audience,
    targetDuration: Number(data.targetDuration) || 60,
    goal: data.goal,
    rawIdea: data.rawIdea,
    notes: data.notes || "",
    references: data.references || "",
    avoid: data.avoid || "",
    tone: data.tone || "",
    enabledSkillIds: [],
    draftScript: "",
    finalScript: "",
    status: "draft",
    currentVersion: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function countWords(text: string) {
  return text.replace(/\s+/g, "").length;
}

export function createStore(dataDir = path.resolve("data")) {
  const projectsDir = path.join(dataDir, "projects");
  const skillsDir = path.join(dataDir, "skills");

  const projectPath = (id: string) => path.join(projectsDir, id, "project.json");
  const versionsDir = (id: string) => path.join(projectsDir, id, "versions");
  const skillPath = (id: string) => path.join(skillsDir, `${id}.md`);

  async function init() {
    await ensureDir(projectsDir);
    await ensureDir(skillsDir);
  }

  async function listProjects(): Promise<Project[]> {
    await init();
    const ids = await listFiles(projectsDir);
    const projects = await Promise.all(ids.map((id) => readJson<Project>(projectPath(id))));
    return projects
      .filter((project): project is Project => Boolean(project))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async function getProject(id: string): Promise<Project> {
    const project = await readJson<Project>(projectPath(id));
    if (!project) throw new Error("项目不存在");
    return project;
  }

  async function createProject(data: CreateProjectData): Promise<Project> {
    await init();
    if (!data.title?.trim()) throw new Error("项目标题不能为空");
    const project = projectDefaults(data);
    await writeJsonAtomic(projectPath(project.id), project);
    return project;
  }

  async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
    const current = await getProject(id);
    const next: Project = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    await writeJsonAtomic(projectPath(id), next);
    return next;
  }

  async function deleteProject(id: string) {
    await fs.rm(path.join(projectsDir, id), { recursive: true, force: true });
  }

  async function listSkills(): Promise<Skill[]> {
    await init();
    const files = (await listFiles(skillsDir)).filter((file) => file.endsWith(".md"));
    const skills = await Promise.all(
      files.map(async (file) => {
        const markdown = await fs.readFile(path.join(skillsDir, file), "utf8");
        const parsed = parseSkillMarkdown(markdown);
        const stat = await fs.stat(path.join(skillsDir, file));
        return { ...parsed, createdAt: stat.birthtime.toISOString(), updatedAt: stat.mtime.toISOString() };
      }),
    );
    return skills.sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-Hans-CN"));
  }

  async function getSkill(id: string): Promise<Skill> {
    const markdown = await fs.readFile(skillPath(id), "utf8").catch(() => null);
    if (!markdown) throw new Error("Skill 不存在");
    return parseSkillMarkdown(markdown);
  }

  async function saveSkill(markdown: string): Promise<Skill> {
    await init();
    const skill = parseSkillMarkdown(markdown);
    await fs.writeFile(skillPath(skill.id), markdown, "utf8");
    return skill;
  }

  async function deleteSkill(id: string) {
    const projects = await listProjects();
    const usingProjects = projects.filter((project) => project.enabledSkillIds.includes(id));
    if (usingProjects.length > 0) {
      throw new Error(`该 Skill 正在被 ${usingProjects.length} 个项目使用，请先从项目中禁用。`);
    }
    await fs.rm(skillPath(id), { force: true });
  }

  async function listVersions(projectId: string): Promise<ScriptVersion[]> {
    const files = (await listFiles(versionsDir(projectId))).filter((file) => file.endsWith(".json"));
    const versions = await Promise.all(files.map((file) => readJson<ScriptVersion>(path.join(versionsDir(projectId), file))));
    return versions
      .filter((version): version is ScriptVersion => Boolean(version))
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  async function createVersion(projectId: string, input: { source: VersionSource; instruction: string; content: string; isFinal?: boolean }) {
    const project = await getProject(projectId);
    const versionNumber = project.currentVersion + 1;
    const version: ScriptVersion = {
      id: `v${String(versionNumber).padStart(3, "0")}`,
      projectId,
      versionNumber,
      source: input.source,
      instruction: input.instruction,
      enabledSkillIds: project.enabledSkillIds,
      content: input.content,
      wordCount: countWords(input.content),
      isFinal: Boolean(input.isFinal),
      createdAt: nowIso(),
    };
    await ensureDir(versionsDir(projectId));
    await writeJsonAtomic(path.join(versionsDir(projectId), `${version.id}.json`), version);
    await updateProject(projectId, {
      currentVersion: versionNumber,
      draftScript: input.content,
      finalScript: input.isFinal ? input.content : project.finalScript,
      status: input.isFinal ? "final" : input.source.startsWith("ai-") ? "generated" : "editing",
    });
    return version;
  }

  async function restoreVersion(projectId: string, versionId: string) {
    const version = await readJson<ScriptVersion>(path.join(versionsDir(projectId), `${versionId}.json`));
    if (!version) throw new Error("版本不存在");
    await updateProject(projectId, { draftScript: version.content, status: "editing" });
    return createVersion(projectId, { source: "restore", instruction: `恢复 ${versionId}`, content: version.content });
  }

  return {
    init,
    listProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    listSkills,
    getSkill,
    saveSkill,
    deleteSkill,
    listVersions,
    createVersion,
    restoreVersion,
  };
}
