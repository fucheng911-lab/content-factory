import type {
  AssetRow,
  ChapterRow,
  ProjectInput,
  StoryboardRow,
  TimedStoryboardRow,
  VideoProject,
} from "./types";

const nowIso = () => new Date().toISOString();

function cleanTitle(title: string) {
  return title.trim() || "未命名视频项目";
}

function firstSentence(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.split(/[。.!！？?]/)[0] || normalized || "把一个粗糙想法变成可执行的视频";
}

function distributeDurations(total: number, weights: number[]) {
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  return weights.map((weight) => Number(((total * weight) / sum).toFixed(1)));
}

export function createProjectFromIdea(input: ProjectInput): VideoProject {
  const title = cleanTitle(input.title);
  const duration = Number.isFinite(input.duration) && input.duration > 0 ? input.duration : 45;
  const angle = firstSentence(input.idea);
  const corePromise = `这条视频让${input.platform || "目标平台"}观众理解：${angle}，并用你的真实声音节奏完成画面制作。`;
  const durations = distributeDurations(duration, [3, 5, 10, 12, 8, 7]);

  const chapters: ChapterRow[] = [
    {
      chapter: "01 Hook",
      estimatedTime: `0-${durations[0]}s`,
      purpose: "用反差抓住注意力",
      voiceover: "很多视频不是输在画面，而是输在流程。",
      subtitle: "不是画面问题，是流程问题",
      visualBeat: "混乱素材、脚本和时间线快速闪现",
      assetNeed: "剪辑软件、素材文件夹、草稿文档截图",
      transition: "快切进入问题",
    },
    {
      chapter: "02 Problem",
      estimatedTime: `${durations[0]}-${durations[0] + durations[1]}s`,
      purpose: "指出常见错误",
      voiceover: "如果先拿文字去硬配画面，最后节奏一定会散。",
      subtitle: "别用文字硬配画面",
      visualBeat: "口播稿和空白分镜表左右对照",
      assetNeed: "脚本文档、分镜表格界面",
      transition: "表格行高亮",
    },
    {
      chapter: "03 Core Idea",
      estimatedTime: "mid",
      purpose: "给出方法主张",
      voiceover: "正确的方法是：先写能录的口播，再用真实声音决定每一段画面时长。",
      subtitle: "用真实录音决定画面节奏",
      visualBeat: "录音波形成为主时间轴，分镜行贴合波形",
      assetNeed: "音频波形、时间轴、分镜表",
      transition: "波形推入",
    },
    {
      chapter: "04 Workflow",
      estimatedTime: "mid",
      purpose: "解释系统流程",
      voiceover: "你录完以后，系统会把实际口播拆成时间戳，再生成可以修改的分镜表格。",
      subtitle: "录完后生成可编辑分镜表",
      visualBeat: "上传录音后，表格自动填入开始时间、结束时间、字幕和画面任务",
      assetNeed: "上传控件、CSV 表格界面",
      transition: "表格从空到满",
    },
    {
      chapter: "05 Production",
      estimatedTime: "mid",
      purpose: "连接 HyperFrames 制作",
      voiceover: "最后，再把分镜、素材和视觉风格交给 HyperFrames 去生成视频。",
      subtitle: "交给 HyperFrames 生成视频",
      visualBeat: "DESIGN、storyboard.csv、asset manifest 汇入制作包",
      assetNeed: "文件包、设计文档、素材清单",
      transition: "文件堆叠成制作包",
    },
    {
      chapter: "06 Takeaway",
      estimatedTime: "final",
      purpose: "收束价值",
      voiceover: "所以最终不是脚本驱动画面，而是你的真实表达驱动画面。",
      subtitle: "让真实表达驱动画面",
      visualBeat: "口播人声、字幕、画面节奏三条轨道对齐",
      assetNeed: "音频轨、字幕轨、画面轨示意",
      transition: "淡出到项目包",
    },
  ];

  const storyboardRows = chapters.map<StoryboardRow>((chapter, index) => {
    const start = Number(durations.slice(0, index).reduce((acc, item) => acc + item, 0).toFixed(1));
    return {
      scene: `s${String(index + 1).padStart(2, "0")}-${chapter.chapter.split(" ")[1].toLowerCase()}`,
      start,
      duration: durations[index],
      chapter: chapter.chapter,
      voiceover: chapter.voiceover,
      text: chapter.subtitle,
      visualJob: index === 0 ? "抓注意力" : index === chapters.length - 1 ? "总结记忆点" : "解释流程",
      layoutState: chapter.visualBeat,
      assetNeed: chapter.assetNeed,
      motion: index % 2 === 0 ? "文字从下方进入，画面轻微推近" : "重点行高亮，素材层横向滑入",
      transition: chapter.transition,
      audio: "待上传真实录音后对齐",
    };
  });

  const assetRows = storyboardRows.map<AssetRow>((row, index) => ({
    id: `ch${String(index + 1).padStart(2, "0")}-visual-01`,
    chapter: row.chapter,
    type: "image",
    status: "needed",
    visualJob: row.visualJob,
    description: row.assetNeed,
    sourceUrl: "",
    licenseNote: "",
    localPath: "",
    crop: "9:16 center crop",
    fallbackPrompt: `Clean product-workflow visual, ${row.assetNeed}, professional local video production UI, crisp typography, restrained lighting`,
  }));

  const spokenScript = chapters.map((chapter) => `### ${chapter.chapter}\n${chapter.voiceover}`).join("\n\n");
  const subtitleLines = chapters.map((chapter) => `${chapter.estimatedTime} | ${chapter.subtitle}`).join("\n");

  return {
    id: crypto.randomUUID(),
    title,
    createdAt: nowIso(),
    input: { ...input, title, duration },
    corePromise,
    spokenScript,
    subtitleLines,
    reviewNotes: "检查口播是否读起来顺、每句是否能对应画面、是否需要事实查证。",
    chapterRows: chapters,
    storyboardRows,
    timedStoryboardRows: [],
    assetRows,
    designDoc: createDesignDoc(input.tone),
    productionBrief: createProductionBrief(title, duration),
  };
}

export function createTimedStoryboard(rows: StoryboardRow[], recordingDuration: number): TimedStoryboardRow[] {
  const safeDuration = Math.max(recordingDuration, 1);
  const total = rows.reduce((acc, row) => acc + row.duration, 0) || safeDuration;
  let cursor = 0;

  return rows.map((row, index) => {
    const isLast = index === rows.length - 1;
    const duration = isLast ? Number((safeDuration - cursor).toFixed(2)) : Number(((row.duration / total) * safeDuration).toFixed(2));
    const start = Number(cursor.toFixed(2));
    const end = Number((start + duration).toFixed(2));
    cursor = end;

    return {
      scene: row.scene,
      start,
      end: isLast ? Number(safeDuration.toFixed(2)) : end,
      duration: isLast ? Number((safeDuration - start).toFixed(2)) : duration,
      recordingLine: row.voiceover,
      subtitle: row.text,
      visualJob: row.visualJob,
      layoutState: row.layoutState,
      assetIds: "",
      motion: row.motion,
      transition: row.transition,
      notes: "已按真实录制总时长等比对齐，精修时可逐行调整。",
    };
  });
}

export function createTimedStoryboardFromTranscript(
  rows: StoryboardRow[],
  transcript: string,
  recordingDuration: number,
): TimedStoryboardRow[] {
  const segments = splitTranscript(transcript);
  if (segments.length === 0) {
    return createTimedStoryboard(rows, recordingDuration);
  }

  const baseRows = rows.length ? rows : createFallbackStoryboardRows(segments);
  const totalCharacters = segments.reduce((acc, segment) => acc + Math.max(segment.length, 1), 0);
  const safeDuration = Math.max(recordingDuration, 1);
  let cursor = 0;

  return segments.map((segment, index) => {
    const source = baseRows[Math.min(index, baseRows.length - 1)];
    const isLast = index === segments.length - 1;
    const duration = isLast
      ? Number((safeDuration - cursor).toFixed(2))
      : Number(((Math.max(segment.length, 1) / totalCharacters) * safeDuration).toFixed(2));
    const start = Number(cursor.toFixed(2));
    const end = isLast ? Number(safeDuration.toFixed(2)) : Number((start + duration).toFixed(2));
    cursor = end;

    return {
      scene: source?.scene || `s${String(index + 1).padStart(2, "0")}`,
      start,
      end,
      duration: Number((end - start).toFixed(2)),
      recordingLine: segment,
      subtitle: source?.text || compressSubtitle(segment),
      visualJob: source?.visualJob || "解释口播内容",
      layoutState: source?.layoutState || "字幕和对应视觉素材居中呈现",
      assetIds: "",
      motion: source?.motion || "字幕淡入，画面轻微推近",
      transition: source?.transition || "按语义切到下一句",
      notes: "由 Qwen 转写文本和真实录制总时长生成，后续可逐行精修。",
    };
  });
}

function splitTranscript(transcript: string) {
  return transcript
    .split(/\n+|(?<=[。！？.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function compressSubtitle(segment: string) {
  return segment.length > 22 ? `${segment.slice(0, 21)}...` : segment;
}

function createFallbackStoryboardRows(segments: string[]): StoryboardRow[] {
  return segments.map((segment, index) => ({
    scene: `s${String(index + 1).padStart(2, "0")}`,
    start: index,
    duration: 1,
    chapter: `Transcript ${index + 1}`,
    voiceover: segment,
    text: compressSubtitle(segment),
    visualJob: "解释口播内容",
    layoutState: "字幕和对应视觉素材居中呈现",
    assetNeed: "根据真实口播补充素材",
    motion: "字幕淡入，画面轻微推近",
    transition: "按语义切到下一句",
    audio: "真实录制",
  }));
}

function createDesignDoc(tone: string) {
  return `# DESIGN

## Style Prompt
本地视频生产工具感，克制、清晰、专业，重点突出真实录音、分镜表格和 HyperFrames 制作包之间的关系。整体语气：${tone || "专业但口语"}。

## Colors
- Background: #F7F4EE
- Primary text: #1F2933
- Accent: #0E7C7B
- Support: #D95D39
- Surface: #FFFFFF

## Typography
- Display: Inter, system-ui
- Body: Inter, system-ui

## Motion
- Entrance: 轻微上移和淡入
- Emphasis: 表格行高亮、波形推入、关键词描边
- Transitions: 根据叙事做快切、推入、表格行滑动
- Avoid: 纯装饰光斑、过度渐变、无意义旋转

## What NOT to Do
- 不要用默认蓝紫科技感
- 不要让字幕整段堆满屏幕
- 不要让素材先于分镜任务出现
`;
}

function createProductionBrief(title: string, duration: number) {
  return `# HyperFrames Production Brief

- Project: ${title}
- Target resolution: 1080x1920
- Estimated duration: ${duration}s
- Source of truth: timed-storyboard.csv after user recording is uploaded
- Caption strategy: 压缩字幕 + 关键词强调
- Asset strategy: 每个场景至少一个明确视觉任务和素材 ID
- Risk: 真实录音上传前，分镜时间均为估算
`;
}
