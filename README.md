# 内容工厂

内容工厂 V1 是一个本地优先的 Skill 驱动口播稿工作台。

当前版本只覆盖第一阶段：创建项目、上传 Markdown Skills、在项目中选择性启用 Skills、生成和反复修改口播稿、保存版本、确认最终录制稿。

## 本地启动

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

本地 API 默认运行在：

```text
http://127.0.0.1:5174/
```

## AI Provider 配置

浏览器不会直接持有 API Key。后端会读取本地环境变量。

复制示例文件：

```bash
cp .env.example .env
```

填写：

```env
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your-local-api-key
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2200
```

如果没有配置 `AI_API_KEY`，系统会使用本地 fallback 文案，方便先测试完整流程。

## Markdown Skill 格式

```markdown
---
name: xiaohongshu-spoken-script
displayName: 小红书口播稿
description: 生成自然、有代入感、有钩子的小红书口播稿
type: script-writing
version: 1.0.0
---

# 写作规则

- 开头 3 秒必须有强钩子
- 不要写成公众号文章
- 每段尽量短
- 语言要自然、有停顿感
```

Skills 是全局资源，但不会自动影响所有项目。每个项目需要在编辑器左侧单独选择启用哪些 Skills。

## 常用命令

```bash
npm test
npm run build
```

## 当前不包含

- 成品视频制作
- 录音上传
- 语音转写
- 分镜表
- 素材收集
- HyperFrames 渲染
- 多人协作
- 云端账号
