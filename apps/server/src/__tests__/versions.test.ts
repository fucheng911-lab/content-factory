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

describe("version restore", () => {
  it("switches to a historical version without creating another version", async () => {
    const project = await store.createProject({
      title: "历史版本测试",
      platform: "小红书",
      contentType: "知识口播",
      audience: "内容创作者",
      targetDuration: 60,
      goal: "建立信任",
      rawIdea: "测试历史版本切换",
      notes: "",
      references: "",
      avoid: "",
      tone: "自然",
    });

    const first = await store.createVersion(project.id, {
      source: "user-save",
      instruction: "第一版",
      content: "第一版内容",
    });
    await store.createVersion(project.id, {
      source: "ai-rewrite-full",
      instruction: "第二版",
      content: "第二版内容",
    });

    const restored = await store.restoreVersion(project.id, first.id);
    const versions = await store.listVersions(project.id);
    const loaded = await store.getProject(project.id);

    expect(restored.id).toBe(first.id);
    expect(versions).toHaveLength(2);
    expect(loaded.draftScript).toBe("第一版内容");
  });
});
