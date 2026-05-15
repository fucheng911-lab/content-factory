import type { ChatMessage, Project, Skill } from "../types.js";

interface BuildMessagesInput {
  action: "generate" | "rewrite-full" | "rewrite-selection";
  project: Partial<Project>;
  enabledSkills: Pick<Skill, "displayName" | "content">[];
  currentScript?: string;
  selectedText?: string;
  instruction?: string;
}

export function buildAiMessages(input: BuildMessagesInput): ChatMessage[] {
  const skillText = input.enabledSkills
    .map((skill, index) => `## ${index + 1}. ${skill.displayName}\n${skill.content}`)
    .join("\n\n");

  return [
    {
      role: "system",
      content: [
        "系统基础规则",
        "你是内容工厂的口播稿写作智能体，只服务口播稿生成和修改。",
        "输出必须适合真人直接录制，语言自然、分段清晰、避免公众号式书面表达。",
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        "当前项目信息",
        `标题：${input.project.title || ""}`,
        `平台：${input.project.platform || ""}`,
        `内容类型：${input.project.contentType || ""}`,
        `目标受众：${input.project.audience || ""}`,
        `预计时长：${input.project.targetDuration || ""} 秒`,
        `内容目的：${input.project.goal || ""}`,
        `原始灵感：${input.project.rawIdea || ""}`,
        `零散要点：${input.project.notes || ""}`,
        `参考资料：${input.project.references || ""}`,
        `避免内容：${input.project.avoid || ""}`,
        `语气：${input.project.tone || ""}`,
      ].join("\n"),
    },
    {
      role: "user",
      content: `已启用 Skills\n${skillText || "当前项目未启用 Skill。"}`,
    },
    {
      role: "user",
      content: `当前口播稿\n${input.currentScript || ""}`,
    },
    {
      role: "user",
      content: `选中文本\n${input.selectedText || ""}`,
    },
    {
      role: "user",
      content: `用户本次修改要求\n${input.instruction || actionInstruction(input.action)}`,
    },
    {
      role: "user",
      content: "输出格式要求\n只输出口播稿正文，不要解释，不要 Markdown 标题。",
    },
  ];
}

function actionInstruction(action: BuildMessagesInput["action"]) {
  if (action === "generate") return "生成一版完整口播稿。";
  if (action === "rewrite-selection") return "只改写选中文本，保持原意但更适合录制。";
  return "改写全文，保持核心意思但表达更自然。";
}

export async function runAiOrFallback(messages: ChatMessage[]) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  if (!apiKey) return fallbackScript(messages);

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: Number(process.env.AI_TEMPERATURE || 0.7),
      max_tokens: Number(process.env.AI_MAX_TOKENS || 2200),
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(json?.error?.message || `AI API 调用失败：HTTP ${response.status}`);
  }

  return String(json?.choices?.[0]?.message?.content || "").trim();
}

function fallbackScript(messages: ChatMessage[]) {
  const context = messages.map((message) => message.content).join("\n");
  const title = context.match(/标题：(.*)/)?.[1]?.trim() || "这个内容主题";
  const idea = context.match(/原始灵感：(.*)/)?.[1]?.trim() || "把一个想法整理成可录制内容";
  const audience = context.match(/目标受众：(.*)/)?.[1]?.trim() || "目标用户";

  return [
    `你有没有发现，很多人不是没有好想法，而是卡在不知道怎么把它说清楚。`,
    `今天这条内容，我们就围绕「${title}」来讲。`,
    `它真正要解决的问题是：${idea}。`,
    `如果你是${audience}，你最需要的不是一篇看起来很完整的文章，而是一段你能直接开口录的表达。`,
    `所以我们先抓住一个核心观点，再把它拆成短句、停顿和自然的语气。`,
    `最后这篇稿子不追求华丽，而是让人听得懂、愿意听完，并且知道下一步该做什么。`,
  ].join("\n\n");
}
