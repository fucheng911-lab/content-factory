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
  audience: "内容创作者",
  targetDuration: 60,
  goal: "生成可录制口播稿",
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
      <Panel className="mx-auto max-w-3xl">
        <PanelHeader title="创建项目" description="只填写启动口播稿需要的关键信息，风格和细节后续交给项目 Skills 控制。" />
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
          </div>
          <Field label="原始想法 / 资料">
            <Textarea
              className="min-h-48"
              value={form.rawIdea}
              onChange={(e) => setForm({ ...form, rawIdea: e.target.value })}
              placeholder="把最原始的想法、观点、语音转写、参考资料或要表达的核心内容放在这里。"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={submit}>保存并进入编辑器</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
