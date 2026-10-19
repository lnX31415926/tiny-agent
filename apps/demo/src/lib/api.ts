// 通用请求函数
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // ... 中间代码截图未展示
  return response.json() as Promise<T>;
}

// 大模型流式SSE请求
async function requestCompletionStream(
  input: AiCompletionInput,
  options: StreamOptions,
): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/ai/complete/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal: options.signal, //支持外部取消
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      typeof error.message === "string" ? error.message : "流式请求失败",
    );
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = ""; //处理跨chunk的不完整事件
  let fullText = ""; //累积完整的生成文本

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    //SSE事件以双换行分隔
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? ""; //最后一个可能不完整，留到下次处理

    for (const event of events) {
      const result = parseStreamEvent(event);
      if (result.type === "delta" && result.text) {
        fullText += result.text;
        options.onDelta(result.text, fullText); //回调：增量文本+全量文本
      }
      if (result.type === "error") {
        throw new Error(result.message || "流式请求失败");
      }
    }
  }

  return fullText;
}

// SSE事件解析函数
function parseStreamEvent(event: string) {
  const lines = event.split("\n");
  let type = "message";
  let data = "";
  for (const line of lines) {
    if (line.startsWith("event: ")) {
      type = line.slice(7);
    } else if (line.startsWith("data: ")) {
      data = line.slice(6);
    }
  }
  if (data === "[DONE]") {
    return { type: "done" };
  }

  try {
    return { type, ...JSON.parse(data) };
  } catch {
    return { type: "invalid", data };
  }
}

// ----------------类型定义（根据代码推断补充）----------------
type AiCompletionInput = any;
interface StreamOptions {
  signal?: AbortSignal;
}
declare const apiBaseUrl: string;
