export async function transcribeRecording(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: form,
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(json?.error || "转写失败。");
  }

  if (!json?.transcript) {
    throw new Error("转写结果为空。");
  }

  return json.transcript;
}
