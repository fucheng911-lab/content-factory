import { Eye, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { useSkillStore } from "../store/skillStore";

export function SkillManagerPage() {
  const { skills, selectedSkill, fetchSkills, uploadSkillFile, previewSkill, deleteSkill } = useSkillStore();
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchSkills();
  }, [fetchSkills]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      await uploadSkillFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    }
  }

  return (
    <div className="grid grid-cols-[minmax(360px,520px)_1fr] gap-6 p-8">
      <Panel>
        <PanelHeader title="Markdown Skills" description="这里是全局 Skill 库。上传后不会自动影响项目，每个项目要单独选择启用。" />
        <div className="grid gap-4 p-5">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground hover:bg-muted/70">
            <Upload className="h-4 w-4" />
            上传 .md Skill 文件
            <input className="hidden" type="file" accept=".md,text/markdown" onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="rounded-md border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{skill.displayName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{skill.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {skill.name} · {skill.type} · v{skill.version}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" onClick={() => void previewSkill(skill.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => void deleteSkill(skill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {skills.length === 0 && <div className="rounded-md bg-muted p-6 text-center text-sm text-muted-foreground">还没有 Skill。先上传一个 Markdown 规则文件。</div>}
          </div>
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="Skill 预览" description="V1 暂不在线编辑 Skill，修改后重新上传覆盖。" />
        <pre className="min-h-[520px] whitespace-pre-wrap p-5 text-sm leading-7 text-foreground">
          {selectedSkill ? selectedSkill.content : "选择左侧 Skill 查看内容。"}
        </pre>
      </Panel>
    </div>
  );
}
