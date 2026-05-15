import { describe, expect, it } from "vitest";
import { createProjectFromIdea, createTimedStoryboard, createTimedStoryboardFromTranscript } from "./project";
import { toCsv } from "./csv";

describe("video project workflow", () => {
  it("creates a project with spoken script, storyboard rows, and asset rows from an idea", () => {
    const project = createProjectFromIdea({
      title: "录音驱动的视频工作流",
      idea: "我想先生成口播稿，再自己录一遍，最后按真实声音时长制作画面。",
      platform: "小红书",
      duration: 45,
      tone: "专业但口语",
    });

    expect(project.title).toBe("录音驱动的视频工作流");
    expect(project.spokenScript).toContain("真实声音");
    expect(project.storyboardRows.length).toBeGreaterThanOrEqual(5);
    expect(project.assetRows[0]).toMatchObject({ status: "needed" });
  });

  it("scales storyboard rows to match the real recording duration", () => {
    const project = createProjectFromIdea({
      title: "测试",
      idea: "测试真实录音对齐",
      platform: "短视频",
      duration: 50,
      tone: "清晰",
    });

    const timed = createTimedStoryboard(project.storyboardRows, 38.4);

    expect(timed[0].start).toBe(0);
    expect(timed.at(-1)?.end).toBe(38.4);
    expect(timed.every((row) => row.duration > 0)).toBe(true);
  });

  it("exports editable table data as escaped CSV", () => {
    const csv = toCsv([
      { scene: "s01", text: "先写稿，再录音", notes: "包含,逗号" },
      { scene: "s02", text: "按真实时长做画面", notes: "包含\"引号\"" },
    ]);

    expect(csv).toContain("scene,text,notes");
    expect(csv).toContain("\"包含,逗号\"");
    expect(csv).toContain("\"包含\"\"引号\"\"\"");
  });

  it("uses Qwen transcript segments as the recording lines for timed storyboard rows", () => {
    const project = createProjectFromIdea({
      title: "测试",
      idea: "测试真实录音对齐",
      platform: "短视频",
      duration: 50,
      tone: "清晰",
    });

    const timed = createTimedStoryboardFromTranscript(
      project.storyboardRows,
      "第一句真实口播。\n第二句临场发挥。\n第三句收尾。",
      30,
    );

    expect(timed).toHaveLength(3);
    expect(timed[0].recordingLine).toBe("第一句真实口播。");
    expect(timed.at(-1)?.end).toBe(30);
  });
});
