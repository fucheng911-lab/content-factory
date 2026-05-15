import "dotenv/config";
import express from "express";
import path from "node:path";
import { buildAiMessages, runAiOrFallback } from "./services/ai.js";
import { createStore } from "./services/store.js";
import type { Skill } from "./types.js";

const app = express();
const port = Number(process.env.PORT || 5174);
const dataDir = process.env.CONTENT_FACTORY_DATA_DIR || path.resolve("data");
const store = createStore(dataDir);

app.use(express.json({ limit: "5mb" }));

function ok<T>(data: T, message?: string) {
  return { success: true, data, message };
}

function asyncRoute(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function param(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

app.get("/api/health", (_req, res) => res.json(ok({ ok: true })));

app.get(
  "/api/projects",
  asyncRoute(async (_req, res) => {
    res.json(ok({ projects: await store.listProjects() }));
  }),
);

app.post(
  "/api/projects",
  asyncRoute(async (req, res) => {
    const project = await store.createProject(req.body);
    res.status(201).json(ok(project, "项目创建成功"));
  }),
);

app.get(
  "/api/projects/:id",
  asyncRoute(async (req, res) => {
    res.json(ok(await store.getProject(param(req.params.id))));
  }),
);

app.put(
  "/api/projects/:id",
  asyncRoute(async (req, res) => {
    res.json(ok(await store.updateProject(param(req.params.id), req.body)));
  }),
);

app.delete(
  "/api/projects/:id",
  asyncRoute(async (req, res) => {
    await store.deleteProject(param(req.params.id));
    res.json(ok({ deleted: true }));
  }),
);

app.get(
  "/api/skills",
  asyncRoute(async (_req, res) => {
    res.json(ok({ skills: await store.listSkills() }));
  }),
);

app.get(
  "/api/skills/:id",
  asyncRoute(async (req, res) => {
    res.json(ok(await store.getSkill(param(req.params.id))));
  }),
);

app.post(
  "/api/skills",
  asyncRoute(async (req, res) => {
    const skill = await store.saveSkill(String(req.body.markdown || ""));
    res.status(201).json(ok(skill, "Skill 上传成功"));
  }),
);

app.delete(
  "/api/skills/:id",
  asyncRoute(async (req, res) => {
    await store.deleteSkill(param(req.params.id));
    res.json(ok({ deleted: true }));
  }),
);

app.get(
  "/api/projects/:id/versions",
  asyncRoute(async (req, res) => {
    res.json(ok({ versions: await store.listVersions(param(req.params.id)) }));
  }),
);

app.post(
  "/api/projects/:id/versions",
  asyncRoute(async (req, res) => {
    const version = await store.createVersion(param(req.params.id), {
      source: req.body.source || "user-save",
      instruction: req.body.instruction || "手动保存",
      content: req.body.content || "",
      isFinal: Boolean(req.body.isFinal),
    });
    res.status(201).json(ok(version, "版本保存成功"));
  }),
);

app.post(
  "/api/projects/:id/versions/:versionId/restore",
  asyncRoute(async (req, res) => {
    res.json(ok(await store.restoreVersion(param(req.params.id), param(req.params.versionId))));
  }),
);

app.post(
  "/api/projects/:id/final-script",
  asyncRoute(async (req, res) => {
    const version = await store.createVersion(param(req.params.id), {
      source: "final-script",
      instruction: "保存最终录制稿",
      content: req.body.content || "",
      isFinal: true,
    });
    res.status(201).json(ok(version, "最终录制稿已保存"));
  }),
);

async function runAiAction(projectId: string, action: "generate" | "rewrite-full" | "rewrite-selection", body: Record<string, unknown>) {
  const project = await store.getProject(projectId);
  const skills = await Promise.all(project.enabledSkillIds.map((id) => store.getSkill(id).catch(() => null)));
  const messages = buildAiMessages({
    action,
    project,
    enabledSkills: skills.filter((skill): skill is Skill => Boolean(skill)),
    currentScript: String(body.currentScript || project.draftScript || ""),
    selectedText: String(body.selectedText || ""),
    instruction: String(body.instruction || ""),
  });
  const content = await runAiOrFallback(messages);
  const source = action === "generate" ? "ai-generate" : action === "rewrite-selection" ? "ai-rewrite-selection" : "ai-rewrite-full";
  const version = await store.createVersion(projectId, {
    source,
    instruction: String(body.instruction || source),
    content,
  });
  return { content, version };
}

app.post(
  "/api/projects/:id/generate-script",
  asyncRoute(async (req, res) => {
    res.json(ok(await runAiAction(param(req.params.id), "generate", req.body)));
  }),
);

app.post(
  "/api/projects/:id/rewrite-full",
  asyncRoute(async (req, res) => {
    res.json(ok(await runAiAction(param(req.params.id), "rewrite-full", req.body)));
  }),
);

app.post(
  "/api/projects/:id/rewrite-selection",
  asyncRoute(async (req, res) => {
    res.json(ok(await runAiAction(param(req.params.id), "rewrite-selection", req.body)));
  }),
);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "请求失败";
  res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message } });
});

await store.init();
app.listen(port, "127.0.0.1", () => {
  console.log(`Content Factory API running at http://127.0.0.1:${port}`);
});
