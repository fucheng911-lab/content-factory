import { ChangeEvent, useMemo, useState } from "react";
import {
  AudioLines,
  Download,
  FileArchive,
  FileSpreadsheet,
  Film,
  PackageCheck,
  PenLine,
  PlayCircle,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { downloadText, toCsv } from "./lib/csv";
import { exportProjectZip } from "./lib/exportPackage";
import { createProjectFromIdea, createTimedStoryboard } from "./lib/project";
import { loadProject, saveProject } from "./lib/storage";
import type { AssetRow, StoryboardRow, TimedStoryboardRow, VideoProject } from "./lib/types";

const defaultInput = {
  title: "真实口播驱动的视频",
  idea: "我想先生成口播稿，自己录一遍，再让系统按照真实声音时长制作画面。",
  platform: "小红书",
  duration: 45,
  tone: "专业但口语",
};

const steps = [
  { id: "idea", label: "创意与口播", icon: PenLine },
  { id: "recording", label: "录制对齐", icon: AudioLines },
  { id: "storyboard", label: "分镜表格", icon: FileSpreadsheet },
  { id: "assets", label: "素材清单", icon: PackageCheck },
  { id: "handoff", label: "制作包", icon: FileArchive },
];

export function App() {
  const [activeStep, setActiveStep] = useState("idea");
  const [form, setForm] = useState(defaultInput);
  const [project, setProject] = useState<VideoProject | null>(() => loadProject());
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const hasTimedStoryboard = Boolean(project?.timedStoryboardRows.length);
  const progress = useMemo(() => {
    const count = [
      Boolean(project),
      Boolean(project?.recording),
      Boolean(project?.storyboardRows.length),
      Boolean(project?.assetRows.length),
      hasTimedStoryboard,
    ].filter(Boolean).length;
    return Math.round((count / 5) * 100);
  }, [project, hasTimedStoryboard]);

  function createProject() {
    const next = createProjectFromIdea(form);
    setProject(next);
    saveProject(next);
    setActiveStep("idea");
  }

  function updateProject(next: VideoProject) {
    setProject(next);
    saveProject(next);
  }

  function updateStoryboard(index: number, field: keyof StoryboardRow, value: string) {
    if (!project) return;
    const rows = project.storyboardRows.map((row, rowIndex) => {
      if (rowIndex !== index) return row;
      if (field === "start" || field === "duration") {
        return { ...row, [field]: Number(value) || 0 };
      }
      return { ...row, [field]: value };
    });
    updateProject({ ...project, storyboardRows: rows });
  }

  function updateTimedStoryboard(index: number, field: keyof TimedStoryboardRow, value: string) {
    if (!project) return;
    const rows = project.timedStoryboardRows.map((row, rowIndex) => {
      if (rowIndex !== index) return row;
      if (field === "start" || field === "end" || field === "duration") {
        return { ...row, [field]: Number(value) || 0 };
      }
      return { ...row, [field]: value };
    });
    updateProject({ ...project, timedStoryboardRows: rows });
  }

  function updateAsset(index: number, field: keyof AssetRow, value: string) {
    if (!project) return;
    const rows = project.assetRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row));
    updateProject({ ...project, assetRows: rows });
  }

  function handleRecording(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !project) return;

    const url = URL.createObjectURL(file);
    setRecordingUrl(url);

    const media = document.createElement(file.type.startsWith("video") ? "video" : "audio");
    media.preload = "metadata";
    media.src = url;
    media.onloadedmetadata = () => {
      const duration = Number(media.duration.toFixed(2));
      updateProject({
        ...project,
        recording: { name: file.name, duration, type: file.type || "media" },
        timedStoryboardRows: createTimedStoryboard(project.storyboardRows, duration),
      });
      setActiveStep("storyboard");
    };
  }

  function exportStoryboardCsv() {
    if (!project) return;
    if (project.timedStoryboardRows.length) {
      downloadText("timed-storyboard.csv", toCsv(project.timedStoryboardRows), "text/csv;charset=utf-8");
      return;
    }
    downloadText("storyboard.csv", toCsv(project.storyboardRows), "text/csv;charset=utf-8");
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="视频生产流程">
        <div className="brand">
          <div className="brand-mark">
            <Film size={22} />
          </div>
          <div>
            <h1>视频生产工作台</h1>
            <p>本地版</p>
          </div>
        </div>

        <nav className="steps">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                className={step.id === activeStep ? "step active" : "step"}
                onClick={() => setActiveStep(step.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="status-panel">
          <span>完成度</span>
          <strong>{progress}%</strong>
          <div className="progress">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Idea / Recording / CSV / HyperFrames</p>
            <h2>{project?.title || "新建视频项目"}</h2>
          </div>
          <div className="top-actions">
            <button className="ghost-button" type="button" onClick={() => project && saveProject(project)} disabled={!project}>
              <Save size={17} />
              保存
            </button>
            <button className="primary-button" type="button" onClick={() => project && exportProjectZip(project)} disabled={!project}>
              <Download size={17} />
              导出制作包
            </button>
          </div>
        </header>

        {activeStep === "idea" && (
          <section className="panel-grid">
            <div className="panel">
              <div className="panel-heading">
                <Sparkles size={19} />
                <h3>创意输入</h3>
              </div>
              <label>
                项目标题
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>
              <label>
                创意、语音转写或资料摘要
                <textarea value={form.idea} onChange={(event) => setForm({ ...form, idea: event.target.value })} rows={7} />
              </label>
              <div className="field-row">
                <label>
                  平台
                  <input value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })} />
                </label>
                <label>
                  预计秒数
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })}
                  />
                </label>
              </div>
              <label>
                语气
                <input value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })} />
              </label>
              <button className="primary-button wide" type="button" onClick={createProject}>
                <PlayCircle size={18} />
                生成口播稿与初版分镜
              </button>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <PenLine size={19} />
                <h3>口播稿</h3>
              </div>
              <pre className="script-preview">{project?.spokenScript || "生成后这里会显示可录制的口播稿。"}</pre>
            </div>
          </section>
        )}

        {activeStep === "recording" && (
          <section className="panel-grid">
            <div className="panel">
              <div className="panel-heading">
                <Upload size={19} />
                <h3>上传录制文件</h3>
              </div>
              <p className="hint">上传你按口播稿录制的音频或视频。系统会读取真实时长，并生成 `timed-storyboard.csv`。</p>
              <label className="upload-box">
                <Upload size={28} />
                <span>选择音频或视频文件</span>
                <input type="file" accept="audio/*,video/*" onChange={handleRecording} disabled={!project} />
              </label>
              {project?.recording && (
                <div className="recording-card">
                  <strong>{project.recording.name}</strong>
                  <span>{project.recording.duration}s</span>
                </div>
              )}
            </div>
            <div className="panel media-panel">
              {recordingUrl ? (
                project?.recording?.type.startsWith("video") ? (
                  <video src={recordingUrl} controls />
                ) : (
                  <audio src={recordingUrl} controls />
                )
              ) : (
                <p className="empty-state">录制文件上传后，可以在这里预览。</p>
              )}
            </div>
          </section>
        )}

        {activeStep === "storyboard" && project && (
          <section className="panel">
            <div className="panel-heading between">
              <div>
                <FileSpreadsheet size={19} />
                <h3>{hasTimedStoryboard ? "真实时长分镜表" : "初版分镜表"}</h3>
              </div>
              <button
                className="ghost-button"
                type="button"
                onClick={exportStoryboardCsv}
              >
                <Download size={16} />
                导出 CSV
              </button>
            </div>
            {hasTimedStoryboard ? (
              <EditableTimedTable rows={project.timedStoryboardRows} onChange={updateTimedStoryboard} />
            ) : (
              <EditableStoryboardTable rows={project.storyboardRows} onChange={updateStoryboard} />
            )}
          </section>
        )}

        {activeStep === "assets" && project && (
          <section className="panel">
            <div className="panel-heading between">
              <div>
                <PackageCheck size={19} />
                <h3>素材清单</h3>
              </div>
              <button className="ghost-button" type="button" onClick={() => downloadText("asset-manifest.csv", toCsv(project.assetRows), "text/csv;charset=utf-8")}>
                <Download size={16} />
                导出 CSV
              </button>
            </div>
            <EditableAssetTable rows={project.assetRows} onChange={updateAsset} />
          </section>
        )}

        {activeStep === "handoff" && project && (
          <section className="panel-grid">
            <div className="panel">
              <div className="panel-heading">
                <FileArchive size={19} />
                <h3>HyperFrames 交付</h3>
              </div>
              <label>
                DESIGN.md
                <textarea value={project.designDoc} rows={14} onChange={(event) => updateProject({ ...project, designDoc: event.target.value })} />
              </label>
            </div>
            <div className="panel">
              <div className="panel-heading">
                <PackageCheck size={19} />
                <h3>production-brief.md</h3>
              </div>
              <textarea value={project.productionBrief} rows={18} onChange={(event) => updateProject({ ...project, productionBrief: event.target.value })} />
              <button className="primary-button wide" type="button" onClick={() => exportProjectZip(project)}>
                <Download size={18} />
                导出 HyperFrames 制作包
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function EditableStoryboardTable({
  rows,
  onChange,
}: {
  rows: StoryboardRow[];
  onChange: (index: number, field: keyof StoryboardRow, value: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {["Scene", "Start", "Duration", "Voiceover", "Text", "Visual job", "Layout", "Asset", "Motion", "Transition"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.scene}>
              <td>{row.scene}</td>
              <td><input value={row.start} onChange={(event) => onChange(index, "start", event.target.value)} /></td>
              <td><input value={row.duration} onChange={(event) => onChange(index, "duration", event.target.value)} /></td>
              <td><textarea value={row.voiceover} onChange={(event) => onChange(index, "voiceover", event.target.value)} /></td>
              <td><textarea value={row.text} onChange={(event) => onChange(index, "text", event.target.value)} /></td>
              <td><input value={row.visualJob} onChange={(event) => onChange(index, "visualJob", event.target.value)} /></td>
              <td><textarea value={row.layoutState} onChange={(event) => onChange(index, "layoutState", event.target.value)} /></td>
              <td><textarea value={row.assetNeed} onChange={(event) => onChange(index, "assetNeed", event.target.value)} /></td>
              <td><textarea value={row.motion} onChange={(event) => onChange(index, "motion", event.target.value)} /></td>
              <td><textarea value={row.transition} onChange={(event) => onChange(index, "transition", event.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditableTimedTable({
  rows,
  onChange,
}: {
  rows: TimedStoryboardRow[];
  onChange: (index: number, field: keyof TimedStoryboardRow, value: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {["Scene", "Start", "End", "Duration", "Recording line", "Subtitle", "Visual job", "Layout", "Asset IDs", "Motion", "Transition"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.scene}>
              <td>{row.scene}</td>
              <td><input value={row.start} onChange={(event) => onChange(index, "start", event.target.value)} /></td>
              <td><input value={row.end} onChange={(event) => onChange(index, "end", event.target.value)} /></td>
              <td><input value={row.duration} onChange={(event) => onChange(index, "duration", event.target.value)} /></td>
              <td><textarea value={row.recordingLine} onChange={(event) => onChange(index, "recordingLine", event.target.value)} /></td>
              <td><textarea value={row.subtitle} onChange={(event) => onChange(index, "subtitle", event.target.value)} /></td>
              <td><input value={row.visualJob} onChange={(event) => onChange(index, "visualJob", event.target.value)} /></td>
              <td><textarea value={row.layoutState} onChange={(event) => onChange(index, "layoutState", event.target.value)} /></td>
              <td><input value={row.assetIds} onChange={(event) => onChange(index, "assetIds", event.target.value)} /></td>
              <td><textarea value={row.motion} onChange={(event) => onChange(index, "motion", event.target.value)} /></td>
              <td><textarea value={row.transition} onChange={(event) => onChange(index, "transition", event.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditableAssetTable({
  rows,
  onChange,
}: {
  rows: AssetRow[];
  onChange: (index: number, field: keyof AssetRow, value: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {["ID", "Chapter", "Status", "Description", "Source URL", "License", "Local path", "Crop", "Fallback prompt"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.chapter}</td>
              <td><input value={row.status} onChange={(event) => onChange(index, "status", event.target.value)} /></td>
              <td><textarea value={row.description} onChange={(event) => onChange(index, "description", event.target.value)} /></td>
              <td><input value={row.sourceUrl} onChange={(event) => onChange(index, "sourceUrl", event.target.value)} /></td>
              <td><input value={row.licenseNote} onChange={(event) => onChange(index, "licenseNote", event.target.value)} /></td>
              <td><input value={row.localPath} onChange={(event) => onChange(index, "localPath", event.target.value)} /></td>
              <td><input value={row.crop} onChange={(event) => onChange(index, "crop", event.target.value)} /></td>
              <td><textarea value={row.fallbackPrompt} onChange={(event) => onChange(index, "fallbackPrompt", event.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
