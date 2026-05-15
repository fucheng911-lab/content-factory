import { describe, expect, it } from "vitest";
import { buildAiMessages } from "../services/ai.js";

describe("buildAiMessages", () => {
  it("assembles context in the required priority order", () => {
    const messages = buildAiMessages({
      action: "rewrite-selection",
      project: {
        title: "内容工厂",
        platform: "小红书",
        contentType: "知识口播",
        audience: "内容创作者",
        targetDuration: 60,
        goal: "建立信任",
        rawIdea: "让 AI 帮我改口播稿",
        notes: "强调 skill",
        references: "",
        avoid: "不要书面化",
        tone: "自然",
      },
      enabledSkills: [
        { displayName: "小红书口播稿", content: "# 写作规则\n要口语化" },
        { displayName: "强钩子", content: "# 开头规则\n前三秒有反差" },
      ],
      currentScript: "原始稿件",
      selectedText: "原始稿件",
      instruction: "改得更自然",
    });

    const text = messages.map((message) => message.content).join("\n");
    expect(text.indexOf("系统基础规则")).toBeLessThan(text.indexOf("当前项目信息"));
    expect(text.indexOf("当前项目信息")).toBeLessThan(text.indexOf("已启用 Skills"));
    expect(text.indexOf("已启用 Skills")).toBeLessThan(text.indexOf("当前口播稿"));
    expect(text.indexOf("当前口播稿")).toBeLessThan(text.indexOf("选中文本"));
    expect(text.indexOf("选中文本")).toBeLessThan(text.indexOf("用户本次修改要求"));
    expect(text).toContain("只输出口播稿正文");
  });
});
