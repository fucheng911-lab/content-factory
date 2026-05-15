# 内容工厂 PRD

## 1. 产品定位

内容工厂是一个本地优先的 AI 内容生产工作台。

它不是单纯的视频生成工具，而是帮助内容创作者、编导、视频运营把一个模糊想法逐步加工成可录制、可修改、可交付的内容项目。

长期来看，内容工厂分成两个大的部分：

1. 口播稿的生成与持续修改
2. 成品视频的制作与交付

当前第一版只开发第一部分：口播稿制作。

## 2. 产品总目标

内容工厂最终要解决的是：从创意到成片的生产链路太散。

用户通常会遇到这些问题：

- 想法零散，难以整理成可录制口播稿
- AI 一次性生成的稿子不可控，后续修改成本高
- 不同平台、不同账号、不同业务的写作规则难以复用
- 口播稿和后续视频制作之间缺少结构化衔接
- 每次都要重复告诉 AI 风格、规则、禁忌和输出格式

内容工厂的核心价值是把这些过程产品化：

```text
创意输入
→ Skill 规则约束
→ AI 生成口播稿
→ 网页编辑器实时修改
→ 第三方 API 持续改写
→ 保存最终录制稿
→ 后续进入成品视频制作
```

## 3. 产品阶段划分

### 3.1 第一阶段：口播稿制作

第一阶段只聚焦口播稿，不做视频制作。

目标是让用户可以：

- 创建一个内容项目
- 输入创意、资料、参考内容
- 上传 Markdown skills 作为 AI 写作规则
- 选择一个或多个 skills
- 调用第三方 AI API 生成口播稿
- 在网页编辑器中实时修改内容
- 对全文或选中段落进行 AI 改写
- 保存最终录制稿

第一阶段的核心产物是：

```text
finalScript
```

也就是用户确认后可以直接拿去录制的最终口播稿。

### 3.2 第二阶段：成品视频制作

第二阶段暂不开发，但架构要为它预留。

第二阶段会从第一阶段的最终口播稿开始，继续处理：

- 用户真实录音
- Qwen 语音转写
- 录音时长读取
- 时间戳分镜表
- 字幕
- 素材清单
- 画面设计说明
- HyperFrames 制作包
- 最终视频渲染

第二阶段的核心目标不是简单“生成视频”，而是把口播、录音、分镜、素材和 HyperFrames 制作要求串成一套可控流程。

## 4. V1 产品名称

内容工厂 V1：Skill 驱动的口播稿工作台

## 5. V1 范围

### 5.1 V1 必须包含

1. 项目管理
2. 项目创建
3. Markdown Skills 管理
4. 口播稿 AI 编辑器
5. 第三方 AI API 接入层
6. 本地项目数据存储
7. 口播稿版本保存
8. 最终录制稿保存

### 5.2 V1 不包含

V1 不开发以下能力：

- 成品视频制作
- 录音上传
- 语音转写
- 分镜表
- 素材收集
- HyperFrames
- 视频渲染
- 账号系统
- 多人协作
- 云端数据库
- 自动发布
- 复杂权限

这些能力进入后续版本。

## 6. 目标用户

V1 的目标用户是个人内容创作者、编导、视频运营或小团队内容负责人。

典型用户特征：

- 需要频繁生产口播类短视频内容
- 希望 AI 辅助写稿，但不希望完全失控
- 有自己的行业经验、平台经验或表达风格
- 希望把自己的写作规则沉淀成可复用 skills
- 希望在网页里边写边改，而不是每次复制粘贴到聊天窗口

## 7. 核心使用流程

```text
打开内容工厂
→ 创建项目
→ 填写项目基础信息
→ 输入创意和参考资料
→ 上传或选择 Markdown skills
→ 进入口播稿编辑器
→ 生成初稿
→ 用户手动编辑
→ AI 全文改写或局部改写
→ 保存版本
→ 确认为最终录制稿
```

## 8. 功能需求

### 8.1 项目列表

项目列表用于管理本地内容项目。

功能：

- 查看已有项目
- 新建项目
- 打开项目
- 删除项目
- 显示项目更新时间
- 显示项目状态

项目状态建议：

- 草稿中
- 已生成初稿
- 修改中
- 已确认录制稿

### 8.2 项目创建

创建项目时需要填写基础信息。

字段：

- 项目标题
- 视频平台
- 内容类型
- 目标受众
- 预计时长
- 内容目的
- 原始灵感
- 零散要点
- 参考资料
- 不想出现的内容
- 希望保持的语气

平台示例：

- 小红书
- 抖音
- B站
- 视频号
- 快手
- YouTube Shorts

内容类型示例：

- 知识口播
- 产品介绍
- 案例拆解
- 观点表达
- 种草推荐
- 经验分享
- 销售转化
- 个人 IP

内容目的示例：

- 种草
- 转化
- 教育
- 涨粉
- 建立信任
- 解释复杂概念
- 输出观点

### 8.3 Markdown Skills 管理

V1 的 skill 更像主流智能体上传 skills 的机制。

它不是网页表单，也不是简单 prompt，而是一个 Markdown 规则文件。

每个 skill 是一个可上传、可启用、可组合的智能体规则包。

#### 8.3.1 Skill 文件格式

Skill 使用 Markdown 文件，必须包含 frontmatter。

示例：

```markdown
---
name: xiaohongshu-spoken-script
displayName: 小红书口播稿
description: 生成自然、有代入感、有钩子的小红书口播稿
type: script-writing
version: 1.0.0
---

# 使用场景

适合小红书口播、个人 IP、种草、经验分享、观点表达。

# 输出目标

生成一篇适合真人直接录制的口播稿。

# 写作规则

- 开头 3 秒必须有强钩子
- 不要写成公众号文章
- 每段尽量短
- 语言要自然、有停顿感
- 不要堆砌形容词
- 多用具体场景
- 少用空泛价值判断

# 修改规则

当用户要求修改时：

- 优先保留原意
- 不要把稿子改得更长，除非用户明确要求
- 保持口语化
- 如果用户只选中一段，只修改选中内容

# 输出格式

只输出口播稿正文，不要解释。
```

#### 8.3.2 Skill 上传

功能：

- 上传 `.md` 文件
- 拖拽上传
- 自动解析 frontmatter
- 保存原始 Markdown 内容
- 显示 skill 名称、描述、类型、版本
- 同名 skill 上传时提示覆盖
- 支持删除 skill

#### 8.3.3 Skill 校验

上传时需要做基础校验：

- 必须是 `.md` 文件
- 必须包含 frontmatter
- 必须包含 `name`
- 必须包含 `description`
- `name` 只能包含英文、数字、横线、下划线
- 文件大小需要限制
- 文件内容不能为空

#### 8.3.4 Skill 类型

V1 先只要求支持：

```text
script-writing
```

后续可扩展：

- script-rewrite
- platform-style
- industry-knowledge
- compliance-check
- video-storyboard
- asset-planning
- hyperframes-production

#### 8.3.5 Skill 启用方式

一个项目可以启用多个 skills。

Skills 的管理和启用要分成两层：

1. 全局 Skill 库：用户上传、查看、删除 Markdown skills
2. 项目 Skill 启用：每个项目从全局 Skill 库里选择自己要启用的 skills

上传到 Skill 库里的内容不会自动影响所有项目。不同项目可以选择性启用不同 skills。

例如：

```text
项目 A：启用 [小红书口播稿] [30秒强钩子]
项目 B：启用 [知识博主口播] [专业解释风格]
项目 C：启用 [奢侈品回收业务] [转化型口播]
```

每个项目都需要保存自己的 `enabledSkillIds`。

编辑器页面需要展示当前项目已启用 skills：

```text
已启用 Skills
[小红书口播稿] [30秒强钩子] [更口语化]
```

用户可以：

- 启用 skill
- 禁用 skill
- 查看 skill 内容
- 调整启用顺序

V1 可以先不支持在线编辑 skill，修改方式是重新上传覆盖。

#### 8.3.6 Skill 优先级

多个 skill 同时启用时可能互相冲突。

V1 采用以下优先级，其中“已启用 skills”只指当前项目启用的 skills，不包括全局 Skill 库里未启用的 skills：

```text
用户本次指令
> 当前项目要求
> 已启用 skills，后启用的优先
> 系统基础规则
```

这样可以保证用户当前修改意图优先。

### 8.4 口播稿 AI 编辑器

口播稿编辑器是 V1 的核心界面。

它不只是展示 AI 输出，而是一个可以实时修改、反复改写、保存版本的写作工作台。

#### 8.4.1 页面布局

建议采用三栏布局：

```text
左侧：项目信息 + 已启用 skills
中间：口播稿编辑器
右侧：AI 操作面板
```

左侧展示：

- 项目标题
- 平台
- 内容类型
- 目标受众
- 内容目的
- 已启用 skills

中间展示：

- 可实时编辑的口播稿
- 当前版本状态
- 保存按钮
- 保存为最终录制稿按钮

右侧展示：

- 生成初稿
- 全文改写
- 局部改写
- 更口语
- 更短
- 更有冲突
- 优化开头
- 优化结尾
- 改成小红书风格
- 改成抖音风格
- 自定义修改要求

#### 8.4.2 编辑器能力

V1 编辑器需要支持：

- 实时编辑文本
- 自动保存草稿
- 手动保存版本
- 保存最终录制稿
- 选中文本
- 对选中文本局部改写
- AI 改写结果插入或替换到当前稿件
- 查看版本历史
- 回滚到历史版本

#### 8.4.3 编辑器技术建议

第一版建议使用 TipTap。

原因：

- 适合写作场景
- 支持段落、标题、高亮
- 后续可支持批注
- 后续可支持选中文本改写
- 后续可支持 AI 插入建议
- 比 Monaco 更适合口播稿编辑

不建议 V1 使用 Monaco 作为主编辑器，因为 Monaco 更像代码编辑器。

如果开发成本需要降低，第一版也可以先用 `textarea`，但架构上要预留升级 TipTap。

### 8.5 AI 生成与修改

V1 的 AI 能力不是一次性生成稿子，而是支持持续修改。

#### 8.5.1 生成初稿

输入：

- 项目基础信息
- 原始灵感
- 参考资料
- 已启用 skills
- 用户补充要求

输出：

- 一版完整口播稿

要求：

- 适合真人直接录制
- 不写成文章
- 按自然停顿分段
- 语言口语化
- 不输出解释，除非用户要求

#### 8.5.2 全文修改

用户可以对全文发起修改。

常用操作：

- 更口语
- 更短
- 更有冲突
- 更专业
- 更适合小红书
- 更适合抖音
- 缩短到指定时长
- 增强开头
- 增强结尾

#### 8.5.3 局部修改

用户选中一段文本后，可以只修改选中内容。

常用操作：

- 改得更自然
- 增加案例
- 简化表达
- 换一种说法
- 更有代入感
- 保留意思但更适合录制

局部修改必须遵守：

- 不改未选中的内容
- 尽量保持原意
- 结果可以替换选中内容
- 用户可以撤销或回滚版本

#### 8.5.4 AI 请求上下文

每次调用 AI 时，请求结构应该由后端统一组装。

上下文顺序：

```text
系统基础规则
当前项目信息
已启用 skills 内容
当前口播稿
选中文本，如果有
用户本次修改要求
输出格式要求
```

### 8.6 第三方 API 接入

用户明确要求中间不断修改的能力会接入第三方 API。

V1 需要设计 provider 层，避免和某个模型强绑定。

#### 8.6.1 支持方向

第一版可以先实现一个 provider，但架构上要支持多个：

- OpenAI
- Qwen
- 其他兼容 OpenAI 格式的 API

#### 8.6.2 API Key 处理

原则：

- API Key 只保存在本地配置
- 前端不能直接持有 API Key
- 前端只调用本地后端
- 本地后端再调用第三方 API

#### 8.6.3 Provider 配置

本地配置至少包含：

```json
{
  "provider": "openai-compatible",
  "baseUrl": "https://example.com/v1",
  "apiKey": "local-only-secret",
  "model": "model-name"
}
```

后续可以扩展：

- temperature
- maxTokens
- timeout
- retry
- stream

### 8.7 版本历史

口播稿需要支持多轮修改，所以必须有版本历史。

每次以下操作都应该产生版本：

- 生成初稿
- 全文 AI 改写
- 局部 AI 改写
- 用户手动保存
- 保存为最终录制稿

版本记录字段：

- versionId
- createdAt
- source
- instruction
- enabledSkillIds
- content

`source` 示例：

- user-save
- ai-generate
- ai-rewrite-full
- ai-rewrite-selection
- final-script

## 9. 数据模型

### 9.1 Project

```json
{
  "id": "project-id",
  "title": "项目标题",
  "platform": "小红书",
  "contentType": "知识口播",
  "audience": "目标用户",
  "targetDuration": 60,
  "goal": "建立信任",
  "rawIdea": "原始想法",
  "notes": "零散要点",
  "references": "参考资料",
  "avoid": "不想出现的内容",
  "tone": "希望保持的语气",
  "enabledSkillIds": [],
  "draftScript": "",
  "finalScript": "",
  "status": "draft",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

`enabledSkillIds` 是项目级配置。每个项目可以从全局 Skill 库中选择性启用不同 skills。

### 9.2 Skill

```json
{
  "id": "xiaohongshu-spoken-script",
  "name": "xiaohongshu-spoken-script",
  "displayName": "小红书口播稿",
  "description": "生成自然、有代入感、有钩子的小红书口播稿",
  "type": "script-writing",
  "version": "1.0.0",
  "filePath": "data/skills/xiaohongshu-spoken-script.md",
  "content": "完整 Markdown 内容",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

Skill 是全局资源，保存在本地 Skill 库中。它是否参与 AI 生成，取决于当前项目是否把该 skill 加入 `enabledSkillIds`。

### 9.3 ScriptVersion

```json
{
  "id": "version-id",
  "projectId": "project-id",
  "source": "ai-rewrite-full",
  "instruction": "改得更口语",
  "enabledSkillIds": ["xiaohongshu-spoken-script"],
  "content": "口播稿内容",
  "createdAt": "ISO Date"
}
```

## 10. 本地文件结构

建议第一版项目结构：

```text
content-factory/
├── apps/
│   ├── web/
│   └── server/
├── data/
│   ├── projects/
│   ├── skills/
│   └── settings.json
├── docs/
│   └── product/
└── PRD.md
```

本地数据结构：

```text
data/
├── skills/
│   ├── xiaohongshu-spoken-script.md
│   └── douyin-hook-script.md
│
└── projects/
    └── project-id/
        ├── project.json
        ├── versions/
        │   ├── version-001.json
        │   └── version-002.json
        └── exports/
```

## 11. 技术架构

V1 采用本地优先架构。

```text
前端 Web App
→ 本地后端 API
→ 本地文件系统
→ 第三方 AI Provider
```

### 11.1 前端

推荐技术：

- React
- TypeScript
- Vite
- TipTap

前端负责：

- 项目列表
- 项目创建
- Skill 管理
- 口播稿编辑器
- AI 操作面板
- 版本历史 UI

### 11.2 本地后端

推荐技术：

- Node.js
- Express

后端负责：

- 读写本地项目文件
- 保存 skill 文件
- 解析 skill frontmatter
- 组装 AI 请求上下文
- 调用第三方 API
- 保存口播稿版本
- 管理本地设置

### 11.3 数据存储

V1 不使用数据库。

使用本地文件系统：

- 项目用 JSON
- Skill 用 Markdown
- 版本历史用 JSON
- 设置用 JSON

后续如果要多人协作，再考虑数据库和云端同步。

### 11.4 AI Provider 层

Provider 层需要抽象成统一接口：

```text
generateScript(input)
rewriteFull(input)
rewriteSelection(input)
```

这样后续可以切换不同模型。

## 12. 页面清单

### 12.1 项目列表页

目标：

- 让用户进入已有项目或创建新项目

核心组件：

- 项目卡片
- 新建项目按钮
- 删除项目
- 状态标签

### 12.2 创建项目页

目标：

- 采集生成口播稿需要的项目背景

核心组件：

- 基础信息表单
- 创意输入区
- 参考资料输入区
- 保存并进入编辑器按钮

### 12.3 Skill 管理页

目标：

- 管理本地 Markdown skills
- 作为全局 Skill 库，不直接决定某个项目启用哪些 skills

核心组件：

- 上传 skill
- Skill 列表
- Skill 详情预览
- 删除 skill
- 覆盖提示

说明：

- 在这里上传的 skill 只是进入全局 Skill 库
- 每个项目需要在项目内单独选择启用哪些 skills
- 删除全局 skill 时，需要提示哪些项目正在使用它

### 12.4 口播稿编辑器页

目标：

- 生成、修改、保存最终口播稿

核心组件：

- 左侧项目信息
- 已启用 skills
- 从全局 Skill 库中选择当前项目启用的 skills
- 中间文本编辑器
- 右侧 AI 操作面板
- 版本历史面板
- 保存最终录制稿按钮

## 13. 成功标准

V1 完成后，用户应该可以完整完成以下任务：

1. 创建一个内容项目
2. 上传一个 Markdown skill
3. 在项目中启用该 skill
4. 输入一个原始创意
5. 调用第三方 API 生成口播稿
6. 在网页编辑器中直接修改口播稿
7. 选中一段内容并要求 AI 局部改写
8. 保存多个版本
9. 回滚历史版本
10. 保存最终录制稿

如果这 10 件事可以顺畅完成，V1 就达标。

## 14. 后续路线

### 14.1 V2：录音和转写

- 上传真实录音
- 读取录音时长
- Qwen 语音转写
- 转写文本校对
- 根据录音切分口播段落

### 14.2 V3：分镜和素材

- 生成时间戳分镜表
- 表格化编辑分镜
- 生成素材需求
- 管理图片、视频、截图、图标等素材

### 14.3 V4：HyperFrames 制作

- 生成 HyperFrames 制作包
- 生成视频设计说明
- 生成动效规则
- 调用 HyperFrames 渲染成片

### 14.4 V5：团队和云端

- 账号系统
- 团队协作
- 云端项目同步
- Skill 市场
- 多人评论和审核

## 15. 当前决策记录

- 产品分成两大部分：口播稿生成、成品视频制作
- 第一版只做口播稿生成
- 第一版支持创建项目
- 第一版支持上传 Markdown skills
- Skill 更像主流智能体上传 skills，而不是网页表单
- 第一版需要网页编辑器，支持实时修改内容
- AI 修改能力接入第三方 API
- API Key 不进入浏览器，只放在本地后端配置
- 编辑器优先考虑 TipTap
- V1 不做视频、录音、分镜、素材和 HyperFrames
