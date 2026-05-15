# 视频生产工作台

本地 Web App，用于把创意生成口播稿、上传真实录制文件、按录制时长生成可编辑分镜 CSV，并导出 HyperFrames 制作包。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

## 常用命令

```bash
npm test
npm run build
```

## 当前能力

- 新建视频项目
- 生成口播稿和初版分镜
- 上传音频或视频，读取真实时长
- 生成 `timed-storyboard.csv`
- 编辑分镜表格和素材清单
- 导出 HyperFrames 制作包 ZIP

## 当前限制

- 第一版不含账号系统和服务器。
- 数据默认保存在浏览器本地存储。
- 暂未接入自动语音转写；录制文件当前用于读取真实时长，后续可接入转写 API。
