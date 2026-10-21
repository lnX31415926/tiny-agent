import { Inject, Injectable } from '@nestjs/common';
import { buildCompletionMessages } from './ai.prompt.js';

// 类型定义，建议单独抽 types.ts，先放这里方便跑
export type AiCompletionInput = {
  prompt: string;
  mode?: string;
  cursorContext?: string;
};

export type AiCompletionResult = {
  text: string;
};

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly chatModel: string;

  constructor(
    // 从环境变量注入，Nest推荐用 ConfigService
    @Inject('AI_API_KEY') apiKey: string,
    @Inject('AI_BASE_URL') baseURL: string,
    @Inject('AI_CHAT_MODEL') chatModel: string,
  ) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.chatModel = chatModel;
  }

  // 你原来的 createChatModel，这里保留，如果你后面要换成 LangChain 可以用
  private createChatModel(temperature: number) {
    return {
      temperature,
      baseURL: this.baseURL,
      apiKey: this.apiKey,
      model: this.chatModel,
    };
  }

  /**
   * 非流式接口：一次性请求，返回完整文本
   */
  async complete(input: AiCompletionInput): Promise<AiCompletionResult> {
    const messages = buildCompletionMessages(input);

    const res = await fetch(
      `${this.baseURL.replace(/\/$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.chatModel,
          messages,
          temperature: 0.3,
          stream: false,
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(
        `模型请求失败: ${res.status} ${detail || res.statusText}`,
      );
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    return { text };
  }

  /**
   * 流式接口，保留你原有逻辑，只修正调用
   */
  async *completeStream(input: AiCompletionInput): AsyncGenerator<string> {
    if (!this.apiKey) {
      return;
    }
    const messages = buildCompletionMessages(input);
    const response = await fetch(
      `${this.baseURL.replace(/\/$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          model: this.chatModel,
          messages,
          temperature: 0.3,
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => response.statusText);
      throw new Error(
        `模型流式请求失败: ${response.status} ${detail || response.statusText}`,
      );
    }

    if (!response.body) {
      return;
    }
    yield* parseOpenAICompatibleStream(response.body);
  }
}

// 【重点】parseOpenAICompatibleStream 函数实现，你原来代码依赖这个，补上
async function* parseOpenAICompatibleStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      console.log(trimmed);
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const payload = trimmed.slice('data: '.length);
      if (payload === '[DONE]') continue;

      try {
        const json = JSON.parse(payload);
        const deltaText = json.choices?.[0]?.delta?.content;
        if (deltaText) yield deltaText;
      } catch {
        // 忽略解析错误行
      }
    }
  }
}
