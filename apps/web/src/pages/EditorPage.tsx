import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bot, Check, RefreshCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field, Textarea } from "../components/ui/Field";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { api } from "../services/api";
import { useEditorStore } from "../store/editorStore";
import { useProjectStore } from "../store/projectStore";
import { useSkillStore } from "../store/skillStore";

export function EditorPage() {
  const { projectId = "" } = useParams();
  const { currentProject, fetchProject, updateProject } = useProjectStore();
  const { skills, fetchSkills } = useSkillStore();
  const { content, setContent, setSelectedText, selectedText, versions, fetchVersions, saveVersion, saveFinal, restoreVersion } = useEditorStore();
  const [instruction, setInstruction] = useState("改得更自然、更适合真人录制");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const enabledSkills = useMemo(() => skills.filter((skill) => currentProject?.enabledSkillIds.includes(skill.id)), [skills, currentProject]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "点击右侧「生成初稿」开始创作，或直接在这里写稿。",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setContent(editor.getText()),
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      setSelectedText(from === to ? "" : editor.state.doc.textBetween(from, to, "\n"));
    },
  });

  useEffect(() => {
    async function load() {
      const [project] = await Promise.all([fetchProject(projectId), fetchSkills(), fetchVersions(projectId)]);
      setContent(project.draftScript);
      editor?.commands.setContent(textToHtml(project.draftScript));
    }
    if (projectId) void load();
  }, [projectId, fetchProject, fetchSkills, fetchVersions, setContent, editor]);

  useEffect(() => {
    if (editor && editor.getText() !== content) {
      editor.commands.setContent(textToHtml(content));
    }
  }, [content, editor]);

  async function toggleSkill(skillId: string) {
    if (!currentProject) return;
    const exists = currentProject.enabledSkillIds.includes(skillId);
    const enabledSkillIds = exists ? currentProject.enabledSkillIds.filter((id) => id !== skillId) : [...currentProject.enabledSkillIds, skillId];
    await updateProject(currentProject.id, { enabledSkillIds });
  }

  async function run(action: "generate" | "rewrite-full" | "rewrite-selection") {
    if (!currentProject) return;
    setBusy(true);
    setError("");
    try {
      const result =
        action === "generate"
          ? await api.generateScript(currentProject.id, instruction)
          : action === "rewrite-selection"
            ? await api.rewriteSelection(currentProject.id, content, selectedText, instruction)
            : await api.rewriteFull(currentProject.id, content, instruction);
      setContent(result.content);
      editor?.commands.setContent(textToHtml(result.content));
      await fetchProject(currentProject.id);
      await fetchVersions(currentProject.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 操作失败");
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft() {
    if (!currentProject) return;
    await saveVersion(currentProject.id);
    await updateProject(currentProject.id, { draftScript: content, status: "editing" });
  }

  async function saveFinalScript() {
    if (!currentProject) return;
    await saveFinal(currentProject.id);
    await fetchProject(currentProject.id);
  }

  if (!currentProject) return <div className="p-8 text-sm text-muted-foreground">正在加载项目...</div>;

  return (
    <div className="grid h-screen grid-cols-[280px_1fr_340px] gap-0">
      <aside className="border-r border-border bg-white p-5">
        <h1 className="text-lg font-semibold">{currentProject.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {currentProject.platform} · {currentProject.contentType}
          <br />
          {currentProject.audience}
        </p>
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">当前项目启用 Skills</h2>
          <div className="grid gap-2">
            {skills.map((skill) => {
              const active = currentProject.enabledSkillIds.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => void toggleSkill(skill.id)}
                  className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {skill.displayName}
                </button>
              );
            })}
            {skills.length === 0 && <p className="text-sm text-muted-foreground">还没有全局 Skill。先去 Skills 页面上传。</p>}
          </div>
        </div>
      </aside>

      <main className="overflow-auto bg-background p-6">
        <Panel className="min-h-full">
          <PanelHeader title="口播稿编辑器" description={`已启用 ${enabledSkills.length} 个 Skills。选中文本后可做局部改写。`} />
          <div className="border-b border-border px-5 py-3 text-sm text-muted-foreground">
            字数：{content.replace(/\s+/g, "").length} · 估算录制：{Math.max(10, Math.round(content.replace(/\s+/g, "").length / 4))} 秒
          </div>
          <div className="p-6 text-base leading-8">
            <EditorContent editor={editor} />
          </div>
        </Panel>
      </main>

      <aside className="overflow-auto border-l border-border bg-white p-5">
        <div className="grid gap-4">
          <Field label="本次修改要求">
            <Textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} />
          </Field>
          <Button onClick={() => void run("generate")} disabled={busy}>
            <Bot className="h-4 w-4" />
            生成初稿
          </Button>
          <Button variant="secondary" onClick={() => void run("rewrite-full")} disabled={busy || !content}>
            <RefreshCcw className="h-4 w-4" />
            全文改写
          </Button>
          <Button variant="secondary" onClick={() => void run("rewrite-selection")} disabled={busy || !selectedText}>
            <RefreshCcw className="h-4 w-4" />
            局部改写
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => void saveDraft()}>
              <Save className="h-4 w-4" />
              保存版本
            </Button>
            <Button onClick={() => void saveFinalScript()}>
              <Check className="h-4 w-4" />
              最终稿
            </Button>
          </div>
          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="border-t border-border pt-4">
            <h2 className="mb-3 text-sm font-semibold">版本历史</h2>
            <div className="grid gap-2">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => void restoreVersion(currentProject.id, version.id)}
                  className="rounded-md border border-border p-3 text-left text-sm hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{version.id}</span>
                    {version.isFinal && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">最终稿</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{version.source} · {version.wordCount} 字</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function textToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
