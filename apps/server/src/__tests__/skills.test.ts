import { describe, expect, it } from "vitest";
import { parseSkillMarkdown } from "../parsers/skills.js";

describe("parseSkillMarkdown", () => {
  it("parses required metadata and markdown content", () => {
    const skill = parseSkillMarkdown(`---
name: xiaohongshu-spoken-script
displayName: 小红书口播稿
description: 生成小红书风格口播稿
type: script-writing
version: 1.2.0
---

# 写作规则

- 开头必须有钩子
`);

    expect(skill).toMatchObject({
      id: "xiaohongshu-spoken-script",
      name: "xiaohongshu-spoken-script",
      displayName: "小红书口播稿",
      description: "生成小红书风格口播稿",
      type: "script-writing",
      version: "1.2.0",
    });
    expect(skill.content).toContain("# 写作规则");
  });

  it("rejects skills without a valid name", () => {
    expect(() =>
      parseSkillMarkdown(`---
name: 小红书
description: 规则
---

正文`),
    ).toThrow("name 只能包含英文、数字、横线、下划线");
  });

  it("requires a description", () => {
    expect(() =>
      parseSkillMarkdown(`---
name: valid-name
---

正文`),
    ).toThrow("必须包含 description");
  });
});
