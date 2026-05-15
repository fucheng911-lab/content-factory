# 内容工厂

内容工厂是一个本地运行的视频内容生产工具，用于把创意、语音、口播稿、真实录制文件、Qwen 转写、分镜表格和 HyperFrames 制作包串成一条可迭代流程。

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
3. 上传真实录制的音频或视频，读取真实时长。
4. 对音频调用 Qwen 转写，并按真实录制时长生成可编辑的 `timed-storyboard.csv`。
5. 编辑素材清单、视觉风格和 HyperFrames 制作说明。
6. 导出 HyperFrames 制作包。

## Qwen API 配置

不要提交真实 API Key。复制示例文件后在本地填写：

```bash
cd video-workbench
cp .env.example .env
```

当前 Qwen 转写按钮直接接收音频文件；如果录的是视频，先导出音频再上传。转写后的分镜对齐是段落级粗对齐，后续可以继续迭代到逐字时间戳。

## 验证

```bash
cd video-workbench
npm test
npm run build
```
