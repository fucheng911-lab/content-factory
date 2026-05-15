import "dotenv/config";
import express from "express";
import multer from "multer";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const port = Number(process.env.PORT || 5174);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/transcribe", upload.single("file"), async (request, response) => {
  try {
    if (!request.file) {
      response.status(400).json({ error: "请先上传音频文件。" });
      return;
    }

    if (!request.file.mimetype.startsWith("audio/")) {
      response.status(400).json({ error: "Qwen 转写当前只接收音频文件。视频文件请先导出音频后上传。" });
      return;
    }

    const transcript = await transcribeWithQwen({
      buffer: request.file.buffer,
      mimeType: request.file.mimetype,
      originalName: request.file.originalname,
    });

    response.json({ transcript });
  } catch (error) {
    const message = error instanceof Error ? error.message : "转写失败。";
    response.status(500).json({ error: message });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Content Factory API running at http://127.0.0.1:${port}`);
});

async function transcribeWithQwen({ buffer, mimeType, originalName }) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 DASHSCOPE_API_KEY。请复制 .env.example 为 .env 并填写 Qwen API Key。");
  }

  const baseUrl = process.env.QWEN_API_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
  const model = process.env.QWEN_ASR_MODEL || "qwen3-asr-flash";
  const format = guessAudioFormat(mimeType, originalName);
  const data = buffer.toString("base64");

  const result = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input_audio",
              input_audio: {
                data,
                format,
              },
            },
            {
              type: "text",
              text: "请将这段音频转写为简体中文。只输出转写文本，不要解释。",
            },
          ],
        },
      ],
    }),
  });

  const json = await result.json().catch(() => null);
  if (!result.ok) {
    throw new Error(json?.error?.message || json?.message || `Qwen 转写失败：HTTP ${result.status}`);
  }

  const content = json?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => item?.text || item?.transcript || "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  throw new Error("Qwen 返回结果里没有可用的转写文本。");
}

function guessAudioFormat(mimeType, filename) {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (extension) {
    return extension === "m4a" ? "mp4" : extension;
  }
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "mp4";
  return "mp3";
}
