# 内容工厂

内容工厂是一个本地运行的视频内容生产工具，用于把创意、语音、口播稿、真实录制文件、分镜表格和 HyperFrames 制作包串成一条可迭代流程。

## 目录结构

```text
.
├── video-workbench/              # 本地 Web App
└── idea-to-hyperframes-video/    # Codex skill 工作流
```

## 本地启动

```bash
cd video-workbench
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

## 主要流程

1. 输入创意、语音转写或资料摘要。
2. 生成可录制的口播稿和初版分镜。
3. 上传真实录制的音频或视频。
4. 按真实录制时长生成可编辑的 `timed-storyboard.csv`。
5. 编辑素材清单、视觉风格和 HyperFrames 制作说明。
6. 导出 HyperFrames 制作包。

## Qwen API 配置

不要提交真实 API Key。复制示例文件后在本地填写：

```bash
cd video-workbench
cp .env.example .env
```

## 验证

```bash
cd video-workbench
npm test
npm run build
```
