import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createStore } from "../services/store.js";

let dir: string;
let store: ReturnType<typeof createStore>;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "content-factory-"));
  store = createStore(dir);
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("project storage", () => {
  it("creates, lists, updates, and reads a project with project-level enabled skills", async () => {
    const project = await store.createProject({
      title: "第一条内容",
      platform: "小红书",
      contentType: "知识口播",
      audience: "新手创作者",
      targetDuration: 60,
      goal: "建立信任",
      rawIdea: "用 AI 改口播稿",
      notes: "强调可以反复修改",
      references: "",
      avoid: "不要像广告",
      tone: "自然专业",
    });

    await store.updateProject(project.id, {
      enabledSkillIds: ["xiaohongshu-spoken-script", "hook-30s"],
      draftScript: "这是初稿",
    });

    const loaded = await store.getProject(project.id);
    const list = await store.listProjects();

    expect(loaded.enabledSkillIds).toEqual(["xiaohongshu-spoken-script", "hook-30s"]);
    expect(loaded.draftScript).toBe("这是初稿");
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(project.id);
  });
});
