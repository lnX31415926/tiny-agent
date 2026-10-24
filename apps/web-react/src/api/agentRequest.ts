const apiBaseUrl = "http://localhost:3000";
interface AiCompletionInput {
  prompt: string;
}
/**
 * 单条 SSE 分片转换
 * @param chunkStr 单条原始字符串：'{"text":"你"}' 或者 '{}'
 * @returns
 *  输入 {"text":"你"} → { type: "text", value: "你" }
 *  输入 {} → { type: "done", value: "{}" }
 */
export function transformSingleChunk(
  chunkStr: string,
): { type: string; value: string } | null {
  try {
    const data = JSON.parse(chunkStr);
    // 空对象标记结束
    if (Object.keys(data).length === 0) {
      return {
        type: "done",
        value: "",
      };
    }
    // 有 text 字段
    if (typeof data.text === "string") {
      return {
        type: "text",
        value: data.text,
      };
    }
    return null;
  } catch (err) {
    console.warn("单条分片解析失败", chunkStr, err);
    return null;
  }
}
export async function requestCompletionStream(
  input: AiCompletionInput,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const res = await fetch(`${apiBaseUrl}/ai/complete/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("请求失败");
  if (!res.body) return "";

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const lineTrim = line.trim();
      if (!lineTrim || !lineTrim.startsWith("data: ")) continue;
      const data = lineTrim.slice(6);
      const parsed = transformSingleChunk(data);
      if (!parsed) continue;

      // 往外抛结构化对象 {type,value}
      onChunk(parsed.value);
    }
  }
  console.log(fullText, "fullText");
  return fullText;
}
