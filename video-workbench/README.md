# 视频生产工作台

本地 Web App，用于把创意生成口播稿、上传真实录制文件、通过 Qwen 转写真实口播、按录制时长生成可编辑分镜 CSV，并导出 HyperFrames 制作包。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

`npm run dev` 会同时启动前端页面和本地 API。API 只监听本机地址，不会把密钥暴露到浏览器代码里。

## Qwen 转写配置

复制示例环境变量文件：

```bash
cp .env.example .env
```

然后在 `.env` 中填写：

```env
DASHSCOPE_API_KEY=你的_Qwen_DashScope_API_Key
QWEN_ASR_MODEL=qwen3-asr-flash
QWEN_API_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

真实 API Key 只放在本地 `.env`，不要提交到 GitHub。

## 常用命令

```bash
npm test
npm run build
```

## 当前能力

- 新建视频项目
- 生成口播稿和初版分镜
- 上传音频或视频，读取真实时长
- 调用 Qwen 转写音频，并按真实录制时长生成对齐分镜
- 生成 `timed-storyboard.csv`
- 编辑分镜表格和素材清单
- 导出 HyperFrames 制作包 ZIP

## 当前限制

- 第一版不含账号系统。
- 数据默认保存在浏览器本地存储。
- Qwen 转写按钮当前只直接接收音频文件；如果你录的是视频，需要先导出音频后上传。
- 分镜对齐使用“转写文本段落 + 录制总时长”做粗对齐，还不是逐字级时间戳。
