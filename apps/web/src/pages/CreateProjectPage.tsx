import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field, Input, Select, Textarea } from "../components/ui/Field";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { useProjectStore } from "../store/projectStore";
import type { CreateProjectData } from "../types/domain";

const initial: CreateProjectData = {
  title: "",
  platform: "小红书",
  contentType: "知识口播",
  audience: "",
  targetDuration: 60,
  goal: "建立信任",
  rawIdea: "",
  notes: "",
  references: "",
  avoid: "",
  tone: "自然、专业、适合真人录制",
};

export function CreateProjectPage() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const createProject = useProjectStore((state) => state.createProject);
  const navigate = useNavigate();

  async function submit() {
    setError("");
    try {
      const project = await createProject(form);
      navigate(`/editor/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    }
  }

  return (
    <div className="p-8">
      <Panel className="mx-auto max-w-5xl">
        <PanelHeader title="创建项目" description="先把口播稿生产需要的背景填清楚，后续 AI 会结合项目要求和启用的 Skills 生成内容。" />
        <div className="grid gap-5 p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="项目标题">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例如：为什么你的口播稿总是不自然" />
            </Field>
            <Field label="目标平台">
              <Select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                {["小红书", "抖音", "B站", "视频号", "快手", "YouTube Shorts"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Field label="内容类型">
              <Select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}>
                {["知识口播", "产品介绍", "案例拆解", "观点表达", "种草推荐", "经验分享", "销售转化", "个人 IP"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Field label="预计时长（秒）">
              <Input type="number" value={form.targetDuration} onChange={(e) => setForm({ ...form, targetDuration: Number(e.target.value) })} />
            </Field>
            <Field label="目标受众">
              <Input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="例如：想提升短视频效率的内容创作者" />
            </Field>
            <Field label="内容目的">
              <Select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                {["种草", "转化", "教育", "涨粉", "建立信任", "解释复杂概念", "输出观点"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="原始灵感">
            <Textarea value={form.rawIdea} onChange={(e) => setForm({ ...form, rawIdea: e.target.value })} placeholder="把最原始的想法、观点、语音转写或资料摘要放在这里。" />
          </Field>
          <Field label="零散要点">
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Field label="参考资料">
            <Textarea value={form.references} onChange={(e) => setForm({ ...form, references: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="不想出现的内容">
              <Textarea value={form.avoid} onChange={(e) => setForm({ ...form, avoid: e.target.value })} />
            </Field>
            <Field label="希望保持的语气">
              <Textarea value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} />
            </Field>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={submit}>保存并进入编辑器</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
